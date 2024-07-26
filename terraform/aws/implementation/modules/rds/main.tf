resource "aws_db_instance" "query-templates" {
  identifier        = var.db_identifier
  instance_class    = "db.t3.micro"
  allocated_storage = 5
  engine            = "postgres"
  engine_version    = "16.3"
  username          = var.db_username
  password          = var.db_password
  #db_subnet_group_name   = aws_db_subnet_group.this.name
  #vpc_security_group_ids    = var.private_subnet_ids
  parameter_group_name      = aws_db_parameter_group.this.name
  publicly_accessible       = false
  skip_final_snapshot       = true
  final_snapshot_identifier = true
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
