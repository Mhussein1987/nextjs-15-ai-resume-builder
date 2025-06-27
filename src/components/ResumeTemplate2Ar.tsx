import { BorderStyles } from "@/app/(main)/editor/BorderStyleButton";
import useDimensions from "@/hooks/useDimensions";
import { cn } from "@/lib/utils";
import { ResumeValues } from "@/lib/validation";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";

interface ResumePreviewProps {
  resumeData: ResumeValues;
  className?: string;
}

interface WorkExperience {
  position?: string;
  company?: string;
  startDate?: string;
  endDate?: string;
  description?: string;
}

const ResumeTemplate2Ar = React.memo(function ResumeTemplate2Ar({
  resumeData,
  className,
}: ResumePreviewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { width } = useDimensions(containerRef);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Get selected font or default
  const selectedFont = "'Times New Roman', serif";

  // Determine direction from resumeData.language
  const isResumeArabic = resumeData.language === 'ar' || resumeData.language === 'ar-SA';
  const dir = isResumeArabic ? 'rtl' : 'ltr';

  return (
    <div className="relative">
      {/* Resume Content */}
      <div
        className={cn(
          "aspect-[210/297] h-fit w-full bg-white text-black print:w-[210mm] print:h-[297mm] arabic-resume-pdf",
          className,
        )}
        ref={containerRef}
        dir={dir} // Set direction based on resumeData.language
        data-template="template2ar" // Add data attribute for print CSS targeting
        data-pdf-export="true" // Add data attribute for PDF export
        style={{
          // Arabic text rendering optimizations
          fontKerning: 'auto',
          textRendering: 'optimizeLegibility',
          WebkitFontFeatureSettings: '"kern" 1, "liga" 1, "calt" 1',
          fontFeatureSettings: '"kern" 1, "liga" 1, "calt" 1',
          // Prevent text overlapping
          wordWrap: 'break-word',
          overflowWrap: 'break-word',
          hyphens: 'auto',
          // Ensure visibility for PDF export
          visibility: 'visible',
          opacity: 1,
        }}
      >
        <div
          className={cn("flex flex-row-reverse", !width && !isClient && "invisible")}
          style={{
            zoom: isClient && width ? (1 / 794) * width : 1,
            minHeight: '297mm',
            width: '210mm',
            // Arabic text rendering optimizations
            fontKerning: 'auto',
            textRendering: 'optimizeLegibility',
            WebkitFontFeatureSettings: '"kern" 1, "liga" 1, "calt" 1',
            fontFeatureSettings: '"kern" 1, "liga" 1, "calt" 1',
            // Enhanced PDF export optimizations
            lineHeight: '1.6',
            letterSpacing: '0.01em',
            // Ensure visibility for PDF export
            visibility: 'visible',
            opacity: 1,
            display: 'flex',
            // Enhanced RTL support
            direction: 'rtl',
            textAlign: 'right',
          }}
          id="resumePreviewContent"
        >
          {/* Right Sidebar - Grey */}
          <div 
            className="sidebar w-1/3 flex flex-col relative overflow-hidden"
            style={{
              minHeight: '297mm',
              background: resumeData.sidebarColorHex || '#0E7490',
              color: 'black',
              fontSize: '14px',
              fontFamily: selectedFont,
              // Arabic text rendering optimizations
              fontKerning: 'auto',
              textRendering: 'optimizeLegibility',
              WebkitFontFeatureSettings: '"kern" 1, "liga" 1, "calt" 1',
              fontFeatureSettings: '"kern" 1, "liga" 1, "calt" 1',
              // Enhanced PDF export optimizations
              wordWrap: 'break-word',
              overflowWrap: 'break-word',
              hyphens: 'auto',
              lineHeight: '1.6',
              letterSpacing: '0.01em',
            }}
          >
            <Sidebar 
              resumeData={resumeData} 
              borderStyle={resumeData.borderStyle}
              fontFamily={selectedFont}
            />
          </div>
          {/* Left Content Area - White */}
          <div 
            className="main-content w-2/3 h-full p-6 print:p-4 print:w-[140mm]"
            style={{
              minHeight: '297mm',
              fontSize: '14px',
              fontFamily: selectedFont,
              // Arabic text rendering optimizations
              fontKerning: 'auto',
              textRendering: 'optimizeLegibility',
              WebkitFontFeatureSettings: '"kern" 1, "liga" 1, "calt" 1',
              fontFeatureSettings: '"kern" 1, "liga" 1, "calt" 1',
              // Enhanced PDF export optimizations
              wordWrap: 'break-word',
              overflowWrap: 'break-word',
              hyphens: 'auto',
              lineHeight: '1.6',
              letterSpacing: '0.01em',
            }}
          >
            <MainContent 
              resumeData={resumeData} 
              colorHex={resumeData.colorHex}
              fontFamily={selectedFont}
              bulletStyle={resumeData.bulletStyle}
            />
          </div>
        </div>
      </div>

      {/* Print styles for PDF export */}
      <style jsx>{`
        @media print {
          * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            color-adjust: exact !important;
            visibility: visible !important;
            opacity: 1 !important;
          }
          
          /* Force visibility for PDF export */
          .resume-container * {
            visibility: visible !important;
            opacity: 1 !important;
            display: block !important;
          }
          
          /* Arabic text rendering optimizations for print */
          [dir="rtl"] * {
            font-kerning: auto !important;
            text-rendering: optimizeLegibility !important;
            -webkit-font-feature-settings: "kern" 1, "liga" 1, "calt" 1 !important;
            font-feature-settings: "kern" 1, "liga" 1, "calt" 1 !important;
            word-wrap: break-word !important;
            overflow-wrap: break-word !important;
            hyphens: auto !important;
            line-height: 1.6 !important;
            letter-spacing: 0.01em !important;
            visibility: visible !important;
            opacity: 1 !important;
          }
          
          /* Arabic text optimization class */
          .arabic-text-optimized {
            font-kerning: auto !important;
            text-rendering: optimizeLegibility !important;
            -webkit-font-feature-settings: "kern" 1, "liga" 1, "calt" 1 !important;
            font-feature-settings: "kern" 1, "liga" 1, "calt" 1 !important;
            word-wrap: break-word !important;
            overflow-wrap: break-word !important;
            hyphens: auto !important;
            line-height: 1.6 !important;
            letter-spacing: 0.01em !important;
          }
          
          /* Enhanced spacing for Arabic text in print */
          [dir="rtl"] .text-sm,
          [dir="rtl"] .text-xs,
          [dir="rtl"] p,
          [dir="rtl"] div,
          [dir="rtl"] span {
            word-wrap: break-word !important;
            overflow-wrap: break-word !important;
            hyphens: auto !important;
            line-height: 1.8 !important;
            letter-spacing: 0.01em !important;
            margin-bottom: 4px !important;
          }
          
          /* Enhanced spacing for work experience items */
          [dir="rtl"] .space-y-1 > * + * {
            margin-top: 0.5rem !important;
          }
          
          [dir="rtl"] .space-y-2 > * + * {
            margin-top: 0.75rem !important;
          }
          
          [dir="rtl"] .space-y-3 > * + * {
            margin-top: 1rem !important;
          }
          
          [dir="rtl"] .space-y-4 > * + * {
            margin-top: 1.25rem !important;
          }
          
          /* Enhanced bullet point alignment for RTL */
          [dir="rtl"] .flex.items-start.gap-2,
          [dir="rtl"] .flex.items-start.gap-3 {
            flex-direction: row-reverse !important;
            text-align: right !important;
            align-items: flex-start !important;
            gap: 12px !important;
          }
          
          [dir="rtl"] .flex.items-start.gap-2 .flex-shrink-0,
          [dir="rtl"] .flex.items-start.gap-3 .flex-shrink-0 {
            order: 2 !important;
            margin-left: 0 !important;
            margin-right: 8px !important;
            margin-top: 2px !important;
            font-size: 10px !important;
          }
          
          [dir="rtl"] .flex.items-start.gap-2 .flex-1,
          [dir="rtl"] .flex.items-start.gap-3 .flex-1 {
            order: 1 !important;
            text-align: right !important;
            direction: rtl !important;
            line-height: 1.8 !important;
          }
          
          /* Ensure proper container sizing */
          .resume-container {
            width: 210mm !important;
            min-height: 297mm !important;
            background: white !important;
            color: black !important;
          }
          
          /* Enhanced main content area */
          .main-content {
            padding: 24px !important;
            line-height: 1.6 !important;
            letter-spacing: 0.01em !important;
          }
          
          /* Enhanced sidebar */
          .sidebar {
            line-height: 1.6 !important;
            letter-spacing: 0.01em !important;
          }
          
          /* Arabic resume PDF specific styles */
          .arabic-resume-pdf {
            visibility: visible !important;
            opacity: 1 !important;
            display: block !important;
          }
          
          .arabic-resume-pdf * {
            visibility: visible !important;
            opacity: 1 !important;
          }
          
          /* Ensure text content is visible */
          [data-pdf-export="true"] * {
            visibility: visible !important;
            opacity: 1 !important;
            color: black !important;
            background-color: transparent !important;
          }
        }
      `}</style>
    </div>
  );
});

