'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Heart, Plus, Save, Eye, Settings, Palette, Layout, Image, Type, MapPin } from 'lucide-react';
import { Button } from '@/components/ui';
import { useAuth } from '@/hooks/useAuth';

export default function BuilderPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [selectedSection, setSelectedSection] = useState<string | null>(null);

  // Redirect if not authenticated
  if (!loading && !user) {
    router.push('/login');
    return null;
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-pink-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-300">กำลังโหลด...</p>
        </div>
      </div>
    );
  }

  const availableSections = [
    { id: 'hero', name: 'Hero Section', icon: Layout, description: 'ส่วนหัวเว็บไซต์' },
    { id: 'story', name: 'Love Story', icon: Heart, description: 'เล่าเรื่องราวความรัก' },
    { id: 'gallery', name: 'Gallery', icon: Image, description: 'แกลเลอรี่รูปภาพ' },
    { id: 'details', name: 'Event Details', icon: MapPin, description: 'รายละเอียดงาน' },
    { id: 'rsvp', name: 'RSVP', icon: Type, description: 'ฟอร์มยืนยันการเข้าร่วม' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Heart className="w-8 h-8 text-pink-500 fill-pink-500" />
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                  Wedding Builder
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  สวัสดี, {user?.user_metadata?.name || user?.email}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm">
                <Eye className="w-4 h-4 mr-2" />
                Preview
              </Button>
              <Button size="sm">
                <Save className="w-4 h-4 mr-2" />
                Save
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                <Palette className="w-5 h-5 inline mr-2" />
                Sections
              </h2>
              
              <div className="space-y-2">
                {availableSections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => setSelectedSection(section.id)}
                    className={`w-full text-left p-3 rounded-lg transition-colors ${
                      selectedSection === section.id
                        ? 'bg-pink-50 dark:bg-pink-900/20 border-2 border-pink-500'
                        : 'bg-gray-50 dark:bg-gray-700 border-2 border-transparent hover:border-gray-300 dark:hover:border-gray-600'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <section.icon className="w-5 h-5 text-pink-500 mt-0.5" />
                      <div>
                        <p className="font-medium text-gray-900 dark:text-gray-100 text-sm">
                          {section.name}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {section.description}
                        </p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              <Button className="w-full mt-4" variant="outline">
                <Plus className="w-4 h-4 mr-2" />
                Add Section
              </Button>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mt-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                <Settings className="w-5 h-5 inline mr-2" />
                Settings
              </h2>
              <div className="space-y-3 text-sm">
                <button className="w-full text-left p-2 rounded hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300">
                  Theme Colors
                </button>
                <button className="w-full text-left p-2 rounded hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300">
                  Typography
                </button>
                <button className="w-full text-left p-2 rounded hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300">
                  Domain Settings
                </button>
              </div>
            </div>
          </div>

          {/* Main Canvas */}
          <div className="lg:col-span-3">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-8 min-h-[600px]">
              {selectedSection ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-pink-100 dark:bg-pink-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                    {availableSections.find(s => s.id === selectedSection)?.icon && (
                      <div className="text-pink-500">
                        {(() => {
                          const Icon = availableSections.find(s => s.id === selectedSection)!.icon;
                          return <Icon className="w-8 h-8" />;
                        })()}
                      </div>
                    )}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                    {availableSections.find(s => s.id === selectedSection)?.name}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-6">
                    กำลังพัฒนา Section นี้...
                  </p>
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Content
                  </Button>
                </div>
              ) : (
                <div className="text-center py-20">
                  <Layout className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                    เริ่มสร้างเว็บแต่งงานของคุณ
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-6">
                    เลือก Section จากด้านซ้ายเพื่อเริ่มต้น
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
