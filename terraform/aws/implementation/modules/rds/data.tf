data "aws_iam_policy_document" "tefca_viewer_db_policy" {
  statement {
    sid    = ""
    effect = "Allow"
    actions = [
      "rds:Connect",
      "rds:DescribeDBInstances",
      "rds:DescribeDBClusters",
      "rds:DescribeDBSnapshots",
      "rds:DescribeDBParameterGroups"
    ]

    resources = [
      aws_db_instance.query-templates.arn,
      "${aws_db_instance.query-templates.arn}/*",
    ]
  }
}
