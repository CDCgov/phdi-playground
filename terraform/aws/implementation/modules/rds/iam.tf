# db role
resource "aws_iam_role" "db_role_for_tefca_viewer" {
  name               = "DBAccessRoleForTefcaViewer"
  assume_role_policy = var.eks_assume_role_policy
}

resource "aws_iam_policy" "db_tefca_viewer_policy" {
  name        = "AWSDBIAMPolicyForTefcaViewer"
  description = "Policy for Tefca Viewer and DB in DIBBS"
  policy      = data.aws_iam_policy_document.tefca_viewer_db_policy.json
}

resource "aws_iam_role_policy_attachment" "db_tefca_viewer_policy" {
  role       = aws_iam_role.db_role_for_tefca_viewer.name
  policy_arn = aws_iam_policy.db_tefca_viewer_policy.arn
}
