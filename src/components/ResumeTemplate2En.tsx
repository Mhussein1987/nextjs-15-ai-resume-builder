import { BorderStyles } from "@/app/(main)/editor/BorderStyleButton";
import useDimensions from "@/hooks/useDimensions";
import { cn } from "@/lib/utils";
import { ResumeValues } from "@/lib/validation";
import Image from "next/image";
import React, { useEffect, useRef, useState, useMemo } from "react";
import { Phone, Mail, MapPin } from "lucide-react";

interface ResumePreviewProps {
  resumeData: ResumeValues;
  className?: string;
}

// Constants to avoid recreating objects
const DEFAULT_FONT = "'Times New Roman', serif";
const DEFAULT_SIDEBAR_COLOR = '#0E7490';
const DEFAULT_COLOR = "#000000";
const DEFAULT_JOB_TITLE_COLOR = "#6B7280";
const BULLET_CHARS = {
  dash: "−",
  bullet: "•"
} as const;

// Memoized styles to avoid recreating objects
const getImageStyle = (borderStyle?: string, fontFamily?: string) => ({
  borderRadius:
    borderStyle === BorderStyles.SQUARE
      ? "0px"
      : borderStyle === BorderStyles.CIRCLE
        ? "9999px"
        : "10%",
  fontFamily,
});

const getContactItemStyle = () => ({ lineHeight: "1.5" });
const getSectionHeaderStyle = () => ({ lineHeight: "1.4" });
const getEducationItemStyle = () => ({ lineHeight: "1.5" });

const ResumeTemplate2En = React.memo(function ResumeTemplate2En({
  resumeData,
  className,
}: ResumePreviewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { width } = useDimensions(containerRef);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Memoize computed values
  const isResumeArabic = useMemo(() => 
    resumeData.language === 'ar' || resumeData.language === 'ar-SA', 
    [resumeData.language]
  );
  
  const dir = useMemo(() => isResumeArabic ? 'rtl' : 'ltr', [isResumeArabic]);
  
  const containerStyle = useMemo(() => ({
    zoom: isClient && width ? (1 / 794) * width : 1,
    minHeight: '297mm',
    width: '210mm',
    // Text rendering optimizations
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
    // Enhanced LTR support
    direction: 'ltr',
    textAlign: 'left',
  }), [isClient, width]);

  const sidebarStyle = useMemo(() => ({
    minHeight: '297mm',
    background: resumeData.sidebarColorHex || DEFAULT_SIDEBAR_COLOR,
    color: 'black',
    fontSize: '14px',
    fontFamily: DEFAULT_FONT,
    // Text rendering optimizations
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
  }), [resumeData.sidebarColorHex]);

  const mainContentStyle = useMemo(() => ({
    minHeight: '297mm',
    fontSize: '14px',
    fontFamily: DEFAULT_FONT,
    // Text rendering optimizations
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
  }), []);

  return (
    <div className="relative">
      {/* Resume Content */}
      <div
        className={cn(
          "aspect-[210/297] h-fit w-full bg-white text-black print:w-[210mm] print:h-[297mm] resume-container",
          className,
        )}
        data-template="template2en"
        ref={containerRef}
        dir={dir} // Set direction based on resumeData.language
      >
        <div
          className={cn("flex", !width && !isClient && "invisible")}
          style={containerStyle}
          id="resumePreviewContent"
        >
          {/* Left Sidebar - Grey */}
          <div 
            className="sidebar w-1/3 flex flex-col relative overflow-hidden"
            style={sidebarStyle}
          >
            <Sidebar 
              resumeData={resumeData} 
              borderStyle={resumeData.borderStyle}
              fontFamily={DEFAULT_FONT}
            />
          </div>
          {/* Right Content Area - White */}
          <div 
            className="main-content w-2/3 h-full p-6"
            style={mainContentStyle}
          >
            <MainContent resumeData={resumeData} />
          </div>
        </div>
      </div>
    </div>
  );
});

ResumeTemplate2En.displayName = 'ResumeTemplate2En';

export default ResumeTemplate2En;

// All helper functions below this line

