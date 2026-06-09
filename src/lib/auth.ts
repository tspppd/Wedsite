// src/lib/auth.ts
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import prisma from "./prisma"; // ไฟล์ Singleton ที่เราทำไว้ก่อนหน้านี้

export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "postgresql",
    }),
    user : {
        additionalFields: {
            plan : {
                type: "string",
                required: false,
                defaultValue: "FREE",
            },
            role : {
                type: "string",
                required: false,
                defaultValue: "USER",
            }
        }
    },
    emailAndPassword: {
        enabled: true, // เปิดใช้งานระบบสมัครด้วย Email + Password
    },
    socialProviders: {
        google: {
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        },
        facebook: {
            clientId: process.env.FACEBOOK_CLIENT_ID as string,
            clientSecret: process.env.FACEBOOK_CLIENT_SECRET as string,
        },
    }

    // หากต้องการเพิ่มระบบ Google/Facebook Login สามารถมาเติมตรงนี้ได้ในอนาคต
});