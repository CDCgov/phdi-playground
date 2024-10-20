locals {
  name        = "phdi-playground-${terraform.workspace}"
  domain_name = "dibbs.cloud"
}

module "vpc" {
  source                      = "terraform-aws-modules/vpc/aws"
  name                        = local.name
  cidr                        = "176.24.0.0/16"
  azs                         = ["us-east-1a", "us-east-1b"]
  private_subnets             = ["176.24.1.0/24", "176.24.3.0/24"]
  public_subnets              = ["176.24.2.0/24", "176.24.4.0/24"]
  enable_nat_gateway          = true
  single_nat_gateway          = true
  default_security_group_name = "${local.name}-security-group"

  public_subnet_tags = {
    "kubernetes.io/cluster/${local.name}" = "shared"
    "kubernetes.io/role/elb"              = "1"
  }

  private_subnet_tags = {
    "kubernetes.io/cluster/${local.name}" = "shared"
    "kubernetes.io/role/internal-elb"     = "1"
    "karpenter.sh/discovery"              = local.name
  }

  tags = {
    "kubernetes.io/cluster/${local.name}" = "shared"
  }
}

module "eks" {
  source                     = "./modules/eks"
  region                     = var.region
  eks_name                   = local.name
  vpc_id                     = module.vpc.vpc_id
  public_subnet_ids          = module.vpc.public_subnets
  private_subnet_ids         = module.vpc.private_subnets
  smarty_auth_id             = var.smarty_auth_id
  smarty_auth_token          = var.smarty_auth_token
  aws_acm_certificate_arn    = module.route53.aws_acm_certificate_arn
  ecr_viewer_s3_role_arn     = module.s3.ecr_viewer_s3_role_arn
  tefca_viewer_db_role_arn   = module.rds.tefca_viewer_db_role_arn
  tefca_db_connection_string = module.rds.tefca_db_connection_string
  tefca_jdbc_db_url          = module.rds.tefca_jdbc_db_url
  tefca_jdbc_db_password     = module.rds.tefca_jdbc_db_password
  tefca_jdbc_db_user         = module.rds.tefca_jdbc_db_user
  domain_name                = local.domain_name
  ecr_bucket_name            = module.s3.ecr_bucket_name
  enable_cognito             = var.enable_cognito
  cognito_user_pool_arn      = module.cognito.cognito_user_pool_arn
  cognito_client_id          = module.cognito.cognito_client_id
  cognito_domain             = module.cognito.cognito_domain
}

module "route53" {
  source          = "./modules/route53"
  domain_name     = local.domain_name
  ingress_created = module.eks.ingress_created
}

module "cognito" {
  source      = "./modules/cognito"
  domain_name = local.domain_name
}

module "s3" {
  source                 = "./modules/s3"
  region                 = var.region
  eks_assume_role_policy = module.eks.eks_assume_role_policy
}

module "rds" {
  source                 = "./modules/rds"
  region                 = var.region
  vpc_id                 = module.vpc.vpc_id
  private_subnet_ids     = module.vpc.private_subnets
  eks_assume_role_policy = module.eks.eks_assume_role_policy
}
