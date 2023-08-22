// Load modules here

module "shared" {
  source              = "../modules/shared"
  resource_group_name = var.resource_group_name
  location            = var.location
  smarty_auth_id      = var.smarty_auth_id
  smarty_auth_token   = var.smarty_auth_token
  smarty_license_type = var.smarty_license_type
  client_id           = var.client_id
  object_id           = var.object_id
  # log_analytics_workspace_id = module.read_source_data.log_analytics_workspace_id
}

output "record_linkage_container_url" {
  value = module.shared.record_linkage_container_url
}
