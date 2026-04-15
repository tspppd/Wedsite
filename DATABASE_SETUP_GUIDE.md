# 🗄️ Database Setup Guide - Complete

## 📋 Overview

คู่มือนี้จะแนะนำการ setup database ตั้งแต่ต้นจนจบ

---

## 🎯 ขั้นตอนทั้งหมด

### Step 1: ตรวจสอบ Environment Variables

ตรวจสอบว่าไฟล์ `.env` และ `.env.local` มี connection string ที่ถูกต้อง:

```bash
# .env และ .env.local
DATABASE_URL="postgresql://postgres:%40Doraemon2536@db.lgjmhphshptvwmjrbvxl.supabase.co:5432/postgres"
DIRECT_URL="postgresql://postgres:%40Doraemon2536@db.lgjmhphshptvwmjrbvxl.supabase.co:5432/postgres"

NEXT_PUBLIC_SUPABASE_URL=https://lgjmhphshptvwmjrbvxl.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_AIf_wZH4IxetwGLiGZDASw_7anDgwK-
```

**สำคัญ:**
- ใช้ port `5432` (Direct Connection) ไม่ใช่ `6543` (PgBouncer)
- Password ที่มี `@` ต้อง encode เป็น `%40`

---

### Step 2: Push Schema to Database

```bash
bunx prisma db push
```

**ผลลัพธ์ที่คาดหวัง:**
```
✅ Your database is now in sync with your Prisma schema.
```

**ถ้าเจอ Error:**

#### Error: Can't reach database server
```
Error: P1001: Can't reach database server
```

**แก้ไข:**
1. ตรวจสอบว่า database ไม่ paused ใน Supabase Dashboard
2. ตรวจสอบ connection string ถูกต้อง
3. ตรวจสอบ password encoding

#### Error: Foreign key type mismatch
```
ERROR: foreign key constraint cannot be implemented
DETAIL: Key columns are of incompatible types: text and uuid
```

**แก้ไข:**
ตรวจสอบว่า foreign key fields มี type ตรงกัน:
```prisma
// ✅ ถูกต้อง
model Session {
  userId String @db.Uuid
  profile Profile @relation(fields: [userId], references: [id])
}

model Profile {
  id String @id @db.Uuid
}
```

---

### Step 3: Generate Prisma Client

```bash
bunx prisma generate
```

**ผลลัพธ์:**
```
✅ Generated Prisma Client to ./node_modules/@prisma/client
```

---

### Step 4: Verify Tables Created

```bash
bunx prisma db pull
```

**ผลลัพธ์:**
```
✅ Introspected 6 models and wrote them into prisma/schema.prisma
```

**Tables ที่ถูกสร้าง:**
1. `profiles` - User profiles
2. `wedding_sites` - Wedding websites
3. `rsvp_responses` - RSVP submissions
4. `payments` - Payment records
5. `analytics` - Analytics data
6. `session` - User sessions

---

### Step 5: Add Row Level Security (RLS)

ไปที่ **Supabase Dashboard → SQL Editor** และรัน:

```bash
# คัดลอกจากไฟล์
supabase/rls-policies.sql
```

**หรือรันทีละส่วน:**

#### 5.1 Enable RLS
```sql
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE wedding_sites ENABLE ROW LEVEL SECURITY;
ALTER TABLE rsvp_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE session ENABLE ROW LEVEL SECURITY;
```

#### 5.2 Add Profile Policies
```sql
CREATE POLICY "Users can view own profile"
ON profiles FOR SELECT
USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
ON profiles FOR UPDATE
USING (auth.uid() = id);
```

#### 5.3 Add Wedding Sites Policies
```sql
CREATE POLICY "Users can view own wedding sites"
ON wedding_sites FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create wedding sites"
ON wedding_sites FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Anyone can view published wedding sites"
ON wedding_sites FOR SELECT
USING (is_published = true);
```

#### 5.4 Add Auto-Create Profile Trigger
```sql
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name, plan, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    'free',
    'user'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

---

### Step 6: Test Database Connection

#### 6.1 Open Prisma Studio
```bash
bunx prisma studio
```

เปิด browser ที่ `http://localhost:5555`

#### 6.2 Test Query
สร้างไฟล์ `test-db.ts`:
```typescript
import { prisma } from './src/lib/prisma';

async function main() {
  // Test connection
  const profiles = await prisma.profile.findMany();
  console.log('Profiles:', profiles);
  
  // Test create
  const testProfile = await prisma.profile.create({
    data: {
      id: 'test-uuid',
      email: 'test@example.com',
      name: 'Test User',
      plan: 'FREE'
    }
  });
  console.log('Created:', testProfile);
  
  // Clean up
  await prisma.profile.delete({
    where: { id: 'test-uuid' }
  });
  console.log('Deleted test profile');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
```

