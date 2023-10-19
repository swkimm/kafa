resource "aws_s3_bucket" "cdn_bucket" {
  bucket = "kafa-cdn-bucket"

  tags = {
    Name = "cdn.kafa.one"
  }
}

data "aws_iam_policy_document" "cdn" {
  statement {
    actions   = ["s3:GetObject"]
    resources = ["${aws_s3_bucket.cdn_bucket.arn}/*"]

    principals {
      type        = "Service"
      identifiers = ["cloudfront.amazonaws.com"]
    }

    condition {
      test     = "StringEquals"
      variable = "AWS:SourceArn"
      values   = [aws_cloudfront_distribution.main.arn]
    }
  }
}

resource "aws_s3_bucket_policy" "cdn" {
  bucket = aws_s3_bucket.cdn_bucket.id
  policy = data.aws_iam_policy_document.cdn.json
}

resource "aws_s3_bucket" "temp_cdn_image_bucket" {
  bucket = "kafa-temp-cdn-bucket"

  tags = {
    Name = "temp.cdn.kafa.one"
  }
}
