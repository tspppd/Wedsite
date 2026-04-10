import { Heart } from 'lucide-react';
import Link from 'next/link';

export function Footer() {
  return (
    <footer className="bg-gray-900 dark:bg-gray-950 text-gray-300 dark:text-gray-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <Heart className="w-8 h-8 text-pink-500 fill-pink-500" />
              <span className="text-xl font-bold text-white">WedSite</span>
            </div>
            <p className="text-gray-400 mb-4 max-w-md">
              สร้างเว็บไซต์งานแต่งงานสุดพิเศษของคุณได้ง่ายๆ ไม่ต้องเขียนโค้ด 
              เลือกเทมเพลตสวยๆ และปรับแต่งได้ตามต้องการ
            </p>
            <div className="flex gap-4">
              <Link href="#" className="hover:text-pink-500 transition-colors text-sm">Instagram</Link>
              <Link href="#" className="hover:text-pink-500 transition-colors text-sm">Facebook</Link>
              <Link href="#" className="hover:text-pink-500 transition-colors text-sm">Twitter</Link>
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold text-white mb-4">ผลิตภัณฑ์</h4>
            <ul className="space-y-2">
              <li><Link href="/#features" className="hover:text-pink-500 transition-colors">ฟีเจอร์</Link></li>
              <li><Link href="/#templates" className="hover:text-pink-500 transition-colors">เทมเพลต</Link></li>
              <li><Link href="/pricing" className="hover:text-pink-500 transition-colors">ราคา</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-4">ช่วยเหลือ</h4>
            <ul className="space-y-2">
              <li><Link href="#" className="hover:text-pink-500 transition-colors">คำถามที่พบบ่อย</Link></li>
              <li><Link href="#" className="hover:text-pink-500 transition-colors">ติดต่อเรา</Link></li>
              <li><Link href="#" className="hover:text-pink-500 transition-colors">นโยบายความเป็นส่วนตัว</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-500">
          <p>© 2024 WedSite. Made with 💕 for your special day</p>
        </div>
      </div>
    </footer>
  );
}
