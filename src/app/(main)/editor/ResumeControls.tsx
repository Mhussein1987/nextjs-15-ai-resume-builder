import { ResumeValues } from "@/lib/validation";
import React from "react";
import BorderStyleButton from "./BorderStyleButton";
import SidebarColorPicker from "./SidebarColorPicker";
import SectionLabelColorPicker from "./SectionLabelColorPicker";
import PrintButton from "@/components/PrintButton";
import { getTemplateNumber } from "@/lib/templateReferenceSystem";

interface ResumeControlsProps {
  resumeData: ResumeValues;
  setResumeData: (updater: React.SetStateAction<ResumeValues>) => void;
  language: 'ar' | 'en';
  className?: string;
}

export default function ResumeControls({ 
  resumeData, 
  setResumeData, 
  language, 
  className 
}: ResumeControlsProps) {
  // Get template number to determine if sidebar color picker should be shown
  const getSelectedTemplate = () => {
    const templateCode = resumeData.templateCode;
    
    if (!templateCode) {
      return 1; // Default to template 1
    }
    
    return getTemplateNumber(templateCode);
  };

  const selectedTemplate = getSelectedTemplate();

  return (
    <div className={`flex items-center gap-3 ${className || ''}`}>
      {/* Only show SidebarColorPicker for templates that have sidebars (template 2 and 4, not template 1) */}
      {selectedTemplate !== 1 && (
        <SidebarColorPicker
          color={resumeData.sidebarColorHex || "#0E7490"}
          onChange={(color) => setResumeData((prev) => ({ ...prev, sidebarColorHex: color.hex }))}
          language={language}
        />
      )}
      
      <SectionLabelColorPicker
        color={resumeData.sectionLabelColorHex || "#1f2937"}
        onChange={(color) => setResumeData((prev) => ({ ...prev, sectionLabelColorHex: color.hex }))}
        language={language}
      />
      
      <BorderStyleButton
        borderStyle={resumeData.borderStyle}
        onChange={(style) => setResumeData(prev => ({ ...prev, borderStyle: style }))}
      />
      
      <PrintButton 
        language={language}
        resumeData={resumeData}
      />
    </div>
  );
} 