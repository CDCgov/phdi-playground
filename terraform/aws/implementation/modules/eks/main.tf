terraform {
  required_providers {
    kubectl = {
      source  = "gavinbunney/kubectl"
      version = ">= 1.14.0"
    }
  }
}

module "eks-cluster" {
  source  = "terraform-aws-modules/eks/aws"
  version = "19.21.0"

  cluster_name                   = var.eks_name
  cluster_version                = "1.29"
  cluster_endpoint_public_access = true

  cluster_enabled_log_types              = ["api", "audit", "authenticator", "controllerManager", "scheduler"]
  cloudwatch_log_group_retention_in_days = 7

  vpc_id     = var.vpc_id
  subnet_ids = flatten([var.private_subnet_ids, var.public_subnet_ids])

  # Fargate profiles use the cluster primary security group so these are not utilized
  create_cluster_security_group = false
  create_node_security_group    = false

  fargate_profiles = {
    default = {
      selectors = [
        { namespace = "default" }
      ]
      subnet_ids = var.private_subnet_ids
    }
    karpenter = {
      selectors = [
        { namespace = "karpenter" }
      ]
      subnet_ids = var.private_subnet_ids
    }
    kube_system = {
      name = "kube-system"
      selectors = [
        { namespace = "kube-system" }
      ]
      subnet_ids = var.private_subnet_ids
    }
  }

  manage_aws_auth_configmap = true
  aws_auth_roles = [
    {
      rolearn  = "arn:aws:iam::339712971032:role/Developer"
      username = "Developer"
      groups   = ["system:masters"]
    },
    # We need to add in the Karpenter node IAM role for nodes launched by Karpenter
    {
      rolearn  = module.eks_blueprints_addons.karpenter.node_iam_role_arn
      username = "system:node:{{EC2PrivateDNSName}}"
      groups = [
        "system:bootstrappers",
        "system:nodes",
      ]
    },
  ]

  aws_auth_users = [
    {
      userarn  = "arn:aws:iam::339712971032:user/terraform"
      username = "terraform"
      groups   = ["system:masters"]
    }
  ]

  aws_auth_accounts = [
    "339712971032"
  ]

  tags = {
    "karpenter.sh/discovery" = var.eks_name
  }
}

data "aws_eks_cluster_auth" "eks" {
  name = module.eks-cluster.cluster_name
}

provider "kubectl" {
  host                   = module.eks-cluster.cluster_endpoint
  cluster_ca_certificate = base64decode(module.eks-cluster.cluster_certificate_authority_data)
  token                  = data.aws_eks_cluster_auth.eks.token
  load_config_file       = false
}

provider "helm" {
  kubernetes {
    host                   = module.eks-cluster.cluster_endpoint
    cluster_ca_certificate = base64decode(module.eks-cluster.cluster_certificate_authority_data)
    token                  = data.aws_eks_cluster_auth.eks.token
  }
}

provider "kubernetes" {
  host                   = module.eks-cluster.cluster_endpoint
  cluster_ca_certificate = base64decode(module.eks-cluster.cluster_certificate_authority_data)
  token                  = data.aws_eks_cluster_auth.eks.token
}

resource "aws_iam_policy" "load_balancer_controller" {
  name        = "AWSLoadBalancerControllerIAMPolicy"
  description = "Policy for ALB Ingress Controller"
  policy      = data.aws_iam_policy_document.load_balancer_controller.json
}

resource "kubectl_manifest" "cluster_role" {
  yaml_body = data.kubectl_path_documents.cluster_role.documents[0]
}

resource "kubectl_manifest" "cluster_role_binding" {
  yaml_body = data.kubectl_path_documents.cluster_role_binding.documents[0]
}

locals {
  account_id           = data.aws_caller_identity.current.account_id
  oidc_provider        = module.eks-cluster.oidc_provider
  namespace            = "kube-system"
  service_account_name = "aws-load-balancer-controller"
  tags = {
    Blueprint  = var.eks_name
    GithubRepo = "github.com/aws-ia/terraform-aws-eks-blueprints"
  }
}

resource "aws_iam_role" "eks_service_account" {
  name = "AmazonEKSLoadBalancerControllerRole"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRoleWithWebIdentity"
        Effect = "Allow"
        Principal = {
          Federated = "arn:aws:iam::${local.account_id}:oidc-provider/${local.oidc_provider}"
        }
        Condition = {
          StringEquals = {
            "${local.oidc_provider}:aud" = "sts.amazonaws.com"
            "${local.oidc_provider}:sub" = "system:serviceaccount:${local.namespace}:${local.service_account_name}"
          }
        }
      },
    ]
  })
}

resource "aws_iam_role_policy_attachment" "load_balancer_controller" {
  role       = aws_iam_role.eks_service_account.name
  policy_arn = aws_iam_policy.load_balancer_controller.arn
}

resource "kubectl_manifest" "service_account" {
  yaml_body = data.kubectl_file_documents.service_account.documents[0]
}

# kubectl auth to EKS
resource "terraform_data" "kubeconfig" {
  depends_on = [module.eks-cluster, kubectl_manifest.cluster_role_binding, kubectl_manifest.service_account]

  provisioner "local-exec" {
    command = "aws eks update-kubeconfig --name ${module.eks-cluster.cluster_name} --region ${var.region}"
  }
}

