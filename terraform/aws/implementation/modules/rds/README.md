<!-- BEGIN_TF_DOCS -->
## Requirements

No requirements.

## Providers

| Name | Version |
|------|---------|
| <a name="provider_aws"></a> [aws](#provider\_aws) | n/a |
| <a name="provider_random"></a> [random](#provider\_random) | n/a |

## Modules

No modules.

## Resources

| Name | Type |
|------|------|
| [aws_db_instance.tefca-viewer-db](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/db_instance) | resource |
| [aws_db_parameter_group.this](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/db_parameter_group) | resource |
| [aws_db_subnet_group.this](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/db_subnet_group) | resource |
| [aws_iam_policy.db_tefca_viewer_policy](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/iam_policy) | resource |
| [aws_iam_role.db_role_for_tefca_viewer](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/iam_role) | resource |
| [aws_iam_role_policy_attachment.db_tefca_viewer_policy](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/iam_role_policy_attachment) | resource |
| [aws_security_group.ds_sg](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/security_group) | resource |
| [random_string.setup_rds_password](https://registry.terraform.io/providers/hashicorp/random/latest/docs/resources/string) | resource |
| [aws_iam_policy_document.tefca_viewer_db_policy](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/data-sources/iam_policy_document) | data source |

## Inputs

| Name | Description | Type | Default | Required |
|------|-------------|------|---------|:--------:|
| <a name="input_db_identifier"></a> [db\_identifier](#input\_db\_identifier) | Name of RDS Instance | `string` | `"tefca-viewer-db"` | no |
| <a name="input_db_username"></a> [db\_username](#input\_db\_username) | Username of RDS Instance | `string` | `"tefcaViewerDbUser"` | no |
| <a name="input_eks_assume_role_policy"></a> [eks\_assume\_role\_policy](#input\_eks\_assume\_role\_policy) | n/a | `string` | n/a | yes |
| <a name="input_engine_type"></a> [engine\_type](#input\_engine\_type) | Engine of RDS Instance | `string` | `"postgres"` | no |
| <a name="input_engine_version"></a> [engine\_version](#input\_engine\_version) | Engine Version of RDS Instance | `string` | `"16.3"` | no |
| <a name="input_family"></a> [family](#input\_family) | RDS Family | `string` | `"postgres16"` | no |
| <a name="input_private_subnet_ids"></a> [private\_subnet\_ids](#input\_private\_subnet\_ids) | List of private subnet IDs | `list(string)` | n/a | yes |
| <a name="input_region"></a> [region](#input\_region) | n/a | `string` | `"us-east-1"` | no |
| <a name="input_tefca_db_name"></a> [tefca\_db\_name](#input\_tefca\_db\_name) | The name of the tefca database | `string` | `"tefca_db"` | no |
| <a name="input_vpc_id"></a> [vpc\_id](#input\_vpc\_id) | ID of the VPC | `string` | n/a | yes |

## Outputs

| Name | Description |
|------|-------------|
| <a name="output_tefca_db_connection_string"></a> [tefca\_db\_connection\_string](#output\_tefca\_db\_connection\_string) | n/a |
| <a name="output_tefca_viewer_db_role_arn"></a> [tefca\_viewer\_db\_role\_arn](#output\_tefca\_viewer\_db\_role\_arn) | n/a |
<!-- END_TF_DOCS -->