resource "aws_route53domains_registered_domain" "domain" {
  domain_name = var.domain_name

  name_server {
    name = "ns-821.awsdns-38.net"
  }

  name_server {
    name = "ns-236.awsdns-29.com"
  }

  name_server {
    name = "ns-1819.awsdns-35.co.uk"
  }

  name_server {
    name = "ns-1315.awsdns-36.org"
  }
}

# Create ACM certificate for the domain
resource "aws_acm_certificate" "site_cert" {
  domain_name       = var.domain_name
  validation_method = "DNS"
  lifecycle {
    create_before_destroy = true
  }
}

# Create DNS record for the ACM certificate
resource "aws_route53_record" "site_cert_dns" {
  allow_overwrite = true
  name            = tolist(aws_acm_certificate.site_cert.domain_validation_options)[0].resource_record_name
  records         = [tolist(aws_acm_certificate.site_cert.domain_validation_options)[0].resource_record_value]
  type            = tolist(aws_acm_certificate.site_cert.domain_validation_options)[0].resource_record_type
  zone_id         = data.aws_route53_zone.domain.zone_id
  ttl             = 60
}

resource "aws_acm_certificate_validation" "site_cert_validation" {
  certificate_arn         = aws_acm_certificate.site_cert.arn
  validation_record_fqdns = [aws_route53_record.site_cert_dns.fqdn]
}

# Create DNS record for the application load balancer
resource "aws_route53_record" "alb" {
  name    = var.domain_name
  type    = "A"
  zone_id = data.aws_route53_zone.domain.zone_id

  alias {
    name                   = var.alb_hostname
    zone_id                = data.aws_lb.alb.zone_id
    evaluate_target_health = true
  }
}
