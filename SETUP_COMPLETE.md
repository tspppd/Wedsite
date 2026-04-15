# ✅ Setup Complete!

## 🎉 สำเร็จแล้ว!

Database schema ถูกสร้างใน Supabase เรียบร้อยแล้ว

---

## 📊 Tables ที่ถูกสร้าง

### 1. profiles
```sql
- id (UUID) - Primary Key
- name (String)
- email (String) - Unique
- role (Enum: USER, ADMIN)
- plan (Enum: FREE, PRO)
- avatar_url (String, Optional)
- created_at (Timestamp)
- updated_at (Timestamp)
```

### 2. wedding_sites
```sql
- id (UUID) - Primary Key
- user_id (UUID) - Foreign Key → profiles.id
- title (String)
- slug (String) - Unique
- template (String)
- custom_domain (String, Optional, Unique)
- is_published (Boolean)
- theme_colors (JSON)
- sections (JSON)
- settings (JSON)
- created_at (Timestamp)
- updated_at (Timestamp)
```

### 3. rsvp_responses
```sql
- id (UUID) - Primary Key
- wedding_site_id (UUID) - Foreign Key → wedding_sites.id
- guest_name (String)
- guest_email (String, Optional)
- guest_phone (String, Optional)
- attendance_status (Enum: ATTENDING, NOT_ATTENDING, MAYBE)
- number_of_guests (Integer)
- dietary_requirements (String, Optional)
- message (String, Optional)
- created_at (Timestamp)
```

### 4. payments
```sql
- id (UUID) - Primary Key
- user_id (UUID) - Foreign Key → profiles.id
- amount (Decimal)
- currency (String)
- status (Enum: PENDING, COMPLETED, FAILED, REFUNDED)
- plan (Enum: FREE, PRO)
- payment_method (String, Optional)
- transaction_id (String, Optional, Unique)
- metadata (JSON)
- created_at (Timestamp)
```

### 5. analytics
```sql
- id (UUID) - Primary Key
- wedding_site_id (UUID) - Foreign Key → wedding_sites.id
- event_type (String)
- event_data (JSON)
- ip_address (String, Optional)
- user_agent (String, Optional)
- created_at (Timestamp)
```

### 6. session
```sql
- id (String) - Primary Key
- expires_at (Timestamp)
- token (String) - Unique
- created_at (Timestamp)
- updated_at (Timestamp)
- ip_address (String, Optional)
- user_agent (String, Optional)
- user_id (UUID) - Foreign Key → profiles.id
```

---

## 🔧 ปัญหาที่แก้ไข

### Error: Foreign Key Type Mismatch
```
ERROR: foreign key constraint "session_userId_fkey" cannot be implemented
DETAIL: Key columns "userId" and "id" are of incompatible types: text and uuid.
```

**สาเหตุ:**
- `Session.userId` เป็น `String` (text)
- `Profile.id` เป็น `@db.Uuid`

**วิธีแก้:**
```prisma
// ❌ ก่อนแก้
model Session {
  userId String
  profile Profile @relation(fields: [userId], references: [id])
}

// ✅ หลังแก้
model Session {
  userId String @db.Uuid
  profile Profile @relation(fields: [userId], references: [id])
}
```

---

## 🚀 คำสั่งที่ใช้

### 1. Push Schema to Database
```bash
bunx prisma db push
```
✅ สร้าง tables ใน database

### 2. Generate Prisma Client
```bash
bunx prisma generate
```
✅ สร้าง TypeScript types และ client

### 3. Pull Schema from Database
```bash
bunx prisma db pull
```
✅ ดึง schema จาก database มาอัปเดต

### 4. Open Prisma Studio
```bash
bunx prisma studio
```
✅ เปิด GUI สำหรับดูและแก้ไขข้อมูล

---

## 📝 Next Steps

### 1. ตรวจสอบ Database
```bash
# เปิด Prisma Studio
bunx prisma studio

# หรือไปที่ Supabase Dashboard
# https://supabase.com/dashboard
```

### 2. สร้าง Profile แรก
เมื่อ user สมัครสมาชิกผ่าน Supabase Auth, profile จะถูกสร้างอัตโนมัติ

หรือสร้างด้วย Prisma:
```typescript
import { prisma } from '@/lib/prisma';

const profile = await prisma.profile.create({
  data: {
    id: 'user-uuid-from-supabase',
    email: 'user@example.com',
    name: 'John Doe',
    plan: 'FREE'
  }
});
```

### 3. ทดสอบ CRUD Operations

