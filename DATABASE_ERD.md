# Database Entity Relationship Diagram (ERD)

## 📊 Visual ERD - AI Recruitment System

### **Detailed ERD with All Fields**

```
┌─────────────────────────────────────────────────────────────┐
│                          USERS                              │
├─────────────────────────────────────────────────────────────┤
│ 🔑 id                    VARCHAR(36)    PRIMARY KEY         │
│ 📧 email                 VARCHAR(255)   UNIQUE, NOT NULL    │
│ 🔒 password_hash         VARCHAR(255)   NOT NULL            │
│ 👤 role                  VARCHAR(20)    NOT NULL            │
│    ├─ 'Admin'                                               │
│    └─ 'HR'                                                  │
│ 📅 created_at            DATETIME       NOT NULL            │
│ 📅 updated_at            DATETIME       NOT NULL            │
└─────────────────────────────────────────────────────────────┘
                              │
                              │ created_by (FK)
                              │ One-to-Many
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                      JOB_POSITIONS                          │
├─────────────────────────────────────────────────────────────┤
│ 🔑 id                    VARCHAR(36)    PRIMARY KEY         │
│ 📝 title                 VARCHAR(255)   NOT NULL            │
│ 📄 description           TEXT           NOT NULL            │
│ 🎯 required_skills       JSON           NULL                │
│    └─ ["Python", "Flask", "SQL"]                           │
│ ⭐ preferred_skills      JSON           NULL                │
│    └─ ["Docker", "AWS", "Redis"]                           │
│ 📊 min_experience_years  INTEGER        DEFAULT 0           │
│ 🎓 education_level       VARCHAR(100)   NULL                │
│    ├─ "High School"                                         │
│    ├─ "Bachelor's"                                          │
│    ├─ "Master's"                                            │
│    └─ "PhD"                                                 │
│ ✅ is_active             BOOLEAN        NOT NULL            │
│ 👤 created_by            VARCHAR(36)    FOREIGN KEY         │
│ 📅 created_at            DATETIME       NOT NULL            │
│ 📅 updated_at            DATETIME       NOT NULL            │
└─────────────────────────────────────────────────────────────┘
                              │
                              │ job_id (FK)
                              │ One-to-Many
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                      MATCH_RESULTS                          │
├─────────────────────────────────────────────────────────────┤
│ 🔑 id                    VARCHAR(36)    PRIMARY KEY         │
│ 👤 candidate_id          VARCHAR(36)    FOREIGN KEY         │
│ 💼 job_id                VARCHAR(36)    FOREIGN KEY         │
│ 📊 match_score           FLOAT          NOT NULL            │
│    └─ Overall score (0-100)                                │
│ 🎯 skill_match_score     FLOAT          NOT NULL            │
│    └─ Skill compatibility (0-100)                          │
│ 📈 experience_match_score FLOAT         NOT NULL            │
│    └─ Experience level match (0-100)                       │
│ 🎓 education_match_score FLOAT          NOT NULL            │
│    └─ Education level match (0-100)                        │
│ ✅ status                VARCHAR(30)    NOT NULL            │
│    ├─ "Qualified"                                           │
│    ├─ "Potentially Qualified"                              │
│    └─ "Not Qualified"                                       │
│ 📝 screening_notes       TEXT           NULL                │
│ 📅 calculated_at         DATETIME       NOT NULL            │
└─────────────────────────────────────────────────────────────┘
                              ▲
                              │ candidate_id (FK)
                              │ One-to-Many
┌─────────────────────────────────────────────────────────────┐
│                        CANDIDATES                           │
├─────────────────────────────────────────────────────────────┤
│ 🔑 id                    VARCHAR(36)    PRIMARY KEY         │
│ 👤 name                  VARCHAR(255)   NULL                │
│ 📧 email                 VARCHAR(255)   UNIQUE              │
│ 📞 phone                 VARCHAR(50)    NULL                │
│ 📄 raw_cv_text           TEXT           NULL                │
│ 🎓 education             JSON           NULL                │
│    └─ [{"degree": "Bachelor's", "institution": "MIT",      │
│         "year": 2015}]                                      │
│ 💼 experience            JSON           NULL                │
│    └─ [{"title": "Senior Dev", "company": "Tech Corp",     │
│         "duration": "2018-Present",                         │
│         "description": "..."}]                              │
│ 🎯 skills                JSON           NULL                │
│    └─ [{"name": "Python", "category": "programming",       │
│         "score": 95.0, "years": 6}]                        │
│ 🏆 certifications        JSON           NULL                │
│    └─ ["AWS Certified", "Google Cloud"]                    │
│ 📊 total_experience_years INTEGER       DEFAULT 0           │
│ ⚙️  status               VARCHAR(20)    NOT NULL            │
│    ├─ "processing"                                          │
│    ├─ "completed"                                           │
│    └─ "failed"                                              │
│ 📅 created_at            DATETIME       NOT NULL            │
│ 📅 updated_at            DATETIME       NOT NULL            │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔗 Relationship Cardinality

```
USER ──────────< JOB_POSITION
 1                    N
 
 One user can create many job positions
 Each job position is created by one user
 
 
