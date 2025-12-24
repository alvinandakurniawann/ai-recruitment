# Database Deployment Guide - AI Recruitment System

## 📊 Sistem Database

### **Development vs Production**

| Aspect | Development | Production |
|--------|-------------|------------|
| **Database** | SQLite (file-based) | PostgreSQL (server-based) |
| **Location** | `backend/instance/recruitment.db` | Cloud database service |
| **Setup** | Otomatis (file dibuat saat run) | Manual setup required |
| **Backup** | Manual copy file | Automated backups |
| **Scalability** | Limited (single file) | High (concurrent users) |
| **Cost** | Free | Free tier available |

---

## 🔧 Development (Local)

### **SQLite - File-Based Database**

**Lokasi:** `backend/instance/recruitment.db`

**Cara Kerja:**
```
backend/
├── instance/
│   └── recruitment.db  ← Database file (auto-created)
├── app.py
└── config.py
```

**Setup:**
```bash
cd backend
python init_db.py --seed
# Creates: backend/instance/recruitment.db
```

**Keuntungan:**
- ✅ No server needed
- ✅ No configuration
- ✅ Portable (single file)
- ✅ Perfect for development

**Keterbatasan:**
- ⚠️ Single writer (no concurrent writes)
- ⚠️ Limited to ~1GB data
- ⚠️ Not suitable for production

---

## 🚀 Production Deployment

### **Option 1: Render.com (Recommended - FREE)**

**Database:** PostgreSQL (Free tier: 90 days, then $7/month)

**Setup Steps:**

1. **Create PostgreSQL Database di Render:**
   - Go to: https://render.com
   - Click "New" → "PostgreSQL"
   - Name: `ai-recruitment-db`
   - Region: Choose closest to your users
   - Plan: Free (90 days) atau Starter ($7/month)
   - Click "Create Database"

2. **Get Connection String:**
   ```
   Render akan provide:
   Internal Database URL: postgresql://user:pass@host/db
   External Database URL: postgresql://user:pass@host:5432/db
   ```

3. **Update Backend Environment:**
   ```bash
   # Di Render dashboard, set environment variable:
   DATABASE_URL=postgresql://user:pass@host:5432/db
   ```

4. **Deploy Backend:**
   ```bash
   # Render akan otomatis:
   # 1. Install dependencies
   # 2. Run migrations (create tables)
   # 3. Start server
   ```

**Automatic Backups:**
- ✅ Daily backups (retained 7 days)
- ✅ Point-in-time recovery
- ✅ Automatic failover

**Connection Pooling:**
- Max connections: 97 (Free), 400 (Starter)
- Auto-scaling

---

### **Option 2: Railway.app (Recommended - FREE)**

**Database:** PostgreSQL (Free tier: $5 credit/month)

**Setup Steps:**

1. **Create Project:**
   - Go to: https://railway.app
   - Click "New Project"
   - Select "Provision PostgreSQL"

2. **Get Connection String:**
   ```
   Railway provides:
   DATABASE_URL=postgresql://user:pass@host:port/db
   ```

3. **Deploy Backend:**
   ```bash
   # Connect GitHub repo
   # Railway auto-detects Python
   # Set environment variables
   ```

**Features:**
- ✅ $5 free credit/month
- ✅ Automatic backups
- ✅ Easy scaling
- ✅ Built-in monitoring

---

### **Option 3: Supabase (FREE Forever)**

**Database:** PostgreSQL (Free tier: 500MB, 2 CPU)

**Setup Steps:**

1. **Create Project:**
   - Go to: https://supabase.com
   - Click "New Project"
   - Choose region
   - Set database password

2. **Get Connection String:**
   ```
   Supabase provides:
   Direct connection: postgresql://postgres:pass@host:5432/postgres
   Connection pooling: postgresql://postgres:pass@host:6543/postgres
   ```

3. **Use Connection Pooling (Recommended):**
   ```bash
   DATABASE_URL=postgresql://postgres:pass@host:6543/postgres?pgbouncer=true
   ```

