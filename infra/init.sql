-- Initialize database for SDGs Health application
CREATE DATABASE IF NOT EXISTS sdgs_db;
USE sdgs_db;

-- Create consultations table
CREATE TABLE IF NOT EXISTS consultations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    patient_name VARCHAR(255) NOT NULL,
    symptoms TEXT NOT NULL,
    diagnosis TEXT NOT NULL,
    confidence DECIMAL(3,2) NOT NULL,
    image_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create index for faster queries
CREATE INDEX idx_created_at ON consultations(created_at);
CREATE INDEX idx_patient_name ON consultations(patient_name);

-- Insert some sample data for testing
INSERT INTO consultations (patient_name, symptoms, diagnosis, confidence, image_url) VALUES 
('John Doe', 'demam dan batuk', 'Kemungkinan infeksi (flu/demam). Istirahat & hidrasi.', 0.6, NULL),
('Jane Smith', 'nyeri dada', 'Gejala berbahaya. Segera cari layanan darurat.', 0.8, NULL),
('Bob Wilson', 'pilek ringan', 'Gejala saluran pernapasan atas. Monitor gejala lainnya.', 0.5, NULL);
