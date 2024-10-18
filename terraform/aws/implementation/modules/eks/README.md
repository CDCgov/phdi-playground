<!-- BEGIN_TF_DOCS -->
## Requirements

| Name | Version |
|------|---------|
| <a name="requirement_kubectl"></a> [kubectl](#requirement\_kubectl) | >= 1.14.0 |

## Providers

| Name | Version |
|------|---------|
| <a name="provider_aws"></a> [aws](#provider\_aws) | n/a |
| <a name="provider_external"></a> [external](#provider\_external) | n/a |
| <a name="provider_helm"></a> [helm](#provider\_helm) | n/a |
| <a name="provider_kubectl"></a> [kubectl](#provider\_kubectl) | >= 1.14.0 |
| <a name="provider_kubernetes"></a> [kubernetes](#provider\_kubernetes) | n/a |
| <a name="provider_terraform"></a> [terraform](#provider\_terraform) | n/a |

## Modules

| Name | Source | Version |
|------|--------|---------|
| <a name="module_eks-cluster"></a> [eks-cluster](#module\_eks-cluster) | terraform-aws-modules/eks/aws | 19.21.0 |
| <a name="module_eks_blueprints_addons"></a> [eks\_blueprints\_addons](#module\_eks\_blueprints\_addons) | aws-ia/eks-blueprints-addons/aws | ~> 1.14 |

## Resources

| Name | Type |
|------|------|
| [aws_iam_policy.cloudwatch_policy](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/iam_policy) | resource |
| [aws_iam_policy.load_balancer_controller](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/iam_policy) | resource |
| [aws_iam_role.eks_service_account](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/iam_role) | resource |
| [aws_iam_role_policy_attachment.load_balancer_controller](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/iam_role_policy_attachment) | resource |
| [helm_release.building_blocks](https://registry.terraform.io/providers/hashicorp/helm/latest/docs/resources/release) | resource |
| [helm_release.load_balancer_controller](https://registry.terraform.io/providers/hashicorp/helm/latest/docs/resources/release) | resource |
| [kubectl_manifest.cluster_role](https://registry.terraform.io/providers/gavinbunney/kubectl/latest/docs/resources/manifest) | resource |
| [kubectl_manifest.cluster_role_binding](https://registry.terraform.io/providers/gavinbunney/kubectl/latest/docs/resources/manifest) | resource |
| [kubectl_manifest.ingress](https://registry.terraform.io/providers/gavinbunney/kubectl/latest/docs/resources/manifest) | resource |
| [kubectl_manifest.load_balancer_controller_crds](https://registry.terraform.io/providers/gavinbunney/kubectl/latest/docs/resources/manifest) | resource |
| [kubectl_manifest.load_balancer_service_account](https://registry.terraform.io/providers/gavinbunney/kubectl/latest/docs/resources/manifest) | resource |
| [kubectl_manifest.logging_config_map](https://registry.terraform.io/providers/gavinbunney/kubectl/latest/docs/resources/manifest) | resource |
| [kubernetes_namespace_v1.aws_observability](https://registry.terraform.io/providers/hashicorp/kubernetes/latest/docs/resources/namespace_v1) | resource |
| [terraform_data.helm_setup](https://registry.terraform.io/providers/hashicorp/terraform/latest/docs/resources/data) | resource |
| [terraform_data.kubeconfig](https://registry.terraform.io/providers/hashicorp/terraform/latest/docs/resources/data) | resource |
| [terraform_data.wait_for_load_balancer_controller](https://registry.terraform.io/providers/hashicorp/terraform/latest/docs/resources/data) | resource |
| [aws_caller_identity.current](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/data-sources/caller_identity) | data source |
| [aws_ecrpublic_authorization_token.token](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/data-sources/ecrpublic_authorization_token) | data source |
| [aws_eks_cluster_auth.eks](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/data-sources/eks_cluster_auth) | data source |
| [aws_iam_policy_document.assume_role](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/data-sources/iam_policy_document) | data source |
| [aws_iam_policy_document.cloudwatch_policy](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/data-sources/iam_policy_document) | data source |
| [aws_iam_policy_document.eks_assume_role_policy](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/data-sources/iam_policy_document) | data source |
| [aws_iam_policy_document.load_balancer_controller](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/data-sources/iam_policy_document) | data source |
| [external_external.chart_versions](https://registry.terraform.io/providers/hashicorp/external/latest/docs/data-sources/external) | data source |
| [external_external.latest_phdi_release](https://registry.terraform.io/providers/hashicorp/external/latest/docs/data-sources/external) | data source |
| [kubectl_file_documents.ingress](https://registry.terraform.io/providers/gavinbunney/kubectl/latest/docs/data-sources/file_documents) | data source |
| [kubectl_file_documents.load_balancer_controller_crds](https://registry.terraform.io/providers/gavinbunney/kubectl/latest/docs/data-sources/file_documents) | data source |
| [kubectl_file_documents.load_balancer_service_account](https://registry.terraform.io/providers/gavinbunney/kubectl/latest/docs/data-sources/file_documents) | data source |
| [kubectl_file_documents.logging_config_map](https://registry.terraform.io/providers/gavinbunney/kubectl/latest/docs/data-sources/file_documents) | data source |
| [kubectl_path_documents.cluster_role](https://registry.terraform.io/providers/gavinbunney/kubectl/latest/docs/data-sources/path_documents) | data source |
| [kubectl_path_documents.cluster_role_binding](https://registry.terraform.io/providers/gavinbunney/kubectl/latest/docs/data-sources/path_documents) | data source |

## Inputs

| Name | Description | Type | Default | Required |
|------|-------------|------|---------|:--------:|
| <a name="input_aws_acm_certificate_arn"></a> [aws\_acm\_certificate\_arn](#input\_aws\_acm\_certificate\_arn) | The ARN of the ACM certificate | `any` | n/a | yes |
| <a name="input_cognito_client_id"></a> [cognito\_client\_id](#input\_cognito\_client\_id) | The ID of the Cognito user pool client | `any` | n/a | yes |
| <a name="input_cognito_domain"></a> [cognito\_domain](#input\_cognito\_domain) | The domain of the Cognito user pool | `any` | n/a | yes |
| <a name="input_cognito_user_pool_arn"></a> [cognito\_user\_pool\_arn](#input\_cognito\_user\_pool\_arn) | The ARN of the Cognito user pool | `any` | n/a | yes |
| <a name="input_domain_name"></a> [domain\_name](#input\_domain\_name) | The domain name to use | `string` | n/a | yes |
| <a name="input_ecr_bucket_name"></a> [ecr\_bucket\_name](#input\_ecr\_bucket\_name) | The name of the ECR bucket | `string` | n/a | yes |
| <a name="input_ecr_viewer_s3_role_arn"></a> [ecr\_viewer\_s3\_role\_arn](#input\_ecr\_viewer\_s3\_role\_arn) | The s3 Role ARN for the ECR Viewer Service | `any` | n/a | yes |
| <a name="input_eks_name"></a> [eks\_name](#input\_eks\_name) | n/a | `string` | `"phdi-playground-eks"` | no |
| <a name="input_enable_cognito"></a> [enable\_cognito](#input\_enable\_cognito) | Enable Cognito | `bool` | `true` | no |
| <a name="input_private_subnet_ids"></a> [private\_subnet\_ids](#input\_private\_subnet\_ids) | List of private subnet IDs | `list(string)` | n/a | yes |
| <a name="input_public_subnet_ids"></a> [public\_subnet\_ids](#input\_public\_subnet\_ids) | List of public subnet IDs | `list(string)` | n/a | yes |
| <a name="input_region"></a> [region](#input\_region) | n/a | `string` | `"us-east-1"` | no |
| <a name="input_services_to_chart"></a> [services\_to\_chart](#input\_services\_to\_chart) | Note: The chart names are limited to 15 characters | `map(string)` | <pre>{<br>  "ecr-viewer": "ecr-viewer",<br>  "fhir-converter": "fhir-converter",<br>  "ingestion": "ingestion",<br>  "message-parser": "message-parser",<br>  "message-refiner": "message-refiner",<br>  "orchestration": "orchestration",<br>  "tefca-viewer": "tefca-viewer",<br>  "trigger-code-reference": "trigger-code-reference",<br>  "validation": "validation"<br>}</pre> | no |
| <a name="input_smarty_auth_id"></a> [smarty\_auth\_id](#input\_smarty\_auth\_id) | value of the SmartyStreets Auth ID | `any` | n/a | yes |
| <a name="input_smarty_auth_token"></a> [smarty\_auth\_token](#input\_smarty\_auth\_token) | value of the SmartyStreets Auth Token | `any` | n/a | yes |
| <a name="input_tefca_db_connection_string"></a> [tefca\_db\_connection\_string](#input\_tefca\_db\_connection\_string) | Connection string to the tefca database | `any` | n/a | yes |
| <a name="input_tefca_jdbc_db_password"></a> [tefca\_jdbc\_db\_password](#input\_tefca\_jdbc\_db\_password) | JDBC password for flyway to the tefca database | `any` | n/a | yes |
| <a name="input_tefca_jdbc_db_url"></a> [tefca\_jdbc\_db\_url](#input\_tefca\_jdbc\_db\_url) | JDBC connection string for flyway to the tefca database | `any` | n/a | yes |
| <a name="input_tefca_jdbc_db_user"></a> [tefca\_jdbc\_db\_user](#input\_tefca\_jdbc\_db\_user) | JDBC username for flyway to the tefca database | `any` | n/a | yes |
| <a name="input_tefca_viewer_db_role_arn"></a> [tefca\_viewer\_db\_role\_arn](#input\_tefca\_viewer\_db\_role\_arn) | The db Role ARN for the Tefca Viewer Service | `any` | n/a | yes |
| <a name="input_vpc_id"></a> [vpc\_id](#input\_vpc\_id) | ID of the VPC | `string` | n/a | yes |

## Outputs

| Name | Description |
|------|-------------|
| <a name="output_eks_assume_role_policy"></a> [eks\_assume\_role\_policy](#output\_eks\_assume\_role\_policy) | n/a |
| <a name="output_ingress_created"></a> [ingress\_created](#output\_ingress\_created) | n/a |
<!-- END_TF_DOCS -->