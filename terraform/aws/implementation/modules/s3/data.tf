data "aws_iam_policy_document" "ecr_viewer_s3_policy" {
  statement {
    principals {
      type        = "AWS"
      identifiers = ["ecrViewerPutPostGetS3Policy"]
    }

    actions = [
      "s3:PutObject",
      "s3:PutObjectAcl",
      "s3:PostObject",
      "s3:PostObjectAcl",
      "s3:GetObject",
      "s3:GetObjectAcl",
    ]

    resources = [
      aws_s3_bucket.s3.arn,
      "${aws_s3_bucket.s3.arn}/*",
    ]
  }
}

data "aws_iam_policy_document" "orchestration_s3_policy" {
  statement {
    principals {
      type        = "AWS"
      identifiers = ["orchestrationPutAndPostS3Policy"]
    }

    actions = [
      "s3:PutObject",
      "s3:PutObjectAcl",
      "s3:PostObject",
      "s3:PostObjectAcl",
    ]

    resources = [
      aws_s3_bucket.s3.arn,
      "${aws_s3_bucket.s3.arn}/*",
    ]
  }
}