# s3 bucket role
resource "aws_iam_role" "s3_role_for_ecr_viewer" {
  name               = "S3AccessRoleForEcrViewer"
  assume_role_policy = var.eks_assume_role_policy
}

resource "aws_iam_policy" "s3_bucket_ecr_viewer_policy" {
  name        = "AWSS3IAMPolicyForEcrViewer"
  description = "Policy for ECR-Viewer and S3 in DIBBS"
  policy      = data.aws_iam_policy_document.ecr_viewer_s3_policy.json
}

resource "aws_iam_role_policy_attachment" "s3_bucket_ecr_viewer_policy" {
  role       = aws_iam_role.s3_role_for_ecr_viewer.name
  policy_arn = aws_iam_policy.s3_bucket_ecr_viewer_policy.arn
}


resource "aws_iam_role" "s3_role_for_orchestration" {
  name               = "S3AccessRoleForOrchestration"
  assume_role_policy = var.eks_assume_role_policy
}

resource "aws_iam_policy" "s3_bucket_orchestration_policy" {
  name        = "AWSS3IAMPolicyForOrchestration"
  description = "Policy for Orchestration and S3 in DIBBS"
  policy      = data.aws_iam_policy_document.orchestration_s3_policy.json
}

resource "aws_iam_role_policy_attachment" "s3_bucket_orchestration_policy" {
  role       = aws_iam_role.s3_role_for_orchestration.name
  policy_arn = aws_iam_policy.s3_bucket_orchestration_policy.arn
}