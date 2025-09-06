import React, { useState } from "react";
import { apiService } from "../services/api";
import { DiagnosisRequest, DiagnosisResponse } from "../types/api";

const DiagnosisPage: React.FC = () => {
  const [formData, setFormData] = useState<DiagnosisRequest>({
    symptoms: "",
    duration: "",
    severity: "",
    age: undefined,
    gender: "",
    additionalInfo: "",
  });
  const [image, setImage] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<DiagnosisResponse | null>(null);
  const [error, setError] = useState<string>("");

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "age" ? (value ? parseInt(value) : undefined) : value,
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setResult(null);

    try {
      // Upload image if exists
      if (image) {
        await apiService.uploadImage(image, { symptoms: formData.symptoms });
      }

      // Submit diagnosis
      const response = await apiService.submitDiagnosis(formData);
      setResult(response);
    } catch (err: any) {
      setError(
        err.response?.data?.error ||
          "Terjadi kesalahan saat memproses diagnosis"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high":
        return "text-red-600 bg-red-50";
      case "medium":
        return "text-yellow-600 bg-yellow-50";
      case "low":
        return "text-green-600 bg-green-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Diagnosis Kesehatan
        </h1>
        <p className="mt-2 text-gray-600">
          Masukkan gejala yang Anda alami untuk mendapatkan rekomendasi awal.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Form */}
        <div className="bg-white shadow-lg rounded-lg p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="symptoms"
                className="block text-sm font-medium text-gray-700"
              >
                Gejala yang Dialami *
              </label>
              <textarea
                id="symptoms"
                name="symptoms"
                required
                rows={4}
                value={formData.symptoms}
                onChange={handleInputChange}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"
                placeholder="Contoh: demam, sakit kepala, batuk..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="duration"
                  className="block text-sm font-medium text-gray-700"
                >
                  Durasi
                </label>
                <select
                  id="duration"
                  name="duration"
                  value={formData.duration}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="">Pilih durasi</option>
                  <option value="< 1 hari">Kurang dari 1 hari</option>
                  <option value="1-3 hari">1-3 hari</option>
                  <option value="4-7 hari">4-7 hari</option>
                  <option value="> 1 minggu">Lebih dari 1 minggu</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="severity"
                  className="block text-sm font-medium text-gray-700"
                >
                  Tingkat Keparahan
                </label>
                <select
                  id="severity"
                  name="severity"
                  value={formData.severity}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="">Pilih tingkat</option>
                  <option value="ringan">Ringan</option>
                  <option value="sedang">Sedang</option>
                  <option value="berat">Berat</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="age"
                  className="block text-sm font-medium text-gray-700"
                >
                  Usia
                </label>
                <input
                  type="number"
                  id="age"
                  name="age"
                  min="0"
                  max="120"
                  value={formData.age || ""}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Masukkan usia"
                />
              </div>

              <div>
                <label
                  htmlFor="gender"
                  className="block text-sm font-medium text-gray-700"
                >
                  Jenis Kelamin
                </label>
                <select
                  id="gender"
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="">Pilih jenis kelamin</option>
                  <option value="pria">Pria</option>
                  <option value="wanita">Wanita</option>
                </select>
              </div>
            </div>

            <div>
              <label
                htmlFor="additionalInfo"
                className="block text-sm font-medium text-gray-700"
              >
                Informasi Tambahan
              </label>
              <textarea
                id="additionalInfo"
                name="additionalInfo"
                rows={3}
                value={formData.additionalInfo}
                onChange={handleInputChange}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"
                placeholder="Riwayat penyakit, obat yang dikonsumsi, dll."
              />
            </div>

            <div>
              <label
                htmlFor="image"
                className="block text-sm font-medium text-gray-700"
              >
                Upload Gambar (Opsional)
              </label>
              <input
                type="file"
                id="image"
                accept="image/*"
                onChange={handleImageChange}
                className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading || !formData.symptoms.trim()}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Memproses...
                </div>
              ) : (
                "Analisis Gejala"
              )}
            </button>
          </form>
        </div>

        {/* Results */}
        <div className="space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <span className="text-red-400">⚠️</span>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">Error</h3>
                  <p className="text-sm text-red-700 mt-1">{error}</p>
                </div>
              </div>
            </div>
          )}

          {result && (
            <div className="bg-white shadow-lg rounded-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Hasil Diagnosis
              </h2>

              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-700">Gejala:</h3>
                  <p className="text-gray-900">{result.symptoms}</p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-700">
                    Diagnosis Awal:
                  </h3>
                  <p className="text-gray-900">{result.diagnosis}</p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-700">
                    Tingkat Keparahan:
                  </h3>
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getSeverityColor(
                      result.severity
                    )}`}
                  >
                    {result.severity === "high"
                      ? "Tinggi"
                      : result.severity === "medium"
                      ? "Sedang"
                      : "Rendah"}
                  </span>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-700">
                    Rekomendasi:
                  </h3>
                  <ul className="list-disc list-inside space-y-1 text-gray-900">
                    {result.recommendations &&
                    result.recommendations.length > 0 ? (
                      result.recommendations.map((rec, index) => (
                        <li key={index}>{rec}</li>
                      ))
                    ) : (
                      <li>Tidak ada rekomendasi tersedia</li>
                    )}
                  </ul>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
                  <p className="text-sm text-yellow-800">
                    <strong>Disclaimer:</strong> Hasil ini adalah rekomendasi
                    awal dan tidak menggantikan konsultasi dengan dokter. Segera
                    hubungi tenaga medis profesional untuk diagnosis dan
                    pengobatan yang tepat.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DiagnosisPage;
