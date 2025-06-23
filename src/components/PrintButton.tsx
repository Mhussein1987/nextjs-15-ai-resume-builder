import { Button } from "@/components/ui/button";
import { Download, Loader2 } from "lucide-react";
import { useState } from "react";

interface PrintButtonProps {
  language?: 'ar' | 'en';
  className?: string;
}

export default function PrintButton({ 
  language = 'en', 
  className 
}: PrintButtonProps) {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = () => {
    setIsExporting(true);
    
    try {
      // Use the browser's print functionality
      window.print();
    } catch (error) {
      console.error('Print error:', error);
      alert(language === 'ar' ? 'حدث خطأ أثناء الطباعة' : 'Error during printing');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Button
      onClick={handleExport}
      disabled={isExporting}
      className={className}
      variant="outline"
      size="sm"
      title={language === 'ar' ? 'تصدير PDF' : 'Export PDF'}
    >
      {isExporting ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <Download className="w-4 h-4" />
      )}
      <span className="ml-2">
        {language === 'ar' ? 'تصدير PDF' : 'Export PDF'}
      </span>
    </Button>
  );
} 