resource "aws_db_instance" "query-templates" {
  identifier        = var.db_identifier
  instance_class    = "db.t3.micro"
  allocated_storage = 5
  engine            = "postgres"
  engine_version    = "16.3"
  username          = var.db_username
  password          = var.db_password
  #   db_subnet_group_name = aws_db_subnet_group.default.name
  #   vpc_security_group_ids    = aws_security_group.db_sg.id
  parameter_group_name      = aws_db_parameter_group.this.name
  publicly_accessible       = false
  skip_final_snapshot       = false
  backup_retention_period   = 30
  final_snapshot_identifier = "${var.db_identifier}-backup"
}

resource "aws_db_parameter_group" "this" {
  name   = "${var.db_identifier}-pg"
  family = "postgres16"

  parameter {
    name  = "log_connections"
    value = "1"
  }

  lifecycle {
    create_before_destroy = true
  }
}

# resource "aws_db_subnet_group" "default" {
#   name       = "main"
#   subnet_ids = var.private_subnet_ids
#   tags = {
#     Name = "${var.db_identifier}-private-subnet-group"
#   }
# }

# Create a security group
# resource "aws_security_group" "db_sg" {
#   vpc_id = var.vpc_id
#   tags = {
#     Name = "${var.db_identifier}-security-group"
#   }
# }
