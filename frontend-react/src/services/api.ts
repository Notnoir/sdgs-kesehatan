import axios from "axios";
import {
  DiagnosisRequest,
  DiagnosisResponse,
  Consultation,
  ChatResponse,
} from "../types/api";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:4000";
const CHATBOT_BASE_URL =
  process.env.REACT_APP_CHATBOT_URL || "http://localhost:4000";

// Create axios instances
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

const chatbotApi = axios.create({
  baseURL: CHATBOT_BASE_URL,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

// API functions
export const apiService = {
  // Health check
  healthCheck: async () => {
    const response = await api.get("/health");
    return response.data;
  },

  // Diagnosis
  submitDiagnosis: async (
    data: DiagnosisRequest
  ): Promise<DiagnosisResponse> => {
    const response = await api.post("/api/diagnose", data);

    // Ensure the response has the expected structure
    const diagnosis = response.data;
    return {
      id: diagnosis.id || Date.now().toString(),
      symptoms: diagnosis.symptoms || data.symptoms,
      diagnosis: diagnosis.diagnosis || "Diagnosis tidak tersedia",
      recommendations: Array.isArray(diagnosis.recommendations)
        ? diagnosis.recommendations
        : ["Konsultasikan dengan dokter untuk pemeriksaan lebih lanjut"],
      severity: diagnosis.severity || "medium",
      createdAt: diagnosis.createdAt || new Date().toISOString(),
    };
  },

  // Consultations
  getConsultations: async (): Promise<Consultation[]> => {
    const response = await api.get("/api/consultations");
    const consultations = Array.isArray(response.data) ? response.data : [];

    // Ensure each consultation has the expected structure
    return consultations.map((consultation: any) => ({
      id: consultation.id || Date.now().toString(),
      symptoms: consultation.symptoms || "Tidak ada gejala tercatat",
      diagnosis: consultation.diagnosis || "Tidak ada diagnosis tersedia",
      recommendations: Array.isArray(consultation.recommendations)
        ? consultation.recommendations
        : ["Konsultasikan dengan dokter untuk pemeriksaan lebih lanjut"],
      severity: consultation.severity || "medium",
      createdAt: consultation.createdAt || new Date().toISOString(),
      updatedAt:
        consultation.updatedAt ||
        consultation.createdAt ||
        new Date().toISOString(),
    }));
  },

  // Upload image
  uploadImage: async (file: File, additionalData?: any) => {
    const formData = new FormData();
    formData.append("image", file);
    if (additionalData) {
      Object.keys(additionalData).forEach((key) => {
        formData.append(key, additionalData[key]);
      });
    }

    const response = await api.post("/api/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },
};

export const chatbotService = {
  // Health check
  healthCheck: async () => {
    const response = await chatbotApi.get("/health");
    return response.data;
  },

  // Chat
  sendMessage: async (
    message: string,
    sessionId?: string
  ): Promise<ChatResponse> => {
    const response = await chatbotApi.post("/api/chat", {
      message,
      sessionId: sessionId || "default",
    });
    return response.data;
  },

  // Get status
  getStatus: async () => {
    const response = await chatbotApi.get("/api/status");
    return response.data;
  },

  // Upload document
  uploadDocument: async (file: File, uploadedBy?: string) => {
    const formData = new FormData();
    formData.append("document", file);
    if (uploadedBy) {
      formData.append("uploadedBy", uploadedBy);
    }

    const response = await chatbotApi.post("/api/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  // Search documents
  searchDocuments: async (query: string, limit: number = 5) => {
    const response = await chatbotApi.post("/api/search", {
      query,
      limit,
    });
    return response.data;
  },
};

export default api;
