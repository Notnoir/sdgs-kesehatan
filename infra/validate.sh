#!/bin/bash

echo "🚀 Memvalidasi konfigurasi Docker Compose..."

# Check if docker-compose.yml is valid
echo "📋 Validasi docker-compose.yml..."
docker compose -f docker-compose.yml config > /dev/null
if [ $? -eq 0 ]; then
    echo "✅ docker-compose.yml valid"
else
    echo "❌ docker-compose.yml tidak valid"
    exit 1
fi

# Check if required files exist
echo "📁 Memeriksa file yang diperlukan..."

required_files=(
    "../frontend/Dockerfile"
    "../frontend/package.json"
    "../frontend/next.config.ts"
    "../backend/Dockerfile"
    "../backend/package.json"
    "../backend/index.js"
    "./init.sql"
    "./setup-minio.sh"
)

for file in "${required_files[@]}"; do
    if [ -f "$file" ]; then
        echo "✅ $file exists"
    else
        echo "❌ $file missing"
        exit 1
    fi
done

echo "🎉 Semua konfigurasi valid! Siap untuk menjalankan:"
echo "   docker compose up --build"
