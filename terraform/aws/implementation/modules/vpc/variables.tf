variable "region" {
  type    = string
  default = "us-east-1"
}

variable "cidrs" {
  type        = string
  default     = "172.0.1.0/24"
  description = "Use to override the default environment CIDRs. Useful for feature deploys or local test environments."
}