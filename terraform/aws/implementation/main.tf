locals {
  name_prefix = "phdi-playground-${terraform.workspace}"
  vpc_name    = "${local.name_prefix}-vpc"
  eks_name    = "${local.name_prefix}-eks"
}

module "vpc" {
  source                      = "terraform-aws-modules/vpc/aws"
  name                        = local.vpc_name
  cidr                        = "176.24.0.0/16"
  azs                         = ["us-east-1a", "us-east-1b"]
  private_subnets             = ["176.24.1.0/24", "176.24.3.0/24"]
  public_subnets              = ["176.24.2.0/24", "176.24.4.0/24"]
  enable_nat_gateway          = true
  single_nat_gateway          = true
  default_security_group_name = "${local.vpc_name}-security-group"

  public_subnet_tags = {
    "kubernetes.io/cluster/${local.eks_name}" = "shared"
    "kubernetes.io/role/elb"                  = "1"
  }

  private_subnet_tags = {
    "kubernetes.io/cluster/${local.eks_name}" = "shared"
    "kubernetes.io/role/internal-elb"         = "1"
  }

  tags = {
    "kubernetes.io/cluster/${local.eks_name}" = "shared"
  }
}

module "eks" {
  source             = "./modules/eks"
  region             = var.region
  eks_name           = local.eks_name
  vpc_id             = module.vpc.vpc_id
  public_subnet_ids  = module.vpc.public_subnets
  private_subnet_ids = module.vpc.private_subnets
  smarty_auth_id     = var.smarty_auth_id
  smarty_auth_token  = var.smarty_auth_token
}
