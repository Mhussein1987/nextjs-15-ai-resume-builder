import useDimensions from "@/hooks/useDimensions";
import { cn } from "@/lib/utils";
import { ResumeValues } from "@/lib/validation";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import { Phone, Mail, MapPin } from "lucide-react";
import { formatDate } from "date-fns";
import { BorderStyles } from "@/app/(main)/editor/BorderStyleButton";

interface ResumePreviewProps {
  resumeData: ResumeValues;
  contentRef?: React.Ref<HTMLDivElement>;
  className?: string;
  direction?: "ltr" | "rtl";
}

export default function ResumePreviewAlt({
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
          className={cn("flex", !width && !isClient && "invisible")}
          style={{
            zoom: isClient && width ? (1 / 794) * width : 1,
            minHeight: '297mm',
            width: '210mm',
          }}
          ref={contentRef}
          id="resumePreviewContent"
        >
          {/* Left Sidebar - Grey */}
          <div
            className="sidebar w-1/3 h-full p-6 flex flex-col items-center print:p-4 print:w-[70mm]"
            style={{
              minHeight: '297mm',
              background: '#6B7280', // grey-500
              fontSize: '14px',
              fontFamily: selectedFont,
            }}
          >
            <Sidebar resumeData={resumeData} />
          </div>
          {/* Right Content Area - White */}
          <div
            className="main-content w-2/3 h-full p-6 print:p-4 print:w-[140mm]"
            style={{
              minHeight: '297mm',
              fontSize: '14px',
              fontFamily: selectedFont,
            }}
          >
            <MainContent resumeData={resumeData} />
          </div>
        </div>

        {/* Print-specific styles for perfect A4 output and edge-to-edge sidebar */}
        <style>{`
          @media print {
            @page {
              margin: 0;
              size: A4;
            }
            
            #resumePreviewContent {
              width: 210mm !important;
              height: 297mm !important;
              margin: 0 !important;
              padding: 0 !important;
              display: flex !important;
              flex-direction: row-reverse !important;
              direction: ltr !important;
              background: white !important;
              box-shadow: none !important;
              zoom: 1 !important;
              color-adjust: exact !important;
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
            
            .main-content {
              width: 140mm !important;
              height: 297mm !important;
              padding: 15mm 10mm !important;
              margin: 0 !important;
              background: white !important;
              flex-shrink: 0 !important;
            }
            
            .sidebar {
              width: 70mm !important;
              height: 297mm !important;
              padding: 15mm 8mm !important;
              margin: 0 !important;
              background: #6B7280 !important;
              color-adjust: exact !important;
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
              flex-shrink: 0 !important;
              display: flex !important;
              flex-direction: column !important;
              align-items: center !important;
            }
            
            .break-inside-avoid {
              break-inside: avoid;
              page-break-inside: avoid;
            }
            
            .email-contact {
              font-size: 11px !important;
            }
          }
        `}</style>
      </div>
    </div>
  );
}