ResumeTemplate2Ar.displayName = 'ResumeTemplate2Ar';

export default ResumeTemplate2Ar;

// All helper functions below this line

// Sidebar component for Arabic template
const Sidebar = React.memo(function Sidebar({ resumeData, borderStyle, fontFamily }: { resumeData: ResumeValues, borderStyle?: typeof BorderStyles[keyof typeof BorderStyles], fontFamily?: string }) {
  const { photo, phone, email, city, country, educations, skills } = resumeData;
  const [photoSrc, setPhotoSrc] = useState<string>("");
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;
    let objectUrl = "";
    if (photo instanceof File) {
      objectUrl = URL.createObjectURL(photo);
      setPhotoSrc(objectUrl);
    } else {
      setPhotoSrc(photo || "");
    }
    return () => {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [photo, isClient]);

  // Memoize computed values
  const imageStyle = React.useMemo(() => ({
    borderRadius:
      borderStyle === BorderStyles.SQUARE
        ? "0px"
        : borderStyle === BorderStyles.CIRCLE
          ? "9999px"
          : "10%",
    fontFamily,
  }), [borderStyle, fontFamily]);

  const location = React.useMemo(() =>
    [city, country].filter(Boolean).join("، "),
    [city, country]
  );

  const filteredEducations = React.useMemo(() =>
    educations?.filter(edu => Object.values(edu).filter(Boolean).length > 0) || [],
    [educations]
  );

  return (
    <div 
      className="w-full text-white space-y-6 print:space-y-4" 
      style={{ 
        fontFamily,
        // Arabic text rendering optimizations
        fontKerning: 'auto',
        textRendering: 'optimizeLegibility',
        WebkitFontFeatureSettings: '"kern" 1, "liga" 1, "calt" 1',
        fontFeatureSettings: '"kern" 1, "liga" 1, "calt" 1',
        // Prevent text overlapping
        wordWrap: 'break-word',
        overflowWrap: 'break-word',
        hyphens: 'auto',
      }}
    >
      {/* Profile Image - with border style */}
      {isClient && photoSrc && (
        <div className="flex justify-center pt-6">
          <Image
            src={photoSrc}
            width={120}
            height={120}
            alt="Profile Photo"
            className="aspect-square object-cover border-4 border-white print:w-32 print:h-32"
            style={imageStyle}
          />
        </div>
      )}

      {/* Contact Section - Always show */}
      <ContactSection phone={phone} email={email} location={location} />

      {/* Education Section - Always show */}
      <EducationSection educations={filteredEducations} />

      {/* Skills Section - Always show */}
      <SkillsSection skills={skills || []} />

      {/* Languages Section - Always show */}
      {resumeData.userLanguages && resumeData.userLanguages.length > 0 && (
        <div className="space-y-3 print:space-y-2 break-inside-avoid px-4 py-2">
          <div className="text-right">
            <h2 className="text-base font-bold text-white uppercase tracking-wide print:text-base" style={{ lineHeight: "1.4" }}>
              اللغات
            </h2>
            <div className="w-32 h-0.5 bg-white mt-3 ml-auto"></div>
          </div>
          <div 
            className="text-sm text-white text-right print:text-sm"
            style={{
              // Arabic text rendering optimizations
              fontKerning: 'auto',
              textRendering: 'optimizeLegibility',
              WebkitFontFeatureSettings: '"kern" 1, "liga" 1, "calt" 1',
              fontFeatureSettings: '"kern" 1, "liga" 1, "calt" 1',
              // Prevent text overlapping
              wordWrap: 'break-word',
              overflowWrap: 'break-word',
              hyphens: 'auto',
              lineHeight: '1.6',
            }}
          >
            {resumeData.userLanguages.join(', ')}
          </div>
        </div>
      )}
    </div>
  );
});

