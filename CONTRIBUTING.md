# Contributing to SDGs Kesehatan - AI Health Assistant

Terima kasih atas minat Anda untuk berkontribusi pada project SDGs Kesehatan dengan teknologi RAG (Retrieval-Augmented Generation)!

## 🚀 Development Setup

### Prerequisites

- Node.js 16+ dan npm
- Git
- Groq API key (untuk AI chatbot)

### 1. Clone Repository

```bash
git clone https://github.com/USERNAME/project-sdgs-kesehatan.git
cd project-sdgs-kesehatan
```

### 2. Setup Environment Variables

```bash
# Backend
cp backend/.env.example backend/.env
# Edit backend/.env dengan Groq API key Anda

# Frontend
cp frontend-react/.env.example frontend-react/.env
# Environment variables biasanya sudah default dengan benar
```

### 3. Install Dependencies & Run

```bash
# Terminal 1 - Backend RAG System
cd backend
npm install
npm start

# Terminal 2 - React Frontend
cd frontend-react
npm install
npm start
```

### 4. Access Application

- Frontend: http://localhost:3000
- Backend API: http://localhost:4000
- AI Assistant: http://localhost:3000/chatbot

## 🛠 Development Guidelines

### Code Style

#### Backend (Node.js + RAG)

- **ES6+ features**: async/await, destructuring
- **RAG Components**: Follow LangChain patterns
- **Error Handling**: Graceful fallbacks untuk AI failures
- **Logging**: Console logs untuk debugging RAG pipeline

#### Frontend (React + TypeScript)

- **TypeScript strict mode**: Type safety untuk API responses
- **React hooks**: Functional components dengan hooks
- **Tailwind CSS**: Utility-first styling
- **API Types**: Defined di `types/api.ts`

#### AI/ML Components

- **Document Processing**: Support PDF, DOCX, TXT
- **Vector Store**: FAISS dengan embedding models
- **Prompt Engineering**: Clear, contextual prompts
- **Fallback Mechanisms**: Graceful degradation when AI fails
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
