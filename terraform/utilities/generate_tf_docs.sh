#!/bin/bash

# aws
terraform-docs markdown table --output-file README.md --output-mode inject ../aws/implementation
terraform-docs markdown table --output-file README.md --output-mode inject ../aws/implementation/modules/cognito
terraform-docs markdown table --output-file README.md --output-mode inject ../aws/implementation/modules/eks
terraform-docs markdown table --output-file README.md --output-mode inject ../aws/implementation/modules/rds
terraform-docs markdown table --output-file README.md --output-mode inject ../aws/implementation/modules/route53
terraform-docs markdown table --output-file README.md --output-mode inject ../aws/implementation/modules/s3
terraform-docs markdown table --output-file README.md --output-mode inject ../aws/setup

# azure
terraform-docs markdown table --output-file README.md --output-mode inject ../azure/implementation
terraform-docs markdown table --output-file README.md --output-mode inject ../azure/setup
