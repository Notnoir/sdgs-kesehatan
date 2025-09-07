// RAG Document Processor
const fs = require("fs").promises;
const path = require("path");
const pdfParse = require("pdf-parse");
const mammoth = require("mammoth");
const { RecursiveCharacterTextSplitter } = require("langchain/text_splitter");

class DocumentProcessor {
  constructor() {
    this.textSplitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 200,
      separators: ["\n\n", "\n", ". ", " ", ""],
    });
  }

  async processDocument(filePath) {
    const ext = path.extname(filePath).toLowerCase();
    let content = "";

    try {
      switch (ext) {
        case ".txt":
          content = await fs.readFile(filePath, "utf-8");
          break;
        case ".pdf":
          const pdfBuffer = await fs.readFile(filePath);
          const pdfData = await pdfParse(pdfBuffer);
          content = pdfData.text;
          break;
        case ".docx":
          const docxBuffer = await fs.readFile(filePath);
          const docxResult = await mammoth.extractRawText({
            buffer: docxBuffer,
          });
          content = docxResult.value;
          break;
        default:
          throw new Error(`Unsupported file type: ${ext}`);
      }

      // Split the document into chunks
      const chunks = await this.textSplitter.splitText(content);

      return {
        filePath,
        filename: path.basename(filePath),
        content,
        chunks,
        metadata: {
          source: filePath,
          type: ext,
          processedAt: new Date().toISOString(),
          chunkCount: chunks.length,
        },
      };
    } catch (error) {
      console.error(`Error processing document ${filePath}:`, error);
      throw error;
    }
  }

  async processDirectory(dirPath) {
    const results = [];

    try {
      const files = await fs.readdir(dirPath);

      for (const file of files) {
        const filePath = path.join(dirPath, file);
        const stat = await fs.stat(filePath);

        if (stat.isFile() && this.isSupportedFile(file)) {
          try {
            const result = await this.processDocument(filePath);
            results.push(result);
            console.log(`Processed: ${file} (${result.chunks.length} chunks)`);
          } catch (error) {
            console.error(`Failed to process ${file}:`, error.message);
          }
        }
      }

      return results;
    } catch (error) {
      console.error(`Error reading directory ${dirPath}:`, error);
      throw error;
    }
  }

  isSupportedFile(filename) {
    const supportedExtensions = [".txt", ".pdf", ".docx"];
    const ext = path.extname(filename).toLowerCase();
    return supportedExtensions.includes(ext);
  }

  async createSampleDocuments() {
    const documentsDir = path.join(__dirname, "documents");

    // Ensure documents directory exists
    try {
      await fs.access(documentsDir);
    } catch {
      await fs.mkdir(documentsDir, { recursive: true });
    }

    // Create sample health documents
    const sampleDocs = [
      {
        filename: "gaya_hidup_sehat.txt",
        content: `Panduan Gaya Hidup Sehat

Pentingnya Pola Makan Sehat:
- Konsumsi makanan bergizi seimbang dengan proporsi karbohidrat, protein, lemak sehat, vitamin, dan mineral
- Makan buah dan sayuran minimal 5 porsi per hari dengan variasi warna untuk mendapatkan antioksidan
- Batasi konsumsi gula, garam, dan lemak jenuh
- Minum air putih minimal 8 gelas per hari untuk menjaga hidrasi tubuh
- Hindari makanan olahan dan fast food yang tinggi kalori namun rendah nutrisi

Olahraga dan Aktivitas Fisik:
- Lakukan aktivitas fisik minimal 150 menit per minggu dengan intensitas sedang
- Kombinasikan latihan kardio, kekuatan, dan fleksibilitas
- Mulai dengan aktivitas ringan seperti jalan kaki 30 menit per hari
- Lakukan peregangan setiap hari untuk menjaga fleksibilitas
- Hindari gaya hidup sedentari, bergerak setiap 30 menit saat bekerja

Istirahat dan Tidur:
- Tidur 7-9 jam per malam untuk dewasa
- Jaga konsistensi waktu tidur dan bangun
- Ciptakan lingkungan tidur yang nyaman, gelap, dan sejuk
- Hindari penggunaan gadget 1 jam sebelum tidur
- Lakukan rutinitas relaksasi sebelum tidur

Manajemen Stres:
- Praktikkan teknik relaksasi seperti meditasi atau pernapasan dalam
- Lakukan hobi yang menyenangkan secara rutin
- Jaga hubungan sosial yang positif
- Kelola waktu dengan baik untuk menghindari tekanan berlebihan
- Cari bantuan profesional jika mengalami stres kronis

Pemeriksaan Kesehatan Rutin:
- Lakukan check-up kesehatan secara berkala
- Pantau tekanan darah, gula darah, dan kolesterol
- Lakukan vaksinasi sesuai jadwal
- Periksakan gigi minimal 6 bulan sekali
- Konsultasi dengan dokter untuk program pencegahan penyakit`,
      },
      {
        filename: "penyakit_umum.txt",
        content: `Informasi Penyakit Umum dan Pencegahannya

Influenza (Flu):
Gejala: Demam, batuk, pilek, sakit kepala, nyeri otot, kelelahan
Pencegahan: Vaksinasi tahunan, cuci tangan teratur, hindari kontak dengan penderita
Pengobatan: Istirahat, minum banyak cairan, obat pereda nyeri, antiviral jika diperlukan
Kapan ke dokter: Demam tinggi >39°C, sesak napas, gejala memburuk setelah 3 hari

Diabetes Mellitus:
Gejala: Sering haus, sering buang air kecil, penurunan berat badan, kelelahan
Pencegahan: Pola makan sehat, olahraga teratur, jaga berat badan ideal
Pengelolaan: Kontrol gula darah, diet khusus, obat diabetes, insulin jika diperlukan
Komplikasi: Penyakit jantung, stroke, gagal ginjal, kerusakan mata

Hipertensi (Tekanan Darah Tinggi):
Gejala: Sering tidak ada gejala, kadang sakit kepala, pusing, sesak napas
Pencegahan: Diet rendah garam, olahraga, hindari stres, batasi alkohol
Pengelolaan: Obat antihipertensi, perubahan gaya hidup, monitoring rutin
Target: Tekanan darah <140/90 mmHg atau <130/80 mmHg untuk risiko tinggi

Gastritis (Radang Lambung):
Gejala: Nyeri perut bagian atas, mual, muntah, perut kembung, kehilangan nafsu makan
Pencegahan: Makan teratur, hindari makanan pedas dan asam, kelola stres
Pengobatan: Obat antasida, PPI (proton pump inhibitor), diet lambung
Komplikasi: Tukak lambung, perdarahan saluran cerna

Migrain:
Gejala: Sakit kepala berdenyut satu sisi, mual, sensitif cahaya dan suara
Pencegahan: Hindari pemicu (stres, kurang tidur, makanan tertentu), olahraga teratur
Pengobatan: Obat pereda nyeri, triptan, obat pencegahan untuk kasus berat
Manajemen: Istirahat di tempat gelap dan tenang, kompres dingin`,
      },
      {
        filename: "panduan_kesehatan.txt",
        content: `Panduan Kesehatan Komprehensif

Sistem Imun dan Pencegahan Penyakit:
- Vaksinasi lengkap sesuai jadwal imunisasi
- Konsumsi makanan kaya vitamin C dan D
- Olahraga teratur untuk meningkatkan daya tahan tubuh
- Tidur cukup untuk regenerasi sistem imun
- Kelola stres yang dapat menurunkan imunitas
- Hindari merokok dan konsumsi alkohol berlebihan

Kesehatan Mental:
- Kenali tanda-tanda depresi dan kecemasan
- Jaga keseimbangan work-life balance
- Lakukan aktivitas yang memberikan kepuasan
- Bangun hubungan sosial yang sehat
- Praktikkan mindfulness dan gratitude
- Cari bantuan profesional jika diperlukan

Kesehatan Reproduksi:
- Pemeriksaan rutin untuk deteksi dini kanker serviks dan payudara
- Praktik seks yang aman
- Perencanaan kehamilan yang baik
- Edukasi tentang kontrasepsi
- Vaksinasi HPV untuk pencegahan kanker serviks

Kesehatan Anak:
- Imunisasi lengkap sesuai jadwal
- ASI eksklusif 6 bulan pertama
- Stimulasi tumbuh kembang yang tepat
- Monitoring pertumbuhan dan perkembangan
- Pencegahan kecelakaan dan trauma
- Deteksi dini gangguan perkembangan

Kesehatan Lansia:
- Pemeriksaan kesehatan rutin lebih sering
- Monitoring fungsi kognitif
- Pencegahan jatuh dan trauma
- Aktivitas fisik yang disesuaikan
- Nutrisi yang tepat untuk usia lanjut
- Dukungan sosial dan psikologis

Tanda Bahaya yang Memerlukan Pertolongan Medis Segera:
- Nyeri dada yang hebat
- Sesak napas berat
- Pingsan atau penurunan kesadaran
- Perdarahan hebat
- Demam tinggi dengan ruam
- Nyeri perut hebat
- Stroke (wajah perot, bicara pelo, kelemahan lengan)
- Kejang
- Reaksi alergi berat`,
      },
    ];

    for (const doc of sampleDocs) {
      const filePath = path.join(documentsDir, doc.filename);
      try {
        await fs.writeFile(filePath, doc.content, "utf-8");
        console.log(`Created sample document: ${doc.filename}`);
      } catch (error) {
        console.error(`Error creating ${doc.filename}:`, error);
      }
    }

    return documentsDir;
  }
}

module.exports = DocumentProcessor;
