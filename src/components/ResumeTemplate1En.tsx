import { BorderStyles } from "@/app/(main)/editor/BorderStyleButton";
import { cn } from "@/lib/utils";
import { ResumeValues } from "@/lib/validation";
import { formatDate } from "date-fns";
import Image from "next/image";
import React, { useEffect, useState, useMemo } from "react";
import { Badge } from "./ui/badge";

interface ResumePreviewProps {
  resumeData: ResumeValues;
  contentRef?: React.Ref<HTMLDivElement>;
  className?: string;
}

export default React.memo(function ResumeTemplate1En({
  resumeData,
  contentRef,
  className,
}: ResumePreviewProps) {
  const [showSecondPage, setShowSecondPage] = useState(false);
  const [firstPageContentEl, setFirstPageContentEl] = useState<HTMLDivElement | null>(null);

  useEffect(() => {
    if (firstPageContentEl) {
      // Calculate if content overflows and needs second page
      const workExperiences = resumeData.workExperiences?.filter(
        (exp) => Object.values(exp).filter(Boolean).length > 0
      ) || [];
      
      const educations = resumeData.educations?.filter(
        (edu) => Object.values(edu).filter(Boolean).length > 0
      ) || [];

      const skills = resumeData.skills?.filter(Boolean) || [];
      const languages = resumeData.userLanguages?.filter(Boolean) || [];
      
      // Show second page if there's substantial content
      const hasSubstantialContent = workExperiences.length > 3 || 
        educations.length > 2 ||
        skills.length > 8 ||
        languages.length > 3 ||
        (resumeData.summary && resumeData.summary.length > 400);
      
      setShowSecondPage(Boolean(hasSubstantialContent));
    }
  }, [resumeData, firstPageContentEl]);

  // Add fontFamily extraction from resumeData if present
  const fontFamily = resumeData.fontFamily || "'Inter', sans-serif";

  // Determine direction from resumeData.language
  const isResumeArabic = resumeData.language === 'ar' || resumeData.language === 'ar-SA';
  const dir = isResumeArabic ? 'rtl' : 'ltr';

  return (
    <div
      dir={dir}
      className={cn(
        "bg-[#f3f4f6] text-black flex flex-col items-center min-h-screen w-full resume-container",
        className,
      )}
      style={{ minHeight: '100vh', width: '100%', fontFamily }}
      data-template="template1en"
      ref={(el) => {
        // Assign the contentRef to the outermost container so PDF generation can find all .a4-page elements
        if (contentRef && typeof contentRef === 'function') {
          contentRef(el);
        } else if (contentRef && 'current' in contentRef) {
          (contentRef as React.MutableRefObject<HTMLDivElement | null>).current = el;
        }
      }}
    >
      {/* First Page */}
      <div className="a4-page">
        <div
          className="space-y-6 p-6"
          ref={setFirstPageContentEl}
          id="resumePreviewContent"
          style={{ fontFamily }}
        >
          <PersonalInfoHeader resumeData={resumeData} />
          <SummarySection resumeData={resumeData} />
          <WorkExperienceSection resumeData={resumeData} />
          {!showSecondPage && (
            <>
              <EducationSection resumeData={resumeData} />
              <SkillsSection resumeData={resumeData} />
              <LanguagesSection resumeData={resumeData} />
            </>
          )}
        </div>
      </div>
      
      {/* Second Page */}
      {showSecondPage && (
        <div className="a4-page">
          <div className="space-y-6 p-6" style={{ fontFamily }}>
            <WorkExperienceSection resumeData={resumeData} />
            <EducationSection resumeData={resumeData} />
            <SkillsSection resumeData={resumeData} />
            <LanguagesSection resumeData={resumeData} />
          </div>
        </div>
      )}
      
      {/* CSS Styles for A4 Pages and Print */}
      <style>{`
        @media screen {
          .a4-page {
            width: 210mm;
            min-height: 297mm;
            background: white;
            box-shadow: 0 0 8px 2px rgba(0,0,0,0.08);
            margin: 32px 0;
            display: flex;
            flex-direction: column;
            position: relative;
          }
          .a4-page:first-child {
            margin-top: 0;
          }
          .a4-page:not(:last-child)::after {
            content: "Page break";
            display: block;
            position: absolute;
            left: 50%;
            bottom: -24px;
            transform: translateX(-50%);
            color: #888;
            font-size: 14px;
            background: #f3f4f6;
            padding: 2px 12px;
            border-radius: 8px;
            z-index: 2;
          }
        }
        
        @media print {
          /* Page setup for A4 */
          @page {
            size: A4 !important;
            margin: 0 !important;
            padding: 0 !important;
          }
          
          /* Reset page and body */
          html, body {
            margin: 0 !important;
            padding: 0 !important;
            width: 100% !important;
            height: 100% !important;
            background: white !important;
            -webkit-print-color-adjust: exact !important;
            color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          
          /* Hide all elements except the resume */
          body * {
            visibility: hidden !important;
          }
          
          /* Show only the resume container and its contents */
          [data-template="template1en"], [data-template="template1en"] * {
            visibility: visible !important;
          }
          
          /* Style the resume container for print */
          [data-template="template1en"] {
            position: fixed !important;
            left: 0 !important;
            top: 0 !important;
            width: 210mm !important;
            height: 297mm !important;
            background: white !important;
            margin: 0 !important;
            padding: 16px !important;
            box-sizing: border-box !important;
            transform: none !important;
            overflow: visible !important;
            display: block !important;
          }
          
          /* Hide page break indicators */
          .a4-page:not(:last-child)::after {
            display: none !important;
          }
          
          /* Ensure proper A4 page styling for print */
          .a4-page {
            width: 100% !important;
            min-height: auto !important;
            height: auto !important;
            margin: 0 !important;
            padding: 16px !important;
            background: white !important;
            box-shadow: none !important;
            page-break-after: always !important;
            break-after: page !important;
            position: relative !important;
            overflow: visible !important;
            display: block !important;
            box-sizing: border-box !important;
          }
          
          /* Remove page break from last page */
          .a4-page:last-child {
            page-break-after: auto !important;
            break-after: auto !important;
          }
          
          /* Ensure content fits properly within page */
          .a4-page > div {
            width: 100% !important;
            height: auto !important;
            padding: 0 !important;
            box-sizing: border-box !important;
            margin: 0 !important;
          }
          
          /* Preserve colors and styles */
          * {
            -webkit-print-color-adjust: exact !important;
            color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          
          /* Ensure proper spacing and layout */
          .space-y-6 > * + * {
            margin-top: 1.5rem !important;
          }
          
          .space-y-3 > * + * {
            margin-top: 0.75rem !important;
          }
          
          .space-y-2\\.5 > * + * {
            margin-top: 0.625rem !important;
          }
          
          .space-y-1 > * + * {
            margin-top: 0.25rem !important;
          }
          
          /* Prevent elements from breaking across pages */
          .break-inside-avoid {
            page-break-inside: avoid !important;
            break-inside: avoid !important;
          }
          
          /* Ensure headers don't break from content */
          h1, h2, h3, h4, h5, h6 {
            page-break-after: avoid !important;
            break-after: avoid !important;
          }
          
          /* Keep work experience items together */
          .space-y-3 > div {
            page-break-inside: avoid !important;
            break-inside: avoid !important;
          }
          
          /* Adjust font sizes for print consistency */
          .text-3xl {
            font-size: 1.875rem !important;
            line-height: 2.25rem !important;
          }
          
          .text-lg {
            font-size: 1.125rem !important;
            line-height: 1.75rem !important;
          }
          
          .text-sm {
            font-size: 0.875rem !important;
            line-height: 1.25rem !important;
          }
          
          .text-xs {
            font-size: 0.75rem !important;
            line-height: 1rem !important;
          }
          
          /* Ensure proper spacing for flexbox layouts */
          .flex.gap-2 {
            gap: 0.5rem !important;
          }
          
          .flex.gap-6 {
            gap: 1.5rem !important;
          }
          
          .flex.items-center {
            align-items: center !important;
          }
          
          .flex.items-start {
            align-items: flex-start !important;
          }
          
          .flex.justify-between {
            justify-content: space-between !important;
          }
          
          .flex.flex-wrap {
            flex-wrap: wrap !important;
          }
          
          /* Ensure images print correctly */
          img {
            max-width: 100% !important;
            height: auto !important;
            -webkit-print-color-adjust: exact !important;
            color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          
          /* Border styles preservation */
          hr.border-2 {
            border-width: 2px !important;
          }
          
          /* Badge and skill styles */
          .flex-wrap > * {
            flex-shrink: 0 !important;
          }
          
          /* Skills badge color preservation */
          [data-template="template1en"] .flex.flex-wrap.gap-2 .rounded-md {
            -webkit-print-color-adjust: exact !important;
            color-adjust: exact !important;
            print-color-adjust: exact !important;
            background-color: var(--badge-bg-color, #000000) !important;
            color: #ffffff !important;
          }
          
          /* Ensure proper text wrapping */
          .whitespace-pre-line {
            white-space: pre-line !important;
          }
          
          /* Hide any screen-only elements */
          .no-print {
            display: none !important;
          }
          
          /* Typography consistency */
          .font-bold {
            font-weight: 700 !important;
          }
          
          .font-semibold {
            font-weight: 600 !important;
          }
          
          .font-medium {
            font-weight: 500 !important;
          }
          
          /* Color preservation for text */
          .text-gray-500 {
            color: #6b7280 !important;
          }
          
          .text-gray-600 {
            color: #4b5563 !important;
          }
          
          .text-gray-700 {
            color: #374151 !important;
          }
          
          .text-black {
            color: #000000 !important;
          }
          
          .text-white {
            color: #ffffff !important;
          }
          
          /* Background color preservation */
          .bg-black {
            background-color: #000000 !important;
          }
          
          .bg-white {
            background-color: #ffffff !important;
          }
          
          /* Ensure aspect ratios are preserved for images */
          .aspect-square {
            aspect-ratio: 1 / 1 !important;
          }
          
          /* Object fit for images */
          .object-cover {
            object-fit: cover !important;
          }
          
          /* Ensure proper margin and padding reset */
          * {
            box-sizing: border-box !important;
          }
          
          /* Page structure optimization */
          [data-template="template1en"] .a4-page:first-child {
            margin-top: 0 !important;
          }
          
          /* Content overflow handling */
          [data-template="template1en"] .space-y-6 {
            overflow: visible !important;
          }
          
          /* Flexbox gap fallbacks for older browsers */
          .flex.gap-2 > * + * {
            margin-left: 0.5rem !important;
          }
          
          .flex.gap-6 > * + * {
            margin-left: 1.5rem !important;
          }
          
          /* Badge specific print styles */
          .flex.flex-wrap.gap-2 > * {
            margin-bottom: 0.5rem !important;
          }
          
          /* Work experience item styling */
          .break-inside-avoid {
            orphans: 2 !important;
            widows: 2 !important;
          }
          
          /* Personal info header spacing */
          .flex.items-center.gap-6 {
            align-items: center !important;
            gap: 1.5rem !important;
          }
          
          /* Text alignment preservation */
          .text-center {
            text-align: center !important;
          }
        }
      `}</style>
    </div>
  );
});

