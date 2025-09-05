// backend/index.js
const mysql = require("mysql2/promise");

// Use localhost instead of mysql hostname for local development
const db = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASS || "",
  database: process.env.DB_NAME || "sdgs_db",
});

require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");

const app = express();
app.use(cors());
app.use(bodyParser.json({ limit: "5mb" }));

// Simple S3 client (for MinIO or AWS)
const s3 = new S3Client({
  region: process.env.AWS_REGION || "us-east-1",
  endpoint: process.env.S3_ENDPOINT || undefined, // e.g., http://minio:9000 for local
  forcePathStyle: process.env.S3_ENDPOINT ? true : false,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || "minioadmin",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "minioadmin",
  },
});

async function uploadToS3(BufferData, key) {
  const bucket = process.env.S3_BUCKET || "app-bucket";
  await s3.send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: BufferData,
    })
  );
  return `s3://${bucket}/${key}`;
}

// Simple rule-based diagnosa (demo)
const rules = [
  {
    keywords: ["demam", "panas"],
    diagnosis:
      "Kemungkinan infeksi (flu/demam). Istirahat & hidrasi. Jika >38.5°C atau gejala parah, konsultasi dokter.",
  },
  {
    keywords: ["batuk", "pilek"],
    diagnosis:
      "Gejala saluran pernapasan atas (batuk/pilek). Perhatikan napas pendek atau demam tinggi.",
  },
  {
    keywords: ["nyeri dada", "sesak"],
    diagnosis: "Gejala berbahaya. Segera cari layanan darurat.",
  },
];

function simpleDiagnose(text) {
  const lower = text.toLowerCase();
  for (const r of rules) {
    for (const k of r.keywords) {
      if (lower.includes(k)) return { diagnosis: r.diagnosis, confidence: 0.6 };
    }
  }
  return {
    diagnosis: "Tidak cukup data — sarankan konsultasi lanjutan.",
    confidence: 0.3,
  };
}

app.post("/api/diagnose", async (req, res) => {
  try {
    const { symptoms, imageBase64, patientName } = req.body;
    if (!symptoms) return res.status(400).json({ error: "symptoms required" });

    let imageUrl = null;
    if (imageBase64) {
      try {
        const match = imageBase64.match(/^data:(.+);base64,(.+)$/);
        const b64 = match ? match[2] : imageBase64;
        const buffer = Buffer.from(b64, "base64");
        const key = `uploads/${Date.now()}_${(patientName || "anon").replace(
          /\s+/g,
          "_"
        )}.jpg`;
        imageUrl = await uploadToS3(buffer, key);
      } catch (s3Error) {
        console.warn(
          "S3 upload failed, continuing without image:",
          s3Error.message
        );
        imageUrl = null;
      }
    }

    const result = simpleDiagnose(symptoms);

    // Generate a temporary ID for testing
    const tempId = Date.now();

    // Try to save to DB, but continue even if it fails
    let insertId = tempId;
    try {
      const [insert] = await db.execute(
        `INSERT INTO consultations (patient_name, symptoms, diagnosis, confidence, image_url) VALUES (?, ?, ?, ?, ?)`,
        [
          patientName || "Anon",
          symptoms,
          result.diagnosis,
          result.confidence,
          imageUrl,
        ]
      );
      insertId = insert.insertId;
    } catch (dbError) {
      console.warn(
        "Database not available, using temporary ID:",
        dbError.message
      );
    }

    const response = {
      id: insertId,
      patient: patientName || "Anon",
      symptoms,
      diagnosis: result.diagnosis,
      confidence: result.confidence,
      image: imageUrl,
      timestamp: new Date().toISOString(),
    };
    res.json(response);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "server error" });
  }
});

app.get("/api/consultations", async (req, res) => {
  try {
    const [rows] = await db.execute(
      `SELECT id, patient_name, symptoms, diagnosis, confidence, image_url, created_at 
       FROM consultations ORDER BY created_at DESC LIMIT 20`
    );
    res.json(rows);
  } catch (err) {
    console.warn("Database not available for consultations:", err.message);
    // Return empty array when database is not available
    res.json([]);
  }
});

// Health check endpoint for Docker
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok", timestamp: new Date().toISOString() });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Backend listening on ${PORT}`));
