import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, MapPin, Phone } from "lucide-react";
import Navbar from "@/app/(main)/Navbar";

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800" dir="rtl">
      <Navbar />
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-[#5409DA] to-[#2563EB] bg-clip-text text-transparent">
            اتصل بنا
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            تواصل مع فريقنا. نحن هنا لمساعدتك في إنشاء السيرة الذاتية المثالية.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-12 max-w-3xl mx-auto">
          {/* Contact Information */}
          <div className="space-y-8">
            <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm dark:bg-gray-800/80">
              <CardHeader>
                <CardTitle className="text-2xl font-bold">
                  تواصل معنا
                </CardTitle>
                <CardDescription>
                  نود أن نسمع منك. إليك كيف يمكنك الوصول إلينا.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-start space-x-reverse space-x-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-[#5409DA] to-[#2563EB] rounded-lg flex items-center justify-center">
                    <Mail className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">البريد الإلكتروني</h3>
                    <p className="text-muted-foreground">support@seeraai.com</p>
                    <p className="text-sm text-muted-foreground">سنرد خلال 24 ساعة</p>
                  </div>
                </div>

                <div className="flex items-start space-x-reverse space-x-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-[#5409DA] to-[#2563EB] rounded-lg flex items-center justify-center">
                    <Phone className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">الهاتف</h3>
                    <p className="text-muted-foreground">+1 (555) 123-4567</p>
                    <p className="text-sm text-muted-foreground">الاثنين-الجمعة 9 صباحاً-6 مساءً بتوقيت شرق الولايات المتحدة</p>
                  </div>
                </div>

                <div className="flex items-start space-x-reverse space-x-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-[#5409DA] to-[#2563EB] rounded-lg flex items-center justify-center">
                    <MapPin className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">المكتب</h3>
                    <p className="text-muted-foreground">123 طريق الابتكار</p>
                    <p className="text-muted-foreground">مدينة التكنولوجيا، TC 12345</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* FAQ Section */}
            <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm dark:bg-gray-800/80">
              <CardHeader>
                <CardTitle className="text-xl font-bold">
                  الأسئلة الشائعة
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <h4 className="font-semibold">كيف أنشئ سيرتي الذاتية الأولى؟</h4>
                  <p className="text-sm text-muted-foreground">
                    ببساطة سجل حساب، اختر قالباً، واتبع دليلنا خطوة بخطوة لبناء سيرتك الذاتية المهنية.
                  </p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold">هل يمكنني تحميل سيرتي الذاتية كملف PDF؟</h4>
                  <p className="text-sm text-muted-foreground">
                    نعم! يمكن تحميل جميع السير الذاتية كملفات PDF عالية الجودة للمشاركة والطباعة بسهولة.
                  </p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold">هل تدعمون لغات متعددة؟</h4>
                  <p className="text-sm text-muted-foreground">
                    بالتأكيد! ندعم كل من اللغة الإنجليزية والعربية مع قوالب مخصصة لكل لغة.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
} 