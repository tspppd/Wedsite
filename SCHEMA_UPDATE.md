# 🔄 Schema Update - Removed Better Auth

## สรุปการเปลี่ยนแปลง

### ✅ สิ่งที่ทำ

1. **ลบ Better Auth**
   - ลบไฟล์ `src/lib/auth.ts`
   - ลบ Better Auth plugin และ dependencies

2. **ปรับ Prisma Schema**
   - ลบ `Session` model (Better Auth)
   - ลบ `Account` model (Better Auth)
   - แก้ไข `Profile.id` จาก `cuid()` เป็น `@db.Uuid`
   - แก้ไข `Profile.role` จาก `String` เป็น `Role` enum
   - เพิ่ม fields ใหม่: `groomName`, `brideName`, `weddingDate`
   - เปลี่ยน UUID generation จาก `uuid_generate_v4()` เป็น `gen_random_uuid()`
   - เพิ่ม indexes สำหรับ performance

3. **สร้าง Migration Scripts**
   - `supabase/migration-clean-schema.sql` - สร้าง tables ใหม่
   - `supabase/rls-policies-updated.sql` - RLS policies พร้อม admin support

---

## 📊 Schema Changes

### Before (Better Auth)
```prisma
model Profile {
  id            String    @id @default(cuid())  // ❌ cuid
  role          String?   @default("user")      // ❌ String
  sessions      Session[]                       // ❌ Better Auth
  accounts      Account[]                       // ❌ Better Auth
}

model Session { ... }  // ❌ Better Auth
model Account { ... }  // ❌ Better Auth
```

### After (Supabase Auth)
```prisma
model Profile {
  id            String    @id @db.Uuid          // ✅ UUID
  role          Role      @default(USER)        // ✅ Enum
  // No sessions or accounts                    // ✅ Clean
}

// No Session model                             // ✅ Removed
// No Account model                             // ✅ Removed
```

---

## 🗄️ New Schema Structure

### Profile
```prisma
model Profile {
  id            String    @id @db.Uuid
  email         String    @unique
  name          String
  role          Role      @default(USER)        // ✅ Enum: USER, ADMIN
  plan          Plan      @default(FREE)
  avatarUrl     String?
  emailVerified Boolean   @default(false)
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  
  weddingSites WeddingSite[]
  payments     Payment[]
}
```

### WeddingSite (Updated)
```prisma
model WeddingSite {
  id           String   @id @default(dbgenerated("gen_random_uuid()"))
  userId       String   @db.Uuid
  title        String
  slug         String   @unique
  groomName    String?  // ✅ New
  brideName    String?  // ✅ New
  weddingDate  DateTime? @db.Date  // ✅ New
  template     String   @default("classic")
  customDomain String?  @unique
  isPublished  Boolean  @default(false)
  themeColors  Json     @db.JsonB
  sections     Json     @db.JsonB
  settings     Json     @db.JsonB
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
  
  user      Profile        @relation(...)
  rsvps     RsvpResponse[]
  analytics Analytics[]
}
```

---

## 🔐 Admin Features

### Admin Role
```typescript
// Check if user is admin
const isAdmin = await prisma.profile.findUnique({
  where: { id: userId },
  select: { role: true }
});

if (isAdmin?.role === 'ADMIN') {
  // Admin actions
}
```

### Admin Functions (SQL)
```sql
-- Check if current user is admin
SELECT public.is_admin();

-- Set user role (admin only)
SELECT public.set_user_role('user-uuid', 'admin');

-- Check if user is pro
SELECT public.is_pro_user();

-- Get user's site count
SELECT public.get_user_site_count();
```

### Admin Policies
```sql
-- Admins can view all profiles
CREATE POLICY "Admins can view all profiles"
ON "profiles" FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM "profiles"
    WHERE id = auth.uid()
    AND role = 'admin'
  )
);

-- Admins can update all profiles
CREATE POLICY "Admins can update all profiles"
ON "profiles" FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM "profiles"
    WHERE id = auth.uid()
    AND role = 'admin'
  )
);
```

---

## 🚀 Migration Steps

### Step 1: Run Migration SQL
ไปที่ **Supabase Dashboard → SQL Editor** และรัน:

```sql
-- 1. Run migration-clean-schema.sql
-- สร้าง tables ใหม่และลบ Better Auth tables
```

