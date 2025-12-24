# AI Recruitment System - Database Schema Documentation

## 📊 Database Overview

**Database Type:** SQLite (Development) / PostgreSQL (Production)
**ORM:** SQLAlchemy
**Total Tables:** 4

---

## 🗂️ Database Schema

### **Entity Relationship Diagram (ERD)**

```
┌─────────────────┐
│     USERS       │
│─────────────────│
│ id (PK)         │
│ email           │◄──────┐
│ password_hash   │       │
│ role            │       │ created_by (FK)
│ created_at      │       │
│ updated_at      │       │
└─────────────────┘       │
                          │
                          │
┌─────────────────┐       │
│   CANDIDATES    │       │
│─────────────────│       │
│ id (PK)         │       │
│ name            │       │
│ email           │       │
│ phone           │       │
│ raw_cv_text     │       │
│ education       │       │
│ experience      │       │
│ skills          │       │
│ certifications  │       │
│ total_exp_years │       │
│ status          │       │
│ created_at      │       │
│ updated_at      │       │
└────────┬────────┘       │
         │                │
         │ candidate_id   │
         │ (FK)           │
         │                │
         ▼                │
┌─────────────────┐       │
│ MATCH_RESULTS   │       │
│─────────────────│       │
│ id (PK)         │       │
│ candidate_id FK │       │
│ job_id FK       │◄──────┤
│ match_score     │       │
│ skill_match     │       │
│ exp_match       │       │
│ edu_match       │       │
│ status          │       │
│ screening_notes │       │
│ calculated_at   │       │
└─────────────────┘       │
         ▲                │
         │ job_id (FK)    │
         │                │
┌────────┴────────┐       │
│  JOB_POSITIONS  │       │
│─────────────────│       │
│ id (PK)         │       │
│ title           │       │
│ description     │       │
│ required_skills │       │
│ preferred_skills│       │
│ min_exp_years   │       │
│ education_level │       │
│ is_active       │       │
│ created_by FK   ├───────┘
│ created_at      │
│ updated_at      │
└─────────────────┘
```

---

## 📋 Table Details

### **1. USERS Table**

**Purpose:** Menyimpan data user HR dan Admin untuk authentication

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | VARCHAR(36) | PRIMARY KEY | UUID user |
| `email` | VARCHAR(255) | UNIQUE, NOT NULL, INDEXED | Email login |
| `password_hash` | VARCHAR(255) | NOT NULL | Password ter-hash (bcrypt) |
| `role` | VARCHAR(20) | NOT NULL, DEFAULT 'HR' | Role: 'Admin' atau 'HR' |
| `created_at` | DATETIME | NOT NULL | Timestamp pembuatan |
| `updated_at` | DATETIME | NOT NULL | Timestamp update terakhir |

**Relationships:**
- `job_positions` → One-to-Many dengan JobPosition (creator)

**Indexes:**
- PRIMARY KEY: `id`
- UNIQUE INDEX: `email`