#### Create Wedding Site
```typescript
const site = await prisma.weddingSite.create({
  data: {
    userId: user.id,
    title: 'Our Wedding',
    slug: 'john-jane-2024',
    template: 'classic'
  }
});
```

#### Get All Wedding Sites
```typescript
const sites = await prisma.weddingSite.findMany({
  where: { userId: user.id },
  include: {
    rsvps: true,
    analytics: true
  }
});
```

#### Create RSVP
```typescript
const rsvp = await prisma.rsvpResponse.create({
  data: {
    weddingSiteId: siteId,
    guestName: 'Jane Smith',
    guestEmail: 'jane@example.com',
    attendanceStatus: 'ATTENDING',
    numberOfGuests: 2
  }
});
```

### 4. เพิ่ม Row Level Security (RLS)

ไปที่ Supabase Dashboard → SQL Editor และรัน:

```sql
-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE wedding_sites ENABLE ROW LEVEL SECURITY;
ALTER TABLE rsvp_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE session ENABLE ROW LEVEL SECURITY;

-- Profiles: Users can only see their own profile
CREATE POLICY "Users can view own profile"
ON profiles FOR SELECT
USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
ON profiles FOR UPDATE
USING (auth.uid() = id);

-- Wedding Sites: Users can only see their own sites
CREATE POLICY "Users can view own wedding sites"
ON wedding_sites FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create wedding sites"
ON wedding_sites FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own wedding sites"
ON wedding_sites FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own wedding sites"
ON wedding_sites FOR DELETE
USING (auth.uid() = user_id);

-- RSVP: Public can view and create (for guest submissions)
CREATE POLICY "Anyone can view RSVP responses"
ON rsvp_responses FOR SELECT
USING (true);

CREATE POLICY "Anyone can create RSVP responses"
ON rsvp_responses FOR INSERT
WITH CHECK (true);

-- Site owners can manage RSVPs
CREATE POLICY "Site owners can manage RSVPs"
ON rsvp_responses FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM wedding_sites
    WHERE wedding_sites.id = rsvp_responses.wedding_site_id
    AND wedding_sites.user_id = auth.uid()
  )
);

-- Payments: Users can only see their own payments
CREATE POLICY "Users can view own payments"
ON payments FOR SELECT
USING (auth.uid() = user_id);

-- Analytics: Site owners can view analytics
CREATE POLICY "Site owners can view analytics"
ON analytics FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM wedding_sites
    WHERE wedding_sites.id = analytics.wedding_site_id
    AND wedding_sites.user_id = auth.uid()
  )
);
```

### 5. สร้าง Database Trigger สำหรับ Profile

```sql
-- Function to create profile when user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name, plan)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', NEW.email),
    'free'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger on auth.users
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

---

## 🎯 ตรวจสอบว่าทุกอย่างทำงาน

### 1. เช็ค Prisma Client
```typescript
import { prisma } from '@/lib/prisma';

// ควรไม่มี error
console.log('Prisma Client:', prisma);
```

### 2. ทดสอบ Query
```typescript
const profiles = await prisma.profile.findMany();
console.log('Profiles:', profiles);
```

### 3. เช็ค Types
```typescript
// TypeScript ควรรู้จัก types เหล่านี้
import { Profile, WeddingSite, RsvpResponse } from '@prisma/client';
```

---

## 📚 เอกสารที่เกี่ยวข้อง

- `QUICK_START.md` - วิธีใช้งาน Prisma
- `ARCHITECTURE_FLOW.md` - Flow การทำงาน
- `USAGE_EXAMPLES.md` - ตัวอย่างโค้ด
- `PRISMA_SETUP.md` - Prisma setup guide

---

## ✅ Checklist

- [x] Database connection ทำงาน
- [x] Schema ถูก push ไปที่ database
- [x] Prisma Client ถูก generate
- [x] Tables ถูกสร้างครบ 6 tables
- [x] Foreign keys ถูกต้อง
- [ ] RLS policies ถูกเพิ่ม (ทำในขั้นตอนถัดไป)
- [ ] Database trigger สำหรับ profile (ทำในขั้นตอนถัดไป)
- [ ] ทดสอบ CRUD operations

---

## 🎉 สรุป

ตอนนี้ database พร้อมใช้งานแล้ว! คุณสามารถ:

1. ✅ ใช้ Prisma Client query ข้อมูล
2. ✅ สร้าง API routes
3. ✅ เชื่อมต่อกับ Supabase Auth
4. ✅ เริ่มพัฒนา features

**Happy Coding! 🚀**