interface ResumeSectionProps {
  resumeData: ResumeValues;
}

const PersonalInfoHeader = React.memo(function PersonalInfoHeader({ resumeData }: ResumeSectionProps) {
  const {
    photo,
    firstName,
    lastName,
    jobTitle,
    city,
    country,
    phone,
    email,
    colorHex,
    borderStyle,
  } = resumeData;

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

  const nameStyle = useMemo(() => ({ color: colorHex }), [colorHex]);
  const jobTitleStyle = useMemo(() => ({ color: colorHex }), [colorHex]);
  
  const imageStyle = useMemo(() => ({
    borderRadius:
      borderStyle === BorderStyles.SQUARE
        ? "0px"
        : borderStyle === BorderStyles.CIRCLE
          ? "9999px"
          : "10%",
  }), [borderStyle]);

  const contactInfo = useMemo(() => {
    const location = [city, country].filter(Boolean).join(", ");
    const contacts = [phone, email].filter(Boolean).join(" • ");
    return [location, contacts].filter(Boolean).join(" • ");
  }, [city, country, phone, email]);

  return (
    <div className="flex items-center gap-6">
      {isClient && photoSrc && (
        <Image
          src={photoSrc}
          width={100}
          height={100}
          alt="Author photo"
          className="aspect-square object-cover"
          style={imageStyle}
        />
      )}
      <div className="space-y-2.5">
        <div className="space-y-1">
          <p className="text-3xl font-bold" style={nameStyle}>
            {firstName} {lastName}
          </p>
          <p className="font-medium" style={jobTitleStyle}>
            {jobTitle}
          </p>
        </div>
        <p className="text-xs text-gray-500">
          {contactInfo}
        </p>
      </div>
    </div>
  );
});

