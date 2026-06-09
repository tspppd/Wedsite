'use client'

import { useRouter } from 'next/navigation';
import { Shield, Lock, Eye, Cookie, UserCheck, Share2, RefreshCw, Mail, ArrowLeft, Heart, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui';

export default function PrivacyPolicyPage() {
  const router = useRouter();

  const sections = [
    {
      icon: Eye,
      title: '1. ข้อมูลที่เราจัดเก็บและรวบรวม',
      content: [
        'ข้อมูลบัญชีผู้ใช้งาน (Account Information): ชื่อ-นามสกุล, อีเมล, และรูปภาพโปรไฟล์ผ่านระบบยืนยันตัวตน (Better Auth, Google, Facebook)',
        'ข้อมูลเว็บไซต์งานแต่งงาน (Wedding Site Information): ชื่อเจ้าบ่าว-เจ้าสาว, วันเวลาและสถานที่จัดงาน, ภาพถ่ายในแกลเลอรี่, เรื่องราวความรัก',
        'ข้อมูลของแขกผู้ร่วมงาน (RSVP & Blessings): ชื่อแขก, อีเมล, เบอร์โทรศัพท์, สถานะการร่วมงาน, จำนวนผู้ติดตาม, ข้อมูลการแพ้อาหาร, และคำอวยพร',
        'ข้อมูลการชำระเงิน (Payment Information): เลขที่อ้างอิงธุรกรรม วันเวลา และจำนวนเงิน โดยระบบจะไม่เก็บรหัสบัตรเครดิตหรือบัญชีธนาคารของคุณโดยตรง',
      ]
    },
    {
      icon: UserCheck,
      title: '2. วิธีการที่เราใช้ข้อมูลของคุณ',
      content: [
        'เพื่อให้บริการ ดำเนินการ และดูแลรักษาประสิทธิภาพการทำงานของแพลตฟอร์มสร้างเว็บไซต์งานแต่งงาน',
        'เพื่อแสดงผลหน้าเว็บไซต์งานแต่งงานของคุณให้แก่แขกผู้มีเกียรติได้อย่างถูกต้องตามที่คุณกำหนดไว้',
        'เพื่อสรุปผลและรายงานสถิติแขกที่มาร่วมงาน (RSVP) และคำอวยพรในระบบแดชบอร์ดหลังบ้านของคู่บ่าวสาว',
        'เพื่อวัตถุประสงค์ในการยืนยันตัวตน รักษาความปลอดภัยของบัญชี และป้องกันการใช้งานที่มิชอบด้วยกฎหมาย',
      ]
    },
    {
      icon: Cookie,
      title: '3. การใช้คุกกี้ (Cookies) และเทคโนโลยีการติดตาม',
      content: [
        'เรามีการใช้งานคุกกี้เพื่อช่วยให้คุณสามารถเข้าสู่ระบบและใช้งานแอปพลิเคชันได้อย่างต่อเนื่อง (Session Management)',
        'เก็บข้อมูลเชิงสถิติโดยไม่มีการระบุตัวตน (Analytics) เพื่อตรวจเช็คจำนวนผู้เข้าชมเว็บไซต์และนำมาพัฒนาความเร็วในการโหลดหน้าเว็บ',
        'คุณสามารถเลือกที่จะปฏิเสธการใช้งานคุกกี้ได้โดยการตั้งค่าที่เบราว์เซอร์ของคุณ แต่อาจส่งผลให้ไม่สามารถใช้งานบางฟีเจอร์ได้สมบูรณ์',
      ]
    },
    {
      icon: Share2,
      title: '4. การเปิดเผยและการแบ่งปันข้อมูล',
      content: [
        'เราจะไม่นำข้อมูลส่วนบุคคลของคุณไปขาย แลกเปลี่ยน หรือให้เช่าแก่บุคคลภายนอกเด็ดขาด',
        'แชร์ข้อมูลเฉพาะผู้ให้บริการภายนอกที่จำเป็น (Third-Party Providers) เช่น ระบบคลาวด์ฐานข้อมูล (Supabase) และระบบยืนยันตัวตน (Better Auth)',
        'เปิดเผยข้อมูลในกรณีที่มีกฎหมายกำหนด มีหมายศาล หรือคำสั่งจากหน่วยงานรัฐบาลที่เกี่ยวข้องเพื่อความถูกต้องตามกระบวนการทางกฎหมาย',
      ]
    },
    {
      icon: Lock,
      title: '5. การรักษาความปลอดภัยของข้อมูล',
      content: [
        'ระบบของเราใช้มาตรการทางเทคนิคและมาตรการการเข้ารหัส (Encryption) ที่ได้มาตรฐานสากล',
        'ปกป้องข้อมูลจากการสูญหาย การเข้าถึงที่ไม่ได้รับอนุญาต การเปิดเผย หรือการเปลี่ยนแปลงแก้ไขโดยไม่ชอบด้วยกฎหมาย',
      ]
    },
    {
      icon: Shield,
      title: '6. สิทธิ์ในข้อมูลส่วนบุคคลของคุณ',
      content: [
        'คุณมีสิทธิ์ในการเข้าถึง แก้ไข อัปเดตข้อมูลส่วนบุคคลของคุณได้ตลอดเวลาผ่านแผงควบคุม (Dashboard)',
        'คุณสามารถส่งคำขอเพื่อขอลบข้อมูลบัญชีผู้ใช้งาน หรือข้อมูลเว็บไซต์งานแต่งงานทั้งหมดออกจากระบบฐานข้อมูลของเราได้อย่างถาวร',
      ]
    },
    {
      icon: RefreshCw,
      title: '7. การเปลี่ยนแปลงนโยบายความเป็นส่วนตัว',
      content: [
        'เราอาจทำการอัปเดตนโยบายนี้เป็นครั้งคราวเพื่อความสอดคล้องกับการเปลี่ยนแปลงของบริการหรือข้อกำหนดทางกฎหมาย',
        'เราจะแจ้งให้ทราบด้วยการระบุ "วันที่มีผลบังคับใช้" ใหม่ที่ส่วนบนสุดของหน้านี้ และแนะนำให้เข้ามาตรวจสอบอย่างสม่ำเสมอ',
      ]
    },
    {
      icon: Trash2,
      title: '8. วิธียกเลิกการเชื่อมต่อและลบข้อมูลบัญชีผู้ใช้ผ่าน Facebook',
      content: [
        '1. ไปที่บัญชี Facebook ของคุณ เลือกเมนู การตั้งค่าและนโยบายความเป็นส่วนตัว > การตั้งค่า',
        '2. มองหาเมนู แอปและเว็บไซต์ (Apps and Websites)',
        '3. ค้นหาแอป [ชื่อแอปของคุณ] แล้วกด ลบออก (Remove)',
        '4. ระบบของเราจะทำการลบข้อมูลโปรไฟล์และเซสชันที่ผูกกับ Facebook ออกจากฐานข้อมูลภายใน 24 ชั่วโมง หรือคุณสามารถส่งอีเมลแจ้งความประสงค์มาได้ที่ support@wedsite.com',
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        
        {/* Back Button & Logo */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => router.back()}
            className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            ย้อนกลับ
          </Button>
          <div className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-pink-500 fill-pink-500" />
            <span className="font-bold text-sm text-gray-400 uppercase tracking-wider">WedSite Framework</span>
          </div>
        </div>

        {/* Header Block */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 md:p-10 border border-gray-200 dark:border-gray-700 shadow-sm mb-8 text-center md:text-left">
          <div className="w-12 h-12 bg-pink-100 dark:bg-pink-900/30 rounded-xl flex items-center justify-center mb-4 mx-auto md:mx-0">
            <Shield className="w-6 h-6 text-pink-500" />
          </div>
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-3">
            นโยบายความเป็นส่วนตัว (Privacy Policy)
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            มีผลบังคับใช้ตั้งแต่วันที่: <span className="font-semibold text-gray-700 dark:text-gray-300">9 มิถุนายน 2026</span>
          </p>
          <p className="mt-4 text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
            WedSite ให้ความสำคัญและเคารพต่อความเป็นส่วนตัวของผู้ใช้งานทุกท่าน ไม่ว่าจะเป็นคู่บ่าวสาวผู้สร้างสรรค์เว็บไซต์ หรือแขกผู้มีเกียรติที่เข้ามาเยี่ยมชมและตอบรับการเข้าร่วมงาน (RSVP) นโยบายฉบับนี้อธิบายถึงวิธีการที่เราจัดเก็บ ใช้ และปกป้องข้อมูลของคุณ
          </p>
        </div>

        {/* Policy Sections Grid */}
        <div className="space-y-6">
          {sections.map((section, idx) => {
            const Icon = section.icon;
            return (
              <div 
                key={idx} 
                className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm transition-all hover:border-gray-300 dark:hover:border-gray-600"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-gray-50 dark:bg-gray-700 rounded-lg text-pink-500">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                    {section.title}
                  </h2>
                </div>
                <ul className="space-y-2.5 pl-1">
                  {section.content.map((bullet, bIdx) => (
                    <li key={bIdx} className="text-sm text-gray-600 dark:text-gray-300 flex items-start gap-2 leading-relaxed">
                      <span className="text-pink-400 mt-1.5 shrink-0 block w-1.5 h-1.5 rounded-full bg-current" />
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>

        {/* Contact Block */}
        <div className="bg-gray-900 text-white rounded-2xl p-6 md:p-8 mt-8 border border-gray-800 text-center">
          <Mail className="w-8 h-8 text-pink-400 mx-auto mb-3" />
          <h3 className="text-lg font-bold mb-2">มีคำถามหรือข้อสงสัยเกี่ยวกับนโยบายนี้?</h3>
          <p className="text-sm text-gray-400 max-w-md mx-auto mb-4">
            หากคุณต้องการขอลบข้อมูลบัญชีผู้ใช้งาน ข้อมูลงานแต่งงาน หรือมีข้อสงสัยใดๆ สามารถติดต่อทีมงานของเราได้ทันที
          </p>
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-800 border border-gray-700 rounded-full text-sm font-mono text-pink-300">
            support@wedsite.com
          </div>
        </div>

        {/* Footer Note */}
        <p className="text-center text-xs text-gray-400 mt-8">
          © 2026 WedSite Platform. All rights reserved. มุ่งมั่นดูแลข้อมูลคู่รักตามมาตรฐาน PDPA
        </p>

      </div>
    </div>
  );
}