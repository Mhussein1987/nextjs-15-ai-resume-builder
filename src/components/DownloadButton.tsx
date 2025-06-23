import { Button } from "@/components/ui/button";
import { Download, Loader2 } from "lucide-react";
import { useState } from "react";
import { ResumeValues } from "@/lib/validation";

interface DownloadButtonProps {
  language?: 'ar' | 'en';
  resumeContainerRef?: React.RefObject<HTMLDivElement>;
  resumeData?: ResumeValues;
}

export default function DownloadButton({ 
  language = 'en', 
  resumeContainerRef,
  resumeData
}: DownloadButtonProps) {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
    setIsDownloading(true);
    
    try {
      // Get the resume data from the container
      const container = resumeContainerRef?.current;
      if (!container) {
        console.error('Resume container not found');
        alert(language === 'ar' ? 'لم يتم العثور على السيرة الذاتية' : 'Resume container not found');
        return;
      }

      // Get the resume HTML content
      const resumeHTML = container.outerHTML;
      
      // Prepare resume data for API - convert File to base64 if it exists
      let apiResumeData = resumeData;
      if (resumeData?.photo instanceof File) {
        try {
          const photoBuffer = await resumeData.photo.arrayBuffer();
          const photoBase64 = Buffer.from(photoBuffer).toString('base64');
          apiResumeData = {
            ...resumeData,
            photo: {
              name: resumeData.photo.name,
              type: resumeData.photo.type,
              size: resumeData.photo.size,
              data: photoBase64
            }
          };
          console.log('Converted photo File to base64 for API');
        } catch (error) {
          console.error('Error converting photo to base64:', error);
        }
      }
      
      // Call the server-side PDF generation API
      const response = await fetch('/api/generate-pdf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          html: resumeHTML,
          language: language,
          resumeData: apiResumeData,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Get the PDF blob
      const pdfBlob = await response.blob();
      
      // Create download link
      const url = window.URL.createObjectURL(pdfBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `resume_${new Date().getTime()}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

    } catch (error) {
      console.error('Error generating PDF:', error);
      alert(language === 'ar' 
        ? 'حدث خطأ أثناء إنشاء ملف PDF. يرجى المحاولة مرة أخرى.' 
        : 'Error generating PDF. Please try again.'
      );
    } finally {
      setIsDownloading(false);
    }
  };

  const title = language === 'ar' ? 'تحميل PDF' : 'Download PDF';

  return (
    <Button
      onClick={handleDownload}
      disabled={isDownloading}
      className="bg-white hover:bg-white/90 text-[#5409DA] border-[#5409DA] dark:border-border dark:bg-secondary dark:text-inherit"
      variant="outline"
      size="icon"
      title={title}
    >
      {isDownloading ? (
        <Loader2 className="w-5 h-5 animate-spin" />
      ) : (
        <Download className="w-5 h-5" />
      )}
    </Button>
  );
} 