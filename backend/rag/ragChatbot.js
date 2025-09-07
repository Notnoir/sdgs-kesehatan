// RAG Chatbot with Groq AI
const Groq = require("groq-sdk");
const DocumentProcessor = require("./documentProcessor");
const VectorStoreManager = require("./vectorStoreManager");

class RAGChatbot {
  constructor() {
    // Initialize Groq client with API key
    this.groqApiKey = process.env.GROQ_API_KEY || "mock";
    this.groq = new Groq({
      apiKey: this.groqApiKey,
    });
    this.documentProcessor = new DocumentProcessor();
    this.vectorStore = new VectorStoreManager();
    this.isInitialized = false;
    this.conversationHistory = new Map(); // Store conversation history by session
  }

  async initialize() {
    try {
      console.log("Initializing RAG Chatbot...");

      // Initialize vector store
      await this.vectorStore.initialize();

      // Create sample documents if they don't exist
      const documentsDir = await this.documentProcessor.createSampleDocuments();

      // Process and add documents to vector store
      const stats = await this.vectorStore.getStats();
      if (!stats.hasVectorStore || stats.documentCount === 0) {
        console.log("Processing sample documents...");
        const processedDocs = await this.documentProcessor.processDirectory(
          documentsDir
        );
        await this.vectorStore.addDocuments(processedDocs);
      }

      this.isInitialized = true;
      console.log("RAG Chatbot initialized successfully");
      return true;
    } catch (error) {
      console.error("Error initializing RAG Chatbot:", error);
      this.isInitialized = true; // Continue with mock mode
      return false;
    }
  }

  async chat(message, sessionId = null) {
    if (!this.isInitialized) {
      await this.initialize();
    }

    try {
      // Generate session ID if not provided
      if (!sessionId) {
        sessionId = `session_${Date.now()}_${Math.random()
          .toString(36)
          .substr(2, 9)}`;
      }

      // Get conversation history
      const history = this.conversationHistory.get(sessionId) || [];

      // Perform similarity search to get relevant documents
      console.log("Retrieving relevant documents...");
      const relevantDocs = await this.vectorStore.similaritySearchWithScore(
        message,
        3
      );

      // Prepare context from retrieved documents
      const context = this.prepareContext(relevantDocs);

      // Generate response using RAG
      const response = await this.generateResponse(message, context, history);

      // Update conversation history
      history.push({ role: "user", content: message });
      history.push({ role: "assistant", content: response.answer });

      // Keep only last 10 messages to manage memory
      if (history.length > 10) {
        history.splice(0, history.length - 10);
      }

      this.conversationHistory.set(sessionId, history);

      return {
        answer: response.answer,
        sources: relevantDocs.map((doc) => doc.source),
        relevantDocs: relevantDocs.map((doc) => ({
          content: doc.content.substring(0, 200) + "...",
          source: doc.source,
          relevanceScore: doc.relevanceScore,
        })),
        followUpQuestions: this.generateFollowUpQuestions(message),
        sessionId: sessionId,
        contextualizedQuestion: response.contextualizedQuestion,
      };
    } catch (error) {
      console.error("Error in RAG chat:", error);
      return this.getFallbackResponse(message, sessionId);
    }
  }

  prepareContext(relevantDocs) {
    if (!relevantDocs || relevantDocs.length === 0) {
      return "Tidak ada konteks khusus tersedia.";
    }

    let context = "Konteks dari dokumen kesehatan:\n\n";
    relevantDocs.forEach((doc, index) => {
      context += `${index + 1}. [${doc.source}] ${doc.content}\n\n`;
    });

    return context;
  }

  async generateResponse(message, context, history) {
    // Check if we're in mock mode
    if (
      process.env.AI_MODE === "mock" ||
      !process.env.GROQ_API_KEY ||
      process.env.GROQ_API_KEY === "mock" ||
      process.env.GROQ_API_KEY === "your_groq_api_key_here"
    ) {
      console.log("Using mock response mode - no valid Groq API key");
      return this.generateMockResponse(message, context);
    }

    try {
      // Prepare conversation context
      const historyContext =
        history.length > 0
          ? history
              .slice(-6)
              .map((h) => `${h.role}: ${h.content}`)
              .join("\n")
          : "";

      const systemPrompt = `Anda adalah asisten kesehatan AI yang menggunakan informasi dari dokumen medis untuk memberikan jawaban yang akurat.

INSTRUKSI PENTING:
1. Gunakan informasi dari konteks yang disediakan untuk menjawab pertanyaan
2. Selalu berikan disclaimer bahwa Anda bukan pengganti konsultasi dokter
3. Jawab dalam bahasa Indonesia yang mudah dipahami
4. Jika informasi tidak tersedia dalam konteks, katakan dengan jujur
5. Berikan saran umum dan pencegahan, bukan diagnosis spesifik
6. Rujuk ke sumber dokumen jika relevan

KONTEKS DOKUMEN:
${context}

RIWAYAT PERCAKAPAN TERAKHIR:
${historyContext}

Jawab pertanyaan berikut dengan berdasarkan konteks di atas:`;

      // Generate response using Groq LLaMA
      const completion = await this.groq.chat.completions.create({
        messages: [
          {
            role: "system",
            content: systemPrompt,
          },
          {
            role: "user",
            content: message,
          },
        ],
        model: "llama-3.1-8b-instant", // Updated to supported model
        temperature: 0.3,
        max_tokens: 800,
        top_p: 1,
      });

      const answer =
        completion.choices[0]?.message?.content ||
        "Maaf, saya tidak dapat memproses permintaan Anda saat ini.";

      return {
        answer: answer,
        contextualizedQuestion: message,
      };
    } catch (error) {
      console.error("Groq API error:", error);
      return this.generateMockResponse(message, context);
    }
  }

