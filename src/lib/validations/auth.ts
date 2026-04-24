import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "กรุณากรอกอีเมล")
    .email("รูปแบบอีเมลไม่ถูกต้อง"),
  password: z
    .string()
    .min(1, "กรุณากรอกรหัสผ่าน")
    .min(8, "รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร"),
});

export const registerSchema = z
  .object({
    name: z
      .string()
      .min(1, "กรุณากรอกชื่อ-นามสกุล")
      .min(2, "ชื่อต้องมีอย่างน้อย 2 ตัวอักษร"),
    email: z.email("รูปแบบอีเมลไม่ถูกต้อง").min(1,'กรุณากรอกอีเมล'),
      // .min(1, "กรุณากรอกอีเมล")
      // .email("รูปแบบอีเมลไม่ถูกต้อง"),
    password: z
      .string()
      .min(1, "กรุณากรอกรหัสผ่าน")
      .min(8, "รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "รหัสผ่านต้องมีตัวพิมพ์เล็ก พิมพ์ใหญ่ และตัวเลข"
      ),
    confirmPassword: z.string().min(1, "กรุณายืนยันรหัสผ่าน"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "รหัสผ่านไม่ตรงกัน",
    path: ["confirmPassword"],
  });

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