**Sample Data:**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "email": "admin@recruitment.com",
  "password_hash": "$2b$12$...",
  "role": "Admin",
  "created_at": "2024-01-15T10:30:00",
  "updated_at": "2024-01-15T10:30:00"
}
```

**Security:**
- Password di-hash menggunakan bcrypt (12 rounds)
- Password asli TIDAK pernah disimpan
- JWT token untuk authentication

---

### **2. CANDIDATES Table**

**Purpose:** Menyimpan data kandidat dan hasil parsing CV

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | VARCHAR(36) | PRIMARY KEY | UUID kandidat |
| `name` | VARCHAR(255) | NULL | Nama lengkap |
| `email` | VARCHAR(255) | UNIQUE, INDEXED | Email kandidat |
| `phone` | VARCHAR(50) | NULL | Nomor telepon |
| `raw_cv_text` | TEXT | NULL | Text mentah dari CV |
| `education` | JSON | NULL | Array education objects |
| `experience` | JSON | NULL | Array experience objects |
| `skills` | JSON | NULL | Array skill objects |
| `certifications` | JSON | NULL | Array certification strings |
| `total_experience_years` | INTEGER | DEFAULT 0 | Total tahun pengalaman |
| `status` | VARCHAR(20) | NOT NULL, INDEXED | Status: 'processing', 'completed', 'failed' |
| `created_at` | DATETIME | NOT NULL | Timestamp upload CV |
| `updated_at` | DATETIME | NOT NULL | Timestamp update terakhir |

**Relationships:**
- `match_results` → One-to-Many dengan MatchResult

**Indexes:**
- PRIMARY KEY: `id`
- UNIQUE INDEX: `email`
- INDEX: `status`

**JSON Field Structures:**

**education (JSON Array):**
```json
[
  {
    "degree": "Bachelor's in Computer Science",
    "institution": "MIT",
    "year": 2015
  },
  {
    "degree": "Master's in AI",
    "institution": "Stanford",
    "year": 2017
  }
]
```

**experience (JSON Array):**
```json
[
  {
    "title": "Senior Python Developer",
    "company": "Tech Corp",
    "duration": "2018-Present",
    "description": "Developed RESTful APIs using Flask"
  }
]
```

**skills (JSON Array):**
```json
[
  {
    "name": "Python",
    "category": "programming_languages",
    "score": 95.0,
    "years": 6
  },
  {
    "name": "Flask",
    "category": "frameworks",
    "score": 90.0,
    "years": 5
  }
]
```

**certifications (JSON Array):**
```json
["AWS Certified Developer", "Google Cloud Professional"]
```

**Sample Complete Record:**
```json
{
  "id": "c1234567-89ab-cdef-0123-456789abcdef",
  "name": "John Smith",
  "email": "john.smith@email.com",
  "phone": "+1-555-0101",
  "raw_cv_text": "JOHN SMITH\nSenior Python Developer...",
  "education": [...],
  "experience": [...],
  "skills": [...],
  "certifications": [...],
  "total_experience_years": 6,
  "status": "completed",
  "created_at": "2024-01-15T14:20:00",
  "updated_at": "2024-01-15T14:25:00"
}
```

---

### **3. JOB_POSITIONS Table**

**Purpose:** Menyimpan data lowongan pekerjaan dan requirements

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | VARCHAR(36) | PRIMARY KEY | UUID job position |
| `title` | VARCHAR(255) | NOT NULL | Judul posisi |
| `description` | TEXT | NOT NULL | Deskripsi lengkap job |
| `required_skills` | JSON | NULL | Array required skill strings |
| `preferred_skills` | JSON | NULL | Array preferred skill strings |
| `min_experience_years` | INTEGER | DEFAULT 0 | Minimum tahun pengalaman |
| `education_level` | VARCHAR(100) | NULL | Level pendidikan required |
| `is_active` | BOOLEAN | NOT NULL, INDEXED | Status aktif/non-aktif |
| `created_by` | VARCHAR(36) | FOREIGN KEY → users.id | User yang membuat job |
| `created_at` | DATETIME | NOT NULL | Timestamp pembuatan |
| `updated_at` | DATETIME | NOT NULL | Timestamp update terakhir |

**Relationships:**
- `creator` → Many-to-One dengan User
- `match_results` → One-to-Many dengan MatchResult

**Indexes:**
- PRIMARY KEY: `id`
- INDEX: `is_active`
- FOREIGN KEY: `created_by` → `users.id`

**JSON Field Structures:**

**required_skills (JSON Array):**
```json
["Python", "Flask", "REST API", "SQL"]
```

**preferred_skills (JSON Array):**
```json
["Docker", "AWS", "Redis", "Celery"]
```

**Sample Record:**
```json
{
  "id": "j1234567-89ab-cdef-0123-456789abcdef",
  "title": "Senior Python Developer",
  "description": "We are looking for an experienced Python developer...",
  "required_skills": ["Python", "Flask", "REST API", "SQL"],
  "preferred_skills": ["Docker", "AWS", "Redis"],
  "min_experience_years": 5,
  "education_level": "Bachelor's",
  "is_active": true,
  "created_by": "550e8400-e29b-41d4-a716-446655440000",
  "created_at": "2024-01-10T09:00:00",
  "updated_at": "2024-01-10T09:00:00"
}
```

---

### **4. MATCH_RESULTS Table**

**Purpose:** Menyimpan hasil matching kandidat dengan job position

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | VARCHAR(36) | PRIMARY KEY | UUID match result |
| `candidate_id` | VARCHAR(36) | FOREIGN KEY → candidates.id, INDEXED | ID kandidat |
| `job_id` | VARCHAR(36) | FOREIGN KEY → job_positions.id, INDEXED | ID job position |
| `match_score` | FLOAT | NOT NULL, INDEXED | Overall match score (0-100) |
| `skill_match_score` | FLOAT | NOT NULL | Skill compatibility (0-100) |
| `experience_match_score` | FLOAT | NOT NULL | Experience level match (0-100) |
| `education_match_score` | FLOAT | NOT NULL | Education level match (0-100) |
| `status` | VARCHAR(30) | NOT NULL, INDEXED | Qualification status |
| `screening_notes` | TEXT | NULL | AI-generated screening notes |
| `calculated_at` | DATETIME | NOT NULL | Timestamp perhitungan |

**Relationships:**
- `candidate` → Many-to-One dengan Candidate
- `job_position` → Many-to-One dengan JobPosition

**Indexes:**
- PRIMARY KEY: `id`
- INDEX: `candidate_id`
- INDEX: `job_id`
- INDEX: `match_score`
- INDEX: `status`
- COMPOSITE INDEX: `(job_id, match_score)` - untuk query "top candidates for job"
- COMPOSITE INDEX: `(candidate_id, match_score)` - untuk query "best jobs for candidate"

**Status Values:**
- `"Qualified"` - Memenuhi semua requirements
- `"Potentially Qualified"` - Mendekati requirements
- `"Not Qualified"` - Tidak memenuhi requirements

**Sample Record:**
```json
{
  "id": "m1234567-89ab-cdef-0123-456789abcdef",
  "candidate_id": "c1234567-89ab-cdef-0123-456789abcdef",
  "job_id": "j1234567-89ab-cdef-0123-456789abcdef",
  "match_score": 88.5,
  "skill_match_score": 92.0,
  "experience_match_score": 90.0,
  "education_match_score": 80.0,
  "status": "Qualified",
  "screening_notes": "Excellent match. Strong Python and Flask experience...",
  "calculated_at": "2024-01-15T15:00:00"
}
```

---

## 🔗 Relationships Summary

```
User (1) ──────< (N) JobPosition
                      │
                      │
                      ▼
