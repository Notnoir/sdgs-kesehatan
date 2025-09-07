# SDGs Kesehatan - AI-Powered Health Assistant

Aplikasi sistem diagnosis kesehatan digital dengan teknologi RAG (Retrieval-Augmented Generation) menggunakan React.js (frontend), Node.js (backend), dan AI chatbot berbasis LangChain dan Groq LLaMA.

## 🌟 Features

- **🤖 AI Assistant**: Chatbot RAG dengan knowledge base medis
- **🩺 Symptom Diagnosis**: Analisis gejala menggunakan AI
- **📚 Document Retrieval**: Pencarian kontekstual dalam dokumen kesehatan
- **💬 Interactive Chat**: Interface chat real-time dengan follow-up questions
- **📊 Source Attribution**: Referensi sumber dokumen untuk setiap jawaban
- **🔄 Session Management**: Pelacakan riwayat percakapan

## 🛠 Tech Stack

### Frontend

- **React.js 18** dengan TypeScript
- **Tailwind CSS** untuk styling
- **React Router** untuk navigasi
- **Axios** untuk API calls

### Backend

- **Node.js** dengan Express.js
- **LangChain** untuk RAG pipeline
- **Groq SDK** dengan LLaMA-3-8B model
- **FAISS** untuk vector storage
- **HuggingFace Transformers** untuk embeddings

### AI & ML

- **RAG Architecture**: Retrieval-Augmented Generation
- **Vector Store**: FAISS similarity search
- **Document Processing**: PDF, DOCX, TXT support
- **Text Splitting**: RecursiveCharacterTextSplitter
- **Embeddings**: HuggingFace Transformers (with fallback mock)

## 📋 Prerequisites

- Node.js 16+ dan npm
- Git
- Internet connection untuk AI model access

## 🚀 Quick Start

### 1. Clone Repository

```bash
git clone https://github.com/USERNAME/project-sdgs-kesehatan.git
cd project-sdgs-kesehatan
```

### 2. Setup Environment Variables

Buat file `.env` di folder `backend/`:

```bash
GROQ_API_KEY=your_groq_api_key_here
NODE_ENV=development
```

Buat file `.env` di folder `frontend-react/`:

```bash
REACT_APP_API_URL=http://localhost:4000
REACT_APP_CHATBOT_URL=http://localhost:4000
```

### 3. Install Dependencies & Start Backend

```bash
cd backend
npm install
npm start
```

Backend akan berjalan di: http://localhost:4000

### 4. Install Dependencies & Start Frontend

```bash
cd frontend-react
npm install
npm start
```

Frontend akan berjalan di: http://localhost:3000

### 5. Access Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:4000
- **Health Check**: http://localhost:4000/health

## 📂 Project Structure

```
project-sdgs-kesehatan/
├── README.md
├── backend/
│   ├── index.js                 # Main server file
│   ├── package.json
│   ├── rag/
│   │   ├── ragChatbot.js       # Main RAG orchestrator
│   │   ├── documentProcessor.js # Document ingestion
│   │   ├── vectorStoreManager.js # Vector storage
│   │   ├── documents/          # Knowledge base
│   │   │   ├── gaya_hidup_sehat.txt
│   │   │   ├── panduan_kesehatan.txt
│   │   │   └── penyakit_umum.txt
│   │   └── vectorstore/        # Generated vector indices
│   └── .env
├── frontend-react/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ChatbotPage.tsx # AI Assistant interface
│   │   │   ├── DiagnosisPage.tsx
│   │   │   ├── Navigation.tsx
│   │   │   └── ConsultationsPage.tsx
│   │   ├── services/
│   │   │   └── api.ts          # API service layer
│   │   ├── types/
│   │   │   └── api.ts          # TypeScript definitions
│   │   ├── App.tsx             # Main app component
│   │   └── index.css           # Tailwind imports
│   ├── public/
│   ├── package.json
│   └── .env
└── infra/
    └── docker-compose.yml       # Optional Docker setup
```

## 🔌 API Endpoints

### Health & Status

- `GET /health` - Backend health check
- `GET /api/chat/stats` - RAG system statistics

### RAG Chatbot

- `POST /api/chat` - Send message to AI assistant
  ```json
  {
    "message": "Saya mengalami demam dan batuk, apa yang harus saya lakukan?",
    "sessionId": "optional_session_id"
  }
  ```

### Diagnosis System

- `POST /api/diagnose` - Submit symptoms for diagnosis
- `GET /api/consultations` - Get consultation history

