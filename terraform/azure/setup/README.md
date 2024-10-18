<!-- BEGIN_TF_DOCS -->
## Requirements

| Name | Version |
|------|---------|
| <a name="requirement_azurerm"></a> [azurerm](#requirement\_azurerm) | =3.23.0 |

## Providers

| Name | Version |
|------|---------|
| <a name="provider_azurerm"></a> [azurerm](#provider\_azurerm) | =3.23.0 |

## Modules

No modules.

## Resources

| Name | Type |
|------|------|
| [azurerm_storage_account.tfstate](https://registry.terraform.io/providers/hashicorp/azurerm/3.23.0/docs/resources/storage_account) | resource |
| [azurerm_storage_container.tfstate](https://registry.terraform.io/providers/hashicorp/azurerm/3.23.0/docs/resources/storage_container) | resource |

## Inputs

| Name | Description | Type | Default | Required |
|------|-------------|------|---------|:--------:|
| <a name="input_client_id"></a> [client\_id](#input\_client\_id) | value of the Azure App registration ID to use in the tfstate storage account name | `any` | n/a | yes |
| <a name="input_location"></a> [location](#input\_location) | value of the Azure location to deploy to | `string` | `"Central US"` | no |
| <a name="input_resource_group_name"></a> [resource\_group\_name](#input\_resource\_group\_name) | value of the Azure resource group to deploy to | `any` | n/a | yes |
| <a name="input_subscription_id"></a> [subscription\_id](#input\_subscription\_id) | value of the Azure Subscription ID to use | `any` | n/a | yes |

## Outputs

No outputs.
<!-- END_TF_DOCS -->