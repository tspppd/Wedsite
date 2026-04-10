import { Template, Section, SectionType, Plan } from '@/types/index';

// ===== Templates =====
export const templates: Template[] = [
  {
    id: 'elegant',
    name: 'Elegant Gold',
    description: 'โทนสีทองหรูหรา เรียบง่าย ดูแพง เหมาะกับงานกลางคืน',
    preview: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
    colors: {
      primary: '#d4af37',
      secondary: '#1a1a2e',
      accent: '#f5e6d3',
      background: '#faf8f5',
      text: '#1a1a2e',
    },
    font: 'Playfair Display',
  },
  {
    id: 'romantic',
    name: 'Romantic Pink',
    description: 'โทนสีชมพูหวาน อบอุ่น เหมาะกับงานกลางวัน',
    preview: 'linear-gradient(135deg, #fce4ec 0%, #f8bbd9 50%, #e1bee7 100%)',
    colors: {
      primary: '#d81b60',
      secondary: '#4a1942',
      accent: '#fce4ec',
      background: '#fff5f8',
      text: '#374151',
    },
    font: 'Cormorant Garamond',
  },
];

// ===== Section Configurations =====
export const sectionConfig: Record<SectionType, { title: string; icon: string; description: string }> = {
  'hero': {
    title: 'หน้าปก',
    icon: '💒',
    description: 'รูปคู่ ชื่อบ่าวสาว และวันแต่งงาน',
  },
  'our-story': {
    title: 'เรื่องราวของเรา',
    icon: '💕',
    description: 'เล่าความเป็นมาของความรัก',
  },
  'schedule': {
    title: 'กำหนดการ',
    icon: '📅',
    description: 'Timeline ของงานแต่งงาน',
  },
  'venue': {
    title: 'สถานที่',
    icon: '📍',
    description: 'รายละเอียดสถานที่และแผนที่',
  },
  'rsvp': {
    title: 'RSVP',
    icon: '✉️',
    description: 'แบบฟอร์มตอบรับการเข้าร่วมงาน',
  },
  'gallery': {
    title: 'แกลเลอรี่',
    icon: '📸',
    description: 'รวบรวมรูปภาพคู่',
  },
  'dress-code': {
    title: 'Dress Code',
    icon: '👔',
    description: 'สีและสไตล์ที่แนะนำสำหรับแขก',
  },
  'gift': {
    title: 'ของขวัญ',
    icon: '🎁',
    description: 'ซองงานแต่ง หรือ Gift Registry',
  },
  'faq': {
    title: 'คำถามที่พบบ่อย',
    icon: '❓',
    description: 'FAQ และข้อมูลติดต่อ',
  },
};

// ===== Default Sections =====
export const defaultSections: Section[] = [
  { id: '1', type: 'hero', title: 'หน้าปก', enabled: true, order: 0, content: {} },
  { id: '2', type: 'our-story', title: 'เรื่องราวของเรา', enabled: true, order: 1, content: {} },
  { id: '3', type: 'schedule', title: 'กำหนดการ', enabled: true, order: 2, content: {} },
  { id: '4', type: 'venue', title: 'สถานที่', enabled: true, order: 3, content: {} },
  { id: '5', type: 'rsvp', title: 'RSVP', enabled: true, order: 4, content: {} },
  { id: '6', type: 'gallery', title: 'แกลเลอรี่', enabled: false, order: 5, content: {} },
  { id: '7', type: 'dress-code', title: 'Dress Code', enabled: false, order: 6, content: {} },
  { id: '8', type: 'gift', title: 'ของขวัญ', enabled: false, order: 7, content: {} },
  { id: '9', type: 'faq', title: 'คำถามที่พบบ่อย', enabled: false, order: 8, content: {} },
];

// ===== Plans =====
export const plans: Plan[] = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    features: [
      'ใช้ Template ได้ 1 แบบ',
      'Section พื้นฐาน 5 Section',
      'URL เว็บไซต์แบบสุ่ม',
      'รองรับแขก 50 คน',
    ],
    limitations: [
      'มีโฆษณา',
      'ไม่สามารถใช้ Custom Domain',
      'ไม่สามารถดาวน์โหลดข้อมูล RSVP',
    ],
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 399,
    popular: true,
    features: [
      'ใช้ Template ได้ทุกแบบ',
      'Section ครบทุก Section',
      'Custom URL',
      'รองรับแขกไม่จำกัด',
      'ไม่มีโฆษณา',
      'Export ข้อมูล RSVP เป็น Excel',
      'Custom Background Music',
      'Photo Gallery ไม่จำกัด',
    ],
  },
];

// ===== Recommended Sections =====
export const recommendedSections = [
  {
    title: 'Hero / หน้าปก',
    description: 'สิ่งแรกที่แขกเห็น ควรมีรูปคู่สวยๆ ชื่อบ่าวสาว วันแต่งงาน',
    importance: 'essential',
  },
  {
    title: 'Our Story / เรื่องราวของเรา',
    description: 'เล่าที่มาของความรัก เช่น เจอกันยังไง คบกันมานานแค่ไหน',
    importance: 'recommended',
  },
  {
    title: 'Schedule / กำหนดการ',
    description: 'Timeline ของงานแต่ละช่วง เช่น พิธีเช้า งานเลี้ยงเย็น',
    importance: 'essential',
  },
  {
    title: 'Venue / สถานที่',
    description: 'รายละเอียดสถานที่ แผนที่นำทาง Google Maps',
    importance: 'essential',
  },
  {
    title: 'RSVP / ตอบรับการเข้าร่วม',
    description: 'ฟอร์มสำหรับแขกยืนยันการมา จำนวนคน อาหารที่แพ้',
    importance: 'essential',
  },
  {
    title: 'Photo Gallery / แกลเลอรี่',
    description: 'รวบรวมรูปภาพคู่ รูป pre-wedding สร้างความประทับใจ',
    importance: 'recommended',
  },
  {
    title: 'Dress Code',
    description: 'แนะนำสีและสไตล์การแต่งกายสำหรับแขก',
    importance: 'optional',
  },
  {
    title: 'Gift Registry / ซอง',
    description: 'เลขบัญชี หรือ QR Code สำหรับซองงานแต่ง',
    importance: 'optional',
  },
  {
    title: 'FAQ / คำถามที่พบบ่อย',
    description: 'ตอบคำถามที่แขกมักถาม เช่น ที่จอดรถ ชุดเดรสโค้ด',
    importance: 'recommended',
  },
];

// ===== Tech Stack =====
export const techStack = [
  { name: 'Next.js', description: 'App Router, Server Components' },
  { name: 'TypeScript', description: 'Type Safety' },
  { name: 'Tailwind CSS v5', description: 'Utility-first CSS' },
  { name: 'shadcn/ui', description: 'UI Components' },
  { name: 'Zod', description: 'Schema Validation' },
  { name: 'Zustand', description: 'State Management' },
];
