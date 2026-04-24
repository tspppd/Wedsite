# 🚀 Supabase Setup Guide

คู่มือการเชื่อมต่อและตั้งค่า Supabase สำหรับ WedSite

## 📋 Prerequisites

- บัญชี Supabase (สมัครฟรีที่ [supabase.com](https://supabase.com))
- Project ใน Supabase

## 🔧 Setup Steps

### 1. Install Supabase Packages

```bash
bun add @supabase/supabase-js @supabase/ssr
```

✅ **Done!** - Packages ติดตั้งแล้ว

---

### 2. Get Supabase Credentials

1. ไปที่ [Supabase Dashboard](https://supabase.com/dashboard)
2. เลือก Project ของคุณ
3. ไปที่ **Settings** > **API**
4. คัดลอก:
   - **Project URL** (NEXT_PUBLIC_SUPABASE_URL)
   - **anon/public key** (NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY)
   - **service_role key** (SUPABASE_SERVICE_ROLE_KEY) ⚠️ เก็บเป็นความลับ!

---

### 3. Update Environment Variables

เปิดไฟล์ `.env.local` และอัปเดต:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

---

### 4. Run Database Schema

1. ไปที่ Supabase Dashboard
2. เลือก **SQL Editor**
3. คลิก **New Query**
4. คัดลอกเนื้อหาจากไฟล์ `supabase/schema.sql`
5. วางและคลิก **Run**

Schema นี้จะสร้าง:
- ✅ `profiles` table - ข้อมูล user
- ✅ `wedding_sites` table - เว็บไซต์งานแต่ง
- ✅ `rsvp_responses` table - การตอบรับ RSVP
- ✅ `payments` table - ประวัติการชำระเงิน
- ✅ `analytics` table - สถิติการเข้าชม
- ✅ Row Level Security (RLS) policies
- ✅ Triggers และ Functions

---

### 5. Seed Test Users

```bash
bun run seed:supabase
```

Output ที่คาดหวัง:
```
🌱 Starting to seed Supabase users...

📡 Supabase URL: https://your-project.supabase.co

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📝 Creating user: สมชาย ใจดี (somchai@test.com)
✅ Created successfully!
   Role: user, Plan: free
   Password: Test1234

📝 Creating user: สมหญิง รักดี (somying@test.com)
✅ Created successfully!
   Role: user, Plan: free
   Password: Test1234

📝 Creating user: ธนพล มั่งมี (thanapol@test.com)
✅ Created successfully!
   Role: user, Plan: pro
   Password: Test1234

📝 Creating user: Admin WedSite (admin@wedsite.com)
✅ Created successfully!
   Role: admin, Plan: pro
   Password: Admin1234

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📊 Summary:
   ✅ Created: 4
   ⏭️  Skipped: 0
   ❌ Failed: 0

✨ Seeding completed!
```

---

## 📊 Database Schema

### Tables Overview

```
┌─────────────────┬──────────────────────────────────────┐
│ Table           │ Description                          │
├─────────────────┼──────────────────────────────────────┤
│ profiles        │ User profiles (extends auth.users)   │
│ wedding_sites   │ Wedding websites                     │
│ rsvp_responses  │ RSVP responses from guests           │
│ payments        │ Payment transactions                 │
│ analytics       │ Website analytics                    │
└─────────────────┴──────────────────────────────────────┘
```

### Profiles Table

```sql
CREATE TABLE profiles (
  id UUID PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  role TEXT DEFAULT 'user',
  plan TEXT DEFAULT 'free',
  avatar_url TEXT,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);
```

### Wedding Sites Table

```sql
CREATE TABLE wedding_sites (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES profiles(id),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  template TEXT DEFAULT 'classic',
  custom_domain TEXT UNIQUE,
  is_published BOOLEAN DEFAULT FALSE,
  theme_colors JSONB,
  sections JSONB,
  settings JSONB,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);
```

---

## 🔐 Security (Row Level Security)

### Profiles
- ✅ Users can view own profile
- ✅ Users can update own profile

### Wedding Sites
- ✅ Users can CRUD own wedding sites
- ✅ Published sites viewable by anyone

### RSVP
- ✅ Anyone can create RSVP
- ✅ Site owners can view RSVPs

### Payments
- ✅ Users can view own payments

---

## 🧪 Testing

### View Users in Supabase

1. ไปที่ Supabase Dashboard
2. เลือก **Authentication** > **Users**
3. จะเห็น test users ทั้ง 4 คน

### Test Login

```
Free User:
Email: somchai@test.com
Password: Test1234

Pro User:
Email: thanapol@test.com
Password: Test1234

Admin:
Email: admin@wedsite.com
Password: Admin1234
```

### Query Data

```sql
-- View all profiles
SELECT * FROM profiles;

-- View users with their plan
SELECT name, email, role, plan FROM profiles;

-- Count users by plan
SELECT plan, COUNT(*) FROM profiles GROUP BY plan;
```

---

## 🔄 Integration with Better Auth

ตอนนี้โปรเจคใช้ Better Auth กับ SQLite อยู่ หากต้องการเปลี่ยนไปใช้ Supabase:

### Option 1: ใช้ Supabase Auth แทน Better Auth

1. ลบ Better Auth configuration
2. ใช้ Supabase Auth hooks
3. อัปเดต login/register pages

### Option 2: ใช้ Better Auth + Supabase Database

1. เก็บ Better Auth สำหรับ authentication
2. ใช้ Supabase สำหรับ application data
3. Sync user data ระหว่าง Better Auth และ Supabase

---

## 📝 Available Scripts

| Command | Description |
|---------|-------------|
| `bun run seed:supabase` | Seed test users to Supabase |
| `bun run seed` | Seed test users to Better Auth (SQLite) |

---

## 🐛 Troubleshooting

### Error: "Invalid API key"

**แก้ไข:** ตรวจสอบว่า keys ใน `.env.local` ถูกต้อง

```bash
# ดู keys ใน Supabase Dashboard
Settings > API
```

---

### Error: "relation does not exist"

**แก้ไข:** รัน schema.sql ใน SQL Editor

```sql
-- ใน Supabase SQL Editor
-- คัดลอกและรันไฟล์ supabase/schema.sql
```

---

### Error: "User already exists"

**แก้ไข:** ลบ users ใน Supabase Dashboard หรือข้าม error นี้ไป

```bash
# Script จะข้าม users ที่มีอยู่แล้วอัตโนมัติ
```

---

### Error: "Service role key required"

**แก้ไข:** เพิ่ม service role key ใน `.env.local`

```env
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

---

## 🔗 Useful Links

- [Supabase Dashboard](https://supabase.com/dashboard)
- [Supabase Docs](https://supabase.com/docs)
- [SQL Editor](https://supabase.com/dashboard/project/_/sql)
- [Auth Users](https://supabase.com/dashboard/project/_/auth/users)
- [Database Tables](https://supabase.com/dashboard/project/_/database/tables)

---

## 📚 Next Steps

1. ✅ Setup Supabase
2. ✅ Run schema
3. ✅ Seed users
4. 🔄 Integrate with app
5. 🚀 Deploy to production

---

## 🆘 Need Help?

1. ตรวจสอบ Supabase logs
2. ดู error messages ใน console
3. ตรวจสอบ RLS policies
4. ลอง reset database

---

Made with 💕 by WedSite Team
