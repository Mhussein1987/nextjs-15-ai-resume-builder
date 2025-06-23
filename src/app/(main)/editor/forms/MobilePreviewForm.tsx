"use client";

import { Button } from "@/components/ui/button";
import { EditorFormProps } from "@/lib/types";
import { Palette, Sidebar } from "lucide-react";
import ResumeTemplate1En from "@/components/ResumeTemplate1En";
import ResumeTemplate1Ar from "@/components/ResumeTemplate1Ar";
import ResumeTemplate2En from "@/components/ResumeTemplate2En";
import ResumeTemplate2Ar from "@/components/ResumeTemplate2Ar";
import ResumeTemplate3En from "@/components/ResumeTemplate3En";
import ResumeTemplate3Ar from "@/components/ResumeTemplate3Ar";
import ResumeTemplate4En from "@/components/ResumeTemplate4En";
import ResumeTemplate4Ar from "@/components/ResumeTemplate4Ar";
import DownloadButton from "@/components/DownloadButton";
import { useRef } from "react";

export default function MobilePreviewForm({
  resumeData,
  language = 'en',
}: EditorFormProps) {
  const resumeContentRef = useRef<HTMLDivElement>(null);

  const getTemplateComponent = () => {
    const templatePreference = resumeData.templatePreference;
    
    if (language === 'ar') {
      switch (templatePreference) {
        case 'alternative':
          return <ResumeTemplate2Ar resumeData={resumeData} />;
        case 'template3':
          return <ResumeTemplate3Ar resumeData={resumeData} />;
        case 'template4':
          return <ResumeTemplate4Ar resumeData={resumeData} />;
        default:
          return <ResumeTemplate1Ar resumeData={resumeData} />;
      }
    } else {
      switch (templatePreference) {
        case 'alternative':
          return <ResumeTemplate2En resumeData={resumeData} />;
        case 'template3':
          return <ResumeTemplate3En resumeData={resumeData} />;
        case 'template4':
          return <ResumeTemplate4En resumeData={resumeData} />;
        default:
          return <ResumeTemplate1En resumeData={resumeData} />;
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">
            {language === 'ar' ? 'معاينة السيرة الذاتية' : 'Resume Preview'}
          </h2>
          <p className="text-muted-foreground">
            {language === 'ar' 
              ? 'معاينة كاملة للسيرة الذاتية' 
              : 'Full resume preview'
            }
          </p>
        </div>
      </div>

      {/* Control Buttons - Horizontal Layout */}
      <div className="flex items-center justify-center gap-3 p-4 bg-gray-50 rounded-lg">
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-2"
          onClick={() => {
            // Open color picker
            const colorPicker = document.querySelector('[data-color-picker]') as HTMLButtonElement;
            if (colorPicker) colorPicker.click();
          }}
        >
          <Palette className="w-4 h-4" />
          <span className="hidden sm:inline">
            {language === 'ar' ? 'اللون' : 'Color'}
          </span>
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-2"
          onClick={() => {
            // Open sidebar color picker
            const sidebarColorPicker = document.querySelector('[data-sidebar-color-picker]') as HTMLButtonElement;
            if (sidebarColorPicker) sidebarColorPicker.click();
          }}
        >
          <Sidebar className="w-4 h-4" />
          <span className="hidden sm:inline">
            {language === 'ar' ? 'لون الشريط' : 'Sidebar'}
          </span>
        </Button>

        {/* Download Button */}
        <DownloadButton
          language={language}
          resumeContainerRef={resumeContentRef}
          resumeData={resumeData}
        />
      </div>

      {/* Resume Preview Container */}
      <div className="relative">
        {/* Display Container - Use A4 dimensions for consistent PDF export */}
        <div 
          className="w-full h-[calc(100vh-400px)] md:w-[210mm] md:min-h-[297mm] bg-white shadow-lg rounded-lg overflow-hidden border"
          style={{ 
            backgroundColor: 'white',
            color: 'black'
          }}
        >
          {/* Inner container with A4 dimensions for PDF generation */}
          <div 
            className="w-[210mm] min-h-[297mm] bg-white transform scale-[0.4] md:scale-100 origin-top-left"
            ref={resumeContentRef}
          >
            {getTemplateComponent()}
          </div>
        </div>
      </div>
    </div>
  );
} 