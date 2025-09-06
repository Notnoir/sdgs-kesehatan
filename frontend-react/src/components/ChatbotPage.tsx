import React, { useState, useEffect } from "react";
import { chatbotService } from "../services/api";
import { ChatMessage, ChatResponse } from "../types/api";

const ChatbotPage: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId] = useState(() => `session_${Date.now()}`);
  const [chatbotStatus, setChatbotStatus] = useState<any>(null);
  const [followUpQuestions, setFollowUpQuestions] = useState<string[]>([]);

  useEffect(() => {
    // Load chatbot status on mount
    loadChatbotStatus();

    // Add welcome message
    setMessages([
      {
        id: `msg_${Date.now()}`,
        type: "assistant",
        content:
          "Halo! Saya asisten AI kesehatan. Apa yang bisa saya bantu hari ini?",
        timestamp: new Date().toISOString(),
      },
    ]);
  }, []);

  const loadChatbotStatus = async () => {
    try {
      const status = await chatbotService.getStatus();
      setChatbotStatus(status);
    } catch (error) {
      console.error("Failed to load chatbot status:", error);
    }
  };

  const sendMessage = async (message: string) => {
    if (!message.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: `msg_${Date.now()}`,
      type: "user",
      content: message,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");
    setIsLoading(true);

    try {
      const response: ChatResponse = await chatbotService.sendMessage(
        message,
        sessionId
      );

      const assistantMessage: ChatMessage = {
        id: `msg_${Date.now() + 1}`,
        type: "assistant",
        content: response.answer,
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
      setFollowUpQuestions(response.followUpQuestions || []);
    } catch (error: any) {
      const errorMessage: ChatMessage = {
        id: `msg_${Date.now() + 1}`,
        type: "assistant",
        content: "Maaf, terjadi kesalahan. Silakan coba lagi nanti.",
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(inputMessage);
  };

  const handleFollowUpClick = (question: string) => {
    sendMessage(question);
    setFollowUpQuestions([]);
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          AI Assistant Kesehatan
        </h1>
        <p className="mt-2 text-gray-600">
          Tanyakan tentang gejala, penyakit, atau tips kesehatan kepada asisten
          AI kami.
        </p>

        {chatbotStatus && (
          <div className="mt-4 bg-blue-50 border border-blue-200 rounded-md p-3">
            <div className="flex items-center text-sm text-blue-800">
              <span className="mr-2">
                {chatbotStatus.mockMode ? "🧪" : "🤖"}
              </span>
              <span>
                Status: {chatbotStatus.mockMode ? "Mode Testing" : "Online"} |
                Provider: {chatbotStatus.llmProvider} | Dokumen:{" "}
                {chatbotStatus.totalDocuments || 0}
              </span>
            </div>
          </div>
        )}
      </div>

      <div className="bg-white shadow-lg rounded-lg flex flex-col h-[600px]">
        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.type === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-xs lg:max-w-md xl:max-w-lg px-4 py-3 rounded-lg ${
                  message.type === "user"
                    ? "bg-primary-600 text-white"
                    : "bg-gray-100 text-gray-900"
                }`}
              >
                <p className="text-sm">{message.content}</p>
                <p
                  className={`text-xs mt-1 ${
                    message.type === "user"
                      ? "text-primary-100"
                      : "text-gray-500"
                  }`}
                >
                  {formatTimestamp(message.timestamp)}
                </p>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-gray-100 px-4 py-3 rounded-lg">
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Follow-up Questions */}
        {followUpQuestions.length > 0 && (
          <div className="px-6 py-3 border-t border-gray-200 bg-gray-50">
            <p className="text-sm font-medium text-gray-700 mb-2">
              Pertanyaan yang mungkin Anda maksud:
            </p>
            <div className="flex flex-wrap gap-2">
              {followUpQuestions.map((question, index) => (
                <button
                  key={index}
                  onClick={() => handleFollowUpClick(question)}
                  className="text-xs px-3 py-1 bg-primary-100 text-primary-700 rounded-full hover:bg-primary-200 transition-colors"
                >
                  {question}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input Form */}
        <div className="p-6 border-t border-gray-200">
          <form onSubmit={handleSubmit} className="flex space-x-4">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Ketik pertanyaan Anda..."
              className="flex-1 border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading || !inputMessage.trim()}
              className="px-6 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "..." : "Kirim"}
            </button>
          </form>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <button
          onClick={() => sendMessage("Apa gejala demam berdarah?")}
          className="p-4 text-left bg-white shadow rounded-lg hover:shadow-md transition-shadow"
        >
          <div className="text-primary-600 font-medium">
            Gejala Demam Berdarah
          </div>
          <div className="text-sm text-gray-600">
            Tanyakan tentang gejala DBD
          </div>
        </button>

        <button
          onClick={() =>
            sendMessage("Bagaimana cara menjaga kesehatan jantung?")
          }
          className="p-4 text-left bg-white shadow rounded-lg hover:shadow-md transition-shadow"
        >
          <div className="text-primary-600 font-medium">
            Tips Kesehatan Jantung
          </div>
          <div className="text-sm text-gray-600">
            Pelajari cara menjaga jantung
          </div>
        </button>

        <button
          onClick={() => sendMessage("Apa yang harus dilakukan saat demam?")}
          className="p-4 text-left bg-white shadow rounded-lg hover:shadow-md transition-shadow"
        >
          <div className="text-primary-600 font-medium">Penanganan Demam</div>
          <div className="text-sm text-gray-600">Tips mengatasi demam</div>
        </button>
      </div>
    </div>
  );
};

export default ChatbotPage;
