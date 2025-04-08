#!/bin/bash
set -e

# Configure primary server for replication
psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
    -- Configure WAL settings for replication
    ALTER SYSTEM SET wal_level = replica;
    ALTER SYSTEM SET max_wal_senders = 10;
    ALTER SYSTEM SET max_replication_slots = 10;
    ALTER SYSTEM SET wal_keep_size = '1GB';
    
    -- Create a replication slot for the replica
    SELECT pg_create_physical_replication_slot('replica_slot_1');
    
    -- Create replication role
    CREATE ROLE replicator WITH REPLICATION LOGIN PASSWORD 'replicator_password';
EOSQL

# Add entry to pg_hba.conf to allow replication connections
echo "host replication postgres main_db md5" >> "$PGDATA/pg_hba.conf"
echo "host replication postgres replica_db md5" >> "$PGDATA/pg_hba.conf"
echo "host replication postgres 0.0.0.0/0 md5" >> "$PGDATA/pg_hba.conf"