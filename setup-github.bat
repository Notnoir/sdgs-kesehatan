@echo off
echo 🚀 Setup SDGs Kesehatan Project untuk GitHub
echo ===========================================

REM Check if git is initialized
if not exist ".git" (
    echo 📁 Initializing Git repository...
    git init
)

REM Check git config
echo 🔧 Checking Git configuration...
git config user.name >nul 2>&1
if %ERRORLEVEL% neq 0 (
    echo ⚠️  Git user.name not set!
    echo Please run: git config --global user.name "Your Name"
    pause
    exit /b 1
)

git config user.email >nul 2>&1
if %ERRORLEVEL% neq 0 (
    echo ⚠️  Git user.email not set!
    echo Please run: git config --global user.email "your.email@example.com"
    pause
    exit /b 1
)

echo ✅ Git configured:
for /f "delims=" %%i in ('git config user.name') do echo    Name: %%i
for /f "delims=" %%i in ('git config user.email') do echo    Email: %%i

REM Check if backend .env exists
if not exist "backend\.env" (
    echo 📄 Creating backend\.env from template...
    copy "backend\.env.example" "backend\.env"
    echo ⚠️  Please edit backend\.env with your actual configuration
)

REM Add all files
echo 📦 Adding files to Git...
git add .

REM Check status
echo 📊 Git status:
git status --short

REM Commit
echo 💾 Creating commit...
git commit -m "Initial commit: Full-stack SDGs kesehatan app" -m "Features:" -m "- Next.js TypeScript frontend" -m "- Node.js Express backend" -m "- MySQL database with init scripts" -m "- MinIO object storage" -m "- Docker Compose configuration" -m "- Health checks and monitoring" -m "- Production-ready Dockerfiles"

echo.
echo 🎉 Project ready for GitHub!
echo.
echo Next steps:
echo 1. Create repository at: https://github.com/new
echo 2. Run: git remote add origin https://github.com/USERNAME/project-sdgs-kesehatan.git
echo 3. Run: git push -u origin master
echo.
echo Or use GitHub CLI:
echo 1. Run: gh auth login
echo 2. Run: gh repo create project-sdgs-kesehatan --public --push

pause