## 🤖 RAG System Architecture

```
User Input
    ↓
Document Retrieval (FAISS)
    ↓
Context Preparation
    ↓
LLM Generation (Grok AI)
    ↓
Response with Sources
```

### Knowledge Base Documents

1. **gaya_hidup_sehat.txt**: Tips gaya hidup sehat, olahraga, nutrisi
2. **panduan_kesehatan.txt**: Panduan umum kesehatan, pencegahan penyakit
3. **penyakit_umum.txt**: Informasi penyakit umum dan pengobatan

### Vector Store Features

- **Similarity Search**: Pencarian dokumen berdasarkan relevansi
- **Relevance Scoring**: Skor tingkat kesesuaian (0.0 - 1.0)
- **Chunk Management**: Pembagian dokumen optimal untuk retrieval

## 🎯 Usage Examples

### AI Assistant Chat

1. Kunjungi http://localhost:3000/chatbot
2. Tanyakan pertanyaan kesehatan:
   - "Saya mengalami demam dan batuk, apa yang harus saya lakukan?"
   - "Bagaimana cara menjaga kesehatan jantung?"
   - "Apa saja gejala diabetes?"

### Response Features

- **Contextual Answers**: Jawaban berdasarkan knowledge base
- **Source Attribution**: Menunjukkan dokumen sumber
- **Follow-up Questions**: Pertanyaan lanjutan otomatis
- **Session Tracking**: Riwayat percakapan

## 🔧 Development

### Adding New Documents

1. Tambahkan file `.txt`, `.pdf`, atau `.docx` ke `backend/rag/documents/`
2. Restart backend untuk memproses dokumen baru
3. Vector store akan diperbarui otomatis

### Environment Configuration

#### Backend (.env)

```bash
GROQ_API_KEY=your_groq_api_key_here
NODE_ENV=development
DB_HOST=localhost
DB_USER=root
DB_PASS=
DB_NAME=sdgs_db
```

#### Frontend (.env)

```bash
REACT_APP_API_URL=http://localhost:4000
REACT_APP_CHATBOT_URL=http://localhost:4000
```

### Dependencies

#### Backend

- `@langchain/community` - LangChain integrations
- `langchain` - Core LangChain framework
- `groq-sdk` - Groq API client
- `faiss-node` - Vector similarity search
- `pdf-parse` - PDF document processing
- `mammoth` - DOCX document processing

#### Frontend

- `react` & `react-dom` - React framework
- `react-router-dom` - Client-side routing
- `axios` - HTTP client
- `tailwindcss` - Utility-first CSS framework

## 🐛 Troubleshooting

### Common Issues

1. **Backend tidak start**

   ```bash
   cd backend
   npm install --legacy-peer-deps
   ```

2. **Vector embeddings error**

   - Install transformers: `npm install @xenova/transformers`
   - Sistem akan fallback ke mock mode jika gagal

3. **Frontend layar kosong**

   - Pastikan Tailwind CSS imports aktif di `src/index.css`
   - Check console browser untuk error JavaScript

4. **API connection failed**
   - Verify backend running di port 4000
   - Check `.env` file di frontend-react

### Development Mode

```bash
# Backend development
cd backend
npm run dev  # if available, or npm start

# Frontend development
cd frontend-react
npm start
```

## 📈 Performance

- **Response Time**: ~2-3 detik untuk query RAG
- **Document Processing**: ~1-2 detik per dokumen
- **Vector Search**: Sub-second similarity search
- **Memory Usage**: ~200MB untuk vector store

## 🔮 Future Enhancements

- [ ] Real-time document upload via UI
- [ ] Multi-language support
- [ ] Voice input/output
- [ ] Medical image analysis
- [ ] Integration with medical APIs
- [ ] Improved vector embeddings
- [ ] User authentication system
- [ ] Advanced analytics dashboard

## 🤝 Contributing

1. Fork repository
2. Create feature branch: `git checkout -b feature/new-feature`
3. Commit changes: `git commit -m 'Add new feature'`
4. Push to branch: `git push origin feature/new-feature`
5. Submit Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- **LangChain** for RAG framework
- **Groq** for fast LLM inference
- **HuggingFace** for embeddings models
- **React** and **Tailwind CSS** for UI
- **FAISS** for efficient vector search

---

**⚠️ Disclaimer**: Aplikasi ini hanya untuk tujuan edukasi dan informasi umum. Tidak menggantikan konsultasi medis profesional. Untuk masalah kesehatan serius, selalu konsultasikan dengan dokter.