CANDIDATE ──────────< MATCH_RESULT >──────────── JOB_POSITION
    1                      N                           1
    
One candidate can have many match results (for different jobs)
One job position can have many match results (for different candidates)
Each match result belongs to one candidate and one job position
```

---

## 📋 Index Strategy

### **Primary Keys (Clustered Indexes)**
```
users.id
candidates.id
job_positions.id
match_results.id
```

### **Unique Indexes**
```
users.email          → Fast login lookup
candidates.email     → Prevent duplicate candidates
```

### **Single Column Indexes**
```
candidates.status           → Filter by processing status
job_positions.is_active     → Filter active jobs
match_results.candidate_id  → Find all matches for candidate
match_results.job_id        → Find all matches for job
match_results.match_score   → Sort by score
match_results.status        → Filter by qualification status
```

### **Composite Indexes**
```
(job_id, match_score)       → Top candidates for a job
(candidate_id, match_score) → Best jobs for a candidate
```

---

## 🎯 Query Patterns

### **1. Authentication Flow**
```sql
-- Login
SELECT * FROM users WHERE email = ?
-- Check password hash in application code
```

### **2. Upload CV Flow**
```sql
-- Insert candidate
INSERT INTO candidates (id, name, email, ...) VALUES (?, ?, ?, ...)

-- Update with parsed data
UPDATE candidates 
SET education = ?, experience = ?, skills = ?, status = 'completed'
WHERE id = ?
```

### **3. Calculate Matching Flow**
```sql
-- Get candidate data
SELECT * FROM candidates WHERE id = ?

-- Get all active jobs
SELECT * FROM job_positions WHERE is_active = true

-- Insert match results (for each job)
INSERT INTO match_results 
(id, candidate_id, job_id, match_score, ...) 
VALUES (?, ?, ?, ?, ...)
```

### **4. Dashboard Analytics Flow**
```sql
-- Get statistics
SELECT COUNT(*) FROM candidates WHERE status = 'completed'
SELECT COUNT(*) FROM job_positions WHERE is_active = true
SELECT AVG(match_score) FROM match_results

-- Get experience distribution
SELECT 
  CASE 
    WHEN total_experience_years <= 2 THEN '0-2 years'
    WHEN total_experience_years <= 5 THEN '3-5 years'
    ...
  END as range,
  COUNT(*) as count
FROM candidates
GROUP BY range
```

### **5. Job Detail with Candidates Flow**
```sql
-- Get job details
SELECT * FROM job_positions WHERE id = ?

-- Get matched candidates (sorted by score)
SELECT c.*, mr.match_score, mr.status
FROM candidates c
JOIN match_results mr ON c.id = mr.candidate_id
WHERE mr.job_id = ?
ORDER BY mr.match_score DESC
LIMIT 50
```

---

## 💾 Data Size Analysis

### **Storage Requirements per Record**

| Table | Avg Size | Max Size | Notes |
|-------|----------|----------|-------|
| users | 500 B | 1 KB | Small, mostly text |
| candidates | 10 KB | 100 KB | Depends on CV length |
| job_positions | 3 KB | 10 KB | Depends on description |
| match_results | 1.5 KB | 3 KB | Mostly numeric + notes |

### **Scaling Estimates**

| Scenario | Candidates | Jobs | Matches | DB Size |
|----------|-----------|------|---------|---------|
| Small | 100 | 20 | 2,000 | ~5 MB |
| Medium | 1,000 | 100 | 100,000 | ~150 MB |
| Large | 10,000 | 500 | 5,000,000 | ~7.5 GB |
| Enterprise | 100,000 | 2,000 | 200,000,000 | ~300 GB |

**Note:** Match results grow as `candidates × jobs`, so it's the largest table.

---

## 🔄 Data Flow Diagram

```
┌─────────────┐
│   HR User   │
└──────┬──────┘
       │
       │ 1. Upload CV (PDF/DOCX)
       ▼
┌─────────────────────┐
│  CV Parser Service  │
│  - Extract text     │
│  - Parse structure  │
└──────┬──────────────┘
       │
       │ 2. Save to DB
       ▼
┌─────────────────────┐
│  CANDIDATES Table   │
│  - Raw text         │
│  - Status: processing│
└──────┬──────────────┘
       │
       │ 3. Analyze skills
       ▼
┌─────────────────────┐
│  Skill Analyzer     │
│  - NLP with spaCy   │
│  - Extract skills   │
└──────┬──────────────┘
       │
       │ 4. Update candidate
       ▼
┌─────────────────────┐
│  CANDIDATES Table   │
│  - Skills JSON      │
│  - Status: completed│
└──────┬──────────────┘
       │
       │ 5. Calculate matches
       ▼
┌─────────────────────┐
│  Matching Engine    │
│  - TF-IDF           │
│  - Cosine similarity│
└──────┬──────────────┘
       │
       │ 6. Save results
       ▼
