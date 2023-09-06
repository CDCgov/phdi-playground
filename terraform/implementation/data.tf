data "azuread_client_config" "current" {}

data "azurerm_client_config" "current" {}

data "azurerm_resource_group" "rg" {
  name = var.resource_group_name
}

data "azurerm_subnet" "kubesubnet" {
  name                 = local.aks_subnet_name
  virtual_network_name = azurerm_virtual_network.aks_vnet.name
  resource_group_name  = var.resource_group_name
}

data "azurerm_subnet" "appgwsubnet" {
  name                 = local.app_gateway_subnet_name
  virtual_network_name = azurerm_virtual_network.aks_vnet.name
  resource_group_name  = var.resource_group_name
}

data "kubectl_path_documents" "keda_secret" {
  pattern = "./manifests/kedaSecret.yaml"
  vars = {
    clientId       = "${base64encode(azuread_service_principal.aks.application_id)}"
    clientPassword = "${base64encode(azuread_service_principal_password.aks.value)}"
  }
}

data "kubectl_path_documents" "keda_trigger" {
  pattern = "./manifests/kedaTriggerAuthentication.yaml"
}

data "kubectl_path_documents" "keda_scaled_object" {
  for_each = local.services
  pattern  = "./manifests/kedaScaledObject.yaml"
  vars = {
    subscriptionId         = "${var.subscription_id}"
    tenantId               = "${data.azurerm_client_config.current.tenant_id}"
    resourceGroupName      = "${var.resource_group_name}"
    applicationGatewayName = "${local.app_gateway_name}"
    serviceName            = each.key
  }
}
