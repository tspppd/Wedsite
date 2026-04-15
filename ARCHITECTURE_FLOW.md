# 🏗️ Architecture Flow: Supabase + Prisma

## Overview

```
┌─────────────────────────────────────────────────────────────┐
│                      Your Application                        │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────┐         ┌──────────────┐                  │
│  │   Frontend   │         │   Backend    │                  │
│  │  (Next.js)   │────────▶│  (API Routes)│                  │
│  └──────────────┘         └──────────────┘                  │
│         │                         │                          │
│         │                         │                          │
│         ▼                         ▼                          │
│  ┌──────────────┐         ┌──────────────┐                  │
│  │ Supabase     │         │   Prisma     │                  │
│  │ Auth Client  │         │   Client     │                  │
│  └──────────────┘         └──────────────┘                  │
│         │                         │                          │
└─────────┼─────────────────────────┼──────────────────────────┘
          │                         │
          │                         │
          ▼                         ▼
┌─────────────────────────────────────────────────────────────┐
│                    Supabase Cloud                            │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────┐         ┌──────────────┐                  │
│  │ Supabase     │         │  PostgreSQL  │                  │
│  │ Auth Service │────────▶│  Database    │                  │
│  └──────────────┘         └──────────────┘                  │
│                                   ▲                          │
│                                   │                          │
│                                   │ (Direct Connection)      │
└───────────────────────────────────┼──────────────────────────┘
                                    │
                                    │
                            (Prisma connects here)
```

## 📚 สองระบบหลัก

### 1. Supabase Auth (Authentication)
**หน้าที่:** จัดการ users, login, register, sessions

**ใช้สำหรับ:**
- ✅ สมัครสมาชิก (Sign Up)
- ✅ เข้าสู่ระบบ (Sign In)
- ✅ ออกจากระบบ (Sign Out)
- ✅ Google OAuth
- ✅ Session Management
- ✅ Password Reset

**ไฟล์ที่เกี่ยวข้อง:**
```
src/lib/auth/client.ts          # Auth helper functions
src/lib/supabase/client.ts      # Supabase client (browser)
src/lib/supabase/server.ts      # Supabase client (server)
src/hooks/useAuth.ts            # React hook for auth
src/app/auth/callback/route.ts  # OAuth callback
```

### 2. Prisma ORM (Database Operations)
**หน้าที่:** Query และจัดการข้อมูลใน database

**ใช้สำหรับ:**
- ✅ CRUD operations (Create, Read, Update, Delete)
- ✅ Complex queries
- ✅ Relations between tables
- ✅ Type-safe database access

**ไฟล์ที่เกี่ยวข้อง:**
```
prisma/schema.prisma            # Database schema
src/lib/prisma.ts               # Prisma client singleton
```

---

## 🔄 Complete Flow

### Flow 1: User Registration (สมัครสมาชิก)

```
1. User กรอกฟอร์มที่ /register
   ├─ Email: user@example.com
   ├─ Password: ********
   └─ Name: John Doe

2. RegisterPage.tsx
   └─ เรียก auth.signUp(email, password, name)

3. src/lib/auth/client.ts
   └─ เรียก supabase.auth.signUp({
        email,
        password,
        options: { data: { name } }
      })

4. Supabase Auth Service
   ├─ สร้าง user ใน auth.users table
   ├─ Hash password
   ├─ เก็บ metadata (name)
   └─ ส่ง verification email (ถ้าเปิดใช้งาน)

5. Supabase Trigger (อัตโนมัติ)
   └─ สร้าง profile ใน public.profiles table
      (ผ่าน database trigger หรือ RLS policy)

6. Response กลับมา
   └─ { data: { user, session }, error: null }

7. Redirect to /login หรือ /builder
```

### Flow 2: User Login (เข้าสู่ระบบ)

```
1. User กรอก email/password ที่ /login

2. LoginPage.tsx
   └─ เรียก auth.signIn(email, password)

3. src/lib/auth/client.ts
   └─ เรียก supabase.auth.signInWithPassword({
        email,
        password
      })

4. Supabase Auth Service
   ├─ ตรวจสอบ email/password
   ├─ สร้าง session token
   └─ เก็บ session ใน cookies

5. Response กลับมา
   └─ { data: { user, session }, error: null }

6. useAuth hook อัปเดต state
   └─ user state เปลี่ยนจาก null → User object

7. Redirect to /builder
```

### Flow 3: Protected Page Access (เข้าหน้าที่ต้อง login)

```
1. User เข้า /builder

2. BuilderPage.tsx
   └─ ใช้ useAuth() hook

3. useAuth hook
   ├─ เรียก auth.getSession()
   ├─ ตรวจสอบ session จาก cookies
   └─ return { user, loading, isAuthenticated }

4. BuilderPage ตรวจสอบ
   ├─ ถ้า loading = true → แสดง spinner
   ├─ ถ้า user = null → redirect to /login
   └─ ถ้า user มีค่า → แสดงหน้า builder

5. แสดงข้อมูล user
   └─ user.email, user.user_metadata.name
```

### Flow 4: Database Query with Prisma (ดึงข้อมูลจาก database)

```
1. API Route หรือ Server Component
   └─ import { prisma } from '@/lib/prisma'

2. Query ข้อมูล
   const profile = await prisma.profile.findUnique({
     where: { id: userId }
   })

3. Prisma Client
   ├─ แปลง TypeScript → SQL
   └─ ส่ง query ไปที่ PostgreSQL

4. PostgreSQL Database (Supabase)
   ├─ Execute SQL query
   └─ Return results

5. Prisma Client
   ├─ แปลง SQL results → TypeScript objects
   └─ Return type-safe data

6. Response กลับมา
   └─ { id, email, name, plan, ... }
```