const ContactSection = React.memo(function ContactSection({ 
  phone, 
  email, 
  location
}: { 
  phone?: string; 
  email?: string; 
  location?: string;
}) {
  return (
    <div className="space-y-3 print:space-y-2 break-inside-avoid px-4 py-2">
      <div className="text-right">
        <h2 className="text-base font-bold text-white uppercase tracking-wide print:text-base" style={{ lineHeight: "1.4" }}>
          معلومات الاتصال
        </h2>
        <div className="w-32 h-0.5 bg-white mt-3 ml-auto"></div>
      </div>
      <div 
        className="text-sm text-white text-right print:text-sm space-y-2"
        style={{
          // Arabic text rendering optimizations
          fontKerning: 'auto',
          textRendering: 'optimizeLegibility',
          WebkitFontFeatureSettings: '"kern" 1, "liga" 1, "calt" 1',
          fontFeatureSettings: '"kern" 1, "liga" 1, "calt" 1',
          // Prevent text overlapping
          wordWrap: 'break-word',
          overflowWrap: 'break-word',
          hyphens: 'auto',
          lineHeight: '1.6',
        }}
      >
        {phone && (
          <div className="text-right">
            <span>{phone}</span>
          </div>
        )}
        {email && (
          <div className="text-right">
            <span className="break-all">{email}</span>
          </div>
        )}
        {location && (
          <div className="text-right">
            <span>{location}</span>
          </div>
        )}
      </div>
    </div>
  );
});

