data "aws_iam_policy_document" "ecr_viewer_s3_policy" {
  statement {

    principals {
      type        = "Service"
      identifiers = ["s3.amazonaws.com"]
    }

    principals {
      type        = "AWS"
      identifiers = ["arn:aws:iam:339712971032:role/s3_role"]
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
      type        = "Service"
      identifiers = ["s3.amazonaws.com"]
    }
    
    principals {
      type        = "AWS"
      identifiers = ["arn:aws:iam:339712971032:role/s3_role"]
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

data "aws_iam_policy_document" "s3_role_policy" {
  statement {
    actions = ["sts:AssumeRole"]

    principals {
      type        = "Service"
      identifiers = ["s3.amazonaws.com"]
    }
  }
}