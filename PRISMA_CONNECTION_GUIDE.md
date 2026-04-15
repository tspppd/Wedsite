# 🔧 แก้ปัญหา Prisma ไม่สามารถเชื่อมต่อ Supabase

## ปัญหาที่พบ
```
Error: P1001: Can't reach database server at `db.lgjmhphshptvwmjrbvxl.supabase.co:5432`
```

## สาเหตุที่เป็นไปได้

### 1. ❌ Database Paused หรือ Inactive
Supabase Free tier จะ pause database หลังจากไม่ได้ใช้งาน 7 วัน

**วิธีแก้:**
- ไปที่ Supabase Dashboard: https://supabase.com/dashboard
- เลือก project ของคุณ
- ถ้า database paused จะมีปุ่ม "Resume" ให้กด

### 2. ❌ Connection String ไม่ถูกต้อง
ต้องใช้ **Direct Connection** (port 5432) ไม่ใช่ PgBouncer (port 6543)

**วิธีหา Connection String ที่ถูกต้อง:**
1. ไปที่ Supabase Dashboard
2. เลือก Project Settings → Database
3. ใน Connection String section เลือก:
   - **URI** (ไม่ใช่ Connection Pooling)
   - คัดลอก connection string
4. วางใน `.env` และ `.env.local`

### 3. ❌ Password มี Special Characters
ถ้า password มี `@` หรือ special characters ต้อง URL encode:
- `@` → `%40`
- `#` → `%23`
- `%` → `%25`
- `/` → `%2F`

**ตัวอย่าง:**
```bash
# ❌ ผิด
DATABASE_URL="postgresql://postgres:@Doraemon2536@db.xxx.supabase.co:5432/postgres"

# ✅ ถูก
DATABASE_URL="postgresql://postgres:%40Doraemon2536@db.xxx.supabase.co:5432/postgres"
```

### 4. ❌ Firewall หรือ Network Issue
Supabase อาจบล็อก connection จาก IP บางตัว

**วิธีทดสอบ:**
```bash
# ทดสอบ connection ด้วย psql
psql "postgresql://postgres:%40Doraemon2536@db.lgjmhphshptvwmjrbvxl.supabase.co:5432/postgres"
```

### 5. ❌ IPv6 Issue
บาง network ไม่ support IPv6

**วิธีแก้:**
ใช้ `directUrl` แทน `url` ใน Prisma schema:

```prisma
datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")
  directUrl = env("DIRECT_URL")
}
```

## วิธีแก้ที่แนะนำ

### ขั้นตอนที่ 1: ตรวจสอบ Supabase Dashboard
1. ไปที่ https://supabase.com/dashboard
2. เลือก project ของคุณ
3. ตรวจสอบว่า database ทำงานอยู่ (ไม่ paused)
4. ถ้า paused ให้กด Resume

### ขั้นตอนที่ 2: ดึง Connection String ใหม่
1. ไปที่ Project Settings → Database
2. ใน Connection String section:
   - เลือก **URI** (ไม่ใช่ Connection Pooling)
   - คัดลอก connection string
3. แทนที่ใน `.env` และ `.env.local`

### ขั้นตอนที่ 3: ใช้ Supabase CLI (แนะนำ)
```bash
# Install Supabase CLI
brew install supabase/tap/supabase

# Login
supabase login

# Link project
supabase link --project-ref lgjmhphshptvwmjrbvxl

# Get connection string
supabase db url
```

### ขั้นตอนที่ 4: ใช้ Transaction Pooler แทน Direct Connection
ถ้า Direct Connection ไม่ได้ ให้ใช้ Transaction Pooler:

```bash
# ใน .env
DATABASE_URL="postgresql://postgres.lgjmhphshptvwmjrbvxl:%40Doraemon2536@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres"
```

**หมายเหตุ:** Transaction Pooler ใช้ได้กับ `prisma db push` แต่อาจมีข้อจำกัดบางอย่าง

### ขั้นตอนที่ 5: ทดสอบ Connection
```bash
# ทดสอบด้วย Prisma
bunx prisma db pull

# หรือทดสอบด้วย psql
psql "your-connection-string"
```

## Alternative: ใช้ Supabase SQL Editor แทน

ถ้ายังเชื่อมต่อไม่ได้ ให้ใช้ Supabase SQL Editor:

1. ไปที่ Supabase Dashboard → SQL Editor
2. รัน SQL จาก `supabase/schema.sql` โดยตรง
3. ใช้ Prisma Client ตามปกติ (ไม่ต้อง push schema)

## สรุป

**ลำดับการแก้ปัญหา:**
1. ✅ ตรวจสอบ database ไม่ paused
2. ✅ ใช้ connection string ที่ถูกต้องจาก Dashboard
3. ✅ URL encode password ที่มี special characters
4. ✅ ลอง Transaction Pooler ถ้า Direct Connection ไม่ได้
5. ✅ ใช้ Supabase SQL Editor เป็นทางเลือกสุดท้าย

## คำสั่งที่เป็นประโยชน์

```bash
# Generate Prisma Client
bunx prisma generate

# Pull schema from database
bunx prisma db pull

# Push schema to database
bunx prisma db push

# Open Prisma Studio
bunx prisma studio

# Validate schema
bunx prisma validate
```
