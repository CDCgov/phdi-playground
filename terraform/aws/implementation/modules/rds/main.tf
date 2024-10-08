# Define the RDS instance for Postgres
resource "aws_db_instance" "tefca-viewer-db" {
  identifier                = var.db_identifier
  instance_class            = "db.t3.micro"
  allocated_storage         = 5
  engine                    = var.engine_type
  engine_version            = var.engine_version
  username                  = var.db_username
  password                  = random_password.setup_rds_password.result
  db_subnet_group_name      = aws_db_subnet_group.this.name
  vpc_security_group_ids    = [aws_security_group.ds_sg.id]
  parameter_group_name      = aws_db_parameter_group.this.name
  publicly_accessible       = false
  skip_final_snapshot       = true
  final_snapshot_identifier = true
}

# Create a parameter group to configure Postgres RDS parameters
resource "aws_db_parameter_group" "this" {
  name   = "${var.db_identifier}-pg"
  family = var.family

  parameter {
    name  = "log_connections"
    value = "1"
  }

  lifecycle {
    create_before_destroy = true
  }
}

# Security group for RDS
resource "aws_security_group" "ds_sg" {
  vpc_id = var.vpc_id

  # Allow inbound traffic on port 5432 for PostgreSQL from within the VPC
  ingress {
    from_port   = 5432
    to_port     = 5432
    protocol    = "tcp"
    cidr_blocks = ["10.0.0.0/16"]
  }

  # Allow all outbound traffic
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "${var.db_identifier}-security-group"
  }
}

# Create a DB subnet group
resource "aws_db_subnet_group" "this" {
  name       = "${var.db_identifier}-subnet-group"
  subnet_ids = var.private_subnet_ids

}

# TODO: Update for Production to AWS Secrets Manager 
# This resource's attribute(s) default value is true 
resource "random_password" "setup_rds_password" {
  length = 13 #update as needed

  # Character set that excludes problematic characters like quotes, backslashes, etc.
  override_special = "_!@#-$%^&*()[]{}"
}