**Features:**
- ✅ FREE forever (500MB)
- ✅ Automatic backups (7 days)
- ✅ Built-in dashboard
- ✅ Real-time subscriptions
- ✅ Row-level security

---

### **Option 4: Neon.tech (FREE)**

**Database:** Serverless PostgreSQL

**Setup Steps:**

1. **Create Project:**
   - Go to: https://neon.tech
   - Sign up with GitHub
   - Create new project

2. **Get Connection String:**
   ```
   Neon provides:
   postgresql://user:pass@host/db?sslmode=require
   ```

**Features:**
- ✅ FREE tier (3GB storage)
- ✅ Serverless (auto-scale to zero)
- ✅ Instant branching
- ✅ Point-in-time restore

---

## 🔄 Migration: SQLite → PostgreSQL

### **Automatic Migration (Recommended)**

SQLAlchemy handles database differences automatically!

**Steps:**

1. **Update Environment Variable:**
   ```bash
   # Old (SQLite):
   DATABASE_URL=sqlite:///recruitment.db
   
   # New (PostgreSQL):
   DATABASE_URL=postgresql://user:pass@host:5432/db
   ```

2. **Run Migration:**
   ```bash
   cd backend
   python init_db.py
   # Creates all tables in PostgreSQL
   ```

3. **Seed Data (Optional):**
   ```bash
   python init_db.py --seed
   # Adds sample data
   ```

**NO CODE CHANGES NEEDED!** ✅

---

### **Manual Data Migration (If Needed)**

**Export from SQLite:**
```bash
# Export to SQL
sqlite3 recruitment.db .dump > backup.sql

# Or export to CSV
sqlite3 recruitment.db
.mode csv
.output users.csv
SELECT * FROM users;
.output candidates.csv
SELECT * FROM candidates;
```

**Import to PostgreSQL:**
```bash
# Using psql
psql $DATABASE_URL < backup.sql

# Or using Python script
python migrate_data.py
```

---

## 📁 File Storage (Uploaded CVs)

### **Development:**
```
backend/uploads/  ← Local folder
```

### **Production Options:**

#### **Option 1: Cloud Storage (Recommended)**

**AWS S3:**
```python
# Install: pip install boto3
import boto3

s3 = boto3.client('s3')
s3.upload_file('cv.pdf', 'bucket-name', 'cvs/cv.pdf')
```

**Cloudinary:**
```python
# Install: pip install cloudinary
import cloudinary.uploader

result = cloudinary.uploader.upload('cv.pdf')
```

**Advantages:**
- ✅ Unlimited storage
- ✅ CDN (fast access)
- ✅ Automatic backups
- ✅ Scalable

#### **Option 2: Server Storage**

**Render/Railway:**
```
/tmp/uploads/  ← Ephemeral storage
```

**Warning:** Files deleted on restart!

**Solution:** Use persistent volume or cloud storage

---

## 🔐 Environment Variables

### **Development (.env):**
```bash
FLASK_ENV=development
SECRET_KEY=dev-secret-key
JWT_SECRET_KEY=dev-jwt-key
DATABASE_URL=sqlite:///recruitment.db
UPLOAD_FOLDER=uploads
CORS_ORIGINS=http://localhost:3000
```

### **Production (.env):**
```bash
FLASK_ENV=production
SECRET_KEY=<generate-random-32-chars>
JWT_SECRET_KEY=<generate-random-32-chars>
DATABASE_URL=postgresql://user:pass@host:5432/db
UPLOAD_FOLDER=/tmp/uploads
CORS_ORIGINS=https://your-frontend.vercel.app
```

**Generate Secure Keys:**
```python
import secrets
print(secrets.token_urlsafe(32))
```

---

## 🗄️ Database Backup Strategy

### **Automated Backups (Production):**

**Render:**
- Daily backups (7 days retention)
- Manual backup anytime
- Download as SQL dump

**Railway:**
- Automatic snapshots
- Point-in-time recovery
- Export to S3

**Supabase:**
- Daily backups (7 days free tier)
- Manual backups
- Download via dashboard

### **Manual Backup:**

