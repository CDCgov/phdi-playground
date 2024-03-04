output "alb_hostname" {
  value = data.kubernetes_ingress_v1.ingress.status.0.load_balancer.0.ingress.0.hostname
}

output "eks_assume_role_policy" {
  value = data.aws_iam_policy_document.eks_assume_role_policy.json
}