// Sidebar now receives borderStyle and fontFamily
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
  const imageStyle = useMemo(() => getImageStyle(borderStyle, fontFamily), [borderStyle, fontFamily]);
  
  const location = useMemo(() =>
    [city, country].filter(Boolean).join(", "),
    [city, country]
  );

  const filteredEducations = useMemo(() =>
    educations?.filter(edu => Object.values(edu).filter(Boolean).length > 0) || [],
    [educations]
  );

  return (
    <div 
      className="w-full text-white space-y-6 print:space-y-4" 
      style={{ 
        fontFamily,
        // Text rendering optimizations
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
          <div className="text-left">
            <h2 className="text-base font-bold text-white uppercase tracking-wide print:text-base" style={{ lineHeight: "1.4" }}>
              Languages
            </h2>
            <div className="w-32 h-0.5 bg-white mt-3 mr-auto"></div>
          </div>
          <div 
            className="text-sm text-white text-left print:text-sm"
            style={{
              // Text rendering optimizations
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

// Extracted Contact Section
const ContactSection = React.memo(function ContactSection({ 
  phone, 
  email, 
  location 
}: { 
  phone?: string; 
  email?: string; 
  location?: string; 
}) {
  const contactItemStyle = getContactItemStyle();
  const sectionHeaderStyle = getSectionHeaderStyle();

  return (
    <div className="space-y-3 print:space-y-2 break-inside-avoid px-4 pt-6 pb-2">
      <div className="text-left">
        <h2 className="text-base font-bold text-white uppercase tracking-wide print:text-base" style={sectionHeaderStyle}>
          Contact
        </h2>
        <div className="w-full h-0.5 bg-white mt-2"></div>
      </div>
      
      {(phone || email || location) ? (
        <>
          {phone && (
            <div className="flex items-center gap-2 text-xs justify-start print:text-sm print:gap-2">
              <Phone size={12} className="text-white flex-shrink-0 print:w-3 print:h-3" />
              <span className="text-white" style={contactItemStyle}>{phone}</span>
            </div>
          )}
          
          {email && (
            <div className="flex items-center gap-2 text-xs justify-start print:text-sm print:gap-2 email-contact">
              <Mail size={12} className="text-white flex-shrink-0 print:w-3 print:h-3" />
              <span className="text-white break-all" style={contactItemStyle}>{email}</span>
            </div>
          )}
          
          {location && (
            <div className="flex items-center gap-2 text-xs justify-start print:text-sm print:gap-2">
              <MapPin size={12} className="text-white flex-shrink-0 print:w-3 print:h-3" />
              <span className="text-white" style={contactItemStyle}>{location}</span>
            </div>
          )}
        </>
      ) : (
        <p className="text-xs text-gray-300 italic">No contact information added yet</p>
      )}
    </div>
  );
});

// Extracted Education Section
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
  const sectionHeaderStyle = getSectionHeaderStyle();

  return (
    <div className="space-y-3 print:space-y-2 break-inside-avoid px-4 py-2">
      <div className="text-left">
        <h2 className="text-base font-bold text-white uppercase tracking-wide print:text-base" style={sectionHeaderStyle}>
          Education
        </h2>
        <div className="w-32 h-0.5 bg-white mt-3 mr-auto"></div>
      </div>
      
      {educations.length > 0 ? (
        <div className="space-y-3 print:space-y-2">
          {educations.map((edu, index) => (
            <EducationItem key={index} education={edu} />
          ))}
        </div>
      ) : (
        <p className="text-xs text-gray-300 italic">No education added yet</p>
      )}
    </div>
  );
});

// Extracted Skills Section
const SkillsSection = React.memo(function SkillsSection({ 
  skills 
}: { 
  skills: string[];
}) {
  const sectionHeaderStyle = getSectionHeaderStyle();

  return (
    <div className="space-y-3 print:space-y-2 break-inside-avoid px-4 py-2">
      <div className="text-left">
        <h2 className="text-base font-bold text-white uppercase tracking-wide print:text-base" style={sectionHeaderStyle}>
          Skills
        </h2>
        <div className="w-32 h-0.5 bg-white mt-3 mr-auto"></div>
      </div>
      
      {skills.length > 0 ? (
        <div className="space-y-3 print:space-y-2">
          {skills.map((skill, index) => (
            <SkillItem key={index} skill={skill} />
          ))}
        </div>
      ) : (
        <p className="text-xs text-gray-300 italic">No skills added yet</p>
      )}
    </div>
  );
});

// Skill Item Component
const SkillItem = React.memo(function SkillItem({ 
  skill 
}: { 
  skill: string;
}) {
  const educationItemStyle = getEducationItemStyle();

  return (
    <div className="text-sm text-white text-left print:text-sm">
      <div className="font-semibold" style={educationItemStyle}>{skill}</div>
    </div>
  );
});

// Optimized Education Item
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
  const dateRange = useMemo(() => {
    if (!education.startDate) return null;
    return `${education.startDate}${education.endDate ? ` - ${education.endDate}` : " - Present"}`;
  }, [education.startDate, education.endDate]);

  const educationItemStyle = getEducationItemStyle();

  return (
    <div className="text-sm text-white text-left print:text-sm">
      {education.degree && (
        <div className="font-semibold" style={educationItemStyle}>{education.degree}</div>
      )}
      {education.school && (
        <div className="text-gray-200" style={educationItemStyle}>{education.school}</div>
      )}
      {dateRange && (
        <div className="text-gray-300 text-xs print:text-sm" style={educationItemStyle}>
          {dateRange}
        </div>
      )}
    </div>
  );
});

// Optimized Main Content
const MainContent = React.memo(function MainContent({ 
  resumeData 
}: { 
  resumeData: ResumeValues;
}) {
  const { firstName, lastName, jobTitle, summary, workExperiences, colorHex, bulletStyle } = resumeData;
  
  const workExperiencesNotEmpty = useMemo(() =>
    workExperiences?.filter((exp) => Object.values(exp).filter(Boolean).length > 0) || [],
    [workExperiences]
  );
  
  const bulletChar = useMemo(() => 
    bulletStyle === "dash" ? BULLET_CHARS.dash : BULLET_CHARS.bullet, 
    [bulletStyle]
  );
  
  const fullName = useMemo(() =>
    [firstName, lastName].filter(Boolean).join(' '),
    [firstName, lastName]
  );
  
  const nameStyle = useMemo(() => ({
    color: colorHex || DEFAULT_COLOR,
    letterSpacing: "0.01em",
    lineHeight: "1.4",
    fontWeight: "700",
    fontFamily: DEFAULT_FONT,
  }), [colorHex]);
  
  const jobTitleStyle = useMemo(() => ({
    color: colorHex || DEFAULT_JOB_TITLE_COLOR,
    lineHeight: "1.5",
    fontFamily: DEFAULT_FONT,
  }), [colorHex]);

  const hasSummary = useMemo(() => Boolean(summary && summary.trim()), [summary]);

  return (
    <div className="w-full h-full" style={{ fontFamily: DEFAULT_FONT }}>
      {/* Name Header */}
      {fullName && (
        <div className="mb-8 text-left print:mb-6">
          <h1 
            className="text-3xl font-bold uppercase print:text-2xl"
            style={nameStyle}
          >
            {fullName}
          </h1>
          {jobTitle && (
            <h2 
              className="text-xl mt-2 font-medium print:text-lg print:mt-1"
              style={jobTitleStyle}
            >
              {jobTitle}
            </h2>
          )}
        </div>
      )}

      {/* Summary Section */}
      {hasSummary && (
        <SummarySection summary={summary!} />
      )}

      {/* Work Experience Section */}
      <WorkExperienceSection 
        workExperiences={workExperiencesNotEmpty}
        colorHex={colorHex}
        bulletChar={bulletChar}
        hasSummary={hasSummary}
      />
    </div>
  );
});

// Extracted Summary Section
const SummarySection = React.memo(function SummarySection({ 
  summary 
}: { 
  summary: string;
}) {
  const sectionHeaderStyle = getSectionHeaderStyle();

  return (
    <div className="break-inside-avoid" style={{ marginTop: '15px' }}>
      <h3 className="text-lg font-bold text-black uppercase tracking-wide mb-3 text-left print:text-base print:mb-2" style={sectionHeaderStyle}>
        Professional Summary
      </h3>
      <div className="w-full h-px bg-black mb-6 print:mb-4"></div>
      
      <div className="text-sm text-gray-800 leading-relaxed text-left print:text-sm" style={{ lineHeight: "1.6" }}>
        <p>{summary}</p>
      </div>
    </div>
  );
});

// Extracted Work Experience Section
const WorkExperienceSection = React.memo(function WorkExperienceSection({ 
  workExperiences,
  colorHex,
  bulletChar,
  hasSummary
}: { 
  workExperiences: Array<{
    position?: string;
    company?: string;
    startDate?: string;
    endDate?: string;
    description?: string;
  }>;
  colorHex?: string;
  bulletChar: string;
  hasSummary: boolean;
}) {
  const sectionHeaderStyle = getSectionHeaderStyle();

  return (
    <div style={{ marginTop: hasSummary ? '15px' : '15px' }}>
      <h3 className="text-lg font-bold text-black uppercase tracking-wide mb-3 text-left print:text-base print:mb-2" style={sectionHeaderStyle}>
        Work Experience
      </h3>
      <div className="w-full h-px bg-black mb-6 print:mb-4"></div>
      
      {workExperiences.length > 0 ? (
        <div className="space-y-3 print:space-y-2">
          {workExperiences.map((exp, index) => (
            <WorkExperienceItem
              key={index}
              experience={exp}
              colorHex={colorHex}
              bulletChar={bulletChar}
            />
          ))}
        </div>
      ) : (
        <p className="text-sm text-gray-500 italic">No work experience added yet</p>
      )}
    </div>
  );
});

// Optimized Work Experience Item
const WorkExperienceItem = React.memo(function WorkExperienceItem({
  experience,
  colorHex,
  bulletChar
}: {
  experience: {
    position?: string;
    company?: string;
    startDate?: string;
    endDate?: string;
    description?: string;
  };
  colorHex?: string;
  bulletChar: string;
}) {
  const titleStyle = useMemo(() => ({ color: colorHex || DEFAULT_COLOR }), [colorHex]);
  
  const dateRange = useMemo(() => {
    if (!experience.startDate) return null;
    return `${experience.startDate}${experience.endDate ? ` - ${experience.endDate}` : " - Present"}`;
  }, [experience.startDate, experience.endDate]);

  const descriptionLines = useMemo(() => {
    return experience.description?.split('\n').filter(line => line.trim())
      .map(line => line.replace(/^[-•]\s*/, '').trim()) || [];
  }, [experience.description]);

  return (
    <div className="break-inside-avoid space-y-1" style={{ fontFamily: DEFAULT_FONT }}>
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