const EducationSection = React.memo(function EducationSection({ 
  educations
}: { 
  educations: Array<{
    degree?: string;
    school?: string;
    startDate?: string;
    endDate?: string;
  }>;
}) {
  return (
    <div className="space-y-3 print:space-y-2 break-inside-avoid px-4 py-2">
      <div className="text-right">
        <h2 className="text-base font-bold text-white uppercase tracking-wide print:text-base" style={{ lineHeight: "1.4" }}>
          التعليم
        </h2>
        <div className="w-32 h-0.5 bg-white mt-3 ml-auto"></div>
      </div>
      <div 
        className="space-y-3 print:space-y-2"
        style={{
          // Arabic text rendering optimizations
          fontKerning: 'auto',
          textRendering: 'optimizeLegibility',
          WebkitFontFeatureSettings: '"kern" 1, "liga" 1, "calt" 1',
          fontFeatureSettings: '"kern" 1, "liga" 1, "calt" 1',
          // Prevent text overlapping
          wordWrap: 'break-word',
          overflowWrap: 'break-word',
          hyphens: 'auto',
        }}
      >
        {educations.length > 0 ? (
          educations.map((education, index) => (
            <EducationItem key={index} education={education} />
          ))
        ) : (
          <p className="text-sm text-white italic text-right">لم يتم إضافة تعليم بعد</p>
        )}
      </div>
    </div>
  );
});

