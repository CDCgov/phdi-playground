output "tefca_viewer_db_role_arn" {
  value = aws_iam_role.db_role_for_tefca_viewer.arn
}

output "tefca_db_connection_string" {
  value = "postgresql://${aws_db_instance.tefca-viewer-db.username}:${aws_db_instance.tefca-viewer-db.password}@${aws_db_instance.tefca-viewer-db.endpoint}:5432/${aws_db_instance.tefca-viewer-db.db_name}"
  sensitive = true
}
