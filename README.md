<div align="center">

# AI Recruitment System

Platform rekrutmen berbasis kecerdasan buatan untuk otomatisasi screening CV, pencocokan kandidat, dan manajemen posisi pekerjaan.

**[English](#english) | [Bahasa Indonesia](#bahasa-indonesia)**

</div>

---

<a id="english"></a>

## English

### Overview

AI Recruitment System is a web-based platform designed to streamline the hiring process for HR departments. The system leverages natural language processing and machine learning algorithms to automatically extract information from candidate resumes, analyze skills, and match candidates to job positions based on compatibility scores.

The platform consists of a React-based frontend and a Flask backend API, with integrated ML components for document processing and candidate matching. It provides a comprehensive dashboard for HR users to manage candidates, job postings, and view analytics.

## Key Features

**Document Processing**
- Upload and parse CV documents in PDF, DOCX, and TXT formats
- Automatic extraction of candidate information including personal details, education, work experience, and skills
- Text analysis using NLP to identify and categorize technical and soft skills

**Intelligent Matching**
- Machine learning-based algorithm to calculate compatibility scores between candidates and job positions
- Multi-factor matching considering skills, experience, education, and job requirements
- Ranking system to prioritize the most suitable candidates

**Candidate Management**
- Centralized database of all candidates with search and filter capabilities
- Detailed candidate profiles with extracted information and match scores
- CV file storage and management

**Job Position Management**
- Create and manage job postings with detailed requirements
- Define required skills, experience levels, and qualifications
- Track applications and matches for each position

**Analytics Dashboard**
- Overview statistics including total candidates, job positions, and matches
- Visual charts and graphs for data analysis
- Performance metrics and insights

**Security**
- JWT-based authentication system
- Role-based access control
- Secure file upload and storage

## Technology Stack

**Frontend**
- React 19.2 - UI framework
- React Router - Navigation and routing
- Axios - HTTP client for API communication
- Chart.js - Data visualization

**Backend**
- Python 3.9+ - Programming language
- Flask - Web framework
- SQLAlchemy - ORM for database operations
- PostgreSQL / SQLite - Database systems

**Machine Learning & NLP**
- spaCy - Natural language processing
- scikit-learn - Machine learning algorithms
- TF-IDF and cosine similarity for text matching

**Additional Libraries**
- PyPDF2 - PDF document parsing
- python-docx - DOCX document parsing
- Flask-JWT-Extended - Authentication
- Flask-CORS - Cross-origin resource sharing

## Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (version 16 or higher)
- npm (comes with Node.js)
- Python (version 3.9 or higher)
- pip (Python package manager)

### Installation

**1. Clone the repository**

```bash
git clone https://github.com/alvinandakurniawann/ai-recruitment.git
cd ai-recruitment
```

**2. Frontend Setup**

Navigate to the project root and install dependencies:

```bash
npm install
```

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Edit `.env` and set your backend API URL:

```
REACT_APP_API_URL=http://localhost:5000
```

Start the development server:

```bash
npm start
```

The frontend will be available at `http://localhost:3000`

**3. Backend Setup**

Navigate to the backend directory:

```bash
cd backend
```

Create a virtual environment:

```bash
python -m venv venv
```

Activate the virtual environment:
- Windows: `venv\Scripts\activate`
- Linux/Mac: `source venv/bin/activate`

Install Python dependencies:

```bash
pip install -r requirements.txt
```

Download the spaCy language model:

```bash
python -m spacy download en_core_web_sm
```

Create a `.env` file in the backend directory:

```bash
cp .env.example .env
```

Edit `backend/.env` with your configuration:

```
FLASK_ENV=development
SECRET_KEY=your-random-secret-key-here
JWT_SECRET_KEY=your-random-jwt-secret-key-here
DATABASE_URL=sqlite:///recruitment.db
MAX_FILE_SIZE=5242880
UPLOAD_FOLDER=uploads
CORS_ORIGINS=http://localhost:3000
```

Initialize the database:

```bash
python init_db.py
```

Run the backend server:

```bash
python app.py
```

The backend API will be available at `http://localhost:5000`

## Project Structure

```
ai-recruitment/
├── backend/
│   ├── models/              # Database models (SQLAlchemy)
│   │   ├── candidate.py
│   │   ├── job_position.py
│   │   ├── match_result.py
│   │   └── user.py
│   ├── services/            # Business logic layer
│   │   ├── candidate_service.py
│   │   ├── cv_parser_service.py
│   │   ├── job_service.py
│   │   └── matching_service.py
│   ├── ml/                  # Machine learning components
│   │   ├── matching_engine.py
│   │   ├── skill_analyzer.py
│   │   └── text_extractor.py
│   ├── routes/              # API endpoints
│   │   ├── auth_routes.py
│   │   ├── candidate_routes.py
│   │   ├── job_routes.py
│   │   ├── matching_routes.py
│   │   └── dashboard_routes.py
│   ├── utils/               # Helper functions
│   │   ├── auth_decorators.py
│   │   ├── db_init.py
│   │   └── file_validators.py
│   ├── uploads/             # Uploaded CV files
│   ├── app.py               # Flask application entry point
│   ├── config.py            # Configuration settings
│   ├── init_db.py           # Database initialization
│   └── requirements.txt     # Python dependencies
├── src/
│   ├── components/          # Reusable React components
│   │   ├── Login.js
│   │   ├── Register.js
│   │   ├── Navbar.js
│   │   └── ProtectedRoute.js
│   ├── pages/               # Page components
│   │   ├── Dashboard.js
│   │   ├── CandidateList.js
│   │   ├── CandidateDetail.js
│   │   ├── JobList.js
│   │   ├── JobForm.js
│   │   ├── JobDetail.js
│   │   └── UploadCV.js
│   ├── services/            # API service functions
│   │   ├── api.js
│   │   ├── authAPI.js
│   │   ├── candidateAPI.js
│   │   ├── jobAPI.js
│   │   └── dashboardAPI.js
│   ├── context/            # React context providers
│   │   └── AuthContext.js
│   ├── App.js              # Main application component
│   └── index.js            # Application entry point
├── public/                 # Static assets
└── package.json           # Node.js dependencies
```

## API Documentation

The backend provides a RESTful API with the following endpoints:

### Authentication
- `POST /api/auth/register` - Register a new user account
- `POST /api/auth/login` - Authenticate and receive JWT token
- `POST /api/auth/refresh` - Refresh JWT token

### Candidates
- `POST /api/candidates/upload` - Upload a CV file for processing
- `GET /api/candidates` - Retrieve list of all candidates
- `GET /api/candidates/:id` - Get detailed information about a specific candidate
- `DELETE /api/candidates/:id` - Remove a candidate from the system

### Job Positions
- `POST /api/jobs` - Create a new job posting
- `GET /api/jobs` - Retrieve list of all job positions
- `GET /api/jobs/:id` - Get detailed information about a specific job
- `PUT /api/jobs/:id` - Update an existing job posting
- `DELETE /api/jobs/:id` - Remove a job posting

### Matching
- `POST /api/matching/calculate/:candidate_id` - Calculate match scores for a candidate against all jobs
- `GET /api/matching/job/:job_id` - Get all candidates matched to a specific job with scores

### Dashboard
- `GET /api/dashboard/stats` - Get overview statistics
- `GET /api/dashboard/analytics` - Get analytics data for charts

All endpoints require JWT authentication except for registration and login.

## Environment Variables

### Frontend (.env)

```
REACT_APP_API_URL=http://localhost:5000
```

### Backend (backend/.env)

```
FLASK_ENV=development
SECRET_KEY=your-secret-key-here
JWT_SECRET_KEY=your-jwt-secret-key-here
DATABASE_URL=sqlite:///recruitment.db
MAX_FILE_SIZE=5242880
UPLOAD_FOLDER=uploads
CORS_ORIGINS=http://localhost:3000
```

For production, use PostgreSQL and set appropriate CORS origins.

## Deployment

The application can be deployed using various free hosting services:

**Frontend**
- Vercel (recommended) - Automatic deployments from GitHub
- Netlify - Similar to Vercel with good free tier

**Backend**
- Render.com - Free tier available with PostgreSQL
- Railway.app - $5 free credit per month
- PythonAnywhere - Free tier for Python applications

**Database**
- Render PostgreSQL (free tier)
- Railway PostgreSQL (included with Railway)
- Supabase (free tier available)

See the deployment documentation for detailed setup instructions.

## Development

### Running Tests

```bash
# Frontend tests
npm test

# Backend tests (when implemented)
cd backend
pytest
```

### Building for Production

```bash
# Frontend build
npm run build

# The build folder will contain optimized production files
```

## Contributing

Contributions are welcome. Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.

</div>

---

<a id="bahasa-indonesia"></a>

## Bahasa Indonesia

### Ringkasan

AI Recruitment System adalah platform berbasis web yang dirancang untuk menyederhanakan proses rekrutmen bagi departemen HR. Sistem ini memanfaatkan natural language processing dan algoritma machine learning untuk secara otomatis mengekstrak informasi dari resume kandidat, menganalisis keterampilan, dan mencocokkan kandidat dengan posisi pekerjaan berdasarkan skor kompatibilitas.

Platform terdiri dari frontend berbasis React dan backend API Flask, dengan komponen ML terintegrasi untuk pemrosesan dokumen dan pencocokan kandidat. Sistem menyediakan dashboard komprehensif untuk pengguna HR untuk mengelola kandidat, lowongan pekerjaan, dan melihat analitik.

## Fitur Utama

**Pemrosesan Dokumen**
- Upload dan parsing dokumen CV dalam format PDF, DOCX, dan TXT
- Ekstraksi otomatis informasi kandidat termasuk data pribadi, pendidikan, pengalaman kerja, dan keterampilan
- Analisis teks menggunakan NLP untuk mengidentifikasi dan mengkategorikan keterampilan teknis dan soft skills

**Pencocokan Cerdas**
- Algoritma berbasis machine learning untuk menghitung skor kompatibilitas antara kandidat dan posisi pekerjaan
- Pencocokan multi-faktor yang mempertimbangkan keterampilan, pengalaman, pendidikan, dan persyaratan pekerjaan
- Sistem peringkat untuk memprioritaskan kandidat yang paling sesuai

**Manajemen Kandidat**
- Database terpusat dari semua kandidat dengan kemampuan pencarian dan filter
- Profil kandidat detail dengan informasi yang diekstrak dan skor kecocokan
- Penyimpanan dan manajemen file CV

**Manajemen Posisi Pekerjaan**
- Membuat dan mengelola lowongan pekerjaan dengan persyaratan detail
- Mendefinisikan keterampilan yang dibutuhkan, tingkat pengalaman, dan kualifikasi
- Melacak aplikasi dan kecocokan untuk setiap posisi

**Dashboard Analitik**
- Statistik ringkasan termasuk total kandidat, posisi pekerjaan, dan kecocokan
- Grafik dan diagram visual untuk analisis data
- Metrik kinerja dan wawasan

**Keamanan**
- Sistem autentikasi berbasis JWT
- Kontrol akses berbasis peran
- Upload dan penyimpanan file yang aman

## Teknologi yang Digunakan

**Frontend**
- React 19.2 - Framework UI
- React Router - Navigasi dan routing
- Axios - HTTP client untuk komunikasi API
- Chart.js - Visualisasi data

**Backend**
- Python 3.9+ - Bahasa pemrograman
- Flask - Web framework
- SQLAlchemy - ORM untuk operasi database
- PostgreSQL / SQLite - Sistem database

**Machine Learning & NLP**
- spaCy - Natural language processing
- scikit-learn - Algoritma machine learning
- TF-IDF dan cosine similarity untuk pencocokan teks

**Library Tambahan**
- PyPDF2 - Parsing dokumen PDF
- python-docx - Parsing dokumen DOCX
- Flask-JWT-Extended - Autentikasi
- Flask-CORS - Cross-origin resource sharing

## Memulai

### Prasyarat

Sebelum memulai, pastikan Anda telah menginstal:
- Node.js (versi 16 atau lebih tinggi)
- npm (termasuk dengan Node.js)
- Python (versi 3.9 atau lebih tinggi)
- pip (package manager Python)

### Instalasi

**1. Clone repository**

```bash
git clone https://github.com/alvinandakurniawann/ai-recruitment.git
cd ai-recruitment
```

**2. Setup Frontend**

Masuk ke root project dan install dependencies:

```bash
npm install
```

Buat file `.env` di root directory:

```bash
cp .env.example .env
```

Edit `.env` dan set URL backend API Anda:

```
REACT_APP_API_URL=http://localhost:5000
```

Jalankan development server:

```bash
npm start
```

Frontend akan tersedia di `http://localhost:3000`

**3. Setup Backend**

Masuk ke direktori backend:

```bash
cd backend
```

Buat virtual environment:

```bash
python -m venv venv
```

Aktifkan virtual environment:
- Windows: `venv\Scripts\activate`
- Linux/Mac: `source venv/bin/activate`

Install dependencies Python:

```bash
pip install -r requirements.txt
```

Download model bahasa spaCy:

```bash
python -m spacy download en_core_web_sm
```

Buat file `.env` di direktori backend:

```bash
cp .env.example .env
```

Edit `backend/.env` dengan konfigurasi Anda:

```
FLASK_ENV=development
SECRET_KEY=kunci-rahasia-acak-anda
JWT_SECRET_KEY=kunci-jwt-rahasia-acak-anda
DATABASE_URL=sqlite:///recruitment.db
MAX_FILE_SIZE=5242880
UPLOAD_FOLDER=uploads
CORS_ORIGINS=http://localhost:3000
```

Inisialisasi database:

```bash
python init_db.py
```

Jalankan server backend:

```bash
python app.py
```

Backend API akan tersedia di `http://localhost:5000`

## Struktur Project

```
ai-recruitment/
├── backend/
│   ├── models/              # Model database (SQLAlchemy)
│   │   ├── candidate.py
│   │   ├── job_position.py
│   │   ├── match_result.py
│   │   └── user.py
│   ├── services/            # Layer logika bisnis
│   │   ├── candidate_service.py
│   │   ├── cv_parser_service.py
│   │   ├── job_service.py
│   │   └── matching_service.py
│   ├── ml/                  # Komponen machine learning
│   │   ├── matching_engine.py
│   │   ├── skill_analyzer.py
│   │   └── text_extractor.py
│   ├── routes/              # Endpoint API
│   │   ├── auth_routes.py
│   │   ├── candidate_routes.py
│   │   ├── job_routes.py
│   │   ├── matching_routes.py
│   │   └── dashboard_routes.py
│   ├── utils/               # Fungsi helper
│   │   ├── auth_decorators.py
│   │   ├── db_init.py
│   │   └── file_validators.py
│   ├── uploads/             # File CV yang diupload
│   ├── app.py               # Entry point aplikasi Flask
│   ├── config.py            # Pengaturan konfigurasi
│   ├── init_db.py           # Inisialisasi database
│   └── requirements.txt     # Dependencies Python
├── src/
│   ├── components/          # Komponen React yang dapat digunakan kembali
│   │   ├── Login.js
│   │   ├── Register.js
│   │   ├── Navbar.js
│   │   └── ProtectedRoute.js
│   ├── pages/               # Komponen halaman
│   │   ├── Dashboard.js
│   │   ├── CandidateList.js
│   │   ├── CandidateDetail.js
│   │   ├── JobList.js
│   │   ├── JobForm.js
│   │   ├── JobDetail.js
│   │   └── UploadCV.js
│   ├── services/            # Fungsi layanan API
│   │   ├── api.js
│   │   ├── authAPI.js
│   │   ├── candidateAPI.js
│   │   ├── jobAPI.js
│   │   └── dashboardAPI.js
│   ├── context/             # Provider context React
│   │   └── AuthContext.js
│   ├── App.js              # Komponen aplikasi utama
│   └── index.js            # Entry point aplikasi
├── public/                 # Asset statis
└── package.json           # Dependencies Node.js
```

## Dokumentasi API

Backend menyediakan RESTful API dengan endpoint berikut:

### Autentikasi
- `POST /api/auth/register` - Mendaftarkan akun pengguna baru
- `POST /api/auth/login` - Autentikasi dan menerima token JWT
- `POST /api/auth/refresh` - Refresh token JWT

### Kandidat
- `POST /api/candidates/upload` - Upload file CV untuk diproses
- `GET /api/candidates` - Mengambil daftar semua kandidat
- `GET /api/candidates/:id` - Mendapatkan informasi detail tentang kandidat tertentu
- `DELETE /api/candidates/:id` - Menghapus kandidat dari sistem

### Posisi Pekerjaan
- `POST /api/jobs` - Membuat lowongan pekerjaan baru
- `GET /api/jobs` - Mengambil daftar semua posisi pekerjaan
- `GET /api/jobs/:id` - Mendapatkan informasi detail tentang pekerjaan tertentu
- `PUT /api/jobs/:id` - Memperbarui lowongan pekerjaan yang ada
- `DELETE /api/jobs/:id` - Menghapus lowongan pekerjaan

### Pencocokan
- `POST /api/matching/calculate/:candidate_id` - Menghitung skor kecocokan untuk kandidat terhadap semua pekerjaan
- `GET /api/matching/job/:job_id` - Mendapatkan semua kandidat yang cocok dengan pekerjaan tertentu beserta skornya

### Dashboard
- `GET /api/dashboard/stats` - Mendapatkan statistik ringkasan
- `GET /api/dashboard/analytics` - Mendapatkan data analitik untuk grafik

Semua endpoint memerlukan autentikasi JWT kecuali untuk registrasi dan login.

## Variabel Environment

### Frontend (.env)

```
REACT_APP_API_URL=http://localhost:5000
```

### Backend (backend/.env)

```
FLASK_ENV=development
SECRET_KEY=kunci-rahasia-anda
JWT_SECRET_KEY=kunci-jwt-rahasia-anda
DATABASE_URL=sqlite:///recruitment.db
MAX_FILE_SIZE=5242880
UPLOAD_FOLDER=uploads
CORS_ORIGINS=http://localhost:3000
```

Untuk production, gunakan PostgreSQL dan set CORS origins yang sesuai.

## Deployment

Aplikasi dapat di-deploy menggunakan berbagai layanan hosting gratis:

**Frontend**
- Vercel (direkomendasikan) - Deployment otomatis dari GitHub
- Netlify - Mirip dengan Vercel dengan free tier yang baik

**Backend**
- Render.com - Free tier tersedia dengan PostgreSQL
- Railway.app - $5 kredit gratis per bulan
- PythonAnywhere - Free tier untuk aplikasi Python

**Database**
- Render PostgreSQL (free tier)
- Railway PostgreSQL (termasuk dengan Railway)
- Supabase (free tier tersedia)

Lihat dokumentasi deployment untuk instruksi setup detail.

## Development

### Menjalankan Test

```bash
# Test frontend
npm test

# Test backend (ketika diimplementasikan)
cd backend
pytest
```

### Build untuk Production

```bash
# Build frontend
npm run build

# Folder build akan berisi file production yang dioptimalkan
```

## Kontribusi

Kontribusi dipersilakan. Silakan kirim Pull Request.

## Lisensi

Project ini dilisensikan di bawah MIT License.

</div>
