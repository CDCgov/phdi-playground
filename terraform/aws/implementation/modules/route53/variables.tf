variable "domain_name" {
  description = "The domain name to use for the Route53 hosted zone"
  type        = string
  default     = "dibbs.cloud"
}

variable "ingress_created" {
  description = "The ID of the Kubernetes Ingress resource"
  type        = string
}