Candidate (1) ──────< (N) MatchResult >────── (N) JobPosition
```

**Relationship Details:**

1. **User → JobPosition** (One-to-Many)
   - Satu user bisa membuat banyak job positions
   - Foreign Key: `job_positions.created_by` → `users.id`
   - Cascade: DELETE (hapus user = hapus semua job positions-nya)

2. **Candidate → MatchResult** (One-to-Many)
   - Satu kandidat bisa punya banyak match results (untuk berbagai jobs)
   - Foreign Key: `match_results.candidate_id` → `candidates.id`
   - Cascade: DELETE (hapus kandidat = hapus semua match results-nya)

3. **JobPosition → MatchResult** (One-to-Many)
   - Satu job position bisa punya banyak match results (untuk berbagai kandidat)
   - Foreign Key: `match_results.job_id` → `job_positions.id`
   - Cascade: DELETE (hapus job = hapus semua match results-nya)

---

## 📈 Database Statistics (Sample Data)

Setelah menjalankan `python init_db.py --seed`:

| Table | Records | Description |
|-------|---------|-------------|
| users | 2 | 1 Admin + 1 HR |
| candidates | 3 | 3 sample candidates |
| job_positions | 3 | 3 active job positions |
| match_results | 4 | 4 calculated matches |

---

## 🔍 Common Queries

### **1. Get All Qualified Candidates for a Job**
```sql
SELECT c.*, mr.match_score, mr.status
FROM candidates c
JOIN match_results mr ON c.id = mr.candidate_id
WHERE mr.job_id = 'job-uuid-here'
  AND mr.status = 'Qualified'