รัน:
```bash
bun run test-db.ts
```

---

## 🔍 Verification Checklist

### Database Connection
- [ ] `bunx prisma db push` สำเร็จ
- [ ] `bunx prisma generate` สำเร็จ
- [ ] `bunx prisma studio` เปิดได้

### Tables
- [ ] `profiles` table มีอยู่
- [ ] `wedding_sites` table มีอยู่
- [ ] `rsvp_responses` table มีอยู่
- [ ] `payments` table มีอยู่
- [ ] `analytics` table มีอยู่
- [ ] `session` table มีอยู่

### RLS Policies
- [ ] RLS enabled บน all tables
- [ ] Profile policies ทำงาน
- [ ] Wedding sites policies ทำงาน
- [ ] RSVP policies ทำงาน

### Triggers
- [ ] `handle_new_user` function มีอยู่
- [ ] `on_auth_user_created` trigger มีอยู่
- [ ] Profile ถูกสร้างอัตโนมัติเมื่อ user sign up

---

## 🧪 Testing

### Test 1: Register New User
```bash
# ไปที่ /register
# สมัครสมาชิกใหม่
# ตรวจสอบว่า profile ถูกสร้างใน database
```

### Test 2: Create Wedding Site
```typescript
const site = await prisma.weddingSite.create({
  data: {
    userId: user.id,
    title: 'Test Wedding',
    slug: 'test-wedding-2024',
    template: 'classic'
  }
});
```

### Test 3: Submit RSVP
```typescript
const rsvp = await prisma.rsvpResponse.create({
  data: {
    weddingSiteId: siteId,
    guestName: 'John Doe',
    guestEmail: 'john@example.com',
    attendanceStatus: 'ATTENDING',
    numberOfGuests: 2
  }
});
```

### Test 4: Check RLS
```sql
-- ใน Supabase SQL Editor
-- Login as a user first
SELECT * FROM profiles WHERE id = auth.uid();
-- ควรเห็นแค่ profile ของตัวเอง

SELECT * FROM wedding_sites WHERE user_id = auth.uid();
-- ควรเห็นแค่ sites ของตัวเอง
```

---

## 🐛 Troubleshooting

### ปัญหา: Can't connect to database

**ตรวจสอบ:**
1. Database ไม่ paused ใน Supabase Dashboard
2. Connection string ถูกต้อง
3. ใช้ port 5432 (Direct Connection)
4. Password encode ถูกต้อง (`@` → `%40`)

**วิธีแก้:**
```bash
# ดึง connection string ใหม่จาก Supabase Dashboard
# Settings → Database → Connection String → URI
```

### ปัญหา: Foreign key error

**ตรวจสอบ:**
- Foreign key fields มี type ตรงกัน
- ใช้ `@db.Uuid` สำหรับ UUID fields

**วิธีแก้:**
```prisma
// ตรวจสอบว่า foreign key type ตรงกัน
model Session {
  userId String @db.Uuid  // ต้องเป็น @db.Uuid
  profile Profile @relation(fields: [userId], references: [id])
}
```

### ปัญหา: Profile ไม่ถูกสร้างอัตโนมัติ

**ตรวจสอบ:**
1. Trigger `on_auth_user_created` มีอยู่
2. Function `handle_new_user` ทำงาน

**วิธีแก้:**
```sql
-- รัน trigger script อีกครั้งใน SQL Editor
-- ดูใน supabase/rls-policies.sql
```

### ปัญหา: RLS blocking queries

**ตรวจสอบ:**
- User authenticated ก่อน query
- Policies ถูกต้อง

**วิธีแก้:**
```typescript
// ตรวจสอบ authentication
const { data: { user } } = await supabase.auth.getUser();
if (!user) {
  // User not authenticated
}
```

---

## 📚 Related Documentation

- `SETUP_COMPLETE.md` - Setup completion checklist
- `PRISMA_SETUP.md` - Prisma setup guide
- `SUPABASE_SETUP.md` - Supabase setup guide
- `PRISMA_CONNECTION_GUIDE.md` - Connection troubleshooting
- `supabase/rls-policies.sql` - RLS policies SQL

---

## 🎯 Next Steps

1. ✅ Database setup complete
2. ✅ RLS policies added
3. ✅ Triggers configured
4. → Start building features!
5. → Create API routes
6. → Test authentication flow
7. → Deploy to production

---

## 📞 Support

ถ้ามีปัญหา:
1. ตรวจสอบ error message
2. ดู troubleshooting section
3. เช็ค Supabase Dashboard logs
4. ดู Prisma documentation

---

**Setup Complete! 🎉**

Database พร้อมใช้งานแล้ว คุณสามารถเริ่มพัฒนา features ได้เลย!
