# Contributing to SDGs Kesehatan

Terima kasih atas minat Anda untuk berkontribusi pada project SDGs Kesehatan!

## Development Setup

1. **Clone repository:**

```bash
git clone https://github.com/USERNAME/project-sdgs-kesehatan.git
cd project-sdgs-kesehatan
```

2. **Setup environment:**

```bash
# Copy environment template
cp backend/.env.example backend/.env
# Edit .env dengan konfigurasi lokal Anda
```

3. **Run dengan Docker:**

```bash
cd infra
docker compose up --build
```

4. **Atau run secara terpisah untuk development:**

```bash
# Terminal 1 - Backend
cd backend
npm install
npm start

# Terminal 2 - Frontend
cd frontend
npm install
npm run dev

# Terminal 3 - Database (optional, atau gunakan Docker)
docker run --name mysql-dev -e MYSQL_ROOT_PASSWORD=root -e MYSQL_DATABASE=sdgs_db -p 3306:3306 -d mysql:8
```

## Code Style

- **Backend:** Gunakan ES6+ features, async/await
- **Frontend:** TypeScript strict mode, React hooks
- **Database:** Gunakan prepared statements
- **Docker:** Multi-stage builds untuk optimasi

## Commit Message Format

```
type(scope): description

body (optional)

footer (optional)
```

Types:

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation
- `style`: Code style changes
- `refactor`: Code refactoring
- `test`: Adding tests
- `chore`: Maintenance tasks

Examples:

```
feat(frontend): add patient search functionality
fix(backend): resolve database connection timeout
docs(readme): update Docker setup instructions
```

## Pull Request Process

1. **Buat branch untuk fitur:**

```bash
git checkout -b feature/patient-management
```

2. **Implementasi dengan tests**

3. **Update documentation jika diperlukan**

4. **Test semua functionality:**

```bash
# Test Docker build
cd infra
docker compose up --build

# Test API endpoints
curl http://localhost:4000/health
curl http://localhost:4000/api/consultations
```

5. **Submit Pull Request dengan deskripsi jelas**

## Bug Reports

Ketika melaporkan bug, sertakan:

- OS dan versi Docker
- Steps to reproduce
- Expected vs actual behavior
- Screenshots (jika UI bug)
- Log output yang relevan

## Feature Requests

Untuk request fitur baru:

- Jelaskan use case
- Berikan mockup/wireframe jika UI change
- Diskusikan di Issues sebelum implementasi

## Questions?

Buka Issue dengan label `question` atau hubungi maintainers.
