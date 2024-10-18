<!-- BEGIN_TF_DOCS -->
## Requirements

No requirements.

## Providers

| Name | Version |
|------|---------|
| <a name="provider_aws"></a> [aws](#provider\_aws) | n/a |

## Modules

No modules.

## Resources

| Name | Type |
|------|------|
| [aws_iam_policy.s3_bucket_ecr_viewer_policy](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/iam_policy) | resource |
| [aws_iam_role.s3_role_for_ecr_viewer](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/iam_role) | resource |
| [aws_iam_role_policy_attachment.s3_bucket_ecr_viewer_policy](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/iam_role_policy_attachment) | resource |
| [aws_s3_bucket.s3](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/s3_bucket) | resource |
| [aws_iam_policy_document.ecr_viewer_s3_policy](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/data-sources/iam_policy_document) | data source |

## Inputs

| Name | Description | Type | Default | Required |
|------|-------------|------|---------|:--------:|
| <a name="input_eks_assume_role_policy"></a> [eks\_assume\_role\_policy](#input\_eks\_assume\_role\_policy) | n/a | `string` | n/a | yes |
| <a name="input_region"></a> [region](#input\_region) | n/a | `string` | `"us-east-1"` | no |
| <a name="input_s3_name"></a> [s3\_name](#input\_s3\_name) | n/a | `string` | `"processed-ecr-files"` | no |

## Outputs

| Name | Description |
|------|-------------|
| <a name="output_ecr_bucket_name"></a> [ecr\_bucket\_name](#output\_ecr\_bucket\_name) | n/a |
| <a name="output_ecr_viewer_s3_role_arn"></a> [ecr\_viewer\_s3\_role\_arn](#output\_ecr\_viewer\_s3\_role\_arn) | n/a |
<!-- END_TF_DOCS -->