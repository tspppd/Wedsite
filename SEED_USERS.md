# 🌱 Seed Test Users

คู่มือการสร้าง mockup users สำหรับทดสอบ

## วิธีที่ 1: ใช้ API Script (แนะนำ)

### ขั้นตอน:

1. **เปิด dev server ในหน้าต่างแรก:**
```bash
bun dev
```

2. **รัน seed script ในหน้าต่างใหม่:**
```bash
bun run seed
```

### Output ที่คาดหวัง:

```
🌱 Starting to seed users via API...

📡 API URL: http://localhost:3000

⚠️  Make sure the dev server is running (bun dev)

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

📝 You can now login with these credentials:
   - somchai@test.com / Test1234 (Free User)
   - thanapol@test.com / Test1234 (Pro User)
   - admin@wedsite.com / Admin1234 (Admin)

🔗 Test users page: http://localhost:3000/test-users
```

---

## วิธีที่ 2: สร้างผ่านหน้า Register (Manual)

### ขั้นตอน:

1. ไปที่ `http://localhost:3000/register`
2. กรอกข้อมูลตามนี้:

#### User 1: Free User
```
ชื่อ-นามสกุล: สมชาย ใจดี
อีเมล: somchai@test.com
รหัสผ่าน: Test1234
ยืนยันรหัสผ่าน: Test1234
```

#### User 2: Free User
```
ชื่อ-นามสกุล: สมหญิง รักดี
อีเมล: somying@test.com
รหัสผ่าน: Test1234
ยืนยันรหัสผ่าน: Test1234
```

#### User 3: Pro User
```
ชื่อ-นามสกุล: ธนพล มั่งมี
อีเมล: thanapol@test.com
รหัสผ่าน: Test1234
ยืนยันรหัสผ่าน: Test1234
```

#### User 4: Admin
```
ชื่อ-นามสกุล: Admin WedSite
อีเมล: admin@wedsite.com
รหัสผ่าน: Admin1234
ยืนยันรหัสผ่าน: Admin1234
```

---

## วิธีที่ 3: ใช้หน้า Test Users

1. ไปที่ `http://localhost:3000/test-users`
2. คลิกปุ่ม "Copy Email" และ "Copy Password"
3. ไปที่หน้า Login และวางข้อมูล
4. หรือคลิก "Login as ..." เพื่อไปหน้า Login โดยตรง

---

## 🔍 ตรวจสอบ Users ที่สร้างแล้ว

### ดูใน Database:

```bash
sqlite3 sqlite.db "SELECT id, name, email, createdAt FROM user;"
```

### ดูผ่าน Test Users Page:

```
http://localhost:3000/test-users
```

---

## 🐛 Troubleshooting

### Error: "Failed to fetch" หรือ "Connection refused"

**สาเหตุ:** Dev server ไม่ได้รัน

**แก้ไข:**
```bash
# Terminal 1: รัน dev server
bun dev

# Terminal 2: รัน seed script
bun run seed
```

---

### Error: "User already exists"

**สาเหตุ:** User ถูกสร้างไปแล้ว

**แก้ไข:** ไม่ต้องทำอะไร หรือลบ database แล้วสร้างใหม่:
```bash
rm sqlite.db sqlite.db-shm sqlite.db-wal
bun dev
bun run seed
```

---

### Error: "Validation failed"

**สาเหตุ:** รหัสผ่านไม่ตรงตามเงื่อนไข

**เงื่อนไขรหัสผ่าน:**
- อย่างน้อย 8 ตัวอักษร
- มีตัวพิมพ์เล็ก (a-z)
- มีตัวพิมพ์ใหญ่ (A-Z)
- มีตัวเลข (0-9)

---

### Error: "ECONNREFUSED" หรือ "Port 3000 is already in use"

**แก้ไข:**
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# หรือใช้ port อื่น
PORT=3001 bun dev
```

---

## 📝 Test Credentials Summary

| Name | Email | Password | Role | Plan |
|------|-------|----------|------|------|
| สมชาย ใจดี | somchai@test.com | Test1234 | user | free |
| สมหญิง รักดี | somying@test.com | Test1234 | user | free |
| ธนพล มั่งมี | thanapol@test.com | Test1234 | user | pro |
| Admin WedSite | admin@wedsite.com | Admin1234 | admin | pro |

---

## 🔄 Reset และเริ่มใหม่

```bash
# 1. ลบ database
rm sqlite.db sqlite.db-shm sqlite.db-wal

# 2. รัน dev server
bun dev

# 3. สร้าง users ใหม่
bun run seed
```

---

## 💡 Tips

1. **ใช้ Test Users Page** สำหรับ copy-paste credentials ง่ายๆ
2. **เปิด 2 terminals** - หนึ่งสำหรับ dev server, อีกหนึ่งสำหรับ commands
3. **ใช้ DevTools** เพื่อดู network requests และ console logs
4. **ตรวจสอบ .env.local** ให้แน่ใจว่ามี BETTER_AUTH_SECRET

---

## 🆘 ยังมีปัญหา?

1. ตรวจสอบ console log ใน terminal
2. ตรวจสอบ browser console (F12)
3. ดู network tab ใน DevTools
4. ลอง clear browser cache
5. ลอง reset database

---

Made with 💕 by WedSite Team
