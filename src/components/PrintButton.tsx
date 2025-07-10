import { Button } from "@/components/ui/button";
import { FileText, Loader2 } from "lucide-react";
import { useState } from "react";
import { ResumeValues } from "@/lib/validation";
import { ensureResumeContent, convertToResumeData } from "@/lib/utils";
import { printResumeToPdf } from "@/lib/printToPdfService";

interface PrintButtonProps {
  language?: 'ar' | 'en';
  className?: string;
  resumeData?: ResumeValues;
}

export default function PrintButton({ 
  language = 'en', 
  className,
  resumeData
}: PrintButtonProps) {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    setIsExporting(true);
    
    try {
      // Check if resume data exists and has content
      if (resumeData) {
        const enrichedResumeData = ensureResumeContent(resumeData);
        
        // Log the resume data for debugging
        console.log('Exporting PDF with data:', {
          firstName: enrichedResumeData.firstName,
          lastName: enrichedResumeData.lastName,
          sidebarColorHex: enrichedResumeData.sidebarColorHex,
          sectionLabelColorHex: enrichedResumeData.sectionLabelColorHex,
          templateCode: enrichedResumeData.templateCode,
          language: enrichedResumeData.language
        });

        // Convert ResumeValues to ResumeData for PDF service
        const pdfResumeData = convertToResumeData(enrichedResumeData);
        
        console.log('Converted PDF resume data:', {
          templateCode: pdfResumeData.templateCode,
          firstName: pdfResumeData.firstName,
          lastName: pdfResumeData.lastName,
          sidebarColorHex: pdfResumeData.sidebarColorHex,
          sectionLabelColorHex: pdfResumeData.sectionLabelColorHex,
          workExperiences: pdfResumeData.workExperiences?.length,
          educations: pdfResumeData.educations?.length,
          skills: pdfResumeData.skills?.length,
          userLanguages: pdfResumeData.userLanguages?.length
        });
        
        // Use react-to-print for all templates (more reliable)
        console.log('Using react-to-print service');
        await printResumeToPdf(pdfResumeData);
        console.log('PDF export completed successfully!');
      } else {
        console.error('No resume data provided for PDF export');
      }
    } catch (error) {
      console.error('PDF export error:', error);
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
        <FileText className="w-4 h-4" />
      )}
      <span className="ml-2">
        {language === 'ar' ? 'تصدير PDF' : 'Export PDF'}
      </span>
    </Button>
  );
} 