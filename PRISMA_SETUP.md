# 🔷 Prisma Setup Guide

คู่มือการตั้งค่า Prisma ORM สำหรับ WedSite

## 📋 What is Prisma?

Prisma เป็น Next-generation ORM ที่ช่วยให้การทำงานกับ database ง่ายขึ้น:
- ✅ Type-safe database queries
- ✅ Auto-completion ใน IDE
- ✅ Database migrations
- ✅ Prisma Studio (GUI สำหรับดู database)

## 🔧 Setup Steps

### 1. Install Prisma

```bash
bun add prisma @prisma/client
```

✅ **Done!** - Packages ติดตั้งแล้ว

---

### 2. Get Database Connection String

1. ไปที่ [Supabase Dashboard](https://supabase.com/dashboard)
2. เลือก Project ของคุณ
3. ไปที่ **Settings** > **Database**
4. ใน **Connection String** section:
   - เลือก **URI**
   - คัดลอก connection string
   - แทนที่ `[YOUR-PASSWORD]` ด้วยรหัสผ่าน database ของคุณ

---

### 3. Update Environment Variables

เปิดไฟล์ `.env.local` และเพิ่ม:

```env
# Prisma Database Connection
DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.hlayqqglzusucznssfqy.supabase.co:5432/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres:[YOUR-PASSWORD]@db.hlayqqglzusucznssfqy.supabase.co:5432/postgres"
```

**หมายเหตุ:**
- `DATABASE_URL` - ใช้กับ connection pooling (pgBouncer)
- `DIRECT_URL` - ใช้สำหรับ migrations และ introspection

---

### 4. Push Schema to Database

```bash
bun run prisma:push
```

คำสั่งนี้จะ:
- ✅ สร้าง tables ใน database
- ✅ สร้าง enums
- ✅ สร้าง indexes
- ✅ ไม่สร้าง migration files (เหมาะสำหรับ development)

Output ที่คาดหวัง:
```
Environment variables loaded from .env.local
Prisma schema loaded from prisma/schema.prisma
Datasource "db": PostgreSQL database

🚀  Your database is now in sync with your Prisma schema. Done in 2.5s

✔ Generated Prisma Client
```

---

### 5. Generate Prisma Client

```bash
bun run prisma:generate
```

คำสั่งนี้จะสร้าง Prisma Client ที่มี:
- ✅ Type-safe queries
- ✅ Auto-completion
- ✅ TypeScript types

---

### 6. Seed Test Users

```bash
bun run seed:prisma
```

Output ที่คาดหวัง:
```
🌱 Starting to seed users with Prisma...

📡 Database: Supabase (PostgreSQL)
🔧 ORM: Prisma

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📝 Creating user: สมชาย ใจดี (somchai@test.com)
✅ Created successfully!
   Role: USER, Plan: FREE
   Password: Test1234

📝 Creating user: สมหญิง รักดี (somying@test.com)
✅ Created successfully!
   Role: USER, Plan: FREE
   Password: Test1234

📝 Creating user: ธนพล มั่งมี (thanapol@test.com)
✅ Created successfully!
   Role: USER, Plan: PRO
   Password: Test1234

📝 Creating user: Admin WedSite (admin@wedsite.com)
✅ Created successfully!
   Role: ADMIN, Plan: PRO
   Password: Admin1234

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📊 Summary:
   ✅ Created: 4
   ⏭️  Skipped: 0
   ❌ Failed: 0

✨ Seeding completed!

📊 Database Stats:
   Total Profiles: 4
   Free Users: 2
   Pro Users: 2
```

---

## 📊 Prisma Schema Overview

### Models

```prisma
model Profile {
  id        String   @id @db.Uuid
  name      String
  email     String   @unique
  role      Role     @default(USER)
  plan      Plan     @default(FREE)
  // ... relations
}

model WeddingSite {
  id            String   @id @default(dbgenerated("uuid_generate_v4()"))
  userId        String
  title         String
  slug          String   @unique
  isPublished   Boolean  @default(false)
  // ... more fields
}

model RsvpResponse {
  id                  String
  weddingSiteId       String
  guestName           String
  attendanceStatus    AttendanceStatus
  // ... more fields
}

model Payment {
  id            String
  userId        String
  amount        Decimal
  status        PaymentStatus
  // ... more fields
}

model Analytics {
  id            String
  weddingSiteId String
  eventType     String
  // ... more fields
}
```

---

## 🔍 Using Prisma in Your Code

### Import Prisma Client

```typescript
import prisma from '@/lib/prisma'
```

### Query Examples

```typescript
// Get all profiles
const profiles = await prisma.profile.findMany()

// Get profile by email
const profile = await prisma.profile.findUnique({
  where: { email: 'somchai@test.com' }
})

// Create wedding site
const site = await prisma.weddingSite.create({
  data: {
    userId: user.id,
    title: 'งานแต่งของเรา',
    slug: 'our-wedding',
    template: 'classic',
  }
})

// Get wedding sites with RSVPs
const sites = await prisma.weddingSite.findMany({
  where: { userId: user.id },
  include: {
    rsvps: true,
    analytics: true,
  }
})

// Count users by plan
const stats = await prisma.profile.groupBy({
  by: ['plan'],
  _count: true,
})

// Update profile
await prisma.profile.update({
  where: { id: user.id },
  data: { plan: 'PRO' }
})

// Delete wedding site
await prisma.weddingSite.delete({
  where: { id: siteId }
})
```

---

## 🎨 Prisma Studio

เปิด GUI สำหรับดูและแก้ไข database:

```bash
bun run prisma:studio
```

จะเปิดเบราว์เซอร์ที่ `http://localhost:5555`

Features:
- ✅ ดูข้อมูลทุก table
- ✅ แก้ไขข้อมูลแบบ visual
- ✅ Filter และ sort
- ✅ Create, update, delete records

---

## 📝 Available Scripts

| Command | Description |
|---------|-------------|
| `bun run prisma:generate` | Generate Prisma Client |
| `bun run prisma:push` | Push schema to database |
| `bun run prisma:studio` | Open Prisma Studio |
| `bun run seed:prisma` | Seed test users |
| `bunx prisma migrate dev` | Create migration |
| `bunx prisma db pull` | Pull schema from database |
| `bunx prisma format` | Format schema file |

---

## 🔄 Development Workflow

### 1. Update Schema

แก้ไขไฟล์ `prisma/schema.prisma`:

```prisma
model Profile {
  // เพิ่ม field ใหม่
  phoneNumber String?
}
```

### 2. Push to Database

```bash
bun run prisma:push
```

### 3. Generate Client

```bash
bun run prisma:generate
```

### 4. Use in Code

```typescript
const profile = await prisma.profile.create({
  data: {
    name: 'John',
    email: 'john@example.com',
    phoneNumber: '0812345678', // field ใหม่
  }
})
```

---

## 🐛 Troubleshooting

### Error: "Can't reach database server"

**แก้ไข:** ตรวจสอบ DATABASE_URL

```bash
# ตรวจสอบว่า connection string ถูกต้อง
# แทนที่ [YOUR-PASSWORD] ด้วยรหัสผ่านจริง
```

---

### Error: "Environment variable not found: DATABASE_URL"

**แก้ไข:** เพิ่ม DATABASE_URL ใน `.env.local`

```env
DATABASE_URL="postgresql://..."
```

---

### Error: "Prisma Client is not generated"

**แก้ไข:** รัน generate command

```bash
bun run prisma:generate
```

---

### Error: "Table does not exist"

**แก้ไข:** Push schema to database

```bash
bun run prisma:push
```

---

### Error: "Type error in TypeScript"

**แก้ไข:** Restart TypeScript server

```
VS Code: Cmd+Shift+P > TypeScript: Restart TS Server
```

---

## 🆚 Prisma vs Raw SQL

### Raw SQL
```typescript
const users = await db.query('SELECT * FROM profiles WHERE plan = $1', ['PRO'])
```

### Prisma
```typescript
const users = await prisma.profile.findMany({
  where: { plan: 'PRO' }
})
```

**ข้อดีของ Prisma:**
- ✅ Type-safe
- ✅ Auto-completion
- ✅ Easier to maintain
- ✅ Prevents SQL injection
- ✅ Better error messages

---

## 📚 Resources

- [Prisma Docs](https://www.prisma.io/docs)
- [Prisma Schema Reference](https://www.prisma.io/docs/reference/api-reference/prisma-schema-reference)
- [Prisma Client API](https://www.prisma.io/docs/reference/api-reference/prisma-client-reference)
- [Prisma with Next.js](https://www.prisma.io/docs/guides/other/troubleshooting-orm/help-articles/nextjs-prisma-client-dev-practices)

---

## 🎯 Next Steps

1. ✅ Setup Prisma
2. ✅ Push schema
3. ✅ Generate client
4. ✅ Seed users
5. 🔄 Use Prisma in API routes
6. 🚀 Deploy to production

---

## 💡 Tips

1. **Always generate after schema changes**
   ```bash
   bun run prisma:generate
   ```

2. **Use Prisma Studio for debugging**
   ```bash
   bun run prisma:studio
   ```

3. **Format schema file**
   ```bash
   bunx prisma format
   ```

4. **Check schema for errors**
   ```bash
   bunx prisma validate
   ```

---

Made with 💕 by WedSite Team
