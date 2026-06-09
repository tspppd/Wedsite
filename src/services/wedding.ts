// src/services/wedding.ts
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function getWeddingData() {
  // 1. ตรวจสอบ Session จากตัวคุกกี้ที่ส่งมาใน Headers ฝั่ง Server
  const { headers } = await import('next/headers')
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session || !session.user) {
    return { user: null, wedding: null };
  }

  // 2. ไปดึงข้อมูลตรงๆ จากฐานข้อมูลผ่าน Prisma โดยตรง ไม่ต้องผ่าน HTTP API 
  const weddingSite = await prisma.weddingSite.findFirst({
    where: {
      userId: session.user.id,
    },
    select: {
      id: true,
      title: true,
      slug: true,
      groomName: true,
      brideName: true,
      weddingDate: true,
      isPublished: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return {
    user: {
      id: session.user.id,
      name: session.user.name,
      email: session.user.email,
      plan: (session.user as any).plan || "FREE",
    },
    wedding: weddingSite,
  };
}