**PostgreSQL:**
```bash
# Backup
pg_dump $DATABASE_URL > backup_$(date +%Y%m%d).sql

# Restore
psql $DATABASE_URL < backup_20240115.sql
```

**SQLite:**
```bash
# Backup
cp backend/instance/recruitment.db backup_$(date +%Y%m%d).db

# Restore
cp backup_20240115.db backend/instance/recruitment.db
```

---

## 📊 Database Monitoring

### **Render Dashboard:**
- Connection count
- Query performance
- Storage usage
- CPU/Memory usage

### **Railway Dashboard:**
- Metrics & logs
- Query insights
- Resource usage

### **Supabase Dashboard:**
- Table editor
- SQL editor
- API logs
- Real-time monitoring

---

## 🚨 Common Issues & Solutions

### **Issue 1: Connection Timeout**

**Cause:** Database sleeping (free tier)

**Solution:**
```python
# Add connection pooling
SQLALCHEMY_ENGINE_OPTIONS = {
    'pool_pre_ping': True,
    'pool_recycle': 300,
}
```

### **Issue 2: Too Many Connections**

**Cause:** Not closing connections

**Solution:**
```python
# Use context manager
with app.app_context():
    db.session.query(...)
    db.session.commit()
```

### **Issue 3: Slow Queries**

**Cause:** Missing indexes

**Solution:**
```python
# Add indexes in models
email = db.Column(db.String(255), index=True)
status = db.Column(db.String(20), index=True)
```

---

## 📈 Scaling Strategy

### **Small Scale (0-1000 users):**
- ✅ Free tier PostgreSQL (Render/Railway/Supabase)
- ✅ Single server
- ✅ No caching needed

### **Medium Scale (1000-10000 users):**
- ✅ Paid PostgreSQL ($7-20/month)
- ✅ Connection pooling
- ✅ Redis caching
- ✅ CDN for static files

### **Large Scale (10000+ users):**
- ✅ Managed PostgreSQL (AWS RDS, Google Cloud SQL)
- ✅ Read replicas
- ✅ Redis cluster
- ✅ Load balancer
- ✅ Horizontal scaling

---

## ✅ Recommended Setup for Your Project

### **For Development:**
```
Database: SQLite (current setup)
Location: backend/instance/recruitment.db
Backup: Manual copy
```

### **For Production (FREE):**

**Option A: Render + Supabase**
```
Backend: Render.com (Free)
Database: Supabase PostgreSQL (Free forever)
Frontend: Vercel (Free)
Storage: Cloudinary (Free tier)
```

**Option B: Railway (All-in-One)**
```
Backend + Database: Railway ($5 credit/month)
Frontend: Vercel (Free)
Storage: Railway volumes
```

**Option C: Neon + Render**
```
Backend: Render.com (Free)
Database: Neon.tech (Free)
Frontend: Vercel (Free)
```

---

## 🎯 Deployment Checklist

### **Before Deploy:**
- [ ] Update `DATABASE_URL` to PostgreSQL
- [ ] Generate secure `SECRET_KEY` and `JWT_SECRET_KEY`
- [ ] Update `CORS_ORIGINS` to production frontend URL
- [ ] Test database connection locally
- [ ] Run migrations: `python init_db.py`
- [ ] Seed initial data (optional)

### **After Deploy:**
- [ ] Verify database connection
- [ ] Test API endpoints
- [ ] Check logs for errors
- [ ] Setup automated backups
- [ ] Monitor database usage
- [ ] Test file uploads

---

## 📚 Resources

**Database Services:**
- Render: https://render.com/docs/databases
- Railway: https://docs.railway.app/databases/postgresql
- Supabase: https://supabase.com/docs
- Neon: https://neon.tech/docs

**SQLAlchemy:**
- Docs: https://docs.sqlalchemy.org/
- PostgreSQL: https://docs.sqlalchemy.org/en/14/dialects/postgresql.html

**Backup Tools:**
- pg_dump: https://www.postgresql.org/docs/current/app-pgdump.html
- Automated backups: https://render.com/docs/databases#backups

