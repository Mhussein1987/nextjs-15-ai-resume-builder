import { ResumeValues } from "@/lib/validation";
import React, { useRef } from "react";
import ColorPicker from "./ColorPicker";
import BorderStyleButton from "./BorderStyleButton";
import SidebarColorPicker from "./SidebarColorPicker";
import DownloadButton from "@/components/DownloadButton";
import { getTemplateNumber } from "@/lib/templateReferenceSystem";

interface ResumeControlsProps {
  resumeData: ResumeValues;
  setResumeData: (updater: React.SetStateAction<ResumeValues>) => void;
  language: 'ar' | 'en';
  resumeContentRef: React.RefObject<HTMLDivElement>;
  className?: string;
}

export default function ResumeControls({ 
  resumeData, 
  setResumeData, 
  language, 
  resumeContentRef,
  className 
}: ResumeControlsProps) {
  // Get template number to determine if sidebar color picker should be shown
  const getSelectedTemplate = () => {
    let templateCode = resumeData.templateCode;
    
    if (!templateCode) {
      return 1; // Default to template 1
    }
    
    return getTemplateNumber(templateCode);
  };

  const selectedTemplate = getSelectedTemplate();

  return (
    <div className={`flex items-center gap-3 ${className || ''}`}>
      <ColorPicker
        color={resumeData.colorHex || "#000000"}
        onChange={(color) => setResumeData((prev) => ({ ...prev, colorHex: color.hex }))}
        language={language}
      />
      
      {/* Only show SidebarColorPicker for templates that have sidebars (template 2 and 4, not template 1) */}
      {selectedTemplate !== 1 && (
        <SidebarColorPicker
          color={resumeData.sidebarColorHex || "#0E7490"}
          onChange={(color) => setResumeData((prev) => ({ ...prev, sidebarColorHex: color.hex }))}
          language={language}
        />
      )}
      
      <BorderStyleButton
        borderStyle={resumeData.borderStyle}
        onChange={(style) => setResumeData(prev => ({ ...prev, borderStyle: style }))}
      />
      
      <DownloadButton 
        resumeContainerRef={resumeContentRef} 
        resumeData={resumeData} 
        language={language} 
      />
    </div>
  );
} 