# การตั้งค่า Google OAuth

## ขั้นตอนการตั้งค่า Google OAuth

### 1. สร้าง Google Cloud Project

1. ไปที่ [Google Cloud Console](https://console.cloud.google.com/)
2. สร้าง Project ใหม่หรือเลือก Project ที่มีอยู่
3. เปิดใช้งาน Google+ API

### 2. สร้าง OAuth 2.0 Credentials

1. ไปที่ **APIs & Services** > **Credentials**
2. คลิก **Create Credentials** > **OAuth client ID**
3. เลือก Application type: **Web application**
4. ตั้งชื่อ: `WedSite Auth`

### 3. ตั้งค่า Authorized redirect URIs

เพิ่ม URLs ต่อไปนี้:

**Development:**
```
http://localhost:3000/api/auth/callback/google
```

**Production:**
```
https://yourdomain.com/api/auth/callback/google
```

### 4. คัดลอก Credentials

หลังจากสร้างเสร็จ คุณจะได้:
- **Client ID** (ตัวอย่าง: `123456789-abc.apps.googleusercontent.com`)
- **Client Secret** (ตัวอย่าง: `GOCSPX-abc123xyz`)

### 5. อัปเดต Environment Variables

เปิดไฟล์ `.env.local` และเพิ่ม:

```env
GOOGLE_CLIENT_ID=your-actual-client-id-here
GOOGLE_CLIENT_SECRET=your-actual-client-secret-here
```

### 6. Restart Development Server

```bash
bun dev
```

## การทดสอบ

1. ไปที่ `http://localhost:3000/login`
2. คลิกปุ่ม "เข้าสู่ระบบด้วย Google"
3. เลือกบัญชี Google
4. อนุญาตการเข้าถึง
5. คุณจะถูก redirect กลับมาที่ `/builder`

## หมายเหตุ

- ใน Development mode, Google จะแสดงหน้าจอเตือนว่า app ยังไม่ได้รับการยืนยัน (unverified)
- สำหรับ Production, คุณต้อง submit app เพื่อขอการยืนยันจาก Google
- ตรวจสอบให้แน่ใจว่า redirect URI ตรงกับที่ตั้งค่าใน Google Cloud Console

## Troubleshooting

### Error: redirect_uri_mismatch
- ตรวจสอบว่า redirect URI ใน Google Cloud Console ตรงกับ URL ที่ใช้งาน
- ตรวจสอบว่าไม่มี trailing slash (`/`) ที่ท้าย URL

### Error: invalid_client
- ตรวจสอบว่า Client ID และ Client Secret ถูกต้อง
- ตรวจสอบว่าไม่มีช่องว่างหรือตัวอักษรพิเศษที่ไม่ต้องการ

### Google Sign-in ไม่ทำงาน
- ตรวจสอบว่า Google+ API เปิดใช้งานแล้ว
- ลอง clear browser cache และ cookies
- ตรวจสอบ console log สำหรับ error messages
