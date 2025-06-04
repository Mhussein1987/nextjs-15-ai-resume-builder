import { BorderStyles } from "@/app/(main)/editor/BorderStyleButton";
import useDimensions from "@/hooks/useDimensions";
import { cn } from "@/lib/utils";
import { ResumeValues } from "@/lib/validation";
import { formatDate } from "date-fns";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import { Phone, Mail, MapPin } from "lucide-react";


interface ResumePreviewProps {
  resumeData: ResumeValues;
  contentRef?: React.Ref<HTMLDivElement>;
  className?: string;
  direction?: "ltr" | "rtl";
}

export default function ResumePreview({
  resumeData,
  contentRef,
  className,
  direction = "ltr",
}: ResumePreviewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { width } = useDimensions(containerRef);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Get selected font or default
  const selectedFont = resumeData.fontFamily || 'system-ui, -apple-system, "Segoe UI", "Tahoma", "Arial", sans-serif';

  return (
    <div className="relative">
      {/* Resume Content */}
      <div
        className={cn(
          "aspect-[210/297] h-fit w-full bg-white text-black print:w-[210mm] print:h-[297mm]",
          className,
        )}
        ref={containerRef}
        dir={direction}
      >
        <div
          className={cn("space-y-3 p-4 print:space-y-2 print:p-3", !width && !isClient && "invisible")}
          style={{
            zoom: isClient && width ? (1 / 794) * width : 1,
            minHeight: '297mm',
            width: '210mm',
            lineHeight: '1.6',
            fontSize: '14px',
            fontFamily: selectedFont,
          }}
          ref={contentRef}
          id="resumePreviewContent"
        >
          <PersonalInfoHeader resumeData={resumeData} direction={direction} />
          {/* Separator Line */}
          {(resumeData.phone || resumeData.email) && (
            <div 
              className="w-full h-px"
              style={{
                backgroundColor: resumeData.colorHex || "#000000",
              }}
            ></div>
          )}
          <SummarySection resumeData={resumeData} direction={direction} />
          {/* Separator Line between Summary and Work Experience */}
          {resumeData.summary && 
           (resumeData.workExperiences?.filter(exp => Object.values(exp).filter(Boolean).length > 0).length || 0) > 0 && (
            <div 
              className="w-full h-px"
              style={{
                backgroundColor: resumeData.colorHex || "#000000",
              }}
            ></div>
          )}
          <WorkExperienceSection resumeData={resumeData} direction={direction} />
          {/* Separator Line between Work Experience and Education */}
          {(resumeData.workExperiences?.filter(exp => Object.values(exp).filter(Boolean).length > 0).length || 0) > 0 && 
           (resumeData.educations?.filter(edu => Object.values(edu).filter(Boolean).length > 0).length || 0) > 0 && (
            <div 
              className="w-full h-px"
              style={{
                backgroundColor: resumeData.colorHex || "#000000",
              }}
            ></div>
          )}
          <EducationSection resumeData={resumeData} direction={direction} />
          {/* Separator Line between Education and Skills */}
          {(resumeData.educations?.filter(edu => Object.values(edu).filter(Boolean).length > 0).length || 0) > 0 && 
           (resumeData.skills?.length || 0) > 0 && (
            <div 
              className="w-full h-px"
              style={{
                backgroundColor: resumeData.colorHex || "#000000",
              }}
            ></div>
          )}
          <SkillsSection resumeData={resumeData} direction={direction} />
        </div>
      </div>
    </div>
  );
}

interface ResumeSectionProps {
  resumeData: ResumeValues;
  direction?: "ltr" | "rtl";
}