const SkillsSection = React.memo(function SkillsSection({ 
  skills 
}: { 
  skills: string[];
}) {
  return (
    <div className="space-y-3 print:space-y-2 break-inside-avoid px-4 py-2">
      <div className="text-right">
        <h2 className="text-base font-bold text-white uppercase tracking-wide print:text-base" style={{ lineHeight: "1.4" }}>
          المهارات
        </h2>
        <div className="w-32 h-0.5 bg-white mt-3 ml-auto"></div>
      </div>
      <div 
        className="space-y-3 print:space-y-2"
        style={{
          // Arabic text rendering optimizations
          fontKerning: 'auto',
          textRendering: 'optimizeLegibility',
          WebkitFontFeatureSettings: '"kern" 1, "liga" 1, "calt" 1',
          fontFeatureSettings: '"kern" 1, "liga" 1, "calt" 1',
          // Prevent text overlapping
          wordWrap: 'break-word',
          overflowWrap: 'break-word',
          hyphens: 'auto',
        }}
      >
        {skills.length > 0 ? (
          skills.map((skill, index) => (
            <SkillItem key={index} skill={skill} />
          ))
        ) : (
          <p className="text-sm text-white italic text-right">لم يتم إضافة مهارات بعد</p>
        )}
      </div>
    </div>
  );
});

// Skill Item Component
const SkillItem = React.memo(function SkillItem({ 
  skill 
}: { 
  skill: string;
}) {
  return (
    <div 
      className="text-sm text-white text-right print:text-sm"
      style={{
        // Arabic text rendering optimizations
        fontKerning: 'auto',
        textRendering: 'optimizeLegibility',
        WebkitFontFeatureSettings: '"kern" 1, "liga" 1, "calt" 1',
        fontFeatureSettings: '"kern" 1, "liga" 1, "calt" 1',
        // Prevent text overlapping
        wordWrap: 'break-word',
        overflowWrap: 'break-word',
        hyphens: 'auto',
        lineHeight: '1.6',
      }}
    >
      <div className="font-semibold">{skill}</div>
    </div>
  );
});

const EducationItem = React.memo(function EducationItem({ 
  education 
}: { 
  education: {
    degree?: string;
    school?: string;
    startDate?: string;
    endDate?: string;
  };
}) {
  const dateRange = React.useMemo(() => {
    if (!education.startDate) return null;
    return `${education.startDate}${education.endDate ? ` - ${education.endDate}` : " - الحالي"}`;
  }, [education.startDate, education.endDate]);

  return (
    <div 
      className="text-sm text-white text-right print:text-sm"
      style={{
        // Arabic text rendering optimizations
        fontKerning: 'auto',
        textRendering: 'optimizeLegibility',
        WebkitFontFeatureSettings: '"kern" 1, "liga" 1, "calt" 1',
        fontFeatureSettings: '"kern" 1, "liga" 1, "calt" 1',
        // Prevent text overlapping
        wordWrap: 'break-word',
        overflowWrap: 'break-word',
        hyphens: 'auto',
        lineHeight: '1.6',
      }}
    >
      {education.degree && (
        <div className="font-semibold">{education.degree}</div>
      )}
      {education.school && (
        <div className="text-white">{education.school}</div>
      )}
      {dateRange && (
        <div className="text-white text-xs print:text-sm">
          {dateRange}
        </div>
      )}
    </div>
  );
});

// Summary Section
const SummarySection = React.memo(function SummarySection({ 
  summary,
  colorHex
}: { 
  summary: string;
  colorHex?: string;
}) {
  const headerStyle = React.useMemo(() => ({ color: colorHex || "#000000" }), [colorHex]);
  
  return (
    <div className="break-inside-avoid" style={{ marginTop: '15px' }}>
      <h3 className="text-lg font-bold text-black uppercase tracking-wide mb-3 text-right print:text-base print:mb-2" style={{ lineHeight: "1.4", ...headerStyle }}>
        الملخص المهني
      </h3>
      <div className="w-full h-px mb-6 print:mb-4" style={{ backgroundColor: colorHex || "#000000" }}></div>
      
      <div 
        className="text-sm text-gray-800 leading-relaxed text-right print:text-sm" 
        style={{ 
          lineHeight: "1.6",
          // Arabic text rendering optimizations
          fontKerning: 'auto',
          textRendering: 'optimizeLegibility',
          WebkitFontFeatureSettings: '"kern" 1, "liga" 1, "calt" 1',
          fontFeatureSettings: '"kern" 1, "liga" 1, "calt" 1',
          // Prevent text overlapping
          wordWrap: 'break-word',
          overflowWrap: 'break-word',
          hyphens: 'auto',
        }}
      >
        <p>{summary}</p>
      </div>
    </div>
  );
});

