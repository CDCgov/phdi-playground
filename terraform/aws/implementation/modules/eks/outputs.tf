output "eks_assume_role_policy" {
  value = data.aws_iam_policy_document.eks_assume_role_policy.json
}

output "ingress_created" {
  value = kubectl_manifest.ingress.id
}
