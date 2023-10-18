# Locals block for hardcoded names
locals {
  backend_address_pool_name      = "${azurerm_virtual_network.aks_vnet.name}-beap"
  frontend_port_name             = "${azurerm_virtual_network.aks_vnet.name}-feport"
  frontend_ip_configuration_name = "${azurerm_virtual_network.aks_vnet.name}-feip"
  http_setting_name              = "${azurerm_virtual_network.aks_vnet.name}-be-htst"
  listener_name                  = "${azurerm_virtual_network.aks_vnet.name}-httplstn"
  request_routing_rule_name      = "${azurerm_virtual_network.aks_vnet.name}-rqrt"

  aks_vnet_name           = "phdi-playground-${terraform.workspace}-aks-vnet"
  aks_subnet_name         = "phdi-playground-${terraform.workspace}-aks-subnet"
  aks_cluster_name        = "phdi-playground-${terraform.workspace}-aks-cluster"
  aks_dns_prefix          = "phdi-playground-${terraform.workspace}"
  app_gateway_name        = "phdi-playground-${terraform.workspace}-aks-appgw"
  app_gateway_subnet_name = "phdi-playground-${terraform.workspace}-aks-appgw-subnet"

  app_gateway_metrics_dashboard_config = jsondecode(templatefile("dashboard.json", {
    app_gateway_name    = local.app_gateway_name,
    resource_group_name = var.resource_group_name,
    subscription_id     = var.subscription_id,
  }))

  services = toset([
    "fhir-converter",
    "ingestion",
    "ingress",
    "message-parser",
    "orchestration",
    "validation",
  ])
}

# Service Principal
resource "azuread_application" "aks" {
  display_name = "phdi-playground-${terraform.workspace}-aks"
  owners       = [data.azuread_client_config.current.object_id]
}

resource "azuread_service_principal" "aks" {
  application_id               = azuread_application.aks.application_id
  app_role_assignment_required = false
  owners                       = [data.azuread_client_config.current.object_id]
}

resource "azuread_service_principal_password" "aks" {
  service_principal_id = azuread_service_principal.aks.object_id
}

resource "azurerm_role_assignment" "gateway_contributor" {
  scope                = azurerm_application_gateway.network.id
  role_definition_name = "Contributor"
  principal_id         = azuread_service_principal.aks.object_id
}

resource "azurerm_role_assignment" "resource_group_reader" {
  scope                = data.azurerm_resource_group.rg.id
  role_definition_name = "Reader"
  principal_id         = azuread_service_principal.aks.object_id
}

resource "azurerm_role_assignment" "public_ip_reader" {
  scope                = azurerm_public_ip.aks.id
  role_definition_name = "Reader"
  principal_id         = azuread_service_principal.aks.object_id
}

resource "azurerm_role_assignment" "app_gateway_subnet_network_contributor" {
  scope                = data.azurerm_subnet.appgwsubnet.id
  role_definition_name = "Network Contributor"
  principal_id         = azuread_service_principal.aks.object_id
}

resource "azurerm_role_assignment" "monitoring_reader" {
  scope                = data.azurerm_resource_group.rg.id
  role_definition_name = "Monitoring Reader"
  principal_id         = azuread_service_principal.aks.object_id
}

# SSH Key
resource "azapi_resource_action" "ssh_public_key_gen" {
  type        = "Microsoft.Compute/sshPublicKeys@2022-11-01"
  resource_id = azapi_resource.ssh_public_key.id
  action      = "generateKeyPair"
  method      = "POST"

  response_export_values = ["publicKey", "privateKey"]
}

resource "azapi_resource" "ssh_public_key" {
  type      = "Microsoft.Compute/sshPublicKeys@2022-11-01"
  name      = "phdi-playground-${terraform.workspace}-ssh-key"
  location  = var.location
  parent_id = data.azurerm_resource_group.rg.id
}

#### VNET for kubernetes ####

resource "azurerm_virtual_network" "aks_vnet" {
  name                = local.aks_vnet_name
  resource_group_name = var.resource_group_name
  address_space       = [var.k8s_vnet_address_space]
  location            = var.location

  subnet {
    name           = local.aks_subnet_name
    address_prefix = var.k8s_subnet_address_prefix
  }

  subnet {
    name           = local.app_gateway_subnet_name
    address_prefix = var.app_gateway_subnet_address_prefix
  }
}

