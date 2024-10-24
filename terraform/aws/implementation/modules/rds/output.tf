output "tefca_viewer_db_role_arn" {
  value = aws_iam_role.db_role_for_tefca_viewer.arn
}

output "tefca_db_connection_string" {
  value     = "postgresql://${aws_db_instance.tefca-viewer-db.username}:${aws_db_instance.tefca-viewer-db.password}@${aws_db_instance.tefca-viewer-db.endpoint}/${aws_db_instance.tefca-viewer-db.db_name}"
  sensitive = true
}

output "tefca_jdbc_db_url" {
  value     = "jdbc:postgresql://${aws_db_instance.tefca-viewer-db.endpoint}/${aws_db_instance.tefca-viewer-db.db_name}"
  sensitive = true
}

output "tefca_jdbc_db_user" {
  value     = aws_db_instance.tefca-viewer-db.username
  sensitive = true
}

output "tefca_jdbc_db_password" {
  value     = aws_db_instance.tefca-viewer-db.password
  sensitive = true
}