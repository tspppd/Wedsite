import { authClient } from "../auth-client"

export const auth = {
  // 1. สมัครสมาชิก
  signUp: async (email: string, password: string, name: string) => {
    try {
      const { data, error } = await authClient.signUp.email({
        email,
        password,
        name,
      })
      return { data, error }
    } catch (err) {
      return { data: null, error: err }
    }
  },

  // 2. เข้าสู่ระบบด้วย Email
  signIn: async (email: string, password: string ) => {
    try {
      const { data, error } = await authClient.signIn.email({
        email,
        password,

      })
      return { data, error }
    } catch (err) {
      return { data: null, error: err }
    }
  },

  // 3. เข้าสู่ระบบด้วย Social (Google / Facebook)
  signInWithSocial: async (provider: 'google' | 'facebook') => {
    try {
      const { data, error } = await authClient.signIn.social({
        provider,
        callbackURL: `${window.location.origin}/dashboard`, // ล็อกอินเสร็จวิ่งไปหน้ารวมงาน
      })
      return { data, error }
    } catch (err) {
      return { data: null, error: err }
    }
  },

  // 4. ออกจากระบบ
  signOut: async () => {
    try {
      const { error } = await authClient.signOut()
      return { error }
    } catch (err) {
      return { error: err }
    }
  },

  // 5. ดึงข้อมูล Session ปัจจุบัน (ฝั่ง Client)
  getSession: async () => {
    const { data: session } = authClient.useSession()
    return { data: session, error: null }
  },

  // 6. ดึงข้อมูลผู้ใช้ (User ข้อมูลจะฝังอยู่ใน session ของ Better Auth)
  getUser: async () => {
    try {
      const res = await authClient.getSession()
      return { data: res?.data?.user, error: null }
    } catch (err) {
      return { data: null, error: err }
    }
  },

  // หมายเหตุ: Better Auth จะใช้ระบบ React Hook (useSession) ในการตรวจจับความเปลี่ยนแปลงสถานะหน้าจอแทน 
  // ทำให้เราไม่จำเป็นต้องสร้างฟังก์ชันลูปฟังคำสั่ง onAuthStateChange แบบผูกดักคอยเหมือนของ Supabase แล้วครับ
}