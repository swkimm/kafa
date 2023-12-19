######### AWS Cloudfront Distribution ##########
resource "aws_cloudfront_distribution" "main" {
  origin {
    domain_name              = aws_s3_bucket.cdn_bucket.bucket_regional_domain_name
    origin_id                = aws_s3_bucket.cdn_bucket.id
    origin_access_control_id = aws_cloudfront_origin_access_control.main.id
  }

  default_cache_behavior {
    allowed_methods        = ["GET", "HEAD", "OPTIONS"]
    cached_methods         = ["GET", "HEAD"]
    target_origin_id       = aws_s3_bucket.cdn_bucket.id
    viewer_protocol_policy = "redirect-to-https"

    forwarded_values {
      query_string = false

      cookies {
        forward = "none"
      }
    }
  }

  ordered_cache_behavior {
    path_pattern           = "/secret/*"
    allowed_methods        = ["GET", "HEAD", "OPTIONS"]
    cached_methods         = ["GET", "HEAD"]
    target_origin_id       = aws_s3_bucket.cdn_bucket.id
    viewer_protocol_policy = "redirect-to-https"

    trusted_key_groups = [aws_cloudfront_key_group.cdn.id]

    forwarded_values {
      query_string = false
      cookies {
        forward = "all"
      }
    }
  }

  price_class = "PriceClass_200"
  enabled     = true
  comment     = "kafa-cdn-cloudfront-distribution"
  aliases     = ["cdn.kafa.one"]

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  viewer_certificate {
    acm_certificate_arn      = aws_acm_certificate.main.arn
    ssl_support_method       = "sni-only"
    minimum_protocol_version = "TLSv1.2_2021"
  }
}

########## AWS CloudFront OAC ##########
resource "aws_cloudfront_origin_access_control" "main" {
  name                              = "kafa-cdn-s3-oai"
  origin_access_control_origin_type = "s3"
  signing_behavior                  = "always"
  signing_protocol                  = "sigv4"
}

########## AWS CloudFront Key Pair##########
resource "aws_cloudfront_key_group" "cdn" {
  comment = "kafa cdn key group"
  items   = [aws_cloudfront_public_key.cdn.id]
  name    = "kafa-cdn-key-group"
}

resource "aws_cloudfront_public_key" "cdn" {
  comment     = "kafa cdn public key"
  encoded_key = file("./cdn/key/kafa_cdn_public_key.pem")
  name        = "kafa-cdn-public-key"
}

output "cloudfront_public_key" {
  value = aws_cloudfront_public_key.cdn.id
}
