data "aws_route53_zone" "domain" {
  name = var.domain_name
}

data "aws_lb" "alb" {
  depends_on = [var.ingress_created]
  tags = {
    "ingress.k8s.aws/stack" = "phdi-playground-${terraform.workspace}"
  }
}
