#!/bin/bash

# Wait for MinIO to be ready
echo "Waiting for MinIO to be ready..."
until curl -f http://minio:9000/minio/health/live; do
  echo "MinIO is not ready yet, waiting..."
  sleep 5
done

echo "MinIO is ready, setting up bucket..."

# Configure mc client
mc alias set local http://minio:9000 minioadmin minioadmin

# Create bucket if it doesn't exist
mc mb local/app-bucket --ignore-existing

# Set public read policy for the bucket (optional)
mc policy set public local/app-bucket

echo "MinIO setup completed!"
