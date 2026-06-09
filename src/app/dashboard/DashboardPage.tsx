'use client'

import { useRouter } from 'next/navigation';
import { 
  Heart, Eye, Edit3, Users, MessageSquare, 
  CheckCircle2, Clock, XCircle, Share2, Copy, 
  Calendar, ExternalLink, ArrowRight, LogOut
} from 'lucide-react';
import { Button } from '@/components/ui';
import { Card, CardContent } from '@/components/ui';
import { useState } from 'react';
import { getWeddingData } from '@/services/wedding';

export default async function DashboardPage() {
  const router = useRouter();
//   const { user, loading } = useAuth();
const { user , wedding } = await getWeddingData()
  const [copied, setCopied] = useState(false);
  const couple = `${wedding?.brideName}-${wedding?.groomName}`

  // สมมติ URL หน้าเว็บงานแต่งของคู่รักรายนี้
  const weddingUrl = `wedding-builder.com/wedding/${couple || 'bride-and-groom'}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(`https://${weddingUrl}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Redirect if not authenticated
  if (!user) {
    router.push('/login');
    return null;
  }


  // จำลองข้อมูลสถิติที่ดึงมาจาก Prisma DB
  const stats = {
    rsvp: { attending: 145, declined: 12, pending: 43, total: 200 },
    wishesCount: 34,
    daysLeft: 45,
    weddingDate: '25 ตุลาคม 2026',
    completionProgress: 60 // ทำเว็บเสร็จไปแล้ว 60%
  };

  // จำลองข้อมูลคำอวยพรล่าสุด (Recent Wishes)
  const recentWishes = [
    { id: 1, name: 'พี่สมชาย และครอบครัว', text: 'ยินดีด้วยกับทั้งสองคนขอให้มีความสุขมากๆ ถือไม้เท้ายอดทองกระบองยอดเพชรนะจ๊ะ', time: '2 ชั่วโมงที่แล้ว' },
    { id: 2, name: 'น้องนัท (เพื่อนเจ้าสาว)', text: 'สวยหล่อเหมาะสมกันที่สุดเลย! ตื่นเต้นกะวันงานมาก ร้องไห้เตรียมทิชชู่รอแล้วนะ', time: '5 ชั่วโมงที่แล้ว' },
  ];

  return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-gray-900 pb-12">
      {/* Top Navbar */}
      <nav className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="sm" onClick={() => router.push('/')}>
                <Heart className="w-6 h-6 text-pink-500 fill-pink-500" />
                <span className="font-bold text-lg text-gray-900 dark:text-white">Wedding Workspace</span>
              </Button>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-xs bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-300 font-semibold px-2.5 py-0.5 rounded-full uppercase">
                {user?.plan || 'FREE'}
              </span>
              <div>
                <Button variant="ghost" onClick={() => router.push('/logout')}>
                  <LogOut className="w-4 h-4 " />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Welcome Section */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 md:p-8 border border-gray-200 dark:border-gray-700 shadow-sm mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">
              ยินดีต้อนรับ, {user?.name || 'คู่รักผู้มีเกียรติ'} 💍
            </h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm flex items-center gap-2">
              <Calendar className="w-4 h-4 text-pink-500" />
              วันแต่งงานของคุณ: <span className="font-semibold text-gray-800 dark:text-gray-200">{stats.weddingDate}</span> 
              (เหลือเวลาอีก <span className="text-pink-500 font-bold">{stats.daysLeft} วัน</span>)
            </p>
          </div>
          
          <div className="flex flex-wrap gap-3 w-full md:w-auto">
            <Button variant="outline" className="flex-1 md:flex-initial" onClick={() => window.open(`https://${weddingUrl}`, '_blank')}>
              <Eye className="w-4 h-4 mr-2" />
              ดูเว็บจริง
            </Button>
            <Button className="flex-1 md:flex-initial bg-pink-500 hover:bg-pink-600 text-white" onClick={() => router.push('/builder')}>
              <Edit3 className="w-4 h-4 mr-2" />
              แก้ไขหน้าเว็บ
            </Button>
          </div>
        </div>

        {/* Link Sharing Card */}
        <div className="bg-linear-to-r from-pink-500/10 to-rose-500/10 border border-pink-200 dark:border-pink-900/30 rounded-xl p-4 mb-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="p-2 bg-pink-500 text-white rounded-lg hidden sm:block">
              <Share2 className="w-5 h-5" />
            </div>
            <div className="w-full">
              <p className="text-xs font-semibold text-pink-700 dark:text-pink-400 uppercase">ลิงก์เว็บไซต์งานแต่งของคุณ</p>
              <p className="text-sm font-mono text-gray-700 dark:text-gray-300 break-all">{weddingUrl}</p>
            </div>
          </div>
          <Button size="sm" variant="outline" onClick={handleCopyLink} className="w-full sm:w-auto border-pink-300 dark:border-pink-800 text-pink-700 dark:text-pink-400">
            <Copy className="w-4 h-4 mr-2" />
            {copied ? 'คัดลอกแล้ว!' : 'คัดลอกลิงก์'}
          </Button>
        </div>

        {/* Main Grid Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Columns - Stats & Info */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* RSVP Overview */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <Users className="w-5 h-5 text-pink-500" />
                  สถิติการตอบรับเข้าร่วมงาน (RSVP)
                </h2>
                <Button variant="secondary" size="sm" className="text-pink-500 p-0" onClick={() => router.push('/guests')}>
                  จัดการรายชื่อแขกทั้งหมด <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Card className="border border-green-100 dark:border-green-900/20 bg-green-50/30 dark:bg-green-950/10">
                  <CardContent className="p-5 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-medium text-green-600 dark:text-green-400">ไปร่วมงานแน่นอน</p>
                      <p className="text-2xl font-bold text-green-700 dark:text-green-300 mt-1">{stats.rsvp.attending} คน</p>
                    </div>
                    <CheckCircle2 className="w-8 h-8 text-green-500 opacity-60" />
                  </CardContent>
                </Card>

                <Card className="border border-red-100 dark:border-red-900/20 bg-red-50/30 dark:bg-red-950/10">
                  <CardContent className="p-5 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-medium text-red-600 dark:text-red-400">ไม่สะดวกมาร่วมงาน</p>
                      <p className="text-2xl font-bold text-red-700 dark:text-red-300 mt-1">{stats.rsvp.declined} คน</p>
                    </div>
                    <XCircle className="w-8 h-8 text-red-500 opacity-60" />
                  </CardContent>
                </Card>

                <Card className="border border-amber-100 dark:border-amber-900/20 bg-amber-50/30 dark:bg-amber-950/10">
                  <CardContent className="p-5 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-medium text-amber-600 dark:text-amber-400">ยังไม่ตอบรับ/รอเช็คคิว</p>
                      <p className="text-2xl font-bold text-amber-700 dark:text-amber-300 mt-1">{stats.rsvp.pending} คน</p>
                    </div>
                    <Clock className="w-8 h-8 text-amber-500 opacity-60" />
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Recent Blessings / Wishes Wall */}
            <div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-pink-500" />
                คำอวยพรล่าสุดจากสมุดออนไลน์ ({stats.wishesCount})
              </h2>
              
              <div className="space-y-4">
                {recentWishes.map((wish) => (
                  <Card key={wish.id} className="dark:bg-gray-800 dark:border-gray-700">
                    <CardContent className="p-5">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-semibold text-sm text-gray-900 dark:text-white">{wish.name}</h4>
                        <span className="text-xs text-gray-400">{wish.time}</span>
                      </div>
                      <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">{wish.text}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

          </div>

          {/* Right Column - Checklist Progress */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 shadow-sm sticky top-24">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                ความพร้อมของเว็บไซต์
              </h2>
              <p className="text-xs text-gray-400 mb-4">เตรียมข้อมูลให้ครบถ้วนก่อนส่งการ์ดเชิญให้แขกของคุณ</p>
              
              {/* Progress Bar */}
              <div className="mb-6">
                <div className="flex justify-between text-sm font-semibold mb-1">
                  <span className="text-gray-600 dark:text-gray-400">กรอกข้อมูลแล้ว</span>
                  <span className="text-pink-500">{stats.completionProgress}%</span>
                </div>
                <div className="w-full bg-gray-100 dark:bg-gray-700 h-2 rounded-full overflow-hidden">
                  <div className="bg-linear-to-r from-pink-500 to-rose-500 h-full rounded-full" style={{ width: `${stats.completionProgress}%` }} />
                </div>
              </div>

              {/* Checklist Items */}
              <div className="space-y-3.5">
                {[
                  { label: 'ใส่ข้อมูลบ่าวสาว & กำหนดการ', completed: true },
                  { label: 'ปักหมุดแผนที่ Google Maps', completed: true },
                  { label: 'อัปโหลดภาพแกลเลอรี่ Pre-wedding', completed: true },
                  { label: 'ตั้งค่า QR Code รับซองอวยพร', completed: false },
                  { label: 'ทดสอบระบบทดลองกรอก RSVP', completed: false },
                ].map((item, index) => (
                  <div key={index} className="flex items-center gap-3 text-sm">
                    {item.completed ? (
                      <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />
                    ) : (
                      <div className="w-5 h-5 rounded-full border-2 border-gray-300 dark:border-gray-600 shrink-0" />
                    )}
                    <span className={`transition-colors ${item.completed ? 'text-gray-400 line-through' : 'text-gray-700 dark:text-gray-300 font-medium'}`}>
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>

              <Button className="w-full mt-6 bg-gray-900 dark:bg-pink-600 dark:hover:bg-pink-700 text-white" onClick={() => router.push('/builder')}>
                ไปกรอกข้อมูลส่วนที่เหลือ
                <ExternalLink className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}