// MainContent component for Arabic template
const MainContent = React.memo(function MainContent({ 
  resumeData, 
  colorHex, 
  fontFamily, 
  bulletStyle, 
  workExperiences 
}: { 
  resumeData: ResumeValues, 
  colorHex?: string, 
  fontFamily?: string, 
  bulletStyle?: string,
  workExperiences?: WorkExperience[]
}) {
  const { firstName, lastName, jobTitle, summary } = resumeData;
  const workExperiencesNotEmpty = React.useMemo(() =>
    workExperiences || resumeData.workExperiences?.filter((exp) => Object.values(exp).filter(Boolean).length > 0) || [],
    [workExperiences, resumeData.workExperiences]
  );
  // Determine bullet character based on bullet style
  const bulletChar = React.useMemo(() => bulletStyle === "dash" ? "−" : "•", [bulletStyle]);
  const fullName = React.useMemo(() =>
    [firstName, lastName].filter(Boolean).join(' '),
    [firstName, lastName]
  );
  const nameStyle = React.useMemo(() => ({
    color: colorHex || "#000000",
    letterSpacing: "0.01em",
    lineHeight: "1.4",
    fontWeight: "700",
    fontFamily,
  }), [colorHex, fontFamily]);
  const jobTitleStyle = React.useMemo(() => ({
    color: colorHex || "#6B7280",
    lineHeight: "1.5",
    fontFamily,
  }), [colorHex, fontFamily]);
  
  return (
    <div 
      className="w-2/3 bg-white text-slate-800 relative arabic-text-optimized" 
      style={{ 
        fontFamily,
        // Prevent text overlapping
        wordWrap: 'break-word',
        overflowWrap: 'break-word',
        hyphens: 'auto',
      }}
    >
      <div className="p-6" style={{ paddingTop: '10px' }}>
        {/* Name and Job Title */}
        {fullName && (
          <div className="mb-8 text-right print:mb-6">
            <h1 
              className="text-3xl font-bold uppercase print:text-2xl arabic-text-optimized"
              style={nameStyle}
            >
              {fullName}
            </h1>
            {jobTitle && (
              <h2 
                className="text-xl mt-2 font-medium print:text-lg print:mt-1 arabic-text-optimized"
                style={jobTitleStyle}
              >
                {jobTitle}
              </h2>
            )}
          </div>
        )}

        {/* Summary */}
        {summary && summary.trim() && (
          <SummarySection summary={summary} colorHex={colorHex} />
        )}

        {/* Work Experience - Always show */}
        <WorkExperienceSection 
          workExperiences={workExperiencesNotEmpty}
          colorHex={colorHex}
          bulletChar={bulletChar}
          fontFamily={fontFamily}
        />
      </div>
    </div>
  );
});

