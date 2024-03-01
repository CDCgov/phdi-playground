# TODO iam permissions to speak with clear
resource "aws_s3_bucket_policy" "allow_s3_access_for_ecr_viewer" {
  bucket = aws_s3_bucket.s3.id
  policy = data.aws_iam_policy_document.ecr_viewer_s3_policy.json
}

resource "aws_s3_bucket_policy" "allow_s3_access_for_orchestration" {
  bucket = aws_s3_bucket.s3.id
  policy = data.aws_iam_policy_document.orchestration_s3_policy.json
}

# s3 bucket role
resource "aws_iam_role" "s3_role" {
  name               = "S3AccessRole"
  assume_role_policy = data.aws_iam_policy_document.s3_role_policy.json
}