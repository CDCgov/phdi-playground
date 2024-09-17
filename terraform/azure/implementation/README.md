<!-- BEGIN_TF_DOCS -->
## Requirements

| Name | Version |
|------|---------|
| <a name="requirement_azapi"></a> [azapi](#requirement\_azapi) | = 1.8.0 |
| <a name="requirement_azuread"></a> [azuread](#requirement\_azuread) | = 2.41.0 |
| <a name="requirement_azurerm"></a> [azurerm](#requirement\_azurerm) | = 3.69.0 |
| <a name="requirement_helm"></a> [helm](#requirement\_helm) | = 2.10.1 |
| <a name="requirement_kubectl"></a> [kubectl](#requirement\_kubectl) | >= 1.14.0 |
| <a name="requirement_random"></a> [random](#requirement\_random) | = 3.5.1 |

## Providers

| Name | Version |
|------|---------|
| <a name="provider_azapi"></a> [azapi](#provider\_azapi) | = 1.8.0 |
| <a name="provider_azuread"></a> [azuread](#provider\_azuread) | = 2.41.0 |
| <a name="provider_azurerm"></a> [azurerm](#provider\_azurerm) | = 3.69.0 |
| <a name="provider_helm"></a> [helm](#provider\_helm) | = 2.10.1 |
| <a name="provider_kubectl"></a> [kubectl](#provider\_kubectl) | >= 1.14.0 |

## Modules

No modules.

## Resources

| Name | Type |
|------|------|
| [azapi_resource.ssh_public_key](https://registry.terraform.io/providers/azure/azapi/1.8.0/docs/resources/resource) | resource |
| [azapi_resource_action.ssh_public_key_gen](https://registry.terraform.io/providers/azure/azapi/1.8.0/docs/resources/resource_action) | resource |
| [azuread_application.aks](https://registry.terraform.io/providers/hashicorp/azuread/2.41.0/docs/resources/application) | resource |
| [azuread_service_principal.aks](https://registry.terraform.io/providers/hashicorp/azuread/2.41.0/docs/resources/service_principal) | resource |
| [azuread_service_principal_password.aks](https://registry.terraform.io/providers/hashicorp/azuread/2.41.0/docs/resources/service_principal_password) | resource |
| [azurerm_application_gateway.network](https://registry.terraform.io/providers/hashicorp/azurerm/3.69.0/docs/resources/application_gateway) | resource |
| [azurerm_kubernetes_cluster.k8s](https://registry.terraform.io/providers/hashicorp/azurerm/3.69.0/docs/resources/kubernetes_cluster) | resource |
| [azurerm_linux_web_app.playground_webapp](https://registry.terraform.io/providers/hashicorp/azurerm/3.69.0/docs/resources/linux_web_app) | resource |
| [azurerm_portal_dashboard.pipeline_metrics](https://registry.terraform.io/providers/hashicorp/azurerm/3.69.0/docs/resources/portal_dashboard) | resource |
| [azurerm_public_ip.aks](https://registry.terraform.io/providers/hashicorp/azurerm/3.69.0/docs/resources/public_ip) | resource |
| [azurerm_role_assignment.app_gateway_subnet_network_contributor](https://registry.terraform.io/providers/hashicorp/azurerm/3.69.0/docs/resources/role_assignment) | resource |
| [azurerm_role_assignment.gateway_contributor](https://registry.terraform.io/providers/hashicorp/azurerm/3.69.0/docs/resources/role_assignment) | resource |
| [azurerm_role_assignment.monitoring_reader](https://registry.terraform.io/providers/hashicorp/azurerm/3.69.0/docs/resources/role_assignment) | resource |
| [azurerm_role_assignment.public_ip_reader](https://registry.terraform.io/providers/hashicorp/azurerm/3.69.0/docs/resources/role_assignment) | resource |
| [azurerm_role_assignment.resource_group_reader](https://registry.terraform.io/providers/hashicorp/azurerm/3.69.0/docs/resources/role_assignment) | resource |
| [azurerm_service_plan.playground_appserviceplan](https://registry.terraform.io/providers/hashicorp/azurerm/3.69.0/docs/resources/service_plan) | resource |
| [azurerm_virtual_network.aks_vnet](https://registry.terraform.io/providers/hashicorp/azurerm/3.69.0/docs/resources/virtual_network) | resource |
| [helm_release.agic](https://registry.terraform.io/providers/hashicorp/helm/2.10.1/docs/resources/release) | resource |
| [helm_release.building_blocks](https://registry.terraform.io/providers/hashicorp/helm/2.10.1/docs/resources/release) | resource |
| [helm_release.cert_manager](https://registry.terraform.io/providers/hashicorp/helm/2.10.1/docs/resources/release) | resource |
| [helm_release.keda](https://registry.terraform.io/providers/hashicorp/helm/2.10.1/docs/resources/release) | resource |
| [kubectl_manifest.cert_manager_issuer](https://registry.terraform.io/providers/gavinbunney/kubectl/latest/docs/resources/manifest) | resource |
| [kubectl_manifest.keda_scaled_object](https://registry.terraform.io/providers/gavinbunney/kubectl/latest/docs/resources/manifest) | resource |
| [kubectl_manifest.keda_secret](https://registry.terraform.io/providers/gavinbunney/kubectl/latest/docs/resources/manifest) | resource |
| [kubectl_manifest.keda_trigger](https://registry.terraform.io/providers/gavinbunney/kubectl/latest/docs/resources/manifest) | resource |
| [azuread_client_config.current](https://registry.terraform.io/providers/hashicorp/azuread/2.41.0/docs/data-sources/client_config) | data source |
| [azurerm_client_config.current](https://registry.terraform.io/providers/hashicorp/azurerm/3.69.0/docs/data-sources/client_config) | data source |
| [azurerm_resource_group.rg](https://registry.terraform.io/providers/hashicorp/azurerm/3.69.0/docs/data-sources/resource_group) | data source |
| [azurerm_subnet.appgwsubnet](https://registry.terraform.io/providers/hashicorp/azurerm/3.69.0/docs/data-sources/subnet) | data source |
| [azurerm_subnet.kubesubnet](https://registry.terraform.io/providers/hashicorp/azurerm/3.69.0/docs/data-sources/subnet) | data source |
| [kubectl_path_documents.keda_scaled_object](https://registry.terraform.io/providers/gavinbunney/kubectl/latest/docs/data-sources/path_documents) | data source |
| [kubectl_path_documents.keda_secret](https://registry.terraform.io/providers/gavinbunney/kubectl/latest/docs/data-sources/path_documents) | data source |
| [kubectl_path_documents.keda_trigger](https://registry.terraform.io/providers/gavinbunney/kubectl/latest/docs/data-sources/path_documents) | data source |

## Inputs

| Name | Description | Type | Default | Required |
|------|-------------|------|---------|:--------:|
| <a name="input_aks_agent_count"></a> [aks\_agent\_count](#input\_aks\_agent\_count) | The number of agent nodes for the cluster. | `number` | `1` | no |
| <a name="input_aks_agent_os_disk_size"></a> [aks\_agent\_os\_disk\_size](#input\_aks\_agent\_os\_disk\_size) | Disk size (in GB) to provision for each of the agent pool nodes. This value ranges from 0 to 1023. Specifying 0 applies the default disk size for that agentVMSize. | `number` | `40` | no |
| <a name="input_aks_agent_vm_size"></a> [aks\_agent\_vm\_size](#input\_aks\_agent\_vm\_size) | VM size | `string` | `"Standard_D2_v2"` | no |
| <a name="input_aks_dns_service_ip"></a> [aks\_dns\_service\_ip](#input\_aks\_dns\_service\_ip) | DNS server IP address | `string` | `"10.0.0.10"` | no |
| <a name="input_aks_enable_rbac"></a> [aks\_enable\_rbac](#input\_aks\_enable\_rbac) | Enable RBAC on the AKS cluster. Defaults to false. | `bool` | `"false"` | no |
| <a name="input_aks_service_cidr"></a> [aks\_service\_cidr](#input\_aks\_service\_cidr) | CIDR notation IP range from which to assign service cluster IPs | `string` | `"10.0.0.0/16"` | no |
| <a name="input_app_gateway_sku"></a> [app\_gateway\_sku](#input\_app\_gateway\_sku) | Name of the Application Gateway SKU | `string` | `"Standard_v2"` | no |
| <a name="input_app_gateway_subnet_address_prefix"></a> [app\_gateway\_subnet\_address\_prefix](#input\_app\_gateway\_subnet\_address\_prefix) | Subnet server IP address. | `string` | `"10.30.2.0/24"` | no |
| <a name="input_app_gateway_tier"></a> [app\_gateway\_tier](#input\_app\_gateway\_tier) | Tier of the Application Gateway tier | `string` | `"Standard_v2"` | no |
| <a name="input_client_id"></a> [client\_id](#input\_client\_id) | Client ID | `any` | n/a | yes |
| <a name="input_k8s_subnet_address_prefix"></a> [k8s\_subnet\_address\_prefix](#input\_k8s\_subnet\_address\_prefix) | Ip address space for kubernetes subnet vnet | `string` | `"10.30.1.0/24"` | no |
| <a name="input_k8s_vnet_address_space"></a> [k8s\_vnet\_address\_space](#input\_k8s\_vnet\_address\_space) | Ip address space for kubernetes vnet | `string` | `"10.30.0.0/16"` | no |
| <a name="input_location"></a> [location](#input\_location) | value of the Azure location to deploy to | `string` | `"Central US"` | no |
| <a name="input_msi_id"></a> [msi\_id](#input\_msi\_id) | The Managed Service Identity ID. Set this value if you're running this example using Managed Identity as the authentication method. | `string` | `null` | no |
| <a name="input_object_id"></a> [object\_id](#input\_object\_id) | Object ID | `any` | n/a | yes |
| <a name="input_resource_group_name"></a> [resource\_group\_name](#input\_resource\_group\_name) | value of the Azure resource group to deploy to | `any` | n/a | yes |
| <a name="input_services_to_chart"></a> [services\_to\_chart](#input\_services\_to\_chart) | Note: The chart names are limited to 15 characters | `map(string)` | <pre>{<br>  "fhir-converter": "fhir-converter-chart",<br>  "ingestion": "ingestion-chart",<br>  "ingress": "ingress-chart",<br>  "message-parser": "message-parser-chart",<br>  "message-refiner": "message-refiner",<br>  "orchestration": "orchestration",<br>  "tefca-viewer": "tefca-viewer",<br>  "trigger-code-reference": "trigger-code-reference",<br>  "validation": "validation-chart"<br>}</pre> | no |
| <a name="input_smarty_auth_id"></a> [smarty\_auth\_id](#input\_smarty\_auth\_id) | value of the SmartyStreets Auth ID | `any` | n/a | yes |
| <a name="input_smarty_auth_token"></a> [smarty\_auth\_token](#input\_smarty\_auth\_token) | value of the SmartyStreets Auth Token | `any` | n/a | yes |
| <a name="input_smarty_license_type"></a> [smarty\_license\_type](#input\_smarty\_license\_type) | value of the SmartyStreets license type to use | `string` | n/a | yes |
| <a name="input_subscription_id"></a> [subscription\_id](#input\_subscription\_id) | value of the Azure Subscription ID to use | `any` | n/a | yes |
| <a name="input_use_oidc"></a> [use\_oidc](#input\_use\_oidc) | Use OIDC for authentication. | `bool` | `false` | no |
| <a name="input_vm_username"></a> [vm\_username](#input\_vm\_username) | User name for the VM | `string` | `"aks_user"` | no |

## Outputs

| Name | Description |
|------|-------------|
| <a name="output_aks_cluster_name"></a> [aks\_cluster\_name](#output\_aks\_cluster\_name) | n/a |
| <a name="output_application_ip_address"></a> [application\_ip\_address](#output\_application\_ip\_address) | n/a |
| <a name="output_client_certificate"></a> [client\_certificate](#output\_client\_certificate) | n/a |
| <a name="output_client_key"></a> [client\_key](#output\_client\_key) | n/a |
| <a name="output_cluster_ca_certificate"></a> [cluster\_ca\_certificate](#output\_cluster\_ca\_certificate) | n/a |
| <a name="output_cluster_password"></a> [cluster\_password](#output\_cluster\_password) | n/a |
| <a name="output_cluster_username"></a> [cluster\_username](#output\_cluster\_username) | n/a |
| <a name="output_host"></a> [host](#output\_host) | n/a |
| <a name="output_key_data"></a> [key\_data](#output\_key\_data) | n/a |
| <a name="output_kube_config"></a> [kube\_config](#output\_kube\_config) | n/a |
<!-- END_TF_DOCS -->