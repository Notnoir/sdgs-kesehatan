"use client";

import { useState, ChangeEvent, FormEvent } from "react";

interface DiagnoseResult {
  patient: string;
  symptoms: string;
  diagnosis: string;
  confidence: number;
  image?: string | null;
  timestamp: string;
}

export default function Home() {
  const [patientName, setPatientName] = useState<string>("");
  const [symptoms, setSymptoms] = useState<string>("");
  const [image, setImage] = useState<File | null>(null);
  const [result, setResult] = useState<DiagnoseResult | null>(null);

  const toBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (err) => reject(err);
    });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    let imageBase64: string | null = null;
    if (image) {
      imageBase64 = await toBase64(image);
    }

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
    const resp = await fetch(`${apiUrl}/api/diagnose`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ symptoms, imageBase64, patientName }),
    });

    const data: DiagnoseResult = await resp.json();
    setResult(data);
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setImage(e.target.files[0]);
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white rounded-xl shadow-md">
      <h1 className="text-2xl font-bold mb-4">Demo Telemedicine</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium">Nama Pasien</label>
          <input
            type="text"
            value={patientName}
            onChange={(e) => setPatientName(e.target.value)}
            className="w-full border p-2 rounded"
            placeholder="Opsional"
          />
        </div>

        <div>
          <label className="block font-medium">Deskripsikan Gejala</label>
          <textarea
            value={symptoms}
            onChange={(e) => setSymptoms(e.target.value)}
            rows={4}
            className="w-full border p-2 rounded"
          />
        </div>

        <div>
          <label className="block font-medium">Upload Foto (Opsional)</label>
          <input type="file" accept="image/*" onChange={handleFileChange} />
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Kirim
        </button>
      </form>

      {result && (
        <div className="mt-6 border-t pt-4">
          <h2 className="text-lg font-semibold">Hasil Diagnosa</h2>
          <p>
            <strong>Nama:</strong> {result.patient}
          </p>
          <p>
            <strong>Gejala:</strong> {result.symptoms}
          </p>
          <p>
            <strong>Diagnosis:</strong> {result.diagnosis}
          </p>
          <p>
            <strong>Confidence:</strong> {result.confidence}
          </p>
          {result.image && (
            <p>
              <strong>Gambar:</strong> {result.image}
            </p>
          )}
          <p className="text-sm text-gray-500">{result.timestamp}</p>
        </div>
      )}
    </div>
  );
}