const SummarySection = React.memo(function SummarySection({ resumeData }: ResumeSectionProps) {
  const { summary, colorHex } = resumeData;

  const borderStyle = useMemo(() => ({ borderColor: colorHex }), [colorHex]);
  const headerStyle = useMemo(() => ({ color: colorHex }), [colorHex]);

  if (!summary) return null;

  return (
    <>
      <hr className="border-2" style={borderStyle} />
      <div className="break-inside-avoid space-y-3">
        <p className="text-lg font-semibold" style={headerStyle}>
          Professional profile
        </p>
        <div className="whitespace-pre-line text-sm">{summary}</div>
      </div>
    </>
  );
});

const WorkExperienceSection = React.memo(function WorkExperienceSection({ 
  resumeData
}: ResumeSectionProps) {
  const { workExperiences, colorHex, bulletStyle, sectionLabelColorHex } = resumeData;

  const workExperiencesNotEmpty = useMemo(() => 
    workExperiences?.filter(
      (exp) => Object.values(exp).filter(Boolean).length > 0,
    ), 
    [workExperiences]
  );

  const borderStyle = useMemo(() => ({ borderColor: colorHex }), [colorHex]);
  const headerStyle = useMemo(() => ({ color: sectionLabelColorHex || colorHex }), [sectionLabelColorHex, colorHex]);

  if (!workExperiencesNotEmpty?.length) return null;

  return (
    <>
      <hr className="border-2" style={borderStyle} />
      <div className="space-y-3">
        <p className="text-lg font-semibold" style={headerStyle}>
          Work experience
        </p>
        {workExperiencesNotEmpty.map((exp, index) => (
          <WorkExperienceItem key={index} experience={exp} colorHex={colorHex} bulletStyle={bulletStyle} />
        ))}
      </div>
    </>
  );
});