### Flow 5: Create Data with Prisma (สร้างข้อมูล)

```
1. API Route: /api/wedding-sites

2. ตรวจสอบ authentication
   const { user } = await auth.getUser()
   if (!user) return error

3. สร้างข้อมูลด้วย Prisma
   const weddingSite = await prisma.weddingSite.create({
     data: {
       userId: user.id,
       title: "Our Wedding",
       theme: "romantic",
       customDomain: "john-jane.wedding"
     }
   })

4. Prisma → PostgreSQL
   INSERT INTO wedding_sites (...)
   VALUES (...)

5. Response
   └─ { id, userId, title, theme, ... }
```

---

## 🗄️ Database Tables

### Supabase Auth Tables (จัดการโดย Supabase)
```sql
auth.users
├─ id (UUID)
├─ email
├─ encrypted_password
├─ email_confirmed_at
├─ user_metadata (JSON) -- เก็บ name, avatar, etc.
└─ created_at
```

### Your Application Tables (จัดการโดย Prisma)
```sql
public.profiles
├─ id (UUID) -- same as auth.users.id
├─ email
├─ name
├─ plan (free/pro)
├─ avatar_url
└─ created_at

public.wedding_sites
├─ id (UUID)
├─ user_id (FK → profiles.id)
├─ title
├─ theme
├─ custom_domain
└─ created_at

public.rsvp_responses
├─ id (UUID)
├─ wedding_site_id (FK → wedding_sites.id)
├─ guest_name
├─ email
├─ attending
└─ created_at
```

---

## 🔐 Security: Row Level Security (RLS)

```sql
-- Users can only see their own profile
CREATE POLICY "Users can view own profile"
ON profiles FOR SELECT
USING (auth.uid() = id);

-- Users can only update their own profile
CREATE POLICY "Users can update own profile"
ON profiles FOR UPDATE
USING (auth.uid() = id);

-- Users can only see their own wedding sites
CREATE POLICY "Users can view own wedding sites"
ON wedding_sites FOR SELECT
USING (auth.uid() = user_id);
```

---

## 📝 Code Examples

### Example 1: Get Current User
```typescript
// In a Client Component
import { useAuth } from '@/hooks/useAuth';

export default function MyComponent() {
  const { user, loading } = useAuth();
  
  if (loading) return <div>Loading...</div>;
  if (!user) return <div>Please login</div>;
  
  return <div>Hello {user.email}</div>;
}
```

### Example 2: Query Database
```typescript
// In an API Route or Server Component
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  // Get user from Supabase Auth
  const { user } = await auth.getUser();
  
  if (!user) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  // Query with Prisma
  const profile = await prisma.profile.findUnique({
    where: { id: user.id },
    include: {
      weddingSites: true // Include relations
    }
  });
  
  return Response.json(profile);
}
```

### Example 3: Create Wedding Site
```typescript
// API Route: /api/wedding-sites
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth/client';

export async function POST(request: Request) {
  const { user } = await auth.getUser();
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });
  
  const body = await request.json();
  
  const weddingSite = await prisma.weddingSite.create({
    data: {
      userId: user.id,
      title: body.title,
      theme: body.theme,
      customDomain: body.customDomain
    }
  });
  
  return Response.json(weddingSite);
}
```

---

## 🚀 Setup Steps

### 1. Supabase Setup
```bash
# Already done ✅
- Created Supabase project
- Got connection strings
- Set up environment variables
```

### 2. Prisma Setup
```bash
# Generate Prisma Client
bunx prisma generate

# Push schema to database (if connection works)
bunx prisma db push

# Or use SQL Editor in Supabase Dashboard
# Copy SQL from supabase/schema.sql and run it
```

### 3. Environment Variables
```bash
# .env.local
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=xxx
DATABASE_URL=postgresql://postgres:password@db.xxx.supabase.co:5432/postgres
```

---

## 🎯 Key Points

1. **Supabase Auth** = User authentication only
   - Login, Register, Sessions
   - Managed by Supabase

2. **Prisma** = Database operations
   - CRUD, Queries, Relations
   - Type-safe TypeScript

3. **PostgreSQL** = Actual database
   - Hosted by Supabase
   - Accessed by both Supabase Auth and Prisma

4. **Connection:**
   - Frontend → Supabase Auth Client → Supabase Auth Service
   - Backend → Prisma Client → PostgreSQL Database

5. **User ID:**
   - Created by Supabase Auth (UUID)
   - Used as foreign key in Prisma tables
   - Links auth.users ↔ public.profiles

---

## 🔧 Troubleshooting

### Can't connect to database?
1. Check if database is paused in Supabase Dashboard
2. Verify connection string is correct
3. Use SQL Editor as alternative

### User not found in Prisma?
1. Check if profile was created after signup
2. Verify user ID matches between auth.users and profiles
3. Check RLS policies

### Session not persisting?
1. Check cookies are enabled
2. Verify Supabase URL and keys
3. Check auth state in DevTools

---

## 📚 Documentation

- Supabase Auth: https://supabase.com/docs/guides/auth
- Prisma: https://www.prisma.io/docs
- Next.js: https://nextjs.org/docs
