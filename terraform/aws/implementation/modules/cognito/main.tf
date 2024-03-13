resource "aws_cognito_user_pool" "pool" {
  name = "phdi-playground-${terraform.workspace}"
}

resource "aws_cognito_user_pool_client" "client" {
  name                                 = "alb"
  user_pool_id                         = aws_cognito_user_pool.pool.id
  callback_urls                        = ["https://${var.domain_name}/oauth2/idpresponse"]
  allowed_oauth_flows_user_pool_client = true
  allowed_oauth_flows                  = ["code", "implicit"]
  allowed_oauth_scopes                 = ["email", "openid"]
  supported_identity_providers         = ["COGNITO"]
  generate_secret                      = true
}

resource "aws_cognito_user_pool_domain" "domain" {
  domain       = "phdi-playground-${terraform.workspace}"
  user_pool_id = aws_cognito_user_pool.pool.id
}

resource "aws_cognito_user" "admin" {
  username           = "admin"
  user_pool_id       = aws_cognito_user_pool.pool.id
  temporary_password = "Password123!"
}

resource "aws_cognito_user" "dibbs" {
  username           = "dibbs"
  user_pool_id       = aws_cognito_user_pool.pool.id
  temporary_password = "Password123!"
}
