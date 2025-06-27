"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function LanguageSelectionPage() {
  return (
    <main className="min-h-screen flex flex-col justify-center items-center p-4 md:p-8" dir="rtl">
      <div className="w-full max-w-4xl space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <Link href="/resumes" className="self-start md:self-auto">
            <Button variant="ghost" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              العودة إلى السير الذاتية
            </Button>
          </Link>
          <div className="flex-1 text-center">
            <h1 className="text-xl md:text-3xl font-bold mb-1 md:mb-2 bg-gradient-to-r from-[#8e2de2] to-[#4a00e0] bg-clip-text text-transparent">
              اختر لغة السيرة الذاتية
            </h1>
            <p className="text-xs md:text-sm text-muted-foreground">
              اختر اللغة التي تريد إنشاء سيرتك الذاتية بها
            </p>
          </div>
        </div>

        {/* Language Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          {/* Arabic Card */}
          <Link href="/templates?lang=ar">
            <Card className="cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-105 border-2 hover:border-primary">
              <CardContent className="p-6 md:p-8 text-center">
                <div className="text-4xl md:text-6xl mb-4">🇸🇦</div>
                <h2 className="text-lg md:text-xl font-semibold">عربي</h2>
              </CardContent>
            </Card>
          </Link>

          {/* English Card */}
          <Link href="/templates?lang=en">
            <Card className="cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-105 border-2 hover:border-primary">
              <CardContent className="p-6 md:p-8 text-center">
                <div className="text-4xl md:text-6xl mb-4">🇺🇸</div>
                <h2 className="text-lg md:text-xl font-semibold">English</h2>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Info Text */}
        <div className="text-center">
          <p className="text-xs md:text-sm text-muted-foreground">
            يمكنك تغيير اللغة لاحقاً من إعدادات السيرة الذاتية
          </p>
        </div>
      </div>
    </main>
  );
} 