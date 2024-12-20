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

# Note: The chart names are limited to 15 characters
variable "services_to_chart" {
  type = map(string)
  default = {
    fhir-converter         = "fhir-converter",
    ingestion              = "ingestion",
    message-parser         = "message-parser",
    orchestration          = "orchestration",
    validation             = "validation",
    ecr-viewer             = "ecr-viewer",
    tefca-viewer           = "tefca-viewer",
    message-refiner        = "message-refiner",
    trigger-code-reference = "trigger-code-reference"
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

variable "ecr_viewer_s3_role_arn" {
  description = "The s3 Role ARN for the ECR Viewer Service"
}

variable "tefca_viewer_db_role_arn" {
  description = "The db Role ARN for the Tefca Viewer Service"
}

variable "domain_name" {
  description = "The domain name to use"
  type        = string
}

variable "ecr_bucket_name" {
  description = "The name of the ECR bucket"
  type        = string
}

variable "enable_cognito" {
  description = "Enable Cognito"
  type        = bool
  default     = true
}

variable "cognito_user_pool_arn" {
  description = "The ARN of the Cognito user pool"
}

variable "cognito_client_id" {
  description = "The ID of the Cognito user pool client"
}

variable "cognito_domain" {
  description = "The domain of the Cognito user pool"
}

variable "tefca_db_connection_string" {
  description = "Connection string to the tefca database"
}

variable "tefca_jdbc_db_url" {
  description = "JDBC connection string for flyway to the tefca database"
}

variable "tefca_jdbc_db_password" {
  description = "JDBC password for flyway to the tefca database"
}

variable "tefca_jdbc_db_user" {
  description = "JDBC username for flyway to the tefca database"
}