function PersonalInfoHeader({ resumeData, direction }: ResumeSectionProps) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const _ = direction; // Keep for future RTL/LTR support
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

  return (
    <div className="flex flex-row-reverse items-center justify-between gap-6 relative">
      {isClient && photoSrc && (
        <div className="flex-shrink-0 order-first">
          <Image
            src={photoSrc}
            width={100}
            height={100}
            alt="صورة صاحب السيرة الذاتية"
            className="aspect-square object-cover"
            style={{
              borderRadius:
                borderStyle === BorderStyles.SQUARE
                  ? "0px"
                  : borderStyle === BorderStyles.CIRCLE
                    ? "9999px"
                    : "10%",
            }}
          />
        </div>
      )}
      <div className="grow space-y-1.5 text-right rtl:text-left print:space-y-1">
        <div className="space-y-0.5 print:space-y-0">
          <p
            className="text-3xl font-bold print:text-2xl text-right"
            style={{
              color: colorHex,
              letterSpacing: "0.01em",
              lineHeight: "1.4",
              fontWeight: "700",
            }}
          >
            {[firstName, lastName].filter(Boolean).join(" ")}
          </p>
          {jobTitle && (
            <p 
              className="text-right"
              style={{
                lineHeight: "1.5",
                fontSize: "20px",
              }}
            >
              {jobTitle}
            </p>
          )}
          {/* Location under job title, right-aligned, with icon */}
          {(city || country) && (
            <div className="flex items-center gap-1 justify-end mt-1" dir="ltr">
              <span>{[city, country].filter(Boolean).join("، ")}</span>
              <MapPin size={14} className="flex-shrink-0" style={{ color: colorHex }} />
            </div>
          )}
          {/* Phone and Email under location */}
          {(phone || email) && (
            <div className="text-xs text-gray-500 print:text-sm text-right" dir="ltr" style={{ lineHeight: "1.4" }}>
              {phone && (
                <div className="flex items-center justify-end gap-1">
                  <span>{phone}</span>
                  <Phone size={14} className="flex-shrink-0" style={{ color: colorHex }} />
                </div>
              )}
              {email && (
                <div className="flex items-center justify-end gap-1">
                  <span>{email}</span>
                  <Mail size={14} className="flex-shrink-0" style={{ color: colorHex }} />
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function SummarySection({ resumeData, direction }: ResumeSectionProps) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const _ = direction; // Keep for future RTL/LTR support
  const { summary, colorHex } = resumeData;

  if (!summary) return null;

  // Split the summary into lines and filter out empty lines
  const lines = summary.split('\n').filter(line => line.trim());

  return (
    <div className="break-inside-avoid space-y-3 text-right print:space-y-2">
      <p
        className="text-lg font-semibold print:text-base"
        style={{
          color: colorHex,
          lineHeight: "1.4",
        }}
      >
        الملف المهني
      </p>
      <div className="space-y-2 print:space-y-1.5">
        {lines.map((line, index) => {
          // Remove trailing dot if present
          const cleanLine = line.trim().replace(/[.\u06D4]+$/, "");
          return (
            <div key={index} className="flex text-sm print:text-sm">
              <p className="flex-1" style={{ lineHeight: "1.6" }}>{cleanLine}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function WorkExperienceSection({ resumeData, direction }: ResumeSectionProps) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const _ = direction; // Keep for future RTL/LTR support
  const { workExperiences, colorHex } = resumeData;

  const workExperiencesNotEmpty = workExperiences?.filter(
    (exp) => Object.values(exp).filter(Boolean).length > 0,
  );

  if (!workExperiencesNotEmpty?.length) return null;

  return (
    <div className="space-y-3 print:space-y-2 text-right">
      <p
        className="text-2xl font-semibold print:text-xl"
        style={{
          color: colorHex,
          lineHeight: "1.4",
        }}
      >
        الخبرات السابقة
      </p>
      {workExperiencesNotEmpty.map((exp, index) => {
        // Split the description into lines and filter out empty lines
        const descriptionLines = exp.description?.split('\n').filter(line => line.trim())
          .map(line => line.replace(/^[-•]\s*/, '').trim()) || [];
        
        return (
          <div key={index} className="break-inside-avoid space-y-2 print:space-y-1.5">
            <div
              className="flex flex-row-reverse items-center"
              style={{
                lineHeight: "1.4",
              }}
            >
              {exp.startDate && (
                <span dir="rtl" className="text-sm print:text-sm" style={{ marginLeft: "40px", whiteSpace: "nowrap", minWidth: "120px" }}>
                  {formatDate(exp.startDate, "MM/yyyy")} - {exp.endDate ? formatDate(exp.endDate, "MM/yyyy") : "الحالي"}
                </span>
              )}
              <span 
                className="text-lg font-bold print:text-lg flex-1 text-right"
              >
                {exp.position}
              </span>
            </div>
            <p className="font-semibold text-right" style={{ lineHeight: "1.5", fontSize: "16px" }}>{exp.company}</p>
            <div className="space-y-0 print:space-y-0">
              {descriptionLines.map((line, lineIndex) => (
                <div key={lineIndex} className="relative pr-4 text-sm print:text-sm" style={{ marginBottom: "0.5px" }}>
                  <p className="text-right m-0" dir="rtl" style={{ 
                    lineHeight: "1.8",
                    wordWrap: "break-word",
                    whiteSpace: "pre-wrap"
                  }}>
                    {line}
                  </p>
                  <span className="absolute right-0 text-gray-600" style={{ 
                    top: "0.2rem",
                    right: "0.25rem" 
                  }}>
                    •
                  </span>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function EducationSection({ resumeData, direction }: ResumeSectionProps) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const _ = direction; // Keep for future RTL/LTR support
  const { educations, colorHex } = resumeData;

  const educationsNotEmpty = educations?.filter(
    (edu) => Object.values(edu).filter(Boolean).length > 0,
  );

  if (!educationsNotEmpty?.length) return null;

  return (
    <div className="space-y-3 print:space-y-2 text-right">
      <p
        className="text-lg font-semibold print:text-base"
        style={{
          color: colorHex,
          lineHeight: "1.4",
        }}
      >
        التعليم
      </p>
      {educationsNotEmpty.map((edu, index) => (
        <div key={index} className="break-inside-avoid space-y-2 print:space-y-1.5">
          <div
            className="flex items-center justify-between text-sm print:text-sm"
            style={{
              lineHeight: "1.4",
            }}
          >
            <span className="font-semibold text-left" dir="rtl">{edu.degree}</span>
            {edu.startDate && (
              <span dir="ltr" className="text-sm print:text-sm text-right" style={{ marginRight: "40px", whiteSpace: "nowrap", minWidth: "120px" }}>
                {formatDate(edu.startDate, "MM/yyyy")} {edu.endDate ? `- ${formatDate(edu.endDate, "MM/yyyy")}` : "- الحالي"}
              </span>
            )}
          </div>
          <p className="text-sm font-semibold text-right print:text-sm" style={{ lineHeight: "1.5" }} dir="rtl">{edu.school}</p>
        </div>
      ))}
    </div>
  );
}

function SkillsSection({ resumeData, direction }: ResumeSectionProps) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const _ = direction; // Keep for future RTL/LTR support
  const { skills, colorHex } = resumeData;

  if (!skills?.length) return null;

  return (
    <div className="break-inside-avoid space-y-3 text-right print:space-y-2">
      <p
        className="text-lg font-semibold print:text-base"
        style={{
          color: colorHex,
          lineHeight: "1.4",
        }}
      >
        المهارات
      </p>
      <div className="flex flex-wrap gap-x-2 gap-y-2 justify-start print:gap-x-2 print:gap-y-1.5" dir="rtl">
        {skills.map((skill, index) => (
          <span key={index} className="text-sm font-semibold text-black print:text-sm" style={{ lineHeight: "1.5" }}>
            {index === skills.length - 1 ? skill : `${skill} -`}
          </span>
        ))}
      </div>
    </div>
  );
}
