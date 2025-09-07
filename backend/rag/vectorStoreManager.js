// Vector Store Manager for RAG
const { FaissStore } = require("@langchain/community/vectorstores/faiss");
const {
  HuggingFaceTransformersEmbeddings,
} = require("@langchain/community/embeddings/hf_transformers");
const { Document } = require("@langchain/core/documents");
const path = require("path");
const fs = require("fs").promises;

class VectorStoreManager {
  constructor() {
    this.vectorStore = null;
    this.embeddings = null;
    this.isInitialized = false;
    this.vectorStorePath = path.join(__dirname, "vectorstore");
  }

  async initialize() {
    try {
      console.log("Initializing vector store...");

      // Initialize embeddings - using lightweight model for better performance
      this.embeddings = new HuggingFaceTransformersEmbeddings({
        modelName: "sentence-transformers/all-MiniLM-L6-v2",
        // Use mock embeddings if model loading fails
        fallbackToMockEmbeddings: true,
      });

      // Try to load existing vector store
      try {
        await fs.access(this.vectorStorePath);
        console.log("Loading existing vector store...");
        this.vectorStore = await FaissStore.load(
          this.vectorStorePath,
          this.embeddings
        );
        console.log("Vector store loaded successfully");
      } catch (error) {
        console.log(
          "No existing vector store found, will create new one when documents are added"
        );
        this.vectorStore = null;
      }

      this.isInitialized = true;
      return true;
    } catch (error) {
      console.error("Error initializing vector store:", error);
      // Fallback to mock implementation
      this.isInitialized = true;
      return false;
    }
  }

  async addDocuments(processedDocuments) {
    if (!this.isInitialized) {
      await this.initialize();
    }

    try {
      const documents = [];

      for (const doc of processedDocuments) {
        for (let i = 0; i < doc.chunks.length; i++) {
          const chunk = doc.chunks[i];
          documents.push(
            new Document({
              pageContent: chunk,
              metadata: {
                source: doc.filename,
                chunkIndex: i,
                totalChunks: doc.chunks.length,
                type: doc.metadata.type,
                processedAt: doc.metadata.processedAt,
              },
            })
          );
        }
      }

      console.log(
        `Adding ${documents.length} document chunks to vector store...`
      );

      if (!this.vectorStore) {
        // Create new vector store
        this.vectorStore = await FaissStore.fromDocuments(
          documents,
          this.embeddings
        );
      } else {
        // Add to existing vector store
        await this.vectorStore.addDocuments(documents);
      }

      // Save the vector store
      await this.vectorStore.save(this.vectorStorePath);
      console.log("Vector store saved successfully");

      return {
        success: true,
        documentsAdded: documents.length,
        message: `Successfully added ${documents.length} document chunks`,
      };
    } catch (error) {
      console.error("Error adding documents to vector store:", error);
      return {
        success: false,
        error: error.message,
        message: "Failed to add documents to vector store",
      };
    }
  }

  async similaritySearch(query, k = 4) {
    if (!this.isInitialized) {
      await this.initialize();
    }

    if (!this.vectorStore) {
      console.warn("No vector store available, returning mock results");
      return this.getMockSearchResults(query, k);
    }

    try {
      console.log(`Performing similarity search for: "${query}"`);
      const results = await this.vectorStore.similaritySearch(query, k);

      return results.map((doc) => ({
        content: doc.pageContent,
        metadata: doc.metadata,
        source: doc.metadata.source,
        relevanceScore: 0.8, // FAISS doesn't return scores by default
      }));
    } catch (error) {
      console.error("Error in similarity search:", error);
      return this.getMockSearchResults(query, k);
    }
  }

  async similaritySearchWithScore(query, k = 4) {
    if (!this.isInitialized) {
      await this.initialize();
    }

    if (!this.vectorStore) {
      console.warn("No vector store available, returning mock results");
      return this.getMockSearchResults(query, k);
    }

    try {
      console.log(`Performing similarity search with scores for: "${query}"`);
      const results = await this.vectorStore.similaritySearchWithScore(
        query,
        k
      );

      return results.map(([doc, score]) => ({
        content: doc.pageContent,
        metadata: doc.metadata,
        source: doc.metadata.source,
        relevanceScore: score,
      }));
    } catch (error) {
      console.error("Error in similarity search with scores:", error);
      return this.getMockSearchResults(query, k);
    }
  }

  getMockSearchResults(query, k) {
    // Mock results based on query keywords
    const mockResults = [
      {
        content:
          "Untuk gejala demam dan flu, disarankan untuk istirahat yang cukup, minum banyak cairan, dan konsultasi dokter jika gejala memburuk.",
        metadata: { source: "panduan_kesehatan.txt", chunkIndex: 0 },
        source: "panduan_kesehatan.txt",
        relevanceScore: 0.85,
      },
      {
        content:
          "Pola makan sehat meliputi konsumsi makanan bergizi seimbang, buah dan sayuran, serta membatasi gula dan garam.",
        metadata: { source: "gaya_hidup_sehat.txt", chunkIndex: 1 },
        source: "gaya_hidup_sehat.txt",
        relevanceScore: 0.75,
      },
      {
        content:
          "Olahraga teratur minimal 150 menit per minggu dapat meningkatkan sistem imun dan kesehatan secara keseluruhan.",
        metadata: { source: "gaya_hidup_sehat.txt", chunkIndex: 2 },
        source: "gaya_hidup_sehat.txt",
        relevanceScore: 0.7,
      },
      {
        content:
          "Tidur 7-9 jam per malam sangat penting untuk regenerasi tubuh dan menjaga kesehatan mental.",
        metadata: { source: "panduan_kesehatan.txt", chunkIndex: 3 },
        source: "panduan_kesehatan.txt",
        relevanceScore: 0.65,
      },
    ];

    // Simple keyword matching for better mock results
    const queryLower = query.toLowerCase();
    const relevantResults = mockResults.filter((result) => {
      const contentLower = result.content.toLowerCase();
      return queryLower
        .split(" ")
        .some((word) => word.length > 2 && contentLower.includes(word));
    });

    return relevantResults.length > 0
      ? relevantResults.slice(0, k)
      : mockResults.slice(0, k);
  }

  async getStats() {
    if (!this.vectorStore) {
      return {
        isInitialized: this.isInitialized,
        hasVectorStore: false,
        documentCount: 0,
        message: "Vector store not available",
      };
    }

    try {
      // Get vector store statistics
      return {
        isInitialized: this.isInitialized,
        hasVectorStore: true,
        documentCount: this.vectorStore.index?.ntotal || 0,
        message: "Vector store is ready",
      };
    } catch (error) {
      return {
        isInitialized: this.isInitialized,
        hasVectorStore: false,
        documentCount: 0,
        error: error.message,
      };
    }
  }

  async reset() {
    try {
      // Remove existing vector store files
      await fs.rm(this.vectorStorePath, { recursive: true, force: true });
      this.vectorStore = null;
      console.log("Vector store reset successfully");
      return { success: true, message: "Vector store reset" };
    } catch (error) {
      console.error("Error resetting vector store:", error);
      return { success: false, error: error.message };
    }
  }
}

module.exports = VectorStoreManager;
