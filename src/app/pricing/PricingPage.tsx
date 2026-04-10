'use client'

import { useRouter } from 'next/navigation';
import { Check, X, Crown, Zap } from 'lucide-react';
import { Button } from '@/components/ui';
import { Card ,CardContent } from '@/components/ui';
import { useAuthStore } from '@/stores/useAuthStore';
import { plans } from '@/components/data/wedding';

const PricingPage = () => {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();

  const handleSelectPlan = (planId: 'free' | 'pro') => {
    if (!isAuthenticated) {
      router.push('/register');
      return;
    }

    if (planId === 'free') {
      router.push('/dashboard');
    } else {
      router.push('/payment');
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-pink-50 to-white pt-20 dark:from-slate-600 dark:to-gray-300">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            เลือกแพ็กเกจที่ใช่สำหรับคุณ
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            เริ่มต้นฟรี ไม่มีค่าใช้จ่าย หรืออัปเกรดเป็น Pro เพื่อปลดล็อกฟีเจอร์ทั้งหมด
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {plans.map((plan) => (
            <Card
              key={plan.id}
              className={`relative overflow-hidden ${
                plan.popular ? 'border-2 border-pink-500 shadow-xl' : ''
              }`}
            >
              {plan.popular && (
                <div className="absolute top-0 right-0 bg-linear-to-r from-pink-500 to-rose-500 text-white px-4 py-1 text-sm font-medium rounded-bl-lg">
                  <Crown className="w-4 h-4 inline mr-1" />
                  แนะนำ
                </div>
              )}
              <CardContent className="p-8">
                {/* Plan Header */}
                <div className="text-center mb-8">
                  <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4 ${
                    plan.popular
                      ? 'bg-linear-to-r from-pink-500 to-rose-500'
                      : 'bg-gray-100'
                  }`}>
                    {plan.popular ? (
                      <Zap className="w-8 h-8 text-white" />
                    ) : (
                      <span className="text-2xl">💒</span>
                    )}
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">{plan.name}</h2>
                  <div className="mt-4">
                    <span className="text-5xl font-bold text-gray-900">
                      ฿{plan.price.toLocaleString()}
                    </span>
                    {plan.price > 0 && (
                      <span className="text-gray-500">/ครั้ง</span>
                    )}
                  </div>
                  {plan.price === 0 && (
                    <p className="text-gray-500 mt-2">ฟรีตลอดไป</p>
                  )}
                </div>

                {/* Features */}
                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                  {plan.limitations?.map((limitation, index) => (
                    <li key={index} className="flex items-start gap-3 text-gray-400">
                      <X className="w-5 h-5 shrink-0 mt-0.5" />
                      <span>{limitation}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA Button */}
                <Button
                  className="w-full"
                  variant={plan.popular ? 'primary' : 'outline'}
                  size="lg"
                  onClick={() => handleSelectPlan(plan.id)}
                  disabled={user?.plan === plan.id}
                >
                  {user?.plan === plan.id
                    ? 'แพ็กเกจปัจจุบัน'
                    : plan.price === 0
                    ? 'เริ่มใช้ฟรี'
                    : 'อัปเกรดเป็น Pro'}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* FAQ */}
        <div className="mt-24 max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-8">คำถามที่พบบ่อย</h2>
          <div className="space-y-6">
            {[
              {
                q: 'จ่ายครั้งเดียวใช่ไหม?',
                a: 'ใช่ครับ จ่าย 399 บาทครั้งเดียว ใช้ได้ตลอดไป ไม่มีค่ารายเดือน',
              },
              {
                q: 'เว็บไซต์หมดอายุไหม?',
                a: 'ไม่หมดครับ เว็บไซต์ของคุณจะอยู่ตลอดไป ตราบใดที่คุณยังต้องการ',
              },
              {
                q: 'ยกเลิกได้ไหม?',
                a: 'Free Plan ไม่มีค่าใช้จ่าย ส่วน Pro Plan จ่ายครั้งเดียวจบ ไม่มีการต่ออายุอัตโนมัติ',
              },
              {
                q: 'รองรับการชำระเงินแบบไหน?',
                a: 'รองรับบัตรเครดิต/เดบิต (Visa, Mastercard) และ QR PromptPay',
              },
            ].map((item, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <h3 className="font-semibold text-lg mb-2">{item.q}</h3>
                  <p className="text-gray-600">{item.a}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default PricingPage
