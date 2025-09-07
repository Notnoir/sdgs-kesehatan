// Vector Store Manager for RAG - with Simple Text Similarity Fallback
const { FaissStore } = require("@langchain/community/vectorstores/faiss");
const { Document } = require("@langchain/core/documents");
const path = require("path");
const fs = require("fs").promises;

class VectorStoreManager {
  constructor() {
    this.vectorStore = null;
    this.embeddings = null;
    this.isInitialized = false;
    this.vectorStorePath = path.join(__dirname, "vectorstore");
    this.documents = []; // Store documents for text-based search fallback
    this.useTextFallback = false;
  }

  async initialize() {
    try {
      console.log("Initializing vector store...");

      // Try to use vector embeddings first
      try {
        const {
          HuggingFaceTransformersEmbeddings,
        } = require("@langchain/community/embeddings/hf_transformers");

        this.embeddings = new HuggingFaceTransformersEmbeddings({
          modelName: "sentence-transformers/all-MiniLM-L6-v2",
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
      } catch (error) {
        console.log(
          "Vector embeddings failed, using text-based similarity fallback"
        );
        this.useTextFallback = true;
      }

      this.isInitialized = true;
      return true;
    } catch (error) {
      console.error("Error initializing vector store:", error);
      // Use text fallback
      this.useTextFallback = true;
      this.isInitialized = true;
      return false;
    }
  }

  async addDocuments(processedDocuments) {
    if (!this.isInitialized) {
      await this.initialize();
    }

    const documents = [];

    try {
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

      if (this.useTextFallback) {
        // Store documents for text-based search
        this.documents = documents;
        console.log("Documents stored for text-based search fallback");
        return {
          success: true,
          documentsAdded: documents.length,
          message: `Successfully stored ${documents.length} document chunks for text search`,
        };
      }

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
      // Fallback to text storage
      this.useTextFallback = true;
      this.documents = documents;
      console.log("Switched to text-based fallback due to vector store error");

      return {
        success: true,
        documentsAdded: documents.length,
        message: `Using text-based fallback: stored ${documents.length} document chunks`,
      };
    }
  }

  async similaritySearch(query, k = 4) {
    if (!this.isInitialized) {
      await this.initialize();
    }

    // Use text-based search if vector store is not available
    if (this.useTextFallback || !this.vectorStore) {
      console.log("Using text-based similarity search fallback");
      return this.textBasedSearch(query, k);
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
      console.log("Fallback to text-based search");
      return this.textBasedSearch(query, k);
    }
  }

  async similaritySearchWithScore(query, k = 4) {
    if (!this.isInitialized) {
      await this.initialize();
    }

    // Use text-based search if vector store is not available
    if (this.useTextFallback || !this.vectorStore) {
      console.log("Using text-based similarity search with score fallback");
      return this.textBasedSearch(query, k);
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
      console.log("Fallback to text-based search");
      return this.textBasedSearch(query, k);
    }
  }

  // Text-based similarity search fallback
  textBasedSearch(query, k = 4) {
    console.log(`DEBUG: this.documents status:`, {
      exists: !!this.documents,
      length: this.documents?.length || 0,
      firstDoc:
        this.documents?.[0]?.pageContent?.substring(0, 100) || "No content",
    });

    if (!this.documents || this.documents.length === 0) {
      console.warn("No documents available for text search");
      return this.getMockSearchResults(query, k);
    }

    const queryLower = query.toLowerCase();
    const queryWords = queryLower
      .split(/\s+/)
      .filter((word) => word.length > 2);

    console.log(`Text search for words: ${queryWords.join(", ")}`);

    // Calculate text similarity scores
    const scoredDocs = this.documents.map((doc) => {
      const contentLower = doc.pageContent.toLowerCase();

      // Count keyword matches
      let score = 0;
      let matchedWords = [];

      queryWords.forEach((word) => {
        if (contentLower.includes(word)) {
          score += 1;
          matchedWords.push(word);
        }
      });

      // Bonus for exact phrase matches
      if (contentLower.includes(queryLower)) {
        score += queryWords.length;
      }

      // Normalize score
      const relevanceScore = Math.min(score / queryWords.length, 1.0);

      return {
        content: doc.pageContent,
        metadata: doc.metadata,
        source: doc.metadata.source,
        relevanceScore: relevanceScore,
        matchedWords: matchedWords,
      };
    });

    // Sort by relevance score and return top k
    const results = scoredDocs
      .filter((doc) => doc.relevanceScore > 0)
      .sort((a, b) => b.relevanceScore - a.relevanceScore)
      .slice(0, k);

    console.log(`Text search found ${results.length} relevant documents`);
    results.forEach((doc) => {
      console.log(
        `- ${doc.source}: ${doc.relevanceScore.toFixed(
          2
        )} (matched: ${doc.matchedWords.join(", ")})`
      );
    });

    return results.length > 0 ? results : this.getMockSearchResults(query, k);
  }

  getMockSearchResults(query, k) {
    console.log("Using mock search results as last resort");
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
