// src/types/auth.d.ts
import { auth } from "@/lib/auth";

type Session = typeof auth.$infer.Session;
// ตัวนี้จะช่วยแมปเอา additionalFields ที่เราประกาศไว้ฝั่ง Server 
// มารวมร่างเข้ากับ Type ของหน้าบ้านให้โดยอัตโนมัติครับ