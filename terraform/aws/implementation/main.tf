module "vpc" {
  source = "./modules/vpc"
  region = var.region
}