type WorkExperience = {
  position?: string;
  company?: string;
  startDate?: Date | string;
  endDate?: Date | string;
  description?: string;
};

const WorkExperienceItem = React.memo(function WorkExperienceItem({ 
  experience, 
  colorHex = "#000000",
  bulletStyle
}: { 
  experience: WorkExperience; 
  colorHex?: string;
  bulletStyle?: string;
}) {
  const titleStyle = useMemo(() => ({ color: colorHex }), [colorHex]);
  
  const dateRange = useMemo(() => {
    if (!experience.startDate) return null;
    return `${formatDate(experience.startDate, "MM/yyyy")} - ${
      experience.endDate ? formatDate(experience.endDate, "MM/yyyy") : "Present"
    }`;
  }, [experience.startDate, experience.endDate]);

  const bulletChar = useMemo(() => {
    return bulletStyle === "dash" ? "–" : "•";
  }, [bulletStyle]);

  const descriptionLines = useMemo(() => {
    return experience.description?.split('\n').filter(line => line.trim())
      .map(line => line.replace(/^[-•]\s*/, '').trim()) || [];
  }, [experience.description]);

  return (
    <div className="break-inside-avoid space-y-1">
      <div className="flex items-center justify-between text-sm font-semibold" style={titleStyle}>
        <span>{experience.position}</span>
        {dateRange && <span>{dateRange}</span>}
      </div>
      <p className="text-xs font-semibold">{experience.company}</p>
      {descriptionLines.length > 0 ? (
        <div className="space-y-1">
          {descriptionLines.map((line, lineIndex) => (
            <div key={lineIndex} className="flex items-start gap-2 text-xs">
              <span className="text-gray-600 flex-shrink-0 mt-0.5">{bulletChar}</span>
              <span className="flex-1">{line}</span>
            </div>
          ))}
        </div>
      ) : (
        experience.description && (
          <div className="whitespace-pre-line text-xs">{experience.description}</div>
        )
      )}
    </div>
  );
});

