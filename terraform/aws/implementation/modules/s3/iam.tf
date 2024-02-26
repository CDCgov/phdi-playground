# TODO iam permissions to speak with clear
resource "aws_s3_bucket_policy" "allow_s3_access_for_ecr_viewer" {
  bucket = aws_s3_bucket.s3.id
  policy = data.aws_iam_policy_document.ecr_viewer_s3_policy.json
}

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

resource "aws_s3_bucket_policy" "allow_s3_access_for_orchestration" {
  bucket = aws_s3_bucket.s3.id
  policy = data.aws_iam_policy_document.orchestration_s3_policy.json
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