import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { HelpCircle } from "lucide-react";

interface PrintInstructionsProps {
  language?: 'ar' | 'en';
}

const PrintInstructions: React.FC<PrintInstructionsProps> = ({ language = 'en' }) => {
  const content = {
    en: {
      title: "How to Export as PDF",
      instructions: [
        "1. Click the print button (printer icon) in the resume preview",
        "2. In the print dialog, select 'Save as PDF' as the destination",
        "3. Choose 'A4' paper size if not already selected",
        "4. Set margins to 'None' or 'Minimum' for best results",
        "5. Click 'Save' to download your resume as a PDF"
      ],
      tip: "Tip: For the best quality, make sure 'Background graphics' is enabled in your browser's print settings."
    },
    ar: {
      title: "كيفية التصدير كملف PDF",
      instructions: [
        "1. انقر على زر الطباعة (أيقونة الطابعة) في معاينة السيرة الذاتية",
        "2. في مربع حوار الطباعة، اختر 'حفظ كملف PDF' كوجهة",
        "3. اختر حجم الورق 'A4' إذا لم يكن محدداً بالفعل",
        "4. اضبط الهوامش على 'لا شيء' أو 'الحد الأدنى' للحصول على أفضل النتائج",
        "5. انقر على 'حفظ' لتحميل سيرتك الذاتية كملف PDF"
      ],
      tip: "نصيحة: للحصول على أفضل جودة، تأكد من تفعيل 'رسومات الخلفية' في إعدادات الطباعة بالمتصفح."
    }
  };

  const currentContent = content[language];

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <HelpCircle className="h-4 w-4" />
          <span className="sr-only">
            {language === 'ar' ? 'تعليمات الطباعة' : 'Print Instructions'}
          </span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{currentContent.title}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <ol className="list-decimal list-inside space-y-2 text-sm">
            {currentContent.instructions.map((instruction, index) => (
              <li key={index} className="text-left">
                {instruction}
              </li>
            ))}
          </ol>
          <div className="bg-blue-50 p-3 rounded-md">
            <p className="text-sm text-blue-800">{currentContent.tip}</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PrintInstructions; 