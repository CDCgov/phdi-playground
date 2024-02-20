resource "aws_s3_bucket" "ecr_viewer_s3" {
  bucket = "ecr-viewer-s3-bucket"

  tags = {
    Name        = "DIBBS Streamline eCR"
    Environment = var.env
  }
}