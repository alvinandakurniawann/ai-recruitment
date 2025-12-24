# AI Recruitment System - Machine Learning Explanation

## 🤖 Apakah Model Ini Benar-Benar AI/ML?

**YA! Sistem ini menggunakan Machine Learning dan NLP yang REAL, bukan random.**

---

## 📊 Komponen ML/AI yang Digunakan

### 1. **NLP (Natural Language Processing) dengan spaCy**

**Library:** spaCy `en_core_web_sm` (Pre-trained model dari spaCy)

**Fungsi:**
- Ekstraksi skill dari CV text
- Named Entity Recognition (NER)
- Tokenization dan POS tagging
- Context analysis

**Kode:** `backend/ml/skill_analyzer.py`

```python
# Model pre-trained dari spaCy
self.nlp = spacy.load("en_core_web_sm")

# Proses text dengan NLP
doc = self.nlp(text.lower())
```

**Ini BUKAN random!** spaCy adalah library NLP profesional yang digunakan oleh perusahaan besar seperti Apple, Microsoft, dan Airbnb.

---

### 2. **TF-IDF (Term Frequency-Inverse Document Frequency)**

**Library:** scikit-learn `TfidfVectorizer`

**Fungsi:**
- Mengubah text skills menjadi vector numerik
- Menghitung importance setiap skill
- Membandingkan similarity antara kandidat dan job requirements

**Kode:** `backend/ml/matching_engine.py`

```python
# TF-IDF Vectorizer dari scikit-learn
self.vectorizer = TfidfVectorizer(
    max_features=500,
    lowercase=True,
    stop_words='english',
    ngram_range=(1, 2),
    min_df=1,
    max_df=0.95
)

# Transform text ke vector
tfidf_matrix = self.vectorizer.fit_transform([candidate_text, job_text])
```

**Ini BUKAN random!** TF-IDF adalah algoritma ML klasik yang digunakan di search engines dan recommendation systems.

---

### 3. **Cosine Similarity**

**Library:** scikit-learn `cosine_similarity`

**Fungsi:**
- Menghitung similarity score antara 2 vector (kandidat vs job)
- Range: 0 (tidak mirip) sampai 1 (sangat mirip)
- Digunakan untuk semantic matching

**Kode:** `backend/ml/matching_engine.py`

```python
# Calculate cosine similarity
similarity = cosine_similarity(tfidf_matrix[0:1], tfidf_matrix[1:2])[0][0]

# Convert to score (0-30 points)
semantic_score = similarity * 30
```

**Ini BUKAN random!** Cosine similarity adalah metode matematis yang digunakan di recommendation systems (Netflix, Spotify, dll).

---

## 🎯 Algoritma Matching Score

### Formula Lengkap:

```
Overall Match Score = (Skill Score × 50%) + (Experience Score × 30%) + (Education Score × 20%)
```

### 1. **Skill Match Score (0-100)**

**Komponen:**
- **Exact Match (70% weight):**
  - Required skills: 5 points per match (max 50 points)
  - Preferred skills: 2 points per match (max 20 points)

- **Semantic Similarity (30% weight):**
  - TF-IDF + Cosine Similarity (max 30 points)

**Contoh Perhitungan:**
```
Kandidat: Python, Flask, Django, PostgreSQL, Docker
Job Required: Python, Flask, REST API, SQL
Job Preferred: Docker, AWS, Redis

Exact Match:
- Required: 3/4 matched = (3/4) × 50 = 37.5 points
- Preferred: 1/3 matched = (1/3) × 20 = 6.7 points
- Total Exact: 44.2 points

Semantic Similarity:
- Cosine similarity = 0.75
- Semantic score = 0.75 × 30 = 22.5 points

Total Skill Score = 44.2 + 22.5 = 66.7
```

### 2. **Experience Match Score (0-100)**

**Formula:**
```
If candidate_years >= required_years:
    score = 100

If candidate_years >= 80% of required_years:
    score = 80 + (ratio - 0.8) × 95

Else:
    score = (candidate_years / required_years) × 100
```

**Contoh:**
```
Required: 5 years
Candidate: 6 years → Score = 100
Candidate: 4 years → Score = 80 + (0.8 - 0.8) × 95 = 80
Candidate: 3 years → Score = (3/5) × 100 = 60
```

### 3. **Education Match Score (0-100)**

**Hierarchy:**
```
1. High School
2. Diploma
3. Associate
4. Bachelor's
5. Master's / MBA
6. PhD / Doctorate
```

