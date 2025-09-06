import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";

// Components
import Navigation from "./components/Navigation";
import DiagnosisPage from "./components/DiagnosisPage";
import ChatbotPage from "./components/ChatbotPage";
import ConsultationsPage from "./components/ConsultationsPage";

// Home page component
const HomePage: React.FC = () => (
  <div className="max-w-6xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
    <div className="text-center">
      <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl md:text-6xl">
        <span className="block">Sistem Diagnosis</span>
        <span className="block text-primary-600">Kesehatan Digital</span>
      </h1>
      <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
        Platform terintegrasi untuk diagnosis kesehatan menggunakan AI dan
        konsultasi virtual. Dapatkan analisis gejala yang akurat dan rekomendasi
        kesehatan yang tepat.
      </p>
    </div>

    <div className="mt-16">
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {/* Diagnosis Feature */}
        <div className="relative">
          <div className="bg-white overflow-hidden shadow-lg rounded-lg">
            <div className="px-6 py-8">
              <div className="text-center">
                <div className="text-6xl mb-4">🩺</div>
                <h3 className="text-lg font-medium text-gray-900">
                  Diagnosis Gejala
                </h3>
                <p className="mt-2 text-sm text-gray-500">
                  Analisis gejala yang Anda alami dengan AI untuk mendapatkan
                  diagnosis awal
                </p>
                <div className="mt-6">
                  <a
                    href="/diagnosis"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700"
                  >
                    Mulai Diagnosis
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Chatbot Feature */}
        <div className="relative">
          <div className="bg-white overflow-hidden shadow-lg rounded-lg">
            <div className="px-6 py-8">
              <div className="text-center">
                <div className="text-6xl mb-4">🤖</div>
                <h3 className="text-lg font-medium text-gray-900">
                  AI Chatbot
                </h3>
                <p className="mt-2 text-sm text-gray-500">
                  Konsultasi dengan chatbot AI untuk mendapatkan informasi
                  kesehatan
                </p>
                <div className="mt-6">
                  <a
                    href="/chatbot"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700"
                  >
                    Chat Sekarang
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Consultations History */}
        <div className="relative">
          <div className="bg-white overflow-hidden shadow-lg rounded-lg">
            <div className="px-6 py-8">
              <div className="text-center">
                <div className="text-6xl mb-4">📋</div>
                <h3 className="text-lg font-medium text-gray-900">
                  Riwayat Konsultasi
                </h3>
                <p className="mt-2 text-sm text-gray-500">
                  Lihat riwayat diagnosis dan rekomendasi kesehatan Anda
                </p>
                <div className="mt-6">
                  <a
                    href="/consultations"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700"
                  >
                    Lihat Riwayat
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    {/* Features Section */}
    <div className="mt-24">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900">Fitur Unggulan</h2>
        <p className="mt-4 text-lg text-gray-600">
          Platform komprehensif untuk kebutuhan diagnosis kesehatan digital
        </p>
      </div>

      <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
        <div className="text-center">
          <div className="text-4xl mb-3">⚡</div>
          <h3 className="text-lg font-medium text-gray-900">Cepat & Akurat</h3>
          <p className="mt-2 text-sm text-gray-500">
            Diagnosis dalam hitungan detik dengan akurasi tinggi
          </p>
        </div>

        <div className="text-center">
          <div className="text-4xl mb-3">🔒</div>
          <h3 className="text-lg font-medium text-gray-900">Aman & Privat</h3>
          <p className="mt-2 text-sm text-gray-500">
            Data kesehatan Anda dijamin aman dan terlindungi
          </p>
        </div>

        <div className="text-center">
          <div className="text-4xl mb-3">🎯</div>
          <h3 className="text-lg font-medium text-gray-900">Personal</h3>
          <p className="mt-2 text-sm text-gray-500">
            Rekomendasi yang disesuaikan dengan kondisi Anda
          </p>
        </div>

        <div className="text-center">
          <div className="text-4xl mb-3">📱</div>
          <h3 className="text-lg font-medium text-gray-900">24/7 Access</h3>
          <p className="mt-2 text-sm text-gray-500">
            Akses kapan saja, di mana saja melalui perangkat Anda
          </p>
        </div>
      </div>
    </div>
  </div>
);

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/diagnosis" element={<DiagnosisPage />} />
            <Route path="/chatbot" element={<ChatbotPage />} />
            <Route path="/consultations" element={<ConsultationsPage />} />
          </Routes>
        </main>

        {/* Footer */}
        <footer className="bg-white border-t border-gray-200">
          <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h3 className="text-lg font-medium text-gray-900">
                Sistem Diagnosis Kesehatan Digital
              </h3>
              <p className="mt-2 text-sm text-gray-500">
                Platform AI untuk diagnosis kesehatan yang akurat dan terpercaya
              </p>
              <div className="mt-4 text-xs text-gray-400">
                © 2024 SDGs Kesehatan. Semua hak dilindungi.
              </div>
            </div>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;
