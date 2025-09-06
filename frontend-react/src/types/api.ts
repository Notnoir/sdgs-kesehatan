// API Types
export interface DiagnosisRequest {
  symptoms: string;
  duration?: string;
  severity?: string;
  age?: number;
  gender?: string;
  additionalInfo?: string;
}

export interface DiagnosisResponse {
  id: string;
  symptoms: string;
  diagnosis: string;
  recommendations: string[];
  severity: "low" | "medium" | "high";
  createdAt: string;
}

export interface Consultation {
  id: string;
  symptoms: string;
  diagnosis: string;
  recommendations: string[];
  severity: "low" | "medium" | "high";
  createdAt: string;
  updatedAt: string;
}

export interface ChatMessage {
  id: string;
  type: "user" | "assistant";
  content: string;
  timestamp: string;
}

export interface ChatResponse {
  answer: string;
  sources: string[];
  relevantDocs: any[];
  followUpQuestions: string[];
  sessionId: string;
  contextualizedQuestion?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