  generateMockResponse(message, context) {
    // Analyze message for health-related keywords
    const messageLower = message.toLowerCase();

    // Daftar kata kunci terkait kesehatan
    const healthKeywords = [
      "demam",
      "panas",
      "batuk",
      "pilek",
      "sakit",
      "nyeri",
      "pusing",
      "mual",
      "muntah",
      "diare",
      "diet",
      "makan",
      "nutrisi",
      "gizi",
      "olahraga",
      "latihan",
      "sehat",
      "penyakit",
      "obat",
      "dokter",
      "rumah sakit",
      "klinik",
      "gejala",
      "diagnosa",
      "terapi",
      "pengobatan",
      "vaksin",
      "imunisasi",
      "alergi",
      "operasi",
      "darah",
      "jantung",
      "paru",
      "ginjal",
      "hati",
      "otak",
      "tulang",
      "kulit",
      "mata",
      "gigi",
      "telinga",
      "hidung",
      "tenggorokan",
      "perut",
      "usus",
      "kandungan",
    ];

    // Periksa apakah pertanyaan terkait kesehatan
    const isHealthRelated = healthKeywords.some((keyword) =>
      messageLower.includes(keyword)
    );

    // Kata-kata yang jelas tidak terkait kesehatan
    const nonHealthKeywords = [
      "ban",
      "mobil",
      "motor",
      "tambal",
      "bengkel",
      "mesin",
      "kendaraan",
    ];
    const isDefinitelyNotHealth = nonHealthKeywords.some((keyword) =>
      messageLower.includes(keyword)
    );

    let response = "";

    // Jika pertanyaan jelas tidak terkait kesehatan
    if (isDefinitelyNotHealth) {
      response =
        "Maaf, pertanyaan Anda tidak terkait dengan kesehatan. Saya adalah asisten AI kesehatan yang dirancang untuk menjawab pertanyaan seputar kesehatan dan medis. Mohon ajukan pertanyaan terkait kesehatan agar saya dapat membantu Anda dengan lebih baik.";

      return {
        answer: response,
        contextualizedQuestion: message,
      };
    }

    // Jika pertanyaan tidak mengandung kata kunci kesehatan
    if (!isHealthRelated) {
      response =
        "Maaf, saya tidak dapat memahami pertanyaan Anda dengan baik. Saya adalah asisten AI kesehatan yang dapat membantu menjawab pertanyaan seputar kesehatan, gejala penyakit, tips hidup sehat, dan informasi medis umum. Mohon ajukan pertanyaan yang lebih spesifik terkait kesehatan.";

      return {
        answer: response,
        contextualizedQuestion: message,
      };
    }

    // Jika pertanyaan terkait kesehatan, berikan respons sesuai kata kunci
    if (messageLower.includes("demam") || messageLower.includes("panas")) {
      response =
        "Berdasarkan informasi kesehatan yang tersedia, untuk mengatasi demam:\n\n" +
        "• Istirahat yang cukup dan minum banyak cairan\n" +
        "• Kompres dengan air hangat\n" +
        "• Konsumsi makanan bergizi\n" +
        "• Jika demam >38.5°C atau berlanjut >3 hari, segera konsultasi dokter\n\n";
    } else if (
      messageLower.includes("batuk") ||
      messageLower.includes("pilek")
    ) {
      response =
        "Untuk mengatasi batuk dan pilek:\n\n" +
        "• Perbanyak istirahat dan minum air hangat\n" +
        "• Konsumsi madu dan jeruk untuk vitamin C\n" +
        "• Hindari makanan dingin dan pedas\n" +
        "• Gunakan humidifier atau hirup uap air hangat\n" +
        "• Jika gejala memburuk atau berlanjut >1 minggu, konsultasi dokter\n\n";
    } else if (
      messageLower.includes("sakit kepala") ||
      messageLower.includes("pusing")
    ) {
      response =
        "Untuk mengatasi sakit kepala:\n\n" +
        "• Istirahat di tempat yang tenang dan gelap\n" +
        "• Kompres dingin di dahi atau leher\n" +
        "• Minum air putih yang cukup\n" +
        "• Hindari stres dan atur pola tidur\n" +
        "• Jika sakit kepala berat atau disertai gejala lain, segera ke dokter\n\n";
    } else if (
      messageLower.includes("diet") ||
      messageLower.includes("makan")
    ) {
      response =
        "Tips pola makan sehat:\n\n" +
        "• Konsumsi makanan bergizi seimbang\n" +
        "• Makan buah dan sayuran minimal 5 porsi per hari\n" +
        "• Batasi gula, garam, dan lemak jenuh\n" +
        "• Minum air putih minimal 8 gelas per hari\n" +
        "• Makan dalam porsi kecil tapi sering\n\n";
    } else if (
      messageLower.includes("olahraga") ||
      messageLower.includes("latihan")
    ) {
      response =
        "Panduan olahraga yang sehat:\n\n" +
        "• Lakukan aktivitas fisik minimal 150 menit per minggu\n" +
        "• Mulai dengan intensitas ringan seperti jalan kaki\n" +
        "• Kombinasikan latihan kardio dan kekuatan\n" +
        "• Lakukan pemanasan dan pendinginan\n" +
        "• Konsultasi dokter sebelum memulai program olahraga intensif\n\n";
    } else {
      response =
        "Berdasarkan informasi kesehatan yang tersedia, saya sarankan:\n\n" +
        "• Jaga pola hidup sehat dengan makan bergizi dan olahraga teratur\n" +
        "• Istirahat yang cukup 7-9 jam per malam\n" +
        "• Kelola stres dengan baik\n" +
        "• Lakukan pemeriksaan kesehatan rutin\n\n";
    }

    response +=
      "**Disclaimer**: Informasi ini hanya sebagai panduan umum dan tidak menggantikan konsultasi dengan dokter atau tenaga medis profesional. Untuk keluhan yang serius atau berkelanjutan, segera konsultasi ke dokter.";

    return {
      answer: response,
      contextualizedQuestion: message,
    };
  }

