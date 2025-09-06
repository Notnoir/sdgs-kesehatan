import React, { useState, useEffect } from "react";
import { apiService } from "../services/api";
import { Consultation } from "../types/api";

const ConsultationsPage: React.FC = () => {
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    loadConsultations();
  }, []);

  const loadConsultations = async () => {
    setIsLoading(true);
    setError("");

    try {
      const data = await apiService.getConsultations();
      setConsultations(Array.isArray(data) ? data : []);
    } catch (err: any) {
      console.error("Error loading consultations:", err);
      setError(err.response?.data?.error || "Gagal memuat riwayat konsultasi");
      setConsultations([]); // Ensure consultations is always an array
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high":
        return "text-red-600 bg-red-50 border-red-200";
      case "medium":
        return "text-yellow-600 bg-yellow-50 border-yellow-200";
      case "low":
        return "text-green-600 bg-green-50 border-green-200";
      default:
        return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  const getSeverityLabel = (severity: string) => {
    switch (severity) {
      case "high":
        return "Tinggi";
      case "medium":
        return "Sedang";
      case "low":
        return "Rendah";
      default:
        return severity;
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Riwayat Konsultasi</h1>
        <p className="mt-2 text-gray-600">
          Lihat riwayat diagnosis dan rekomendasi kesehatan Anda.
        </p>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <span className="text-red-400">⚠️</span>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error</h3>
              <p className="text-sm text-red-700 mt-1">{error}</p>
            </div>
            <div className="ml-auto">
              <button
                onClick={loadConsultations}
                className="text-sm text-red-600 hover:text-red-500"
              >
                Coba Lagi
              </button>
            </div>
          </div>
        </div>
      )}

      {consultations.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📋</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Belum Ada Riwayat Konsultasi
          </h3>
          <p className="text-gray-600 mb-6">
            Mulai diagnosis pertama Anda untuk melihat riwayat di sini.
          </p>
          <a
            href="/"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700"
          >
            Mulai Diagnosis
          </a>
        </div>
      ) : (
        <div className="space-y-6">
          {Array.isArray(consultations) &&
            consultations.map((consultation) => (
              <div
                key={consultation.id}
                className="bg-white shadow-lg rounded-lg p-6 border border-gray-200"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">
                        Konsultasi #{consultation.id}
                      </h3>
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-medium rounded-full border ${getSeverityColor(
                          consultation.severity
                        )}`}
                      >
                        {getSeverityLabel(consultation.severity)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">
                      {formatDate(consultation.createdAt)}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">
                      Gejala:
                    </h4>
                    <p className="text-gray-900 text-sm bg-gray-50 p-3 rounded-md">
                      {consultation.symptoms}
                    </p>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">
                      Diagnosis:
                    </h4>
                    <p className="text-gray-900 text-sm bg-blue-50 p-3 rounded-md">
                      {consultation.diagnosis}
                    </p>
                  </div>
                </div>

                <div className="mt-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">
                    Rekomendasi:
                  </h4>
                  <ul className="list-disc list-inside space-y-1 text-sm text-gray-900 bg-green-50 p-3 rounded-md">
                    {consultation.recommendations &&
                    consultation.recommendations.length > 0 ? (
                      consultation.recommendations.map((rec, index) => (
                        <li key={index}>{rec}</li>
                      ))
                    ) : (
                      <li>Tidak ada rekomendasi tersedia</li>
                    )}
                  </ul>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>Dibuat: {formatDate(consultation.createdAt)}</span>
                    {consultation.updatedAt !== consultation.createdAt && (
                      <span>
                        Diperbarui: {formatDate(consultation.updatedAt)}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}

          {/* Load More Button (if needed in the future) */}
          <div className="text-center py-6">
            <p className="text-sm text-gray-500">
              Menampilkan{" "}
              {Array.isArray(consultations) ? consultations.length : 0}{" "}
              konsultasi
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConsultationsPage;
