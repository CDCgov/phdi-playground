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

  cluster_addons = {
    coredns = {
      most_recent = true
    }
    kube-proxy = {
      most_recent = true
    }
    vpc-cni = {
      most_recent = true
    }
  }

  fargate_profiles = {
    default = {
      name = "default"
      selectors = [
        {
          namespace = "kube-system"
        },
        {
          namespace = "default"
        }
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
    }
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

# cert-manager

# resource "helm_release" "cert_manager" {
#   depends_on       = [module.eks-cluster]
#   name             = "cert-manager"
#   repository       = "https://charts.jetstack.io"
#   chart            = "cert-manager"
#   namespace        = "cert-manager"
#   create_namespace = true

#   set {
#     name  = "installCRDs"
#     value = true
#   }

#   set {
#     name  = "webhook.securePort"
#     value = 10260
#   }
# }

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
  version    = "1.6.2"

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
    value = "v1.1.11"
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