  generateFollowUpQuestions(message) {
    const messageLower = message.toLowerCase();

    if (messageLower.includes("demam")) {
      return [
        "Sudah berapa lama Anda mengalami demam?",
        "Apakah disertai gejala lain seperti batuk atau pilek?",
        "Apakah Anda sudah mengukur suhu tubuh?",
      ];
    } else if (messageLower.includes("batuk")) {
      return [
        "Apakah batuk berdahak atau kering?",
        "Sudah berapa lama batuk berlangsung?",
        "Apakah ada darah dalam dahak?",
      ];
    } else if (messageLower.includes("sakit kepala")) {
      return [
        "Di bagian mana kepala yang sakit?",
        "Apakah sakitnya berdenyut atau terus-menerus?",
        "Apakah disertai mual atau muntah?",
      ];
    } else {
      return [
        "Apakah ada gejala lain yang Anda rasakan?",
        "Sudah berapa lama mengalami keluhan ini?",
        "Apakah ada riwayat penyakit dalam keluarga?",
      ];
    }
  }

  getFallbackResponse(message, sessionId) {
    return {
      answer:
        "Maaf, terjadi gangguan pada sistem AI. Untuk informasi kesehatan yang akurat, saya sarankan untuk berkonsultasi langsung dengan tenaga medis profesional.",
      sources: ["Fallback Response"],
      relevantDocs: [],
      followUpQuestions: [
        "Apakah Anda ingin mencoba bertanya lagi?",
        "Apakah ada informasi kesehatan lain yang bisa saya bantu?",
      ],
      sessionId: sessionId || `fallback_${Date.now()}`,
    };
  }

  async addDocument(filePath) {
    try {
      if (!this.isInitialized) {
        await this.initialize();
      }

      const processedDoc = await this.documentProcessor.processDocument(
        filePath
      );
      const result = await this.vectorStore.addDocuments([processedDoc]);

      return {
        success: true,
        message: `Document ${processedDoc.filename} added successfully`,
        chunks: processedDoc.chunks.length,
      };
    } catch (error) {
      console.error("Error adding document:", error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  async getStats() {
    const vectorStoreStats = await this.vectorStore.getStats();
    return {
      isInitialized: this.isInitialized,
      activeSessions: this.conversationHistory.size,
      vectorStore: vectorStoreStats,
    };
  }

  clearSession(sessionId) {
    if (sessionId) {
      this.conversationHistory.delete(sessionId);
      return { success: true, message: "Session cleared" };
    }
    return { success: false, message: "Invalid session ID" };
  }

  clearAllSessions() {
    this.conversationHistory.clear();
    return { success: true, message: "All sessions cleared" };
  }
}

module.exports = RAGChatbot;