function Sidebar({ resumeData }: { resumeData: ResumeValues }) {
  const { photo, phone, email, city, country, educations, skills, borderStyle } = resumeData;
  
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
    <div className="w-full text-white space-y-6 print:space-y-4">
      {/* Profile Image - with border style */}
      {isClient && photoSrc && (
        <div className="flex justify-center">
          <Image
            src={photoSrc}
            width={100}
            height={100}
            alt="Profile Photo"
            className="aspect-square object-cover border-4 border-white print:w-20 print:h-20"
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

      {/* Contact Section */}
      <div className="space-y-3 print:space-y-2 break-inside-avoid">
        <div className="text-right">
          <h2 className="text-base font-bold text-white uppercase tracking-wide print:text-base" style={{ lineHeight: "1.4" }}>اتصل بي</h2>
          <div className="w-full h-0.5 bg-white mt-2"></div>
        </div>
        
        {/* Phone */}
        {phone && (
          <div className="flex items-center gap-2 text-xs justify-start print:text-sm print:gap-2" dir="rtl">
            <Phone size={12} className="text-white flex-shrink-0 print:w-3 print:h-3" />
            <span className="text-white" style={{ lineHeight: "1.5" }}>{phone}</span>
          </div>
        )}
        
        {/* Email */}
        {email && (
          <div className="flex items-center gap-2 text-xs justify-start print:text-sm print:gap-2 email-contact" dir="rtl">
            <Mail size={12} className="text-white flex-shrink-0 print:w-3 print:h-3" />
            <span className="text-white break-all" style={{ lineHeight: "1.5" }}>{email}</span>
          </div>
        )}
        
        {/* Location */}
        {(city || country) && (
          <div className="flex items-center gap-2 text-xs justify-start print:text-sm print:gap-2" dir="rtl">
            <MapPin size={12} className="text-white flex-shrink-0 print:w-3 print:h-3" />
            <span className="text-white" style={{ lineHeight: "1.5" }}>
              {[city, country].filter(Boolean).join("، ")}
            </span>
          </div>
        )}
      </div>

      {/* Education Section */}
      {educations && educations.length > 0 && (
        <div className="space-y-3 print:space-y-2 break-inside-avoid">
          <div className="text-right">
            <h2 className="text-base font-bold text-white uppercase tracking-wide print:text-base" style={{ lineHeight: "1.4" }}>التعليم</h2>
            <div className="w-32 h-0.5 bg-white mt-3 ml-auto"></div>
          </div>
          
          <div className="space-y-3 print:space-y-2">
            {educations
              .filter(edu => Object.values(edu).filter(Boolean).length > 0)
              .map((edu, index) => (
                <div key={index} className="text-sm text-white text-right print:text-sm">
                  {edu.degree && (
                    <div className="font-semibold" style={{ lineHeight: "1.5" }}>{edu.degree}</div>
                  )}
                  {edu.school && (
                    <div className="text-gray-200" style={{ lineHeight: "1.5" }}>{edu.school}</div>
                  )}
                  {edu.startDate && (
                    <div className="text-gray-300 text-xs print:text-sm" style={{ lineHeight: "1.5" }}>
                      {edu.startDate} {edu.endDate ? `- ${edu.endDate}` : "- الحالي"}
                    </div>
                  )}
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Skills Section */}
      {skills && skills.length > 0 && (
        <div className="space-y-3 print:space-y-2 break-inside-avoid">
          <div className="text-right">
            <h2 className="text-base font-bold text-white uppercase tracking-wide print:text-base" style={{ lineHeight: "1.4" }}>المهارات</h2>
            <div className="w-32 h-0.5 bg-white mt-3 ml-auto"></div>
          </div>
          
          <div className="space-y-2 print:space-y-1.5">
            {skills.map((skill, index) => (
              <div key={index} className="text-sm text-white text-right print:text-sm">
                <span className="font-medium" style={{ lineHeight: "1.5" }}>{skill}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function MainContent({ resumeData }: { resumeData: ResumeValues }) {
  const { firstName, lastName, jobTitle, workExperiences, summary, colorHex } = resumeData;

  const workExperiencesNotEmpty = workExperiences?.filter(
    (exp) => Object.values(exp).filter(Boolean).length > 0,
  );

  return (
    <div className="w-full h-full" dir="rtl">
      {/* Name Header */}
      {(firstName || lastName) && (
        <div className="mb-8 text-right print:mb-6">
          <h1 
            className="text-3xl font-bold uppercase print:text-2xl"
            style={{
              color: colorHex || "#000000",
              letterSpacing: "0.01em",
              lineHeight: "1.4",
              fontWeight: "700",
            }}
          >
            {[firstName, lastName].filter(Boolean).join(' ')}
          </h1>
          {jobTitle && (
            <h2 
              className="text-xl mt-2 font-medium print:text-lg print:mt-1"
              style={{
                color: colorHex || "#6B7280",
                lineHeight: "1.5",
              }}
            >
              {jobTitle}
            </h2>
          )}
        </div>
      )}

      {/* Summary Section */}
      {summary && summary.trim() && (
        <div className="break-inside-avoid" style={{ marginTop: '20px' }}>
          <h3 className="text-lg font-bold text-black uppercase tracking-wide mb-3 text-right print:text-base print:mb-2" style={{ lineHeight: "1.4" }}>
            الملف المهني
          </h3>
          <div className="w-full h-px bg-black mb-6 print:mb-4"></div>
          
          <div className="text-sm text-gray-800 leading-relaxed text-right print:text-sm" style={{ lineHeight: "1.6" }}>
            <p>{summary}</p>
          </div>
        </div>
      )}

      {/* Work Experience Section */}
      <div style={{ marginTop: summary && summary.trim() ? '25px' : '20px' }}>
        <h3 className="text-lg font-bold text-black uppercase tracking-wide mb-3 text-right print:text-base print:mb-2" style={{ lineHeight: "1.4" }}>
          الخبرات العملية
        </h3>
        <div className="w-full h-px bg-black mb-6 print:mb-4"></div>
        
        {/* Work Experience Entries */}
        {workExperiencesNotEmpty && workExperiencesNotEmpty.length > 0 && (
          <div className="space-y-8 print:space-y-4">
            {workExperiencesNotEmpty.map((exp, index) => {
              // Split the description into lines and filter out empty lines
              const descriptionLines = exp.description?.split('\n').filter(line => line.trim())
                .map(line => line.replace(/^[-•]\s*/, '').trim()) || [];
              
              return (
                <div key={index} className="space-y-2 text-right print:space-y-1.5 break-inside-avoid">
                  <div className="flex items-center justify-between">
                    <span 
                      className="font-bold print:text-base"
                      style={{
                        color: colorHex || "#000000",
                        lineHeight: "1.4",
                        fontSize: "22px",
                      }}
                    >
                      {exp.position}
                    </span>
                    {exp.startDate && (
                      <span className="text-sm text-gray-600 print:text-sm" style={{ lineHeight: "1.4" }}>
                        {formatDate(exp.startDate, "MM/yyyy")} - {exp.endDate ? formatDate(exp.endDate, "MM/yyyy") : "الحالي"}
                      </span>
                    )}
                  </div>
                  <p className="text-sm font-semibold text-gray-700 print:text-sm" style={{ lineHeight: "1.5" }}>{exp.company}</p>
                  {descriptionLines.length > 0 && (
                    <div className="space-y-0 print:space-y-0">
                      {descriptionLines.map((line, lineIndex) => (
                        <div key={lineIndex} className="relative pr-4 text-sm text-gray-800 print:text-sm" style={{ marginBottom: "0.5px" }}>
                          <p className="text-right m-0" style={{ 
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
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}