########## AWS RDS Aurora ##########
resource "aws_rds_cluster" "cluster" {
  engine             = "aurora-postgresql"
  engine_version     = "15.2"
  cluster_identifier = "kafa-staging-db"
  master_username    = var.postgres_username
  master_password    = var.postgres_password

  db_subnet_group_name   = aws_db_subnet_group.default.name
  vpc_security_group_ids = [aws_security_group.rds_aurora.id]
  port                   = 5432

  backup_retention_period = 1
  skip_final_snapshot     = true
}

resource "aws_rds_cluster_instance" "cluster_instances" {
  count              = 1
  identifier         = "kafa-staging-db-instance-${count.index}"
  cluster_identifier = aws_rds_cluster.cluster.id
  instance_class     = "db.t4g.medium"
  engine             = aws_rds_cluster.cluster.engine
  engine_version     = aws_rds_cluster.cluster.engine_version
}

########## RDS Subnet Group ##########
resource "aws_db_subnet_group" "default" {
  name       = "kafa staging rds subnet group"
  subnet_ids = [aws_subnet.private_1.id, aws_subnet.private_2.id, aws_subnet.private_3.id]
}