# Load Balancer Controller

resource "kubectl_manifest" "load_balancer_controller_crds" {
  depends_on = [module.eks-cluster]
  for_each   = data.kubectl_file_documents.load_balancer_controller_crds.manifests
  yaml_body  = each.value
}

resource "helm_release" "load_balancer_controller" {
  depends_on = [module.eks-cluster, kubectl_manifest.load_balancer_controller_crds]
  name       = "aws-load-balancer-controller"
  repository = "https://aws.github.io/eks-charts"
  chart      = "aws-load-balancer-controller"
  namespace  = "kube-system"
  version    = "1.7.0"

  set {
    name  = "clusterName"
    value = module.eks-cluster.cluster_name
  }

  set {
    name  = "serviceAccount.create"
    value = "false"
  }

  set {
    name  = "serviceAccount.name"
    value = local.service_account_name
  }

  set {
    name  = "clusterSecretsPermissions.allowAllSecrets"
    value = "true"
  }

  set {
    name  = "region"
    value = var.region
  }

  set {
    name  = "vpcId"
    value = var.vpc_id
  }

  set {
    name  = "enableCertManager"
    value = "false"
  }
}


# Sleep for 120 seconds to allow the load balancer controller to start
resource "terraform_data" "wait_for_load_balancer_controller" {
  depends_on = [helm_release.load_balancer_controller]

  provisioner "local-exec" {
    command = "sleep 120"
  }
}

# Building blocks

resource "helm_release" "building_blocks" {
  depends_on      = [terraform_data.wait_for_load_balancer_controller]
  for_each        = var.services_to_chart
  repository      = "https://cdcgov.github.io/phdi-charts/"
  name            = "phdi-playground-${terraform.workspace}-${each.key}"
  chart           = each.value
  force_update    = true
  recreate_pods   = true
  cleanup_on_fail = true

  set {
    name  = "image.tag"
    value = "v1.1.12"
  }

  set {
    name  = "smartyAuthId"
    value = var.smarty_auth_id
  }

  set {
    name  = "smartyToken"
    value = var.smarty_auth_token
  }

  #  Values needed for orchestration service
  set {
    name  = "fhirConverterUrl"
    value = "https://k8s-phdiplayground${terraform.workspace}.${var.region}.elb.amazonaws.com/fhir-converter"
  }

  set {
    name  = "ingestionUrl"
    value = "https://k8s-phdiplayground${terraform.workspace}.${var.region}.elb.amazonaws.com/ingestion"
  }

  set {
    name  = "messageParserUrl"
    value = "https://k8s-phdiplayground${terraform.workspace}.${var.region}.elb.amazonaws.com/message-parser"
  }

  set {
    name  = "validationUrl"
    value = "https://k8s-phdiplayground${terraform.workspace}.${var.region}.elb.amazonaws.com/validation"
  }
}

# Ingress

resource "kubectl_manifest" "ingress" {
  depends_on = [helm_release.building_blocks]
  yaml_body  = data.kubectl_file_documents.ingress.documents[0]
}

# Karpenter

module "eks_blueprints_addons" {
  source  = "aws-ia/eks-blueprints-addons/aws"
  version = "~> 1.14"

  cluster_name      = module.eks-cluster.cluster_name
  cluster_endpoint  = module.eks-cluster.cluster_endpoint
  cluster_version   = module.eks-cluster.cluster_version
  oidc_provider_arn = module.eks-cluster.oidc_provider_arn

  # We want to wait for the Fargate profiles to be deployed first
  create_delay_dependencies = [for prof in module.eks-cluster.fargate_profiles : prof.fargate_profile_arn]

  eks_addons = {
    coredns = {
      configuration_values = jsonencode({
        computeType = "Fargate"
        # Ensure that the we fully utilize the minimum amount of resources that are supplied by
        # Fargate https://docs.aws.amazon.com/eks/latest/userguide/fargate-pod-configuration.html
        # Fargate adds 256 MB to each pod's memory reservation for the required Kubernetes
        # components (kubelet, kube-proxy, and containerd). Fargate rounds up to the following
        # compute configuration that most closely matches the sum of vCPU and memory requests in
        # order to ensure pods always have the resources that they need to run.
        resources = {
          limits = {
            cpu = "0.25"
            # We are targeting the smallest Task size of 512Mb, so we subtract 256Mb from the
            # request/limit to ensure we can fit within that task
            memory = "256M"
          }
          requests = {
            cpu = "0.25"
            # We are targeting the smallest Task size of 512Mb, so we subtract 256Mb from the
            # request/limit to ensure we can fit within that task
            memory = "256M"
          }
        }
      })
    }
    vpc-cni    = {}
    kube-proxy = {}
  }

  enable_karpenter = true
  karpenter = {
    repository_username = data.aws_ecrpublic_authorization_token.token.user_name
    repository_password = data.aws_ecrpublic_authorization_token.token.password
  }
  karpenter_node = {
    # Use static name so that it matches what is defined in `karpenter.yaml` example manifest
    iam_role_use_name_prefix = false
  }

  tags = local.tags
}
