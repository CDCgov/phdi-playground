variable "region" {
  type    = string
  default = "us-east-1"
}

variable "eks_name" {
  type    = string
  default = "phdi-playground-eks"
}

variable "vpc_id" {
  type        = string
  description = "ID of the VPC"
}

variable "public_subnet_ids" {
  type        = list(string)
  description = "List of public subnet IDs"
}

variable "private_subnet_ids" {
  type        = list(string)
  description = "List of private subnet IDs"
}

variable "services_to_chart" {
  type = map(string)
  default = {
    fhir-converter = "fhir-converter-chart",
    ingestion      = "ingestion-chart",
    message-parser = "message-parser-chart",
    orchestration  = "orchestration",
    validation     = "validation-chart"
    ecr-viewer     = "ecr-viewer-chart"
  }
}

variable "smarty_auth_id" {
  description = "value of the SmartyStreets Auth ID"
}

variable "smarty_auth_token" {
  description = "value of the SmartyStreets Auth Token"
}

variable "aws_acm_certificate_arn" {
  description = "The ARN of the ACM certificate"
}