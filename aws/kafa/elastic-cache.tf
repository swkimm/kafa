########## AWS Elasticache Replication Group ##########
resource "aws_elasticache_replication_group" "main" {
  automatic_failover_enabled  = true
  preferred_cache_cluster_azs = [var.availability_zones[0], var.availability_zones[2]]
  replication_group_id        = "kafa-staging-elasticache-rep-group"
  description                 = "kafa-staging-elasticache-rep-group"
  node_type                   = "cache.t4g.micro"
  num_cache_clusters          = 2
  parameter_group_name        = "default.redis7"
  port                        = 6379
  subnet_group_name           = aws_elasticache_subnet_group.main.name
  security_group_ids          = [aws_security_group.elasticache.id]

  lifecycle {
    ignore_changes = [num_cache_clusters]
  }
}

########## AWS Elasticache Subnet Group ##########
resource "aws_elasticache_subnet_group" "main" {
  name       = "kafa-staging-elasticache-subnet-group"
  subnet_ids = [aws_subnet.private_1.id, aws_subnet.private_3.id]
}
