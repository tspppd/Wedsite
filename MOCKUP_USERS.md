# Mockup Users สำหรับทดสอบ

## วิธีการสร้าง Test Users

### ขั้นตอนที่ 1: สร้าง Users ผ่านหน้า Register

ไปที่ `http://localhost:3000/register` และสร้าง users ตามข้อมูลด้านล่าง

---

## 👤 User ทั่วไป (Free Plan)

### User 1: สมชาย ใจดี
```
ชื่อ-นามสกุล: สมชาย ใจดี
อีเมล: somchai@test.com
รหัสผ่าน: Test1234
Plan: Free
```

**สำหรับทดสอบ:**
- การสร้างเว็บแต่งงานพื้นฐาน
- ฟีเจอร์ Free Plan
- การอัปเกรดเป็น Pro

---

### User 2: สมหญิง รักดี
```
ชื่อ-นามสกุล: สมหญิง รักดี
อีเมล: somying@test.com
รหัสผ่าน: Test1234
Plan: Free
```

**สำหรับทดสอบ:**
- Multiple users
- การแชร์เว็บไซต์
- RSVP system

---

## 💎 User Pro Plan

### User 3: ธนพล มั่งมี
```
ชื่อ-นามสกุล: ธนพล มั่งมี
อีเมล: thanapol@test.com
รหัสผ่าน: Test1234
Plan: Pro
```

**สำหรับทดสอบ:**
- ฟีเจอร์ Pro Plan ทั้งหมด
- Custom Domain
- Premium Templates
- Priority Support

---

## 👨‍💼 Admin User

### Admin: ผู้ดูแลระบบ
```
ชื่อ-นามสกุล: Admin WedSite
อีเมล: admin@wedsite.com
รหัสผ่าน: Admin1234
Role: Admin
```

**สำหรับทดสอบ:**
- จัดการ users
- ดู analytics
- จัดการ templates
- Support tickets

---

## 🔐 Quick Login Credentials

### สำหรับ Copy-Paste ในหน้า Login:

**User ทั่วไป:**
```
Email: somchai@test.com
Password: Test1234
```

**Pro User:**
```
Email: thanapol@test.com
Password: Test1234
```

**Admin:**
```
Email: admin@wedsite.com
Password: Admin1234
```

---

## 📝 หมายเหตุ

1. **Password Requirements:**
   - ต้องมีอย่างน้อย 8 ตัวอักษร
   - มีตัวพิมพ์เล็ก (a-z)
   - มีตัวพิมพ์ใหญ่ (A-Z)
   - มีตัวเลข (0-9)

2. **การสร้าง Users:**
   - ใช้หน้า Register: `/register`
   - หรือใช้ Google Sign-in (ถ้าตั้งค่า OAuth แล้ว)

3. **Database:**
   - Users จะถูกเก็บใน SQLite database (`sqlite.db`)
   - สามารถลบ database เพื่อเริ่มใหม่ได้

4. **Testing Scenarios:**
   - Login/Logout
   - Session management
   - Role-based access
   - Feature restrictions (Free vs Pro)

---

## 🧪 Test Cases

### Test Case 1: User Registration
1. ไปที่ `/register`
2. กรอกข้อมูล user ทั่วไป
3. ตรวจสอบว่าสร้างบัญชีสำเร็จ
4. Redirect ไปที่ `/builder`

### Test Case 2: User Login
1. ไปที่ `/login`
2. กรอก email และ password
3. ตรวจสอบว่า login สำเร็จ
4. ตรวจสอบ session ใน Navbar

### Test Case 3: Google Login
1. ไปที่ `/login`
2. คลิก "เข้าสู่ระบบด้วย Google"
3. เลือกบัญชี Google
4. ตรวจสอบว่า login สำเร็จ

### Test Case 4: Protected Routes
1. ไปที่ `/builder` โดยไม่ login
2. ควร redirect ไปที่ `/login`
3. Login แล้วลองอีกครั้ง
4. ควรเข้าถึงได้

### Test Case 5: Logout
1. Login เข้าระบบ
2. คลิกปุ่ม Logout ใน Navbar
3. ตรวจสอบว่า logout สำเร็จ
4. Redirect ไปที่หน้าแรก

---

## 🔧 Development Tools

### ดู Database
```bash
# Install sqlite3
brew install sqlite3  # macOS
apt-get install sqlite3  # Linux

# Open database
sqlite3 sqlite.db

# View users table
.tables
SELECT * FROM user;
.quit
```

### Reset Database
```bash
# ลบ database
rm sqlite.db sqlite.db-shm sqlite.db-wal

# Restart server
bun dev
```

---

## 🎯 Feature Testing Matrix

| Feature | Free User | Pro User | Admin |
|---------|-----------|----------|-------|
| Create Website | ✅ | ✅ | ✅ |
| Basic Templates | ✅ | ✅ | ✅ |
| Premium Templates | ❌ | ✅ | ✅ |
| Custom Domain | ❌ | ✅ | ✅ |
| Unlimited Guests | ❌ | ✅ | ✅ |
| Analytics | Basic | Advanced | Full |
| Support | Email | Priority | Direct |
| User Management | ❌ | ❌ | ✅ |
| Template Management | ❌ | ❌ | ✅ |

---

## 📧 Contact for Issues

หากพบปัญหาในการทดสอบ:
1. ตรวจสอบ console log
2. ตรวจสอบ network tab
3. ตรวจสอบ database
4. Clear browser cache และลองใหม่
