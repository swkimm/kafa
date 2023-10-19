resource "aws_security_group" "rds_aurora" {
  name        = "kafa-staging-sg-rds-aurora"
  description = "Allow RDS Aurora inbound traffic"
  vpc_id      = aws_vpc.main.id

  ingress {
    description = "PostgreSQL"
    from_port   = var.postgres_port
    to_port     = var.postgres_port
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port        = 0
    to_port          = 0
    protocol         = "-1"
    cidr_blocks      = ["0.0.0.0/0"]
    ipv6_cidr_blocks = ["::/0"]
  }

  tags = {
    Name = "kafa-staging-sg-rds-aurora"
  }
}

resource "aws_security_group" "elasticache" {
  name        = "kafa-staging-sg-elasticache"
  description = "Allow elasticache inbound traffic"
  vpc_id      = aws_vpc.main.id

  ingress {
    description = "elastic_cache"
    from_port   = var.elasticache_port
    to_port     = var.elasticache_port
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port        = 0
    to_port          = 0
    protocol         = "-1"
    cidr_blocks      = ["0.0.0.0/0"]
    ipv6_cidr_blocks = ["::/0"]
  }

  tags = {
    Name = "kafa-staging-sg-elasticache"
  }
}

resource "aws_security_group" "elb" {
  name        = "kafa-staging-sg-elb"
  description = "Allow WEB inbound traffic"
  vpc_id      = aws_vpc.main.id

  ingress {
    description = "HTTP"
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    description = "HTTPS"
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port        = 0
    to_port          = 0
    protocol         = "-1"
    cidr_blocks      = ["0.0.0.0/0"]
    ipv6_cidr_blocks = ["::/0"]
  }

  tags = {
    Name = "kafa-staging-sg-elb"
  }
}

resource "aws_security_group" "ecs" {
  name        = "kafa-staging-sg-ecs"
  description = "Allow ECS inbound traffic"
  vpc_id      = aws_vpc.main.id

  ingress {
    description = "SSH"
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    description = "From ALB"
    from_port   = 80
    to_port     = 4000
    protocol    = "tcp"
    security_groups = [
      aws_security_group.elb.id
    ]
  }

  egress {
    from_port        = 0
    to_port          = 0
    protocol         = "-1"
    cidr_blocks      = ["0.0.0.0/0"]
    ipv6_cidr_blocks = ["::/0"]
  }

  tags = {
    Name = "kafa-staging-sg-ecs"
  }
}
