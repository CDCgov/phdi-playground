# Note: only lowercase alphanumeric characters and hyphens allowed in "identifier"
variable "db_identifier" {
  type        = string
  description = "Name of RDS Instance"
  default     = "query-templates"
}

variable "db_username" {
  type        = string
  description = "Username of RDS Instance"
  default     = "tefcaViewerDbUser"
}

variable "db_password" {
  type        = string
  description = "Password of RDS Instance"
  # TODO: Turn on sensitive once the database is fully up and save real pwd 
  # as a variable to ingest from the pipeline (i.e. Github Secrets)
  sensitive = true
}

variable "private_subnet_ids" {
  type        = list(string)
  description = "List of private subnet IDs"
}

variable "region" {
  type    = string
  default = "us-east-1"
}

variable "vpc_id" {
  type        = string
  description = "ID of the VPC"
}