const EducationSection = React.memo(function EducationSection({ resumeData }: ResumeSectionProps) {
  const { educations, colorHex, sectionLabelColorHex } = resumeData;

  const educationsNotEmpty = useMemo(() => 
    educations?.filter(
      (edu) => Object.values(edu).filter(Boolean).length > 0,
    ), 
    [educations]
  );

  const borderStyle = useMemo(() => ({ borderColor: colorHex }), [colorHex]);
  const headerStyle = useMemo(() => ({ color: sectionLabelColorHex || colorHex }), [sectionLabelColorHex, colorHex]);

  if (!educationsNotEmpty?.length) return null;

  return (
    <>
      <hr className="border-2" style={borderStyle} />
      <div className="space-y-3">
        <p className="text-lg font-semibold" style={headerStyle}>
          Education
        </p>
        {educationsNotEmpty.map((edu, index) => (
          <EducationItem key={index} education={edu} />
        ))}
      </div>
    </>
  );
});

type Education = {
  degree?: string;
  school?: string;
  startDate?: Date | string;
  endDate?: Date | string;
};

const EducationItem = React.memo(function EducationItem({ 
  education
}: { 
  education: Education; 
}) {
  const dateRange = useMemo(() => {
    if (!education.startDate) return null;
    return `${formatDate(education.startDate, "MM/yyyy")}${
      education.endDate ? ` - ${formatDate(education.endDate, "MM/yyyy")}` : ""
    }`;
  }, [education.startDate, education.endDate]);

  return (
    <div className="break-inside-avoid space-y-1">
      <div className="flex items-center justify-between text-sm font-semibold text-black">
        <span>{education.degree}</span>
        {dateRange && <span>{dateRange}</span>}
      </div>
      <p className="text-xs font-semibold">{education.school}</p>
    </div>
  );
});

const SkillsSection = React.memo(function SkillsSection({ resumeData }: ResumeSectionProps) {
  const { skills, colorHex, borderStyle, sectionLabelColorHex } = resumeData;

  const borderStyleMemo = useMemo(() => ({ borderColor: colorHex }), [colorHex]);
  const headerStyle = useMemo(() => ({ color: sectionLabelColorHex || colorHex }), [sectionLabelColorHex, colorHex]);

  const badgeStyle = useMemo(() => ({
    backgroundColor: colorHex,
    borderRadius:
      borderStyle === BorderStyles.SQUARE
        ? "0px"
        : borderStyle === BorderStyles.CIRCLE
          ? "9999px"
          : "8px",
    '--badge-bg-color': colorHex,
  } as React.CSSProperties), [colorHex, borderStyle]);

  if (!skills?.length) return null;

  return (
    <>
      <hr className="border-2" style={borderStyleMemo} />
      <div className="break-inside-avoid space-y-3">
        <p className="text-lg font-semibold" style={headerStyle}>
          Skills
        </p>
        <div className="flex break-inside-avoid flex-wrap gap-2">
          {skills.map((skill, index) => (
            <Badge
              key={index}
              className="rounded-md bg-black text-white hover:bg-black"
              style={badgeStyle}
            >
              {skill}
            </Badge>
          ))}
        </div>
      </div>
    </>
  );
});

const LanguagesSection = React.memo(function LanguagesSection({ resumeData }: ResumeSectionProps) {
  const { userLanguages, colorHex, sectionLabelColorHex } = resumeData;

  const borderStyle = useMemo(() => ({ borderColor: colorHex }), [colorHex]);
  const headerStyle = useMemo(() => ({ color: sectionLabelColorHex || colorHex }), [sectionLabelColorHex, colorHex]);

  if (!userLanguages?.length) return null;

  return (
    <>
      <hr className="border-2" style={borderStyle} />
      <div className="break-inside-avoid space-y-3">
        <p className="text-lg font-semibold" style={headerStyle}>
          Languages
        </p>
        <div className="text-sm">
          {userLanguages.join(', ')}
        </div>
      </div>
    </>
  );
});