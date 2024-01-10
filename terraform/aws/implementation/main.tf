module "vpc" {
  source = "./modules/vpc"
  region = var.region
}

module "eks" {
  source            = "./modules/eks"
  region            = var.region
  public_subnet_ids = module.vpc.public_subnet_ids
}