const WorkExperienceSection = React.memo(function WorkExperienceSection({ 
  workExperiences, 
  colorHex, 
  bulletChar, 
  fontFamily 
}: { 
  workExperiences: WorkExperience[], 
  colorHex?: string, 
  bulletChar: string, 
  fontFamily?: string 
}) {
  const headerStyle = React.useMemo(() => ({ color: colorHex || "#000000" }), [colorHex]);
  
  return (
    <div style={{ marginTop: '20px' }}>
      <h3 className="text-lg font-bold text-black uppercase tracking-wide mb-4 text-right print:text-base print:mb-3" style={{ lineHeight: "1.4", ...headerStyle }}>
        الخبرة العملية
      </h3>
      <div className="w-full h-px mb-6 print:mb-4" style={{ backgroundColor: colorHex || "#000000" }}></div>
      
      {workExperiences.length > 0 ? (
        <div 
          className="space-y-4 print:space-y-3 arabic-text-optimized"
          style={{
            // Enhanced PDF export optimizations
            wordWrap: 'break-word',
            overflowWrap: 'break-word',
            hyphens: 'auto',
            lineHeight: '1.6',
            letterSpacing: '0.01em',
          }}
        >
          {workExperiences.map((exp, index) => (
            <WorkExperienceItem
              key={index}
              experience={exp}
              bulletChar={bulletChar}
              fontFamily={fontFamily}
            />
          ))}
        </div>
      ) : (
        <p 
          className="text-sm text-gray-500 italic text-right arabic-text-optimized"
          style={{
            // Enhanced PDF export optimizations
            wordWrap: 'break-word',
            overflowWrap: 'break-word',
            hyphens: 'auto',
            lineHeight: '1.8',
            letterSpacing: '0.01em',
            marginTop: '8px',
          }}
        >
          لم يتم إضافة خبرة عمل بعد
        </p>
      )}
    </div>
  );
});

const WorkExperienceItem = React.memo(function WorkExperienceItem({
  experience,
  bulletChar,
  fontFamily
}: {
  experience: WorkExperience;
  bulletChar: string;
  fontFamily?: string;
}) {
  const dateRange = React.useMemo(() => {
    if (!experience.startDate) return null;
    return `${experience.startDate}${experience.endDate ? ` - ${experience.endDate}` : " - الحالي"}`;
  }, [experience.startDate, experience.endDate]);

  const descriptionLines = React.useMemo(() => {
    return experience.description?.split('\n').filter(line => line.trim())
      .map(line => line.replace(/^[-•]\s*/, '').trim()) || [];
  }, [experience.description]);

  return (
    <div 
      className="break-inside-avoid space-y-2 arabic-text-optimized" 
      style={{ 
        fontFamily,
        // Enhanced PDF export optimizations
        wordWrap: 'break-word',
        overflowWrap: 'break-word',
        hyphens: 'auto',
        lineHeight: '1.6',
        letterSpacing: '0.01em',
        marginBottom: '8px',
      }}
    >
      <div className="flex items-center justify-between text-sm font-semibold text-black" style={{ marginBottom: '4px' }}>
        <span>{experience.position}</span>
        {dateRange && <span>{dateRange}</span>}
      </div>
      <p className="text-xs font-semibold" style={{ marginBottom: '6px' }}>{experience.company}</p>
      {descriptionLines.length > 0 ? (
        <div className="space-y-2">
          {descriptionLines.map((line, lineIndex) => (
            <div 
              key={lineIndex} 
              className="flex items-start gap-3 text-xs arabic-text-optimized" 
              dir="rtl"
              style={{
                // Enhanced PDF export optimizations
                wordWrap: 'break-word',
                overflowWrap: 'break-word',
                hyphens: 'auto',
                lineHeight: '1.8',
                letterSpacing: '0.01em',
                marginBottom: '4px',
                alignItems: 'flex-start',
              }}
            >
              <span 
                className="text-gray-600 flex-shrink-0" 
                style={{ 
                  marginTop: '2px',
                  marginLeft: '8px',
                  fontSize: '10px',
                }}
              >
                {bulletChar}
              </span>
              <span 
                className="flex-1"
                style={{
                  textAlign: 'right',
                  direction: 'rtl',
                }}
              >
                {line}
              </span>
            </div>
          ))}
        </div>
      ) : (
        experience.description && (
          <div 
            className="whitespace-pre-line text-xs arabic-text-optimized"
            style={{
              // Enhanced PDF export optimizations
              wordWrap: 'break-word',
              overflowWrap: 'break-word',
              hyphens: 'auto',
              lineHeight: '1.8',
              letterSpacing: '0.01em',
              textAlign: 'right',
              direction: 'rtl',
            }}
          >
            {experience.description}
          </div>
        )
      )}
    </div>
  );
});