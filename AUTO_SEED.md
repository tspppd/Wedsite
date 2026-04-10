# 🌱 Auto-Seed on Dev Start

โปรเจค WedSite จะ seed test users อัตโนมัติเมื่อรัน `bun dev`

## 🔄 How It Works

เมื่อคุณรัน:
```bash
bun dev
```

ระบบจะทำงานตามลำดับ:

1. **Check Database Configuration**
   - ตรวจสอบว่ามี `DATABASE_URL` ใน `.env.local` หรือไม่
   - ถ้าไม่มี → ใช้ Better Auth + SQLite
   - ถ้ามี → ใช้ Prisma + Supabase

2. **Generate Prisma Client** (ถ้าใช้ Prisma)
   ```bash
   bunx prisma generate
   ```

3. **Seed Test Users** (ถ้ายังไม่มี)
   ```bash
   bun run seed:prisma
   ```

4. **Start Dev Server**
   ```bash
   next dev
   ```

---

## 📋 What Gets Seeded

### Test Users (4 accounts)

| Name | Email | Password | Role | Plan |
|------|-------|----------|------|------|
| สมชาย ใจดี | somchai@test.com | Test1234 | USER | FREE |
| สมหญิง รักดี | somying@test.com | Test1234 | USER | FREE |
| ธนพล มั่งมี | thanapol@test.com | Test1234 | USER | PRO |
| Admin WedSite | admin@wedsite.com | Admin1234 | ADMIN | PRO |

---

## 🎯 Expected Output

### First Time (Creating Users)

```bash
$ bun dev

🚀 Starting development setup...

📦 Generating Prisma Client...
✅ Prisma Client generated

🌱 Seeding database...

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

📝 You can now login with these credentials:
   - somchai@test.com / Test1234 (Free User)
   - thanapol@test.com / Test1234 (Pro User)
   - admin@wedsite.com / Admin1234 (Admin)

📊 Database Stats:
   Total Profiles: 4
   Free Users: 2
   Pro Users: 2

✨ Setup complete! Starting dev server...

  ▲ Next.js 16.2.3
  - Local:        http://localhost:3000
```

### Subsequent Times (Users Already Exist)

```bash
$ bun dev

🚀 Starting development setup...

📦 Generating Prisma Client...
✅ Prisma Client generated

🌱 Seeding database...

⏭️  User somchai@test.com already exists, skipping...
⏭️  User somying@test.com already exists, skipping...
⏭️  User thanapol@test.com already exists, skipping...
⏭️  User admin@wedsite.com already exists, skipping...

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📊 Summary:
   ✅ Created: 0
   ⏭️  Skipped: 4
   ❌ Failed: 0

✨ Seeding completed!

📊 Database Stats:
   Total Profiles: 4
   Free Users: 2
   Pro Users: 2

✨ Setup complete! Starting dev server...

  ▲ Next.js 16.2.3
  - Local:        http://localhost:3000
```

### Without DATABASE_URL (Using SQLite)

```bash
$ bun dev

🚀 Starting development setup...

⚠️  DATABASE_URL not found in .env.local
   Skipping Prisma setup. Using Better Auth + SQLite instead.

✨ Setup complete! Starting dev server...

  ▲ Next.js 16.2.3
  - Local:        http://localhost:3000
```

---

## ⚙️ Configuration

### Enable Auto-Seed (Default)

Auto-seed เปิดอยู่แล้วโดย default ผ่าน `predev` script:

```json
{
  "scripts": {
    "predev": "bun run scripts/dev-setup.ts",
    "dev": "next dev"
  }
}
```

### Disable Auto-Seed

ถ้าไม่ต้องการ auto-seed ให้แก้ไข `package.json`:

```json
{
  "scripts": {
    "dev": "next dev"
  }
}
```

หรือรัน dev server โดยตรง:
```bash
bunx next dev
```

---

## 🔧 Manual Seeding

ถ้าต้องการ seed ด้วยตัวเอง:

### Prisma + Supabase
```bash
bun run seed:prisma
```

### Supabase Direct
```bash
bun run seed:supabase
```

### Better Auth (API)
```bash
# ต้องเปิด dev server ก่อน
bun run seed
```

---

## 🐛 Troubleshooting

### Error: "DATABASE_URL not found"

**สาเหตุ:** ไม่มี DATABASE_URL ใน `.env.local`

**แก้ไข:**
```env
# เพิ่มใน .env.local
DATABASE_URL="postgresql://..."
```

---

### Error: "Prisma Client not generated"

**สาเหตุ:** Prisma Client ยังไม่ได้ generate

**แก้ไข:**
```bash
bun run prisma:generate
```

---

### Error: "Table does not exist"

**สาเหตุ:** Schema ยังไม่ได้ push ไปที่ database

**แก้ไข:**
```bash
bun run prisma:push
```

---

### Seeding Takes Too Long

**สาเหตุ:** Network latency กับ Supabase

**แก้ไข:** รอให้เสร็จ หรือ disable auto-seed:
```bash
# รัน dev โดยไม่ seed
bunx next dev
```

---

### Users Already Exist

**ไม่ต้องกังวล!** Script จะข้าม users ที่มีอยู่แล้วอัตโนมัติ

---

## 📊 Database Options

### Option 1: SQLite (No Setup)
```bash
# ไม่ต้องทำอะไร
bun dev
```

### Option 2: Supabase + Prisma (Recommended)
```bash
# 1. Set DATABASE_URL in .env.local
# 2. Push schema
bun run prisma:push

# 3. Start dev (auto-seed)
bun dev
```

---

## 🎓 Learn More

- [PRISMA_SETUP.md](./PRISMA_SETUP.md) - Prisma setup guide
- [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) - Supabase setup guide
- [DATABASE_COMPARISON.md](./DATABASE_COMPARISON.md) - Compare options
- [SEED_USERS.md](./SEED_USERS.md) - Manual seeding guide

---

## 💡 Tips

1. **First time setup:**
   ```bash
   # Set DATABASE_URL
   # Then just run:
   bun dev
   ```

2. **Reset database:**
   ```bash
   # Delete all data
   bun run prisma:push --force-reset
   
   # Restart dev (will auto-seed)
   bun dev
   ```

3. **View database:**
   ```bash
   bun run prisma:studio
   ```

4. **Skip auto-seed:**
   ```bash
   bunx next dev
   ```

---

Made with 💕 by WedSite Team