### Step 2: Run RLS Policies
```sql
-- 2. Run rls-policies-updated.sql
-- เพิ่ม RLS policies พร้อม admin support
```

### Step 3: Generate Prisma Client
```bash
bunx prisma generate
```

### Step 4: Verify
```bash
# เปิด Prisma Studio
bunx prisma studio

# ตรวจสอบ tables
# - profiles ✅
# - wedding_sites ✅
# - rsvp_responses ✅
# - payments ✅
# - analytics ✅
# - session ❌ (ถูกลบแล้ว)
# - account ❌ (ถูกลบแล้ว)
```

---

## 📝 Usage Examples

### Create Admin User
```typescript
// In Supabase SQL Editor
UPDATE profiles
SET role = 'admin'
WHERE email = 'admin@example.com';
```

### Check Admin in API Route
```typescript
import { createClient } from '@/lib/supabase/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  // Check if admin
  const profile = await prisma.profile.findUnique({
    where: { id: user.id },
    select: { role: true }
  });
  
  if (profile?.role !== 'ADMIN') {
    return Response.json({ error: 'Forbidden' }, { status: 403 });
  }
  
  // Admin actions...
  const allUsers = await prisma.profile.findMany();
  return Response.json(allUsers);
}
```

### Admin Dashboard Component
```typescript
'use client';

import { useAuth } from '@/hooks/useAuth';
import { useEffect, useState } from 'react';

export default function AdminDashboard() {
  const { user } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [users, setUsers] = useState([]);
  
  useEffect(() => {
    if (user) {
      // Check if admin
      fetch('/api/admin/check')
        .then(res => res.json())
        .then(data => setIsAdmin(data.isAdmin));
      
      // Fetch all users (admin only)
      if (isAdmin) {
        fetch('/api/admin/users')
          .then(res => res.json())
          .then(setUsers);
      }
    }
  }, [user, isAdmin]);
  
  if (!isAdmin) {
    return <div>Access Denied</div>;
  }
  
  return (
    <div>
      <h1>Admin Dashboard</h1>
      <div>
        {users.map(u => (
          <div key={u.id}>
            {u.email} - {u.role}
          </div>
        ))}
      </div>
    </div>
  );
}
```

---

## 🎯 Benefits

### 1. Cleaner Schema
- ❌ ลบ Better Auth complexity
- ✅ ใช้ Supabase Auth โดยตรง
- ✅ Schema ง่ายขึ้น

### 2. Better Type Safety
- ✅ Role เป็น Enum แทน String
- ✅ UUID type ถูกต้อง
- ✅ Foreign keys ตรงกัน

### 3. Admin Support
- ✅ Admin role ใน database
- ✅ Admin policies ใน RLS
- ✅ Admin utility functions

### 4. Performance
- ✅ เพิ่ม indexes
- ✅ ลด joins ที่ไม่จำเป็น
- ✅ JSONB แทน JSON

---

## 🐛 Troubleshooting

### ปัญหา: Can't connect to database
**แก้ไข:** ใช้ SQL Editor ใน Supabase Dashboard แทน `prisma db push`

### ปัญหา: Foreign key error
**แก้ไข:** รัน migration-clean-schema.sql ก่อน

### ปัญหา: RLS blocking queries
**แก้ไข:** ตรวจสอบว่า user authenticated และมี role ถูกต้อง

---

## ✅ Checklist

- [x] ลบ `src/lib/auth.ts`
- [x] อัปเดต `prisma/schema.prisma`
- [x] สร้าง `migration-clean-schema.sql`
- [x] สร้าง `rls-policies-updated.sql`
- [x] Generate Prisma Client
- [ ] รัน migration SQL ใน Supabase
- [ ] รัน RLS policies SQL
- [ ] ทดสอบ admin functions
- [ ] สร้าง admin user
- [ ] ทดสอบ admin dashboard

---

## 📚 Related Files

- `prisma/schema.prisma` - Updated schema
- `supabase/migration-clean-schema.sql` - Migration script
- `supabase/rls-policies-updated.sql` - RLS policies with admin
- `SETUP_COMPLETE.md` - Setup guide
- `DATABASE_SETUP_GUIDE.md` - Database guide

---

**Schema updated successfully! 🎉**

ตอนนี้ระบบใช้ Supabase Auth เต็มรูปแบบ พร้อม admin support!
