variable "region" {
  type    = string
  default = "ap-northeast-2"
}

variable "s3_bucket" {
  type    = string
  default = "kafa.one"
}

variable "availability_zones" {
  type    = list(string)
  default = ["ap-northeast-2a", "ap-northeast-2b", "ap-northeast-2c"]
}

variable "postgres_username" {
  type    = string
  default = "kafa"
}

variable "postgres_password" {
  type      = string
  default   = "kafa1234"
  sensitive = true
}

variable "postgres_port" {
  type    = number
  default = 5433
}

variable "elasticache_port" {
  type    = number
  default = 6379
}

variable "jwt_secret" {
  type      = string
  default   = "kafa"
  sensitive = true
}

variable "port" {
  type    = number
  default = "4000"
}

variable "aws_cdn_bucket_name" {
  type    = string
  default = "abcd"
}

variable "aws_cdn_origin_bucket_name" {
  type    = string
  default = "abcd"
}

variable "cdn_server_domain" {
  type    = string
  default = "abcd"
}

variable "aws_cdn_bucket_region" {
  type    = string
  default = "abcd"
}

variable "nodemailer_from" {
  type    = string
  default = "abcd"
}

variable "nodemailer_user_name" {
  type    = string
  default = "abcd"
}

variable "cloudfront_id_key" {
  type    = string
  default = ""
}

variable "cloudfront_secret_key" {
  type    = string
  default = ""
}
