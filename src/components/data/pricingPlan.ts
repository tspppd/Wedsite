// 1. กำหนด Type และ Interface สำหรับความปลอดภัยของข้อมูล (Type Safety)
export interface FeatureItem {
  id: string;
  name: string;
  description: string;
  free: boolean;
  standard: boolean;
  pro: boolean;
}

export interface FeatureCategory {
  categoryName: string;
  features: FeatureItem[];
}

// 2. ข้อมูล Feature และ Plan ทั้งหมดในรูปแบบ Object
export const weddingPricingPlans: FeatureCategory[] = [
  {
    categoryName: "Core Web Page (หน้าเว็บไซต์หลัก)",
    features: [
      {
        id: "basic-info",
        name: "ข้อมูลบ่าวสาว & วันเวลาสถานที่",
        description: "แสดงชื่อ เรื่องราวความรัก วันจัดงาน และกำหนดการ",
        free: true,
        standard: true,
        pro: true,
      },
      {
        id: "google-maps",
        name: "แผนที่ Google Maps Integration",
        description: "ปักหมุดสถานที่จัดงาน กดนำทางได้ทันที",
        free: true,
        standard: true,
        pro: true,
      },
      {
        id: "countdown",
        name: "ระบบนับถอยหลัง (Countdown Timer)",
        description: "นาฬิกานับถอยหลังสู่สร้างวันสำคัญ",
        free: true,
        standard: true,
        pro: true,
      },
      {
        id: "photo-gallery-limit",
        name: "แกลเลอรีรูปภาพ (จำกัดจำนวน)",
        description: "อัปโหลดรูปภาพ Pre-wedding ได้สูงสุด 10 รูป",
        free: true,
        standard: true,
        pro: true,
      },
      {
        id: "photo-gallery-unlimit",
        name: "แกลเลอรีรูปภาพ (ไม่จำกัด)",
        description: "อัปโหลดรูปภาพได้ไม่จำกัด พร้อมระบบสไลด์โชว์",
        free: false,
        standard: true,
        pro: true,
      },
      {
        id: "bg-music",
        name: "เพลงบรรเลงพื้นหลัง (Background Music)",
        description: "เปิดเพลงอัตโนมัติเมื่อแขกกดเข้าเว็บไซต์",
        free: false,
        standard: true,
        pro: true,
      },
    ],
  },
  {
    categoryName: "Guest Management & RSVP (ระบบจัดการแขก)",
    features: [
      {
        id: "basic-rsvp",
        name: "แบบฟอร์ม RSVP พื้นฐาน",
        description: "ให้แขกกรอกสถานะว่าจะมาร่วมงานหรือไม่",
        free: true,
        standard: true,
        pro: true,
      },
      {
        id: "advanced-rsvp",
        name: "RSVP ขั้นสูง (อาหาร & ผู้ติดตาม)",
        description: "ระบุจำนวนผู้ติดตาม เมนูอาหารที่แพ้ หรือความต้องการพิเศษ",
        free: false,
        standard: true,
        pro: true,
      },
      {
        id: "export-csv",
        name: "ส่งออกข้อมูลแขก (Export to Excel/CSV)",
        description: "ดึงข้อมูลรายชื่อแขกและสรุปยอดไปจัดโต๊ะจีนต่อได้ง่าย",
        free: false,
        standard: true,
        pro: true,
      },
      {
        id: "seating-chart",
        name: "ระบบจัดที่นั่งแขก (Seating Chart Builder)",
        description: "วางผังโต๊ะและระบุว่าแขกคนไหนนั่งโต๊ะไหน",
        free: false,
        standard: false,
        pro: true,
      },
    ],
  },
  {
    categoryName: "Interactions & Blessing (การแชร์และการอวยพร)",
    features: [
      {
        id: "wishes-wall",
        name: "สมุดอวยพรออนไลน์ (Wishes Wall)",
        description: "แขกสามารถพิมพ์คำอวยพรส่งตรงเข้าสู่หน้าเว็บได้",
        free: false,
        standard: true,
        pro: true,
      },
      {
        id: "upload-guest-photos",
        name: "แขกร่วมอัปโหลดรูปภาพในงาน",
        description: "ให้แขกยิง QR Code เพื่ออัปโหลดรูปที่ถ่ายในงานขึ้นเว็บได้ทันที",
        free: false,
        standard: false,
        pro: true,
      },
      {
        id: "money-blessing",
        name: "กล่องรับซองดิจิทัล (QR Code PromptPay)",
        description: "แสดง QR Code สำหรับแขกที่ต้องการโอนเงินช่วยซอง",
        free: false,
        standard: true,
        pro: true,
      },
    ],
  },
  {
    categoryName: "Design & Customization (การตกแต่งและโดเมน)",
    features: [
      {
        id: "free-templates",
        name: "ธีมมาตรฐาน (Standard Templates)",
        description: "เลือกใช้งานธีมพื้นฐานที่ระบบกำหนดให้",
        free: true,
        standard: true,
        pro: true,
      },
      {
        id: "premium-templates",
        name: "ธีมพรีเมียม (Premium Templates)",
        description: "เข้าถึงดีไซน์ที่หรูหรา ทันสมัย และอนิเมชันที่สวยงามกว่า",
        free: false,
        standard: true,
        pro: true,
      },
      {
        id: "custom-font-color",
        name: "ปรับแต่งฟอนต์และโทนสีอิสระ",
        description: "เปลี่ยนคัลเลอร์พาเลทและฟอนต์ให้ตรงกับธีมงานแต่งจริง",
        free: false,
        standard: true,
        pro: true,
      },
      {
        id: "remove-watermark",
        name: "ลบลายเซ็นผู้พัฒนา (Remove Watermark)",
        description: "เอาเครดิต 'Powered by...' ออกจากท้ายเว็บไซต์",
        free: false,
        standard: true,
        pro: true,
      },
      {
        id: "custom-domain",
        name: "ใช้โดเมนส่วนตัว (Custom Domain)",
        description: "เปลี่ยน URL เป็นชื่อตัวเอง เช่น www.johnandjane.com",
        free: false,
        standard: false,
        pro: true,
      },
      {
        id: "password-protection",
        name: "ระบบล็อกรหัสผ่านเข้าเว็บ (Private Wedding)",
        description: "ตั้ง Password สำหรับงานปิดเฉพาะแขกที่มีรหัสเท่านั้น",
        free: false,
        standard: false,
        pro: true,
      },
    ],
  },
];