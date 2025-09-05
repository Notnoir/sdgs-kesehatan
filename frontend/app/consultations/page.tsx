"use client";

import { useEffect, useState } from "react";

interface Consultation {
  id: number;
  patient_name: string;
  symptoms: string;
  diagnosis: string;
  confidence: number;
  image_url?: string;
  created_at: string;
}

export default function Consultations() {
  const [data, setData] = useState<Consultation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
    fetch(`${apiUrl}/api/consultations`)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then((rows) => {
        // Ensure rows is an array
        if (Array.isArray(rows)) {
          setData(rows);
        } else {
          console.error("API response is not an array:", rows);
          setData([]);
          setError("Invalid data format received from server");
        }
      })
      .catch((err) => {
        console.error("Failed to fetch consultations:", err);
        setError(
          "Failed to load consultations. Please check if the backend is running."
        );
        setData([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white rounded-xl shadow-md">
      <h1 className="text-2xl font-bold mb-4">Daftar Konsultasi</h1>

      {loading && <p className="text-gray-600">Loading consultations...</p>}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded p-4 mb-4">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {!loading && !error && data.length === 0 && (
        <p className="text-gray-600">No consultations found.</p>
      )}

      {!loading && !error && data.length > 0 && (
        <ul className="space-y-4">
          {data.map((c) => (
            <li key={c.id} className="border p-3 rounded">
              <p>
                <strong>Nama:</strong> {c.patient_name}
              </p>
              <p>
                <strong>Gejala:</strong> {c.symptoms}
              </p>
              <p>
                <strong>Diagnosis:</strong> {c.diagnosis}
              </p>
              <p>
                <strong>Confidence:</strong> {c.confidence}
              </p>
              {c.image_url && (
                <p>
                  <strong>Image:</strong> {c.image_url}
                </p>
              )}
              <p className="text-sm text-gray-500">{c.created_at}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