# Public Ip 
resource "azurerm_public_ip" "aks" {
  name                = "phdi-playground-${terraform.workspace}-aks-pip"
  location            = var.location
  resource_group_name = var.resource_group_name
  allocation_method   = "Static"
  sku                 = "Standard"
  domain_name_label   = "phdi-playground-${terraform.workspace}"
}

resource "azurerm_application_gateway" "network" {
  name                = local.app_gateway_name
  resource_group_name = var.resource_group_name
  location            = var.location

  sku {
    name     = var.app_gateway_sku
    tier     = "Standard_v2"
    capacity = 2
  }

  gateway_ip_configuration {
    name      = "appGatewayIpConfig"
    subnet_id = data.azurerm_subnet.appgwsubnet.id
  }

  frontend_port {
    name = local.frontend_port_name
    port = 80
  }

  frontend_port {
    name = "httpsPort"
    port = 443
  }

  frontend_ip_configuration {
    name                 = local.frontend_ip_configuration_name
    public_ip_address_id = azurerm_public_ip.aks.id
  }

  backend_address_pool {
    name = local.backend_address_pool_name
  }

  backend_http_settings {
    name                  = local.http_setting_name
    cookie_based_affinity = "Disabled"
    port                  = 80
    protocol              = "Http"
    request_timeout       = 1
  }

  http_listener {
    name                           = local.listener_name
    frontend_ip_configuration_name = local.frontend_ip_configuration_name
    frontend_port_name             = local.frontend_port_name
    protocol                       = "Http"
  }

  request_routing_rule {
    name                       = local.request_routing_rule_name
    rule_type                  = "Basic"
    http_listener_name         = local.listener_name
    backend_address_pool_name  = local.backend_address_pool_name
    backend_http_settings_name = local.http_setting_name
    priority                   = 1
  }

  lifecycle {
    ignore_changes = [
      tags,
      ssl_certificate,
      trusted_root_certificate,
      frontend_port,
      backend_address_pool,
      backend_http_settings,
      http_listener,
      url_path_map,
      request_routing_rule,
      probe,
      redirect_configuration,
      ssl_policy,
    ]
  }
}

#### Kubernetes Service ####

resource "azurerm_kubernetes_cluster" "k8s" {
  name                = local.aks_cluster_name
  location            = var.location
  resource_group_name = var.resource_group_name
  dns_prefix          = local.aks_dns_prefix

  default_node_pool {
    name            = "agentpool"
    node_count      = var.aks_agent_count
    vm_size         = var.aks_agent_vm_size
    os_disk_size_gb = var.aks_agent_os_disk_size
    vnet_subnet_id  = data.azurerm_subnet.kubesubnet.id
  }

  identity {
    type = "SystemAssigned"
  }

  network_profile {
    network_plugin = "azure"
    dns_service_ip = var.aks_dns_service_ip
    service_cidr   = var.aks_service_cidr
  }

  http_application_routing_enabled = false

  linux_profile {
    admin_username = var.vm_username

    ssh_key {
      key_data = jsondecode(azapi_resource_action.ssh_public_key_gen.output).publicKey
    }
  }
}

# Helm

provider "kubectl" {
  host                   = azurerm_kubernetes_cluster.k8s.kube_config.0.host
  client_certificate     = base64decode(azurerm_kubernetes_cluster.k8s.kube_config.0.client_certificate)
  client_key             = base64decode(azurerm_kubernetes_cluster.k8s.kube_config.0.client_key)
  cluster_ca_certificate = base64decode(azurerm_kubernetes_cluster.k8s.kube_config.0.cluster_ca_certificate)
  load_config_file       = false
}

provider "helm" {
  kubernetes {
    host                   = azurerm_kubernetes_cluster.k8s.kube_config.0.host
    client_certificate     = base64decode(azurerm_kubernetes_cluster.k8s.kube_config.0.client_certificate)
    client_key             = base64decode(azurerm_kubernetes_cluster.k8s.kube_config.0.client_key)
    cluster_ca_certificate = base64decode(azurerm_kubernetes_cluster.k8s.kube_config.0.cluster_ca_certificate)
  }
}

# Application Gateway Ingress Controller

resource "helm_release" "agic" {
  name       = "aks-agic"
  repository = "https://appgwingress.blob.core.windows.net/ingress-azure-helm-package"
  chart      = "ingress-azure"
  depends_on = [azurerm_kubernetes_cluster.k8s]

  values = [
    "${templatefile("helm-agic-config.yaml", {
      subscription_id     = var.subscription_id,
      resource_group_name = var.resource_group_name,
      app_gateway_name    = local.app_gateway_name,
      secret_json = base64encode(jsonencode({
        clientId                       = "${azuread_service_principal.aks.application_id}",
        clientSecret                   = "${azuread_service_principal_password.aks.value}",
        subscriptionId                 = "${var.subscription_id}",
        tenantId                       = "${data.azurerm_client_config.current.tenant_id}",
        activeDirectoryEndpointUrl     = "https://login.microsoftonline.com",
        resourceManagerEndpointUrl     = "https://management.azure.com/",
        activeDirectoryGraphResourceId = "https://graph.windows.net/",
        sqlManagementEndpointUrl       = "https://management.core.windows.net:8443/",
        galleryEndpointUrl             = "https://gallery.azure.com/",
        managementEndpointUrl          = "https://management.core.windows.net/",
      }))
    })}"
  ]
}

# Cert Manager

resource "helm_release" "cert_manager" {
  name             = "cert-manager"
  repository       = "https://charts.jetstack.io"
  chart            = "cert-manager"
  namespace        = "cert-manager"
  create_namespace = true
  depends_on       = [azurerm_kubernetes_cluster.k8s]

  set {
    name  = "installCRDs"
    value = true
  }
}

resource "kubectl_manifest" "cert_manager_issuer" {
  depends_on = [helm_release.cert_manager]

  yaml_body = <<YAML
apiVersion: cert-manager.io/v1
kind: ClusterIssuer
metadata:
  name: letsencrypt-prod
spec:
  acme:
    email: nclyde@skylight.digital
    server: https://acme-v02.api.letsencrypt.org/directory
    privateKeySecretRef:
      name: phdi-playground-issuer-account-key
    solvers:
      - http01:
          ingress:
            class: azure/application-gateway
YAML
}

# Helm Releases

resource "helm_release" "building_blocks" {
  for_each      = local.services
  repository    = "https://cdcgov.github.io/phdi-charts/"
  name          = "phdi-playground-${terraform.workspace}-${each.key}"
  chart         = "${each.key}-chart"
  recreate_pods = true
  depends_on    = [helm_release.agic]

  set {
    name  = "image.tag"
    value = "latest"
  }

  set {
    name  = "smartyAuthId"
    value = var.smarty_auth_id
  }

  set {
    name  = "smartyToken"
    value = var.smarty_auth_token
  }

  set {
    name  = "ingressHostname"
    value = "${var.resource_group_name}-${terraform.workspace}.${var.location}.cloudapp.azure.com"
  }

  set {
    name  = "fhir-converter-url"
    value = "${var.resource_group_name}-${terraform.workspace}.${var.location}.cloudapp.azure.com/fhir-converter"
  }

  set {
    name  = "ingestion-url"
    value = "${var.resource_group_name}-${terraform.workspace}.${var.location}.cloudapp.azure.com/ingestion"
  }

  set {
    name  = "message-parser-url"
    value = "${var.resource_group_name}-${terraform.workspace}.${var.location}.cloudapp.azure.com/message-parser"
  }

  set {
    name  = "validation-url"
    value = "${var.resource_group_name}-${terraform.workspace}.${var.location}.cloudapp.azure.com/validation"
  }
}

# Metrics Dashboard

resource "azurerm_portal_dashboard" "pipeline_metrics" {
  name                = "app-gateway-metrics-${terraform.workspace}"
  resource_group_name = var.resource_group_name
  location            = var.location
  depends_on          = [azurerm_application_gateway.network, helm_release.building_blocks]

  tags = {
    source = "terraform"
  }

  dashboard_properties = jsonencode(local.app_gateway_metrics_dashboard_config.properties)
}

# Auto-Scaling

resource "helm_release" "keda" {
  name             = "keda"
  repository       = "https://kedacore.github.io/charts"
  chart            = "keda"
  namespace        = "keda"
  create_namespace = true
  depends_on       = [azurerm_kubernetes_cluster.k8s]
}

resource "kubectl_manifest" "keda_secret" {
  depends_on = [helm_release.keda, azuread_service_principal.aks, azuread_service_principal_password.aks]
  yaml_body  = data.kubectl_path_documents.keda_secret.documents[0]
}

resource "kubectl_manifest" "keda_trigger" {
  depends_on = [kubectl_manifest.keda_secret]
  yaml_body  = data.kubectl_path_documents.keda_trigger.documents[0]
}

resource "kubectl_manifest" "keda_scaled_object" {
  for_each   = local.services
  depends_on = [kubectl_manifest.keda_trigger]
  yaml_body  = data.kubectl_path_documents.keda_scaled_object[each.key].documents[0]
}