**Scoring:**
```
If candidate_level >= required_level: 100 points
If candidate_level = required - 1: 70 points
If candidate_level = required - 2: 40 points
Else: 20 points
```

---

## 🧠 Skill Proficiency Scoring

**Faktor yang Mempengaruhi Skill Score (0-100):**

1. **Frequency of Mention** (up to +20 points)
   - 5+ mentions: +20
   - 3-4 mentions: +15
   - 2 mentions: +10
   - 1 mention: +5

2. **Proficiency Keywords** (up to +20 points)
   - "expert": +20
   - "advanced": +18
   - "proficient": +15
   - "experienced": +12
   - "skilled": +10
   - "familiar": +3
   - "basic": -5
   - "beginner": -10

3. **Years of Experience** (up to +15 points)
   - 5+ years: +15
   - 3-4 years: +10
   - 1-2 years: +5

4. **Skills Section** (up to +10 points)
   - Appears in dedicated skills section: +10

5. **Action Verbs** (up to +10 points)
   - "developed", "built", "created", etc.: +10

**Base Score:** 50 points

**Contoh:**
```
Skill: Python
- Mentioned 4 times: +15
- Context: "expert Python developer": +20
- Years: "5 years Python experience": +15
- In skills section: +10
- Action: "developed Python applications": +10

Total: 50 + 15 + 20 + 15 + 10 + 10 = 120 → Capped at 100
```

---

## 🔍 Screening Decision Logic

**Status Categories:**

1. **"Qualified"**
   - Overall score ≥ 70%
   - Skill score ≥ 60%
   - Recommendation: Interview

2. **"Potentially Qualified"**
   - Overall score ≥ 50%
   - OR (Overall ≥ 40% AND Skill ≥ 50%)
   - Recommendation: Further evaluation

3. **"Not Qualified"**
   - Overall score < 50%
   - Critical gaps in requirements
   - Recommendation: Reject

---

## 📈 Dashboard Analytics

### Experience Level Distribution

**Ranges:**
- 0-2 years: Junior
- 3-5 years: Mid-level
- 6-10 years: Senior
- 11-15 years: Lead/Principal
- 16+ years: Executive

**Calculation:**
```python
for candidate in candidates:
    years = candidate.total_experience_years
    
    if years <= 2:
        experience_ranges['0-2 years'] += 1
    elif years <= 5:
        experience_ranges['3-5 years'] += 1
    # ... dst
```

### Skill Distribution

**Top 20 skills** berdasarkan jumlah kandidat yang memiliki skill tersebut.

### Match Score Distribution

**Ranges:**
- 0-20: Very Poor Match
- 21-40: Poor Match
- 41-60: Fair Match
- 61-80: Good Match
- 81-100: Excellent Match

---

## ✅ Kesimpulan

### **Ini BUKAN Random!**

✅ Menggunakan **spaCy** (NLP pre-trained model)
✅ Menggunakan **TF-IDF** (ML algorithm)
✅ Menggunakan **Cosine Similarity** (Mathematical similarity)
✅ Menggunakan **Rule-based scoring** (Logical algorithms)
✅ Semua perhitungan **deterministik** (input sama = output sama)

### **Tipe ML:**

- **Supervised Learning:** spaCy model (trained on large corpus)
- **Unsupervised Learning:** TF-IDF (statistical analysis)
- **Rule-based AI:** Scoring algorithms (expert system)

### **Production-Ready:**

✅ Digunakan oleh perusahaan real
✅ Scalable dan maintainable
✅ Explainable AI (bisa dijelaskan kenapa score tertentu)
✅ Tidak ada randomness

---

## 🐛 Bug Fix: Experience Distribution Kosong

**Masalah:** Chart experience level distribution tidak muncul

**Penyebab:** Mismatch key antara backend dan frontend
- Backend: `'0-2 years'`, `'3-5 years'`
- Frontend: `'0-2'`, `'3-5'`

**Solusi:** Sudah diperbaiki di `src/pages/Dashboard.js`

**Sebelum:**
```javascript
const ranges = ['0-2', '3-5', '6-10', '11-15', '16+'];
```

**Sesudah:**
```javascript
const ranges = ['0-2 years', '3-5 years', '6-10 years', '11-15 years', '16+ years'];
```

---

## 📚 Referensi

- **spaCy:** https://spacy.io/
- **scikit-learn TF-IDF:** https://scikit-learn.org/stable/modules/generated/sklearn.feature_extraction.text.TfidfVectorizer.html
- **Cosine Similarity:** https://en.wikipedia.org/wiki/Cosine_similarity
- **NLP for Resume Parsing:** Industry standard approach

