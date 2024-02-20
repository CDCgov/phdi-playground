variable "env" {
  type        = string
  description = "Environment"
  default     = "dev"
}

variable "region" {
  type    = string
  default = "us-east-1"
}

variable "s3_name" {
  type    = string
  default = "phdi-playground-s3-bucket"
}