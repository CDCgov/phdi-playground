output "orchestration_s3_role_arn" {
  value = aws_iam_role.s3_role_for_orchestration.arn
}

output "ecr_viewer_s3_role_arn" {
  value = aws_iam_role.s3_role_for_ecr_viewer.arn
}