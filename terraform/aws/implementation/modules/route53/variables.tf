variable "domain_name" {
  description = "The domain name to use for the Route53 hosted zone"
  type        = string
  default     = "dibbs.cloud"
}

variable "alb_hostname" {
  description = "The hostname of the ALB"
  type        = string
}