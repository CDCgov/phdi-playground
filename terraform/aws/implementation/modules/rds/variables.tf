#Must be in the format of "hh24:mi-hh24:mi"
variable "backup_window" {
  type        = string
  description = "Backup Window for RDS Instance"
  default     = "03:00-06:00"
}

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

variable "eks_assume_role_policy" {
  type = string
}

variable "engine_type" {
  type        = string
  description = "Engine of RDS Instance"
  default     = "postgres"
}

variable "engine_version" {
  type        = string
  description = "Engine Version of RDS Instance"
  default     = "16.3"
}

variable "family" {
  type        = string
  description = "RDS Family"
  default     = "postgres16"
}

# Must be in the format of "ddd:hh24:mi-ddd:hh24:mi"
variable "maintenance_window" {
  type        = string
  description = "Maintenance Window for RDS Instance"
  default     = "Mon:00:00mi-Mon:3:00:mi"
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
