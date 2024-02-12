variable "region" {
  description = "The AWS region to deploy the CloudFront distribution"
  type        = string
}

variable "vpc_id" {
  description = "The VPC ID to deploy the CloudFront distribution"
  type        = string
}

variable "alb_hostname" {
  description = "The DNS name of the ALB to use as the origin for the CloudFront distribution"
  type        = string
}