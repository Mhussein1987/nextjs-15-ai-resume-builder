import { ResumeValues } from "@/lib/validation";
import { cn } from "@/lib/utils";
import React, { useRef, forwardRef } from "react";
import ResumeTemplate1En from "@/components/ResumeTemplate1En";
import ResumeTemplate1Ar from "@/components/ResumeTemplate1Ar";
import ResumeTemplate2En from "@/components/ResumeTemplate2En";
import ResumeTemplate2Ar from "@/components/ResumeTemplate2Ar";
import ResumeTemplate3En from "@/components/ResumeTemplate3En";
import ResumeTemplate3Ar from "@/components/ResumeTemplate3Ar";
import ResumeTemplate4En from "@/components/ResumeTemplate4En";
import ResumeTemplate4Ar from "@/components/ResumeTemplate4Ar";
import { 
  generateTemplateCode, 
  migrateLegacyTemplate, 
  getTemplateNumber 
} from "@/lib/templateReferenceSystem";

interface ResumePreviewSectionProps {
  resumeData: ResumeValues;
  setResumeData: (updater: React.SetStateAction<ResumeValues>) => void;
  language: 'ar' | 'en';
  resumeContentRef?: React.RefObject<HTMLDivElement>;
  className?: string;
}

export const ResumePreviewSection = forwardRef<HTMLDivElement, ResumePreviewSectionProps>(
  ({ resumeData, setResumeData, language, resumeContentRef: externalResumeContentRef, className }, ref) => {
    // Create a separate ref for the resume content if not provided
    const internalResumeContentRef = useRef<HTMLDivElement>(null);
    const resumeContentRef = externalResumeContentRef || internalResumeContentRef;
    
    // Get template using new reference system
    const getCurrentTemplate = () => {
      // Use templateCode if available, otherwise migrate from legacy system
      let templateCode = resumeData.templateCode;
      
      if (!templateCode && resumeData.templatePreference) {
        // Migrate from legacy system
        templateCode = migrateLegacyTemplate(resumeData.templatePreference, resumeData.language || language);
        
        // Update the resume data with the new template code
        setResumeData(prev => ({ ...prev, templateCode }));
      }
      
      if (!templateCode) {
        // Generate default template code
        const currentLanguage = (resumeData.language as 'ar' | 'en') || language;
        templateCode = generateTemplateCode('default', currentLanguage);
      }
      
      return getTemplateNumber(templateCode);
    };
  
    const selectedTemplate = getCurrentTemplate();

  return (
    <div ref={ref} className={cn("w-full md:flex md:w-1/2 flex-col", className)}>
      <div
        className={cn(
          "flex flex-1 w-full flex-col items-center justify-start bg-gray-200 p-2 md:p-8 dark:bg-gray-800 overflow-auto",
          className
        )}
      >
        <div
          ref={resumeContentRef}
          id="resume-preview"
          className="w-full max-w-[210mm] h-auto md:h-[297mm] md:min-w-[210mm] md:min-h-[297mm] resume-container"
          style={{
            aspectRatio: '210/297', // Maintain A4 aspect ratio on mobile
            maxHeight: '80vh' // Limit height on mobile
          }}
          data-template={resumeData.templateCode?.toLowerCase()}
        >
          {selectedTemplate === 1 && (resumeData.language === 'ar' || resumeData.language === 'ar-SA') && <ResumeTemplate1Ar resumeData={resumeData} />}
          {selectedTemplate === 1 && (resumeData.language !== 'ar' && resumeData.language !== 'ar-SA') && <ResumeTemplate1En resumeData={resumeData} />}
          {selectedTemplate === 2 && (resumeData.language === 'ar' || resumeData.language === 'ar-SA') && <ResumeTemplate2Ar resumeData={resumeData} />}
          {selectedTemplate === 2 && (resumeData.language !== 'ar' && resumeData.language !== 'ar-SA') && <ResumeTemplate2En resumeData={resumeData} />}
          {selectedTemplate === 3 && (resumeData.language === 'ar' || resumeData.language === 'ar-SA') && <ResumeTemplate3Ar resumeData={resumeData} />}
          {selectedTemplate === 3 && (resumeData.language !== 'ar' && resumeData.language !== 'ar-SA') && <ResumeTemplate3En resumeData={resumeData} />}
          {selectedTemplate === 4 && (resumeData.language === 'ar' || resumeData.language === 'ar-SA') && <ResumeTemplate4Ar resumeData={resumeData} />}
          {selectedTemplate === 4 && (resumeData.language !== 'ar' && resumeData.language !== 'ar-SA') && <ResumeTemplate4En resumeData={resumeData} />}
        </div>
      </div>
    </div>
  );
});

ResumePreviewSection.displayName = "ResumePreviewSection";
