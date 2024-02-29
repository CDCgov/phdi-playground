output "alb_hostname" {
  value = data.kubernetes_ingress_v1.ingress.status.0.load_balancer.0.ingress.0.hostname
}