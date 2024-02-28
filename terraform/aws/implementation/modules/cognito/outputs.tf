output "cognito_user_pool_arn" {
  value = aws_cognito_user_pool.pool.arn
}

output "cognito_client_id" {
  value = aws_cognito_user_pool_client.client.id
}

output "cognito_domain" {
  value = aws_cognito_user_pool_domain.domain.domain
}