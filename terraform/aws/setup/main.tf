###########################################################################################
#
# This file creates the bare minimum infrastructure to start storing remote state.
# It can't store its own remote state, so this file contains only one resource.
#
# In other words, do not apply this file multiple times, as it will fail due to lack of
# state - it won't know it already created the resources.
#
###########################################################################################

terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "=5.31.0"
    }
  }
}

# Credentials should be provided by using the AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY environment variables.
provider "aws" {
  region = var.region
  default_tags {
    tags = {
      Owner       = "Skylight"
      Environment = terraform.workspace
    }
  }
}

resource "aws_s3_bucket" "tfstate" {
  bucket = "phdi-playground-tfstate-${terraform.workspace}"

  force_destroy = true
}

resource "aws_s3_bucket_public_access_block" "default" {
  bucket = aws_s3_bucket.tfstate.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

resource "aws_s3_bucket_server_side_encryption_configuration" "default" {
  bucket = aws_s3_bucket.tfstate.bucket

  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "aws:kms"
    }
  }
}

resource "aws_s3_bucket_versioning" "default" {
  bucket = aws_s3_bucket.tfstate.id
  versioning_configuration {
    status = "Enabled"
  }
}

# Create a DynamoDB table for locking the state file
resource "aws_dynamodb_table" "tfstate_lock" {
  name         = "phdi-playground-tfstate-lock-${terraform.workspace}"
  hash_key     = "LockID"
  billing_mode = "PAY_PER_REQUEST"

  attribute {
    name = "LockID"
    type = "S"
  }
}