┌─────────────────────┐
│ MATCH_RESULTS Table │
│  - Scores           │
│  - Status           │
└─────────────────────┘
```

---

## 🛡️ Data Integrity Rules

### **Foreign Key Constraints**

```sql
-- Job positions must have valid creator
ALTER TABLE job_positions
ADD CONSTRAINT fk_job_creator
FOREIGN KEY (created_by) REFERENCES users(id)
ON DELETE CASCADE;

-- Match results must have valid candidate
ALTER TABLE match_results
ADD CONSTRAINT fk_match_candidate
FOREIGN KEY (candidate_id) REFERENCES candidates(id)
ON DELETE CASCADE;

-- Match results must have valid job
ALTER TABLE match_results
ADD CONSTRAINT fk_match_job
FOREIGN KEY (job_id) REFERENCES job_positions(id)
ON DELETE CASCADE;
```

### **Check Constraints**

```sql
-- Match scores must be between 0 and 100
ALTER TABLE match_results
ADD CONSTRAINT chk_match_score
CHECK (match_score >= 0 AND match_score <= 100);

-- Experience years must be non-negative
ALTER TABLE candidates
ADD CONSTRAINT chk_experience
CHECK (total_experience_years >= 0);

-- Role must be valid
ALTER TABLE users
ADD CONSTRAINT chk_role
CHECK (role IN ('Admin', 'HR'));
```

---

## 📊 Sample Data Relationships

```
USER: admin@recruitment.com (Admin)
  │
  ├─ JOB: Senior Python Developer
  │    │
  │    ├─ MATCH: John Smith → 88.5% (Qualified)
  │    ├─ MATCH: Sarah Johnson → 62.5% (Potentially Qualified)
  │    └─ MATCH: Mike Chen → 45.0% (Not Qualified)
  │
  └─ JOB: ML Engineer
       │
       ├─ MATCH: Sarah Johnson → 91.2% (Qualified)
       └─ MATCH: John Smith → 62.5% (Potentially Qualified)

USER: hr@recruitment.com (HR)
  │
  └─ JOB: Frontend Developer
       │
       └─ MATCH: Mike Chen → 86.0% (Qualified)
```

---

## 🔍 Advanced Query Examples

### **Find Best Candidates for Multiple Jobs**
```sql
SELECT 
  c.name,
  c.email,
  jp.title as job_title,
  mr.match_score,
  mr.status
FROM candidates c
JOIN match_results mr ON c.id = mr.candidate_id
JOIN job_positions jp ON mr.job_id = jp.id
WHERE jp.is_active = true
  AND mr.status = 'Qualified'
ORDER BY mr.match_score DESC
LIMIT 20;
```

### **Get Skill Distribution Across All Candidates**
```sql
-- This requires JSON processing in application code
-- See: backend/services/dashboard_service.py
```

### **Find Candidates with Specific Skills**
```sql
-- PostgreSQL with JSONB:
SELECT name, email
FROM candidates
WHERE skills @> '[{"name": "Python"}]'::jsonb;

-- SQLite (requires application-level filtering):
-- Done in backend/services/candidate_service.py
```

---

## 🎯 Performance Optimization Tips

### **1. Index Usage**
- ✅ Always filter by indexed columns first
- ✅ Use composite indexes for common query patterns
- ✅ Monitor slow queries with EXPLAIN

### **2. JSON Field Optimization**
- ✅ PostgreSQL: Use JSONB instead of JSON
- ✅ Add GIN indexes on frequently queried JSON fields
- ✅ Denormalize frequently accessed JSON data

### **3. Query Optimization**
- ✅ Use pagination (LIMIT/OFFSET)
- ✅ Avoid SELECT * (specify columns)
- ✅ Use JOINs instead of multiple queries

### **4. Caching Strategy**
- ✅ Cache dashboard statistics (5 min TTL)
- ✅ Cache skill taxonomy (1 hour TTL)
- ✅ Cache match results (invalidate on update)

---

## 📝 Database Maintenance

### **Regular Tasks**
```sql
-- Vacuum database (SQLite)
VACUUM;

-- Analyze tables for query optimization
ANALYZE;

-- Check database integrity
PRAGMA integrity_check;
```

### **Backup Strategy**
```bash
# SQLite backup
sqlite3 recruitment.db ".backup backup.db"

# PostgreSQL backup
pg_dump -U user -d recruitment > backup.sql
```

---

## 🚀 Migration to Production

### **SQLite → PostgreSQL**

**Advantages of PostgreSQL:**
- ✅ Better concurrency (multiple writers)
- ✅ JSONB support (faster JSON queries)
- ✅ Full-text search
- ✅ Better performance at scale
- ✅ Advanced indexing (GIN, GiST)

**Migration Steps:**
1. Export data from SQLite
2. Update `DATABASE_URL` in `.env`
3. Run `python init_db.py`
4. Import data
5. Create additional indexes
6. Test thoroughly

**No code changes needed!** SQLAlchemy abstracts database differences.

