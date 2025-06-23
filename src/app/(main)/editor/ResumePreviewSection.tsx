import { ResumeValues } from "@/lib/validation";
import { cn } from "@/lib/utils";
import React, { useRef, useEffect } from "react";
import ColorPicker from "./ColorPicker";
import BorderStyleButton from "./BorderStyleButton";
import SidebarColorPicker from "./SidebarColorPicker";
import PrintInstructions from "@/components/PrintInstructions";
import ResumeTemplate1En from "@/components/ResumeTemplate1En";
import ResumeTemplate1Ar from "@/components/ResumeTemplate1Ar";
import ResumeTemplate2En from "@/components/ResumeTemplate2En";
import ResumeTemplate2Ar from "@/components/ResumeTemplate2Ar";
import ResumeTemplate3En from "@/components/ResumeTemplate3En";
import ResumeTemplate3Ar from "@/components/ResumeTemplate3Ar";
import ResumeTemplate4En from "@/components/ResumeTemplate4En";
import ResumeTemplate4Ar from "@/components/ResumeTemplate4Ar";
import DownloadButton from "@/components/DownloadButton";

interface ResumePreviewSectionProps {
  resumeData: ResumeValues;
  setResumeData: (updater: React.SetStateAction<ResumeValues>) => void;
  language: 'ar' | 'en';
  className?: string;
  initialTemplate?: number;
}

export function ResumePreviewSection({
  resumeData,
  setResumeData,
  language,
  className,
  initialTemplate,
}: ResumePreviewSectionProps) {
  // Use the template preference from resume data, or fall back to initialTemplate, or default to 1
  const getCurrentTemplate = () => {
    if (resumeData.templatePreference) {
      switch (resumeData.templatePreference) {
        case 'default': return 1;
        case 'alternative': return 2;
        case 'template3': return 3;
        case 'template4': return 4;
        default: return 1;
      }
    }
    return initialTemplate || 1;
  };

  const resumeContentRef = useRef<HTMLDivElement>(null);

  // Set template preference in resume data when initialTemplate is provided and no preference exists
  useEffect(() => {
    if (initialTemplate && !resumeData.templatePreference) {
      const templatePreference = initialTemplate === 1 ? 'default' : 
                                initialTemplate === 2 ? 'alternative' : 
                                initialTemplate === 3 ? 'template3' : 
                                initialTemplate === 4 ? 'template4' : 'default';
      
      setResumeData(prev => ({
        ...prev,
        templatePreference
      }));
    }
  }, [initialTemplate, resumeData.templatePreference, setResumeData]);

  const getTemplateComponent = () => {
    const isArabic = language === 'ar';
    const selectedTemplate = getCurrentTemplate();
    const templateProps = {
      resumeData,
      className: "transition-all duration-300",
    };

    console.log('Template rendering debug:', {
      selectedTemplate,
      language,
      isArabic,
      templatePreference: resumeData.templatePreference,
    });

    switch (selectedTemplate) {
      case 1:
        return isArabic ? (
          <ResumeTemplate1Ar {...templateProps} />
        ) : (
          <ResumeTemplate1En {...templateProps} />
        );
      case 2:
        return isArabic ? (
          <ResumeTemplate2Ar {...templateProps} />
        ) : (
          <ResumeTemplate2En {...templateProps} />
        );
      case 3:
        return isArabic ? (
          <ResumeTemplate3Ar {...templateProps} />
        ) : (
          <ResumeTemplate3En {...templateProps} />
        );
      case 4:
        return isArabic ? (
          <ResumeTemplate4Ar {...templateProps} />
        ) : (
          <ResumeTemplate4En {...templateProps} />
        );
      default:
        return isArabic ? (
          <ResumeTemplate1Ar {...templateProps} />
        ) : (
          <ResumeTemplate1En {...templateProps} />
        );
    }
  };

  return (
    <div className={cn("group relative w-full md:flex md:w-1/2 flex-col", className)}>
      <div className="absolute left-1 top-1 flex flex-none flex-col gap-3 opacity-50 transition-opacity group-hover:opacity-100 lg:left-3 lg:top-3 xl:opacity-100">
        <ColorPicker
          color={resumeData.colorHex || "#000000"}
          onChange={(color) =>
            setResumeData({ ...resumeData, colorHex: color.hex })
          }
          language={language}
        />
        {getCurrentTemplate() !== 1 && (
          <SidebarColorPicker
            color={resumeData.sidebarColorHex || "#0E7490"}
            onChange={(color) =>
              setResumeData({ ...resumeData, sidebarColorHex: color.hex })
            }
            language={language}
          />
        )}
        <BorderStyleButton
          borderStyle={resumeData.borderStyle}
          onChange={(borderStyle) =>
            setResumeData({ ...resumeData, borderStyle })
          }
        />
        <DownloadButton
          language={language}
          resumeContainerRef={resumeContentRef}
          resumeData={resumeData}
        />
        <PrintInstructions language={language} />
      </div>
      <div className="flex w-full justify-center overflow-y-auto bg-secondary p-3 flex-1">
        <div className="resume-container" ref={resumeContentRef}>
          {getTemplateComponent()}
        </div>
      </div>
    </div>
  );
}
