terraform {
  required_providers {
    aws = {
      source                = "hashicorp/aws"
      version               = "5.32.1"
      configuration_aliases = [aws.east]
    }
  }
}
