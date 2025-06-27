"use client";

import { Button } from "@/components/ui/button";
import { EditorFormProps } from "@/lib/types";
import { X } from "lucide-react";
import ResumeTemplate1En from "@/components/ResumeTemplate1En";
import ResumeTemplate1Ar from "@/components/ResumeTemplate1Ar";
import ResumeTemplate2En from "@/components/ResumeTemplate2En";
import ResumeTemplate2Ar from "@/components/ResumeTemplate2Ar";
import ResumeTemplate4En from "@/components/ResumeTemplate4En";
import ResumeTemplate4Ar from "@/components/ResumeTemplate4Ar";
import DownloadButton from "@/components/DownloadButton";
import ColorPicker from "../ColorPicker";
import SidebarColorPicker from "../SidebarColorPicker";
import { 
  generateTemplateCode, 
  migrateLegacyTemplate, 
  getTemplateByCode,
  getTemplateNumber
} from "@/lib/templateReferenceSystem";
import { useRef } from "react";
import { useRouter } from "next/navigation";

export default function MobilePreviewForm({
  resumeData,
  setResumeData,
  language = 'en',
}: EditorFormProps) {
  const resumeContentRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const getTemplateComponent = () => {
    // Use templateCode if available, otherwise migrate from legacy system
    let templateCode = resumeData.templateCode;
    
    if (!templateCode && resumeData.templatePreference) {
      // Migrate from legacy system
      templateCode = migrateLegacyTemplate(resumeData.templatePreference, resumeData.language || language);
    }
    
    if (!templateCode) {
      // Generate default template code
      const currentLanguage = (resumeData.language as 'ar' | 'en') || language;
      templateCode = generateTemplateCode('default', currentLanguage);
    }
    
    const template = getTemplateByCode(templateCode);
    const isResumeArabic = resumeData.language === 'ar' || resumeData.language === 'ar-SA';
    
    if (isResumeArabic) {
      switch (template?.number) {
        case 2:
          return <ResumeTemplate2Ar resumeData={resumeData} />;
        case 4:
          return <ResumeTemplate4Ar resumeData={resumeData} />;
        default:
          return <ResumeTemplate1Ar resumeData={resumeData} />;
      }
    } else {
      switch (template?.number) {
        case 2:
          return <ResumeTemplate2En resumeData={resumeData} />;
        case 4:
          return <ResumeTemplate4En resumeData={resumeData} />;
        default:
          return <ResumeTemplate1En resumeData={resumeData} />;
      }
    }
  };

  const getTemplateDataAttribute = () => {
    // Use templateCode if available, otherwise migrate from legacy system
    let templateCode = resumeData.templateCode;
    
    if (!templateCode && resumeData.templatePreference) {
      // Migrate from legacy system
      templateCode = migrateLegacyTemplate(resumeData.templatePreference, resumeData.language || language);
    }
    
    if (!templateCode) {
      // Generate default template code
      const currentLanguage = (resumeData.language as 'ar' | 'en') || language;
      templateCode = generateTemplateCode('default', currentLanguage);
    }
    
    const template = getTemplateByCode(templateCode);
    const isResumeArabic = resumeData.language === 'ar' || resumeData.language === 'ar-SA';
    
    if (isResumeArabic) {
      switch (template?.number) {
        case 2:
          return 'template2ar';
        case 4:
          return 'template4ar';
        default:
          return 'template1ar';
      }
    } else {
      switch (template?.number) {
        case 2:
          return 'template2en';
        case 4:
          return 'template4en';
        default:
          return 'template1en';
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        {/* Empty div for spacing */}
        <div className="w-16"></div>
        
        {/* Centered Title */}
        <div className="text-center flex-1">
          <h2 className="text-2xl font-bold">
            معاينة السيرة الذاتية
          </h2>
          <p className="text-muted-foreground">
            معاينة كاملة للسيرة الذاتية
          </p>
        </div>
        
        {/* Close Button */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => router.push('/resumes')}
          className="flex items-center gap-1 w-16 justify-center text-xs py-2"
        >
          <X className="w-3 h-3" />
          <span className="hidden sm:inline">
            إغلاق
          </span>
        </Button>
      </div>

      {/* Control Buttons - Horizontal Layout */}
      <div className="flex items-center justify-center gap-3 p-4 bg-gray-50 rounded-lg">
        <ColorPicker
          color={resumeData.colorHex || "#000000"}
          onChange={(color) => setResumeData((prev) => ({ ...prev, colorHex: color.hex }))}
          language={language}
        />
        
        {/* Only show SidebarColorPicker for templates that have sidebars (template 2 and 4, not template 1) */}
        {(() => {
          let templateCode = resumeData.templateCode;
          if (!templateCode && resumeData.templatePreference) {
            templateCode = migrateLegacyTemplate(resumeData.templatePreference, resumeData.language || language);
          }
          if (!templateCode) {
            const currentLanguage = (resumeData.language as 'ar' | 'en') || language;
            templateCode = generateTemplateCode('default', currentLanguage);
          }
          const selectedTemplate = getTemplateNumber(templateCode);
          
          return selectedTemplate !== 1 ? (
            <SidebarColorPicker
              color={resumeData.sidebarColorHex || "#0E7490"}
              onChange={(color) => setResumeData((prev) => ({ ...prev, sidebarColorHex: color.hex }))}
              language={language}
            />
          ) : null;
        })()}

        {/* Download Button */}
        <DownloadButton
          language={language}
          resumeContainerRef={resumeContentRef}
          resumeData={resumeData}
          onDownloadComplete={() => router.push('/resumes')}
        />
      </div>

      {/* Resume Preview Container */}
      <div className="relative">
        {/* Display Container - Responsive container that fits mobile screens */}
        <div 
          className="w-full bg-white shadow-lg rounded-lg border overflow-hidden"
          style={{ 
            backgroundColor: 'white',
            color: 'black',
            aspectRatio: '210/297', // Maintain A4 aspect ratio
            maxHeight: '80vh' // Limit height to viewport
          }}
        >
          {/* Inner container with proper mobile scaling */}
          <div 
            className="w-full h-full bg-white resume-container"
            data-template={getTemplateDataAttribute()}
            ref={resumeContentRef}
            style={{
              transform: 'scale(1)', // No transform needed with new CSS
              transformOrigin: 'top left'
            }}
          >
            {getTemplateComponent()}
          </div>
        </div>
      </div>
    </div>
  );
} 