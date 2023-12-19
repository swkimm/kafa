terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "5.31.0"
    }
  }

  backend "s3" {
    bucket         = "kafa-tf-state-storage"
    key            = "terraform/terraform.tfstate"
    region         = "ap-northeast-2"
    encrypt        = true
    dynamodb_table = "kafa-tf-state-lock"
  }
}

provider "aws" {
  region = var.region
}

provider "aws" {
  alias  = "east"
  region = "us-east-1"
}

module "kafa-cdn" {
  source = "./cdn"
}

module "kafa" {
  source = "./kafa"

  postgres_username          = var.postgres_username
  postgres_password          = var.postgres_password
  jwt_secret                 = var.jwt_secret
  postgres_port              = var.postgres_port
  elasticache_port           = var.elasticache_port
  port                       = var.port
  aws_cdn_bucket_name        = var.aws_cdn_bucket_name
  aws_cdn_origin_bucket_name = var.aws_cdn_origin_bucket_name
  cdn_server_domain          = var.cdn_server_domain
  aws_cdn_bucket_region      = var.aws_cdn_bucket_region
  nodemailer_from            = var.nodemailer_from
  nodemailer_user_name       = var.nodemailer_user_name
  cloudfront_secret_key      = var.cloudfront_secret_key
  cloudfront_id_key          = module.kafa-cdn.cloudfront_public_key

  providers = {
    aws.east = aws.east
  }

  depends_on = [module.kafa-cdn]
}
