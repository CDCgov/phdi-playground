# PHDI Charts

Part of the helm charts used in order to deploy are based on services created and maintained by DIBBs in the [phdi repository](https://github.com/CDCgov/phdi). A helm chart for these respective services is subsequently created in the [phdi-charts repository](https://github.com/CDCgov/phdi-charts) These helm charts ensure that Terraform can build each of these services to be able to deployed online for any individual to access without needing to install and run a given service locally.

## Version

The latest version of these charts can be determined by reviewing the latest Release, which can be found [here](https://github.com/CDCgov/phdi/releases).

For the purposes of best practices with helm charts, we do not update the version numbers in a given chart's `values.yaml` but rather dynamically update them with the latest Release version at the time of deployment to the cloud with the `filter.jq` script invoked [here](https://github.com/CDCgov/phdi-playground/blob/bd769a5556eff6cec4b2670892ce71078b333ff4/terraform/aws/implementation/modules/eks/main.tf#L276-L295) at time of deployment. This ensures that the values of the respective building block do not need to be hardcoded, nor do we need to manually update any versions beyond running the AWS Deployment script to ensure that the website is on the latest version once a release is made.
