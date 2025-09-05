# SDGs Kesehatan - Full Stack Application

Aplikasi telemedicine sederhana dengan Next.js (frontend), Node.js (backend), MySQL (database), dan MinIO (object storage).

## Prerequisites

- Docker dan Docker Compose
- Git

## Quick Start

1. Clone repository dan masuk ke direktori infra:

```bash
cd infra
```

2. Jalankan seluruh stack dengan satu perintah:

```bash
docker compose up --build
```

3. Tunggu semua service siap (biasanya 2-3 menit untuk pertama kali)

4. Akses aplikasi:
   - **Frontend**: http://localhost:3000
   - **Backend API**: http://localhost:4000
   - **MinIO Console**: http://localhost:9001 (admin/minioadmin)
   - **MySQL**: localhost:3306

## Services

### Frontend (Next.js)

- Port: 3000
- Health check: http://localhost:3000/api/health

### Backend (Node.js)

- Port: 4000
- Health check: http://localhost:4000/health
- API endpoints:
  - POST `/api/diagnose` - Submit symptoms for diagnosis
  - GET `/api/consultations` - Get consultation history

### Database (MySQL)

- Port: 3306
- Database: `sdgs_db`
- User: `sdgs_user`
- Password: `sdgs_pass`

### Object Storage (MinIO)

- S3 API: Port 9000
- Console: Port 9001
- Credentials: minioadmin/minioadmin
- Bucket: `app-bucket`

## Development

### Stop all services:

```bash
docker compose down
```

### Stop and remove volumes (reset data):

```bash
docker compose down -v
```

### View logs:

```bash
docker compose logs -f [service-name]
```

### Rebuild specific service:

```bash
docker compose up --build [service-name]
```

## Environment Variables

Aplikasi menggunakan environment variables berikut:

### Frontend

- `NEXT_PUBLIC_API_URL`: URL backend API (default: http://localhost:4000)

### Backend

- `DB_HOST`: MySQL host (default: mysql)
- `DB_USER`: MySQL user (default: sdgs_user)
- `DB_PASS`: MySQL password (default: sdgs_pass)
- `DB_NAME`: MySQL database (default: sdgs_db)
- `S3_ENDPOINT`: MinIO endpoint (default: http://minio:9000)
- `AWS_ACCESS_KEY_ID`: MinIO access key (default: minioadmin)
- `AWS_SECRET_ACCESS_KEY`: MinIO secret key (default: minioadmin)
- `S3_BUCKET`: S3 bucket name (default: app-bucket)

## Troubleshooting

1. **Port sudah digunakan**: Pastikan port 3000, 4000, 3306, 9000, 9001 tidak digunakan aplikasi lain
2. **Build gagal**: Pastikan Docker memiliki cukup memory (minimum 4GB)
3. **Database connection error**: Tunggu MySQL service siap sepenuhnya (lihat health check)
4. **MinIO bucket error**: Pastikan service minio-setup berhasil membuat bucket

## Architecture

```
Frontend (Next.js) :3000
    ↓
Backend (Node.js) :4000
    ↓
MySQL :3306 + MinIO :9000
```

## Push ke GitHub

### 1. Persiapan Repository GitHub

1. **Buat repository baru di GitHub:**
   - Buka https://github.com/new
   - Masukkan nama repository: `project-sdgs-kesehatan`
   - Pilih **Public** atau **Private**
   - **Jangan** centang "Add a README file" (karena sudah ada)
   - Klik **Create repository**

### 2. Setup Git Configuration

```bash
# Set your Git user info (jika belum)
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"

# Verify current directory
cd d:\riza\SP1\Cloud\project-sdgs-kesehatan
```

### 3. Add dan Commit Files

```bash
# Add all files
git add .

# Commit with descriptive message
git commit -m "Initial commit: Full-stack SDGs kesehatan app with Docker"
```

### 4. Connect ke GitHub Repository

```bash
# Add remote origin (ganti USERNAME dengan username GitHub Anda)
git remote add origin https://github.com/USERNAME/project-sdgs-kesehatan.git

# Push to GitHub
git push -u origin master
```

### 5. Alternative: Menggunakan GitHub CLI (Optional)

Jika Anda memiliki GitHub CLI:

```bash
# Login ke GitHub
gh auth login

# Create repository dan push sekaligus
gh repo create project-sdgs-kesehatan --public --push
```

### 6. Update Repository Description

Setelah push berhasil, update deskripsi repository di GitHub:

- Buka repository di GitHub
- Klik **⚙️ Settings** atau edit icon di bagian About
- Tambahkan deskripsi: "Full-stack telemedicine app with Next.js, Node.js, MySQL, and MinIO"
- Tambahkan topics: `nextjs`, `nodejs`, `mysql`, `minio`, `docker`, `telemedicine`, `sdgs`

### 7. Struktur Repository di GitHub

Setelah push, struktur repository akan terlihat seperti:

```
project-sdgs-kesehatan/
├── README.md
├── .gitignore
├── backend/
│   ├── Dockerfile
│   ├── index.js
│   ├── package.json
│   └── .dockerignore
├── frontend/
│   ├── Dockerfile
│   ├── app/
│   ├── package.json
│   ├── next.config.ts
│   └── .dockerignore
└── infra/
    ├── docker-compose.yml
    ├── init.sql
    ├── setup-minio.sh
    └── validate.sh
```

### 8. Clone untuk Development Lain

Orang lain bisa clone dan run dengan:

```bash
git clone https://github.com/USERNAME/project-sdgs-kesehatan.git
cd project-sdgs-kesehatan/infra
docker compose up --build
```

### 9. Best Practices untuk Development

1. **Buat branch untuk fitur baru:**

```bash
git checkout -b feature/new-feature
# ... make changes ...
git add .
git commit -m "Add new feature"
git push origin feature/new-feature
```

2. **Buat Pull Request di GitHub**

3. **Update documentation** saat ada perubahan

### 10. Environment Variables untuk Production

Untuk deployment production, buat file `.env.example`:

```bash
# Copy environment template
cp backend/.env backend/.env.example
# Edit .env.example to remove sensitive values
```

Dan update README dengan instruksi environment setup.
