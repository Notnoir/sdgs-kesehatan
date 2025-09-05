#!/bin/bash

echo "🚀 Setup SDGs Kesehatan Project untuk GitHub"
echo "==========================================="

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "📁 Initializing Git repository..."
    git init
fi

# Check git config
echo "🔧 Checking Git configuration..."
if [ -z "$(git config user.name)" ]; then
    echo "⚠️  Git user.name not set!"
    echo "Please run: git config --global user.name 'Your Name'"
    exit 1
fi

if [ -z "$(git config user.email)" ]; then
    echo "⚠️  Git user.email not set!"
    echo "Please run: git config --global user.email 'your.email@example.com'"
    exit 1
fi

echo "✅ Git configured:"
echo "   Name: $(git config user.name)"
echo "   Email: $(git config user.email)"

# Check if backend .env exists
if [ ! -f "backend/.env" ]; then
    echo "📄 Creating backend/.env from template..."
    cp backend/.env.example backend/.env
    echo "⚠️  Please edit backend/.env with your actual configuration"
fi

# Add all files
echo "📦 Adding files to Git..."
git add .

# Check status
echo "📊 Git status:"
git status --short

# Commit
echo "💾 Creating commit..."
git commit -m "Initial commit: Full-stack SDGs kesehatan app

Features:
- Next.js TypeScript frontend
- Node.js Express backend  
- MySQL database with init scripts
- MinIO object storage
- Docker Compose configuration
- Health checks and monitoring
- Production-ready Dockerfiles"

echo ""
echo "🎉 Project ready for GitHub!"
echo ""
echo "Next steps:"
echo "1. Create repository at: https://github.com/new"
echo "2. Run: git remote add origin https://github.com/USERNAME/project-sdgs-kesehatan.git"
echo "3. Run: git push -u origin master"
echo ""
echo "Or use GitHub CLI:"
echo "1. Run: gh auth login"
echo "2. Run: gh repo create project-sdgs-kesehatan --public --push"
