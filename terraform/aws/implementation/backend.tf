terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "=5.61.0"
    }
    kubectl = {
      source  = "gavinbunney/kubectl"
      version = ">= 1.14.0"
    }
    helm = {
      source  = "hashicorp/helm"
      version = "= 2.12.1"
    }
    kubernetes = {
      source  = "hashicorp/kubernetes"
      version = "= 2.25.2"
    }
    external = {
      source  = "hashicorp/external"
      version = "= 2.3.3"
    }
  }

  backend "s3" {
    key    = "remote_tfstate"
    region = "us-east-1"
  }
}

# Credentials should be provided by using the AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY environment variables.
provider "aws" {
  region = "us-east-1"
  default_tags {
    tags = {
      Owner       = "Skylight"
      Environment = terraform.workspace
    }
  }
}