ORDER BY mr.match_score DESC;
```

### **2. Get Top 10 Skills Across All Candidates**
```sql
-- This requires JSON extraction (SQLite/PostgreSQL specific)
-- In application code, this is done in dashboard_service.py
```

### **3. Get Experience Distribution**
```sql
SELECT 
  CASE 
    WHEN total_experience_years <= 2 THEN '0-2 years'
    WHEN total_experience_years <= 5 THEN '3-5 years'
    WHEN total_experience_years <= 10 THEN '6-10 years'
    WHEN total_experience_years <= 15 THEN '11-15 years'
    ELSE '16+ years'
  END as experience_range,
  COUNT(*) as count
FROM candidates
WHERE status = 'completed'
GROUP BY experience_range;
```

### **4. Get Average Match Score by Job**
```sql
SELECT 
  jp.title,
  AVG(mr.match_score) as avg_score,
  COUNT(mr.id) as total_matches
FROM job_positions jp
LEFT JOIN match_results mr ON jp.id = mr.job_id
WHERE jp.is_active = true
GROUP BY jp.id, jp.title
ORDER BY avg_score DESC;
```

---

## 🛠️ Database Initialization

### **Create Database:**
```bash
cd backend
python init_db.py
```

### **Create Database with Sample Data:**
```bash
python init_db.py --seed
```

### **Reset Database (Drop All Tables):**
```bash
python init_db.py --reset
```

---

## 🔐 Security Considerations

### **Password Security:**
- ✅ Passwords hashed dengan bcrypt (12 rounds)
- ✅ Salt unique per user
- ✅ Password asli TIDAK pernah disimpan
- ✅ Hash tidak reversible

### **Data Privacy:**
- ✅ Email candidates unique (tidak duplikat)
- ✅ Raw CV text disimpan untuk re-processing
- ✅ Sensitive data bisa di-encrypt (future enhancement)

### **Access Control:**
- ✅ Role-based access (Admin vs HR)
- ✅ JWT token untuk authentication
- ✅ Foreign key constraints untuk data integrity

---

## 📊 Database Size Estimates

**Per Record Size (Approximate):**

| Table | Size per Record | Notes |
|-------|----------------|-------|
| users | ~500 bytes | Small, mostly text |
| candidates | ~5-50 KB | Depends on CV size |
| job_positions | ~2-5 KB | Depends on description |
| match_results | ~1-2 KB | Mostly numeric + notes |

**Estimated Database Size:**

| Records | Database Size |
|---------|--------------|
| 100 candidates, 20 jobs | ~1-5 MB |
| 1,000 candidates, 100 jobs | ~10-50 MB |
| 10,000 candidates, 500 jobs | ~100-500 MB |

**SQLite is suitable for:**
- ✅ Development
- ✅ Small deployments (<10,000 candidates)
- ✅ Single-server applications

**PostgreSQL recommended for:**
- ✅ Production
- ✅ Large deployments (>10,000 candidates)
- ✅ Multi-server applications
- ✅ Better JSON query performance

---

## 🔄 Migration Path

### **SQLite → PostgreSQL:**

1. Export data dari SQLite
2. Update `DATABASE_URL` di `.env`:
   ```
   DATABASE_URL=postgresql://user:password@host:port/dbname
   ```
3. Run migrations:
   ```bash
   python init_db.py
   ```
4. Import data ke PostgreSQL

**No code changes required!** SQLAlchemy handles database differences.

---

## 📝 Notes

- **UUID vs Auto-increment:** Menggunakan UUID untuk better scalability dan security
- **JSON Fields:** Flexible schema untuk skills, education, experience
- **Soft Delete:** `is_active` flag untuk job positions (tidak hard delete)
- **Timestamps:** Semua tables punya `created_at` dan `updated_at` untuk audit trail
- **Indexes:** Optimized untuk common queries (by email, status, match_score)

---

## 🎯 Database Performance Tips

1. **Index Usage:**
   - Email lookups: INDEXED
   - Status filtering: INDEXED
   - Match score sorting: INDEXED

2. **JSON Query Optimization:**
   - PostgreSQL: Use JSONB instead of JSON
   - Add GIN indexes on JSON columns for better search

3. **Query Optimization:**
   - Use `lazy='dynamic'` for large relationships
   - Paginate results (limit/offset)
   - Use `select_related` untuk avoid N+1 queries

4. **Caching:**
   - Cache dashboard statistics (Redis)
   - Cache skill taxonomy
   - Cache match results (invalidate on update)

