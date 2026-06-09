"use client";

import { Fragment } from "react";
import { useRouter } from "next/navigation";
import { Check, Minus, Crown, Zap, Gift, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui";
import { Card, CardContent } from "@/components/ui";
import { useAuthStore } from "@/stores/useAuthStore";
// สมมติว่านำเข้าข้อมูลที่เราคุยกันไว้ก่อนหน้านี้
import { weddingPricingPlans } from "@/components/data/pricingPlan";

// นิยามข้อมูลหัวข้อการ์ดจำลองเพื่อให้แมปเข้ากับปุ่ม CTA ด้านบน
const planHeaders = [
  {
    id: "free" as const,
    name: "Free Plan",
    price: 0,
    description: "เหมาะสำหรับทดลองระบบและงานขนาดเล็ก",
    icon: <Gift className="w-8 h-8 text-gray-500" />,
    popular: false,
  },
  {
    id: "standard" as const,
    name: "Standard Plan",
    price: 399, // ตัวอย่างราคาตาม FAQ ของคุณ
    description: "คุ้มค่าที่สุด ได้ฟีเจอร์หลักครบถ้วน ไม่มีลายน้ำ",
    icon: <Zap className="w-8 h-8 text-white" />,
    popular: true, // กำหนดให้ Standard เป็นป้ายแนะนำ
  },
  {
    id: "pro" as const,
    name: "Pro Plan",
    price: 999,
    description: "จัดเต็มเพื่อความสมบูรณ์แบบ แขกแชร์รูป และ Custom Domain",
    icon: <Crown className="w-8 h-8 text-amber-500" />,
    popular: false,
  },
];

const PricingPage = () => {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();

  const handleSelectPlan = (planId: "free" | "standard" | "pro") => {
    if (!isAuthenticated) {
      router.push("/register");
      return;
    }

    if (planId === "free") {
      router.push("/dashboard");
    } else {
      router.push("/payment");
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-pink-50 to-white pt-20 dark:from-slate-900 dark:to-slate-800">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            เลือกแพ็กเกจที่ใช่สำหรับคุณ
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            สร้างการ์ดแต่งงานออนไลน์ในแบบของคุณ จ่ายครั้งเดียวจบ
            ไม่มีค่าบริการรายเดือน
          </p>
        </div>

        {/* 1. Pricing Cards Section (ปรับเป็น 3 คอลัมน์) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-20">
          {planHeaders.map((plan) => (
            <Card
              key={plan.id}
              className={`relative overflow-hidden flex flex-col justify-between transition-all duration-300 hover:shadow-2xl ${
                plan.popular
                  ? "border-2 border-pink-500 shadow-xl scale-105 md:translate-y-2"
                  : "border border-gray-200 dark:border-gray-700 shadow-md"
              }`}
            >
              {plan.popular && (
                <div className="absolute top-0 right-0 bg-linear-to-r from-pink-500 to-rose-500 text-white px-4 py-1 text-sm font-medium rounded-bl-lg flex items-center gap-1">
                  <Crown className="w-4 h-4" />
                  ยอดนิยม
                </div>
              )}

              <CardContent className="p-8 flex flex-col h-full justify-between">
                <div>
                  {/* Plan Icon & Name */}
                  <div className="text-center mb-6">
                    <div
                      className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-4 ${
                        plan.popular
                          ? "bg-linear-to-r from-pink-500 to-rose-500"
                          : "bg-gray-100 dark:bg-slate-700"
                      }`}
                    >
                      {plan.icon}
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                      {plan.name}
                    </h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 min-h-10">
                      {plan.description}
                    </p>
                  </div>

                  {/* Pricing */}
                  <div className="text-center mb-8 bg-gray-50 dark:bg-slate-800/50 py-4 rounded-xl">
                    <span className="text-4xl font-extrabold text-gray-900 dark:text-white">
                      ฿{plan.price.toLocaleString()}
                    </span>
                    {plan.price > 0 ? (
                      <span className="text-gray-500 dark:text-gray-400 text-sm block mt-1">
                        จ่ายครั้งเดียวจบ
                      </span>
                    ) : (
                      <span className="text-gray-500 dark:text-gray-400 text-sm block mt-1">
                        ใช้งานได้ทันที
                      </span>
                    )}
                  </div>
                </div>

                {/* CTA Button */}
                <Button
                  className={`w-full ${plan.popular ? "bg-linear-to-r from-pink-500 to-rose-500 text-white hover:opacity-90" : ""}`}
                  variant={plan.popular ? "default" : "outline"}
                  size="lg"
                  onClick={() => handleSelectPlan(plan.id)}
                  disabled={user?.plan === plan.id}
                >
                  {user?.plan === plan.id
                    ? "แพ็กเกจปัจจุบันของคุณ"
                    : plan.price === 0
                      ? "เริ่มใช้งานฟรี"
                      : "อัปเกรดแพ็กเกจนี้"}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* 2. Feature Comparison Table (ตารางเปรียบเทียบละเอียดจาก TypeScript Object) */}
        <div className="mt-16 bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden hidden md:block">
          <div className="p-6 bg-gray-50 dark:bg-slate-800/80 border-b border-gray-100 dark:border-gray-700">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              เปรียบเทียบฟีเจอร์อย่างละเอียด
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="p-4 text-sm font-semibold text-gray-600 dark:text-gray-300 w-2/5">
                    ฟีเจอร์ทั้งหมด
                  </th>
                  <th className="p-4 text-sm font-semibold text-center text-gray-600 dark:text-gray-300 w-1/5">
                    Free
                  </th>
                  <th className="p-4 text-sm font-semibold text-center text-gray-600 dark:text-gray-300 w-1/5">
                    Standard
                  </th>
                  <th className="p-4 text-sm font-semibold text-center text-gray-600 dark:text-gray-300 w-1/5">
                    Pro
                  </th>
                </tr>
              </thead>
              <tbody>
  {weddingPricingPlans.map((category, catIdx) => (
    // 2. เปลี่ยนจาก <div> มาใช้ Fragment แบบใส่ key ได้
    <Fragment key={catIdx}> 
      
      {/* แถวหัวข้อหมวดหมู่ (Category Title Row) */}
      <tr className="bg-pink-50/50 dark:bg-slate-700/30">
        <td colSpan={4} className="p-3 text-sm font-bold text-pink-600 dark:text-pink-400 uppercase tracking-wider">
          {category.categoryName}
        </td>
      </tr>
      
      {/* รายการฟีเจอร์ในหมวดหมู่นั้นๆ */}
      {category.features.map((feature) => (
        <tr key={feature.id} className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50/50 dark:hover:bg-slate-700/10 transition-colors">
          <td className="p-4">
            <div className="font-medium text-gray-900 dark:text-white text-sm">{feature.name}</div>
            <div className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{feature.description}</div>
          </td>
          <td className="p-4 text-center">{renderCheckOrMinus(feature.free)}</td>
          <td className="p-4 text-center">{renderCheckOrMinus(feature.standard)}</td>
          <td className="p-4 text-center">{renderCheckOrMinus(feature.pro)}</td>
        </tr>
      ))}
      
    </Fragment>
  ))}
</tbody>
            </table>
          </div>
        </div>

        {/* Mobile Feature List (สำหรับหน้าจอมือถือที่แสดงตารางไม่สวย) */}
        <div className="mt-12 md:hidden space-y-4">
          <h2 className="text-lg font-bold text-center mb-4 dark:text-white">
            🔍 ฟีเจอร์เด่นแต่ละแพ็กเกจ
          </h2>
          <div className="p-4 bg-amber-50 dark:bg-amber-950/30 text-amber-800 dark:text-amber-300 text-xs rounded-xl flex gap-2 items-center">
            <ShieldAlert className="w-4 h-4 shrink-0" />
            <span>ดูตารางเปรียบเทียบฟีเจอร์ตัวเต็มได้บนหน้าจอเดสก์ท็อป</span>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-24 max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-8 dark:text-white">
            คำถามที่พบบ่อย
          </h2>
          <div className="space-y-6">
            {[
              {
                q: "จ่ายครั้งเดียวใช่ไหม?",
                a: "ใช่ครับ ทุกแพ็กเกจพรีเมียม (Standard/Pro) เป็นการจ่ายครั้งเดียวจบสำหรับงานแต่งงาน 1 งาน ไม่มีค่าบริการแอบแฝงรายเดือน",
              },
              {
                q: "เว็บไซต์หมดอายุไหม?",
                a: "เว็บไซต์ความทรงจำของคุณจะออนไลน์อยู่ตลอดไป ไม่มีกำหนดวันหมดอายุครับ",
              },
              {
                q: "สามารถอัปเกรดจาก Standard เป็น Pro ทีหลังได้ไหม?",
                a: "ได้แน่นอนครับ คุณสามารถจ่ายเพิ่มเฉพาะส่วนต่างเพื่อขยับเป็น Pro Plan ได้ทุกเมื่อจากหน้า Dashboard",
              },
              {
                q: "ระบบ Custom Domain ใน Pro Plan ทำงานอย่างไร?",
                a: "คุณสามารถจดโดเมนชื่อคุณเอง (เช่น johnandjane.com) แล้วนำมาผูกเข้ากับระบบของเราได้ทันที โดยเราจะมีคู่มือการตั้งค่าให้อย่างง่ายครับ",
              },
            ].map((item, index) => (
              <Card
                key={index}
                className="dark:bg-slate-800 dark:border-gray-700"
              >
                <CardContent className="p-6">
                  <h3 className="font-semibold text-lg mb-2 text-gray-900 dark:text-white">
                    {item.q}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                    {item.a}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper Function สำหรับ Render เครื่องหมาย ถูก/ผิด ในตาราง
const renderCheckOrMinus = (isAvailable: boolean) => {
  return isAvailable ? (
    <div className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-green-100 dark:bg-green-900/30">
      <Check className="w-4 h-4 text-green-600 dark:text-green-400" />
    </div>
  ) : (
    <Minus className="w-4 h-4 text-gray-300 dark:text-gray-600 mx-auto" />
  );
};

export default PricingPage;
