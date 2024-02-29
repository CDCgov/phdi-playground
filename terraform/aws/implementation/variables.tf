variable "region" {
  description = "AWS region"
  type        = string
  default     = "us-east-1"
}

variable "smarty_auth_id" {
  description = "value of the SmartyStreets Auth ID"
}

variable "smarty_auth_token" {
  description = "value of the SmartyStreets Auth Token"
}
