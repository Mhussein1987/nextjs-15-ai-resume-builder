import { BorderStyles } from "@/app/(main)/editor/BorderStyleButton";
import useDimensions from "@/hooks/useDimensions";
import { cn } from "@/lib/utils";
import { ResumeValues } from "@/lib/validation";
import { formatDate } from "date-fns";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";

interface ResumePreviewProps {
  resumeData: ResumeValues;
  className?: string;
}

const ResumeTemplate1En = React.memo(function ResumeTemplate1En({
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
          "aspect-[210/297] h-fit w-full bg-white text-black print:w-[210mm] print:h-[297mm]",
          className,
        )}
        ref={containerRef}
        dir={dir} // Set direction based on resumeData.language
        data-template="template1en" // Add data attribute for print CSS targeting
      >
        <div
          className={cn("space-y-3 print:space-y-2", !width && !isClient && "invisible")}
          style={{
            zoom: isClient && width ? (1 / 794) * width : 1,
            minHeight: '297mm',
            width: '210mm',
            lineHeight: '1.6',
            fontSize: '14px',
            fontFamily: selectedFont,
            padding: '16px', // Always apply 16px padding
          }}
          id="resumePreviewContent"
        >
          <PersonalInfoHeader resumeData={resumeData} />
          <SummarySection resumeData={resumeData} />
          <WorkExperienceSection resumeData={resumeData} />
          <EducationSection resumeData={resumeData} />
          <SkillsSection resumeData={resumeData} />
          <div className="space-y-3">
            <hr className="border" style={{ borderColor: resumeData.colorHex }} />
            <p className="text-lg font-semibold" style={{ color: resumeData.colorHex }}>
              Languages
            </p>
            {resumeData.userLanguages && resumeData.userLanguages.length > 0 ? (
              <div className="text-sm">
                {resumeData.userLanguages.join(', ')}
              </div>
            ) : (
              <p className="text-sm text-gray-500 italic">No languages added yet</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
});

ResumeTemplate1En.displayName = 'ResumeTemplate1En';

export default ResumeTemplate1En;

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

  const nameStyle = React.useMemo(() => ({ color: colorHex }), [colorHex]);
  const jobTitleStyle = React.useMemo(() => ({ color: colorHex }), [colorHex]);
  
  const imageStyle = React.useMemo(() => ({
    borderRadius:
      borderStyle === BorderStyles.SQUARE
        ? "0px"
        : borderStyle === BorderStyles.CIRCLE
          ? "9999px"
          : "10%",
  }), [borderStyle]);

  const contactInfo = React.useMemo(() => {
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

  const borderStyle = React.useMemo(() => ({ borderColor: colorHex }), [colorHex]);
  const headerStyle = React.useMemo(() => ({ color: colorHex }), [colorHex]);

  if (!summary) return null;

  return (
    <>
      <hr className="border" style={borderStyle} />
      <div className="break-inside-avoid space-y-3">
        <p className="text-lg font-semibold" style={headerStyle}>
          Professional profile
        </p>
        <div className="whitespace-pre-line text-sm">{summary}</div>
      </div>
    </>
  );
});

const WorkExperienceSection = React.memo(function WorkExperienceSection({ resumeData }: ResumeSectionProps) {
  const { workExperiences, colorHex, bulletStyle } = resumeData;

  const workExperiencesNotEmpty = React.useMemo(() => 
    workExperiences?.filter(
      (exp) => Object.values(exp).filter(Boolean).length > 0,
    ) || [], 
    [workExperiences]
  );

  const borderStyle = React.useMemo(() => ({ borderColor: colorHex }), [colorHex]);
  const headerStyle = React.useMemo(() => ({ color: colorHex }), [colorHex]);

  return (
    <>
      <hr className="border" style={borderStyle} />
      <div className="space-y-3">
        <p className="text-lg font-semibold" style={headerStyle}>
          Work experience
        </p>
        {workExperiencesNotEmpty?.length > 0 ? (
          workExperiencesNotEmpty.map((exp, index) => (
            <WorkExperienceItem key={index} experience={exp} bulletStyle={bulletStyle} />
          ))
        ) : (
          <p className="text-sm text-gray-500 italic">No work experience added yet</p>
        )}
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
  bulletStyle
}: { 
  experience: WorkExperience; 
  bulletStyle?: string;
}) {
  const dateRange = React.useMemo(() => {
    if (!experience.startDate) return null;
    return `${formatDate(experience.startDate, "MM/yyyy")} - ${
      experience.endDate ? formatDate(experience.endDate, "MM/yyyy") : "Present"
    }`;
  }, [experience.startDate, experience.endDate]);

  const bulletChar = React.useMemo(() => {
    return bulletStyle === "dash" ? "–" : "•";
  }, [bulletStyle]);

  const descriptionLines = React.useMemo(() => {
    return experience.description?.split('\n').filter(line => line.trim())
      .map(line => line.replace(/^[-•]\s*/, '').trim()) || [];
  }, [experience.description]);

  return (
    <div className="break-inside-avoid space-y-1">
      <div className="flex items-center justify-between text-sm font-semibold text-black">
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
  const { educations, colorHex } = resumeData;

  const educationsNotEmpty = React.useMemo(() => 
    educations?.filter(
      (edu) => Object.values(edu).filter(Boolean).length > 0,
    ) || [], 
    [educations]
  );

  const borderStyle = React.useMemo(() => ({ borderColor: colorHex }), [colorHex]);
  const headerStyle = React.useMemo(() => ({ color: colorHex }), [colorHex]);

  return (
    <>
      <hr className="border" style={borderStyle} />
      <div className="space-y-3">
        <p className="text-lg font-semibold" style={headerStyle}>
          Education
        </p>
        {educationsNotEmpty?.length > 0 ? (
          educationsNotEmpty.map((edu, index) => (
            <EducationItem key={index} education={edu} />
          ))
        ) : (
          <p className="text-sm text-gray-500 italic">No education added yet</p>
        )}
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
  const dateRange = React.useMemo(() => {
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
  const { skills, colorHex } = resumeData;

  const borderStyle = React.useMemo(() => ({ borderColor: colorHex }), [colorHex]);
  const headerStyle = React.useMemo(() => ({ color: colorHex }), [colorHex]);

  return (
    <>
      <hr className="border" style={borderStyle} />
      <div className="space-y-3">
        <p className="text-lg font-semibold" style={headerStyle}>
          Skills
        </p>
        {(skills || [])?.length > 0 ? (
          <div className="text-sm space-y-1">
            {(skills || []).map((skill, index) => (
              <div key={index} className="flex items-start gap-2">
                <span className="text-gray-600 flex-shrink-0 mt-0.5">•</span>
                <span className="flex-1">{skill}</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500 italic">No skills added yet</p>
        )}
      </div>
    </>
  );
});