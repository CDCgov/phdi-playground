##### Key Vault #####

resource "azurerm_key_vault" "phdi_key_vault" {
  name                       = "${terraform.workspace}vault${substr(var.client_id, 0, 8)}"
  location                   = var.location
  resource_group_name        = var.resource_group_name
  tenant_id                  = data.azurerm_client_config.current.tenant_id
  sku_name                   = "premium"
  soft_delete_retention_days = 7


  access_policy {
    tenant_id = data.azurerm_client_config.current.tenant_id
    object_id = data.azurerm_client_config.current.object_id

    key_permissions = [
      "Create",
      "Get",
    ]

    secret_permissions = [
      "Set",
      "Get",
      "Delete",
      "Purge",
      "Recover"
    ]
  }

  access_policy {
    tenant_id = data.azurerm_client_config.current.tenant_id
    object_id = azurerm_user_assigned_identity.pipeline_runner.principal_id

    key_permissions = [
      "Get",
    ]

    secret_permissions = [
      "Get",
    ]
  }

  #  access_policy {
  #    tenant_id = data.azurerm_client_config.current.tenant_id
  #    object_id = azurerm_synapse_workspace.phdi.identity.0.principal_id
  #
  #    key_permissions = [
  #      "Get",
  #    ]
  #
  #    secret_permissions = [
  #      "Get",
  #    ]
  #  }
}

resource "random_uuid" "salt" {}

resource "azurerm_key_vault_secret" "salt" {
  name         = "patient-hash-salt"
  value        = random_uuid.salt.result
  key_vault_id = azurerm_key_vault.phdi_key_vault.id
}

resource "azurerm_key_vault_secret" "smarty_auth_id" {
  name         = "smarty-auth-id"
  value        = var.smarty_auth_id
  key_vault_id = azurerm_key_vault.phdi_key_vault.id
}

resource "azurerm_key_vault_secret" "smarty_auth_token" {
  name         = "smarty-auth-token"
  value        = var.smarty_auth_token
  key_vault_id = azurerm_key_vault.phdi_key_vault.id
}

# resource "azurerm_key_vault_secret" "record_linkage_url" {
#   name         = "record-linkage-url"
#   value        = "https://phdi-${terraform.workspace}-record-linkage.${azurerm_container_app_environment.phdi.default_domain}"
#   key_vault_id = azurerm_key_vault.phdi_key_vault.id
# }

# resource "azurerm_key_vault_secret" "ingestion-url" {
#   name         = "ingestion-url"
#   value        = "https://phdi-${terraform.workspace}-ingestion.${azurerm_container_app_environment.phdi.default_domain}"
#   key_vault_id = azurerm_key_vault.phdi_key_vault.id
# }

# Pull images from GitHub Container Registry and push to Azure Container Registry
locals {
  images = toset([
    "fhir-converter",
    "ingestion",
    "tabulation",
    "alerts",
    "message-parser",
    "validation",
    "record-linkage",
  ])
}


#### VNET for kubernetes ####

resource "azurerm_virtual_network" "aks_vnet" {
  name                = "phdi-${terraform.workspace}-vnet"
  resource_group_name = var.resource_group_name
  address_space       = [var.k8s_vnet_address_space]
  location            = var.location

  subnet {
    name           = "phdi-${terraform.workspace}-aks_subnet"
    address_prefix = var.k8s_subnet_address_prefix
  }
}

resource "azurerm_network_security_group" "aks_nsg" {
  name                = "phdi-${terraform.workspace}-nsg"
  location            = var.location
  resource_group_name = var.resource_group_name

  security_rule {
    name                       = "AzureDataFactoryInbound"
    priority                   = 100
    direction                  = "Inbound"
    access                     = "Allow"
    protocol                   = "*"
    source_port_range          = "*"
    destination_port_range     = "*"
    source_address_prefix      = "DataFactory"
    destination_address_prefix = "*"
  }
  security_rule {
    name                       = "AzureDataFactoryOutbound"
    priority                   = 100
    direction                  = "Outbound"
    access                     = "Allow"
    protocol                   = "*"
    source_port_range          = "*"
    destination_port_range     = "*"
    source_address_prefix      = "*"
    destination_address_prefix = "DataFactory"
  }
}

resource "azurerm_subnet_network_security_group_association" "aks_nsg_association" {
  subnet_id                 = azurerm_virtual_network.aks_vnet.subnet.*.id[0]
  network_security_group_id = azurerm_network_security_group.aks_nsg.id
}

#### Kubernetes Service ####

resource "azurerm_kubernetes_cluster" "cluster" {
  name                = "phdi-${terraform.workspace}-cluster"
  location            = var.location
  resource_group_name = var.resource_group_name
  dns_prefix          = "phdi-${terraform.workspace}"

  default_node_pool {
    name           = "default"
    node_count     = 1
    vm_size        = "Standard_D2_v2"
    vnet_subnet_id = azurerm_virtual_network.aks_vnet.subnet.*.id[0]
  }

  identity {
    type = "SystemAssigned"
  }
  network_profile {
    network_plugin = "azure"
  }
}

data "azurerm_kubernetes_cluster" "credentials" {
  name                = azurerm_kubernetes_cluster.cluster.name
  resource_group_name = var.resource_group_name
}

provider "helm" {
  kubernetes {
    host                   = data.azurerm_kubernetes_cluster.credentials.kube_config.0.host
    client_certificate     = base64decode(data.azurerm_kubernetes_cluster.credentials.kube_config.0.client_certificate)
    client_key             = base64decode(data.azurerm_kubernetes_cluster.credentials.kube_config.0.client_key)
    cluster_ca_certificate = base64decode(data.azurerm_kubernetes_cluster.credentials.kube_config.0.cluster_ca_certificate)
  }
}

resource "helm_release" "helm_clusters" {
  for_each      = local.images
  repository    = "https://cdcgov.github.io/phdi-charts/"
  name          = "phdi-${terraform.workspace}-${each.key}"
  chart         = "${each.key}-chart"
  recreate_pods = true

  set {
    name  = "image.tag"
    value = "latest"
  }

  set {
    name  = "databasePassword"
    value = azurerm_postgresql_flexible_server.mpi.administrator_password
  }

  set {
    name  = "databaseName"
    value = azurerm_postgresql_flexible_server_database.mpi.name
  }

  set {
    name  = "databaseHost"
    value = azurerm_postgresql_flexible_server.mpi.fqdn
  }

  set {
    name  = "smartyAuthId"
    value = azurerm_key_vault_secret.smarty_auth_id.value
  }

  set {
    name  = "smartyToken"
    value = azurerm_key_vault_secret.smarty_auth_token.value
  }
}

##### FHIR Server #####

resource "azurerm_healthcare_service" "fhir_server" {
  name                = "${terraform.workspace}fhir${substr(var.client_id, 0, 8)}"
  location            = "eastus"
  resource_group_name = var.resource_group_name
  kind                = "fhir-R4"
  cosmosdb_throughput = 400

  lifecycle {
    ignore_changes = [name, tags]
  }

  tags = {
    environment = terraform.workspace
    managed-by  = "terraform"
  }
}

resource "azurerm_role_assignment" "gh_sp_fhir_contributor" {
  scope                = azurerm_healthcare_service.fhir_server.id
  role_definition_name = "FHIR Data Contributor"
  principal_id         = var.object_id
}

resource "azurerm_role_assignment" "pipeline_runner_fhir_contributor" {
  scope                = azurerm_healthcare_service.fhir_server.id
  role_definition_name = "FHIR Data Contributor"
  principal_id         = azurerm_user_assigned_identity.pipeline_runner.principal_id
}

#### User Assigned Identity #####

resource "azurerm_user_assigned_identity" "pipeline_runner" {
  location            = var.location
  name                = "phdi-${terraform.workspace}-pipeline-runner"
  resource_group_name = var.resource_group_name
}

##### Communication Service #####

resource "azurerm_communication_service" "communication_service" {
  name                = "${terraform.workspace}communication${substr(var.client_id, 0, 8)}"
  resource_group_name = var.resource_group_name
  data_location       = "United States"

}


##### Synapse #####

#resource "random_password" "synapse_sql_password" {
#  length           = 32
#  special          = true
#  override_special = "_%@"
#}
#
## Store password in key vault
#resource "azurerm_key_vault_secret" "synapse_sql_password" {
#  name         = "synapse-sql-password"
#  value        = random_password.synapse_sql_password.result
#  key_vault_id = azurerm_key_vault.phdi_key_vault.id
#}
#
#resource "azurerm_synapse_workspace" "phdi" {
#  name                                 = "phdi${terraform.workspace}synapse${substr(var.client_id, 0, 8)}"
#  resource_group_name                  = var.resource_group_name
#  location                             = var.location
#  storage_data_lake_gen2_filesystem_id = azurerm_storage_data_lake_gen2_filesystem.delta-tables.id
#  sql_administrator_login              = "sqladminuser"
#  sql_administrator_login_password     = random_password.synapse_sql_password.result
#
#  identity {
#    type = "SystemAssigned, UserAssigned"
#    identity_ids = [
#      azurerm_user_assigned_identity.pipeline_runner.id
#    ]
#  }
#}
#
#resource "azurerm_synapse_firewall_rule" "allow_azure_services" {
#  name                 = "AllowAllWindowsAzureIps"
#  synapse_workspace_id = azurerm_synapse_workspace.phdi.id
#  start_ip_address     = "0.0.0.0"
#  end_ip_address       = "0.0.0.0"
#}
#
#resource "azurerm_synapse_spark_pool" "phdi" {
#  name                                = "sparkpool"
#  synapse_workspace_id                = azurerm_synapse_workspace.phdi.id
#  node_size_family                    = "MemoryOptimized"
#  node_size                           = "Small"
#  cache_size                          = 100
#  spark_version                       = 3.3
#  dynamic_executor_allocation_enabled = true
#  min_executors                       = 1
#  max_executors                       = 2
#
#  auto_scale {
#    max_node_count = 50
#    min_node_count = 3
#  }
#
#  auto_pause {
#    delay_in_minutes = 15
#  }
#
#  spark_config {
#    content  = <<EOF
#spark.shuffle.spill                true
#EOF
#    filename = "config.txt"
#  }
#}
#
#resource "azurerm_role_assignment" "synapse_blob_contributor" {
#  scope                = azurerm_storage_account.phi.id
#  role_definition_name = "Storage Blob Data Contributor"
#  principal_id         = azurerm_synapse_workspace.phdi.identity[0].principal_id
#}
#
#resource "azuread_application" "synapse_app" {
#  display_name = "phdi-${terraform.workspace}-synapse-${substr(var.client_id, 0, 8)}"
#}
#
#resource "azuread_application_password" "synapse_app_password" {
#  application_object_id = azuread_application.synapse_app.object_id
#}
#
#resource "azurerm_key_vault_secret" "synapse_client_secret" {
#  name         = "synapse-client-secret"
#  value        = azuread_application_password.synapse_app_password.value
#  key_vault_id = azurerm_key_vault.phdi_key_vault.id
#}
#
#resource "azurerm_key_vault_secret" "synapse_client_id" {
#  name         = "synapse-client-id"
#  value        = azuread_application.synapse_app.application_id
#  key_vault_id = azurerm_key_vault.phdi_key_vault.id
#}
#
#resource "azurerm_synapse_linked_service" "synapse_linked_service_key_vault" {
#  name                 = "${terraform.workspace}${substr(var.client_id, 0, 8)}-keyvault-linked-service"
#  synapse_workspace_id = azurerm_synapse_workspace.phdi.id
#  type                 = "AzureKeyVault"
#  type_properties_json = <<JSON
#  {
#  "baseUrl": "https://${terraform.workspace}vault${substr(var.client_id, 0, 8)}.vault.azure.net/"
#  }
#  JSON
#}
