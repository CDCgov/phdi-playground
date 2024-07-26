resource "aws_db_instance" "query-templates" {
  identifier        = "tefca-viewer"
  instance_class    = "db.t3.micro"
  allocated_storage = 5
  engine            = "postgres"
  engine_version    = "16.3"
  username          = var.db_username
  password          = var.db_password
  #db_subnet_group_name   = aws_db_subnet_group.education.name
  vpc_security_group_ids = var.private_subnet_ids
  #parameter_group_name   = aws_db_parameter_group.education.name
  publicly_accessible = false
  skip_final_snapshot = true
}
