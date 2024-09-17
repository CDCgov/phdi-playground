<!-- BEGIN_TF_DOCS -->
## Requirements

| Name | Version |
|------|---------|
| <a name="requirement_aws"></a> [aws](#requirement\_aws) | =5.61.0 |
| <a name="requirement_external"></a> [external](#requirement\_external) | = 2.3.3 |
| <a name="requirement_helm"></a> [helm](#requirement\_helm) | = 2.12.1 |
| <a name="requirement_kubectl"></a> [kubectl](#requirement\_kubectl) | >= 1.14.0 |
| <a name="requirement_kubernetes"></a> [kubernetes](#requirement\_kubernetes) | = 2.25.2 |

## Providers

No providers.

## Modules

| Name | Source | Version |
|------|--------|---------|
| <a name="module_cognito"></a> [cognito](#module\_cognito) | ./modules/cognito | n/a |
| <a name="module_eks"></a> [eks](#module\_eks) | ./modules/eks | n/a |
| <a name="module_rds"></a> [rds](#module\_rds) | ./modules/rds | n/a |
| <a name="module_route53"></a> [route53](#module\_route53) | ./modules/route53 | n/a |
| <a name="module_s3"></a> [s3](#module\_s3) | ./modules/s3 | n/a |
| <a name="module_vpc"></a> [vpc](#module\_vpc) | terraform-aws-modules/vpc/aws | n/a |

## Resources

No resources.

## Inputs

| Name | Description | Type | Default | Required |
|------|-------------|------|---------|:--------:|
| <a name="input_enable_cognito"></a> [enable\_cognito](#input\_enable\_cognito) | Enable Cognito | `bool` | `true` | no |
| <a name="input_region"></a> [region](#input\_region) | AWS region | `string` | `"us-east-1"` | no |
| <a name="input_smarty_auth_id"></a> [smarty\_auth\_id](#input\_smarty\_auth\_id) | value of the SmartyStreets Auth ID | `any` | n/a | yes |
| <a name="input_smarty_auth_token"></a> [smarty\_auth\_token](#input\_smarty\_auth\_token) | value of the SmartyStreets Auth Token | `any` | n/a | yes |

## Outputs

No outputs.
<!-- END_TF_DOCS -->