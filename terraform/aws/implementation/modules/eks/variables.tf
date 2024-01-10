variable "region" {
  type    = string
  default = "us-east-1"
}

variable "public_subnet_ids" {
  type    = list(string)
}