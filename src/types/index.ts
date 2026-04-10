import { z } from 'zod';

// ===== Section Types =====
export const SECTION_TYPES = {
  HERO: 'hero',
  OUR_STORY: 'our-story',
  SCHEDULE: 'schedule',
  VENUE: 'venue',
  RSVP: 'rsvp',
  GALLERY: 'gallery',
  DRESS_CODE: 'dress-code',
  GIFT: 'gift',
  FAQ: 'faq',
} as const;

export type SectionType = typeof SECTION_TYPES[keyof typeof SECTION_TYPES];

export interface Section {
  id: string;
  type: SectionType;
  title: string;
  enabled: boolean;
  order: number;
  content: Record<string, unknown>;
}

// ===== Template Types =====
export type TemplateId = 'elegant' | 'romantic';

export interface Template {
  id: TemplateId;
  name: string;
  description: string;
  preview: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
  };
  font: string;
}

// ===== User & Auth Types =====
export const loginSchema = z.object({
  email: z.string().email('กรุณากรอกอีเมลให้ถูกต้อง'),
  password: z.string().min(6, 'รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร'),
});

export const registerSchema = z.object({
  name: z.string().min(2, 'ชื่อต้องมีอย่างน้อย 2 ตัวอักษร'),
  email: z.string().email('กรุณากรอกอีเมลให้ถูกต้อง'),
  password: z.string().min(6, 'รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'รหัสผ่านไม่ตรงกัน',
  path: ['confirmPassword'],
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;

export interface User {
  id: string;
  name: string;
  email: string;
  plan: 'free' | 'pro';
  avatar?: string;
}

// ===== Wedding Website Types =====
export const weddingInfoSchema = z.object({
  partner1Name: z.string().min(1, 'กรุณากรอกชื่อบ่าวสาว'),
  partner2Name: z.string().min(1, 'กรุณากรอกชื่อบ่าวสาว'),
  weddingDate: z.string().min(1, 'กรุณาเลือกวันแต่งงาน'),
  weddingTime: z.string().optional(),
  venue: z.string().optional(),
  venueAddress: z.string().optional(),
  story: z.string().optional(),
  message: z.string().optional(),
});

export type WeddingInfoInput = z.infer<typeof weddingInfoSchema>;

export interface WeddingWebsite {
  id: string;
  userId: string;
  templateId: TemplateId;
  weddingInfo: WeddingInfoInput;
  sections: Section[];
  slug: string;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

// ===== Payment Types =====
export const paymentSchema = z.object({
  cardNumber: z.string().regex(/^\d{16}$/, 'กรุณากรอกเลขบัตร 16 หลัก'),
  expiryDate: z.string().regex(/^\d{2}\/\d{2}$/, 'กรุณากรอกในรูปแบบ MM/YY'),
  cvv: z.string().regex(/^\d{3}$/, 'กรุณากรอก CVV 3 หลัก'),
  cardName: z.string().min(2, 'กรุณากรอกชื่อบนบัตร'),
});

export type PaymentInput = z.infer<typeof paymentSchema>;

// ===== Plan Types =====
export type PlanType = 'free' | 'pro';

export interface Plan {
  id: PlanType;
  name: string;
  price: number;
  features: string[];
  limitations?: string[];
  popular?: boolean;
}

// ===== Preview Types =====
export type DeviceType = 'desktop' | 'mobile';
