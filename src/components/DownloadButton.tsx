import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { ResumeValues } from "@/lib/validation";

interface DownloadButtonProps {
  language?: 'ar' | 'en';
  resumeContainerRef?: React.RefObject<HTMLDivElement>;
  resumeData?: ResumeValues;
  onDownloadComplete?: () => void;
}

// Local type for API photo payload
interface ApiPhotoPayload {
  name: string;
  type: string;
  size: number;
  data: string;
}

export default function DownloadButton({ 
  language = 'en', 
  resumeContainerRef,
  resumeData,
  onDownloadComplete
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
      
      // Only proceed if resumeData exists
      if (!resumeData) {
        alert(language === 'ar' ? 'لا توجد بيانات سيرة ذاتية' : 'No resume data');
        setIsDownloading(false);
        return;
      }
      
      // Debug: Log photo information
      console.log('DownloadButton - Photo Debug:', {
        photoExists: !!resumeData.photo,
        photoType: typeof resumeData.photo,
        photoValue: resumeData.photo,
        isFile: resumeData.photo instanceof File
      });
      
      // Prepare resume data for API - convert File to base64 if it exists
      let apiResumeData: Omit<ResumeValues, 'photo'> & { photo?: File | string | ApiPhotoPayload | null } = { ...resumeData };
      if (resumeData.photo instanceof File) {
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
            } as ApiPhotoPayload
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

      if (onDownloadComplete) {
        onDownloadComplete();
      }

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

  const buttonText = 'تحميل';

  return (
    <Button
      onClick={handleDownload}
      disabled={isDownloading}
      className="bg-gradient-to-r from-[#5409DA] to-[#2563EB] hover:from-[#4A08C4] hover:to-[#1D4ED8] text-white border-0 w-16 px-1"
      variant="default"
      size="sm"
    >
      {isDownloading ? (
        <>
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          {language === 'ar' ? 'جاري التحميل...' : 'Downloading...'}
        </>
      ) : (
        buttonText
      )}
    </Button>
  );
} 