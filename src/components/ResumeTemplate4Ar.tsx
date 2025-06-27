import React, { useEffect, useRef, useState } from "react";
import { ResumeValues } from "@/lib/validation";
import { formatDate } from "date-fns";
import Image from "next/image";
import { BorderStyles } from "@/app/(main)/editor/BorderStyleButton";
import { cn } from "@/lib/utils";
import useDimensions from "@/hooks/useDimensions";

interface ResumePreviewProps {
  resumeData: ResumeValues;
  className?: string;
}

// Section Components
const SummarySection = ({ resumeData }: { resumeData: ResumeValues }) => {
  if (!resumeData.summary) return null;

  return (
    <section>
      <h3 className="text-base font-bold mb-3 pb-1 border-b-2" style={{ color: resumeData.colorHex || "#000000", borderColor: resumeData.colorHex || "#000000" }}>
        الملخص المهني
      </h3>
      <p className="text-gray-700 leading-relaxed text-sm">{resumeData.summary}</p>
    </section>
  );
};

const WorkExperienceSection = ({ resumeData, workExperiences }: { resumeData: ResumeValues; workExperiences?: Array<{
  position?: string;
  company?: string;
  startDate?: string;
  endDate?: string;
  description?: string;
}> }) => {
  const filteredExperiences = workExperiences || resumeData.workExperiences?.filter(exp => Object.values(exp).some(Boolean)) || [];

  return (
    <section>
      <h3 className="text-base font-bold mb-4 pb-1 border-b-2" style={{ color: resumeData.colorHex || "#000000", borderColor: resumeData.colorHex || "#000000" }}>
        الخبرة العملية
      </h3>
      {filteredExperiences.length > 0 ? (
        <div className="space-y-5">
          {filteredExperiences.map((exp, idx) => (
            <div key={idx} className="relative pr-5 border-r-2 border-gray-200">
              <div className="absolute -right-1.5 top-0 w-3 h-3 rounded-full" style={{ backgroundColor: resumeData.colorHex || "#000000" }}></div>
              <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start mb-1">
                <div>
                  <h4 className="text-sm font-semibold text-gray-900">{exp.position}</h4>
                  {exp.company && (
                    <p className="font-medium text-gray-700 text-xs">{exp.company}</p>
                  )}
                </div>
                {(exp.startDate || exp.endDate) && (
                  <div className="text-gray-600 text-xs lg:text-right">
                    {exp.startDate && formatDate(new Date(exp.startDate), "MMM yyyy")}
                    {exp.endDate && ` - ${formatDate(new Date(exp.endDate), "MMM yyyy")}`}
                    {!exp.endDate && " - الحالي"}
                  </div>
                )}
              </div>
              {exp.description && (
                <div className="text-gray-700 leading-relaxed text-xs">
                  {exp.description.split('\n').filter(Boolean).map((line: string, i: number) => (
                    <p key={i} className="mb-1">• {line.replace(/^[-•]\s*/, "")}</p>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-gray-500 italic text-right">لم يتم إضافة خبرة عمل بعد</p>
      )}
    </section>
  );
};

const ResumeTemplate4Ar = React.memo(function ResumeTemplate4Ar({
  resumeData,
  className,
}: ResumePreviewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const { width } = useDimensions(containerRef);
  const [isClient, setIsClient] = useState(false);
  const [photoSrc, setPhotoSrc] = useState<string>("");

  // Show second page only when there are 4 or more work experiences
  const showSecondPage = React.useMemo(() => {
    const workExperiencesCount = resumeData.workExperiences?.filter(exp => 
      Object.values(exp).filter(Boolean).length > 0
    ).length || 0;
    return workExperiencesCount >= 4;
  }, [resumeData.workExperiences]);

  // Split work experiences: first 3 on page 1, rest on page 2
  const firstPageWorkExperiences = React.useMemo(() => 
    resumeData.workExperiences?.filter(exp => Object.values(exp).filter(Boolean).length > 0).slice(0, 3) || [], 
    [resumeData.workExperiences]
  );
  
  const secondPageWorkExperiences = React.useMemo(() => 
    resumeData.workExperiences?.filter(exp => Object.values(exp).filter(Boolean).length > 0).slice(3) || [], 
    [resumeData.workExperiences]
  );

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;
    
    let objectUrl = "";
    if (resumeData.photo instanceof File) {
      objectUrl = URL.createObjectURL(resumeData.photo);
      setPhotoSrc(objectUrl);
    } else {
      setPhotoSrc(resumeData.photo || "");
    }
    return () => {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [resumeData.photo, isClient]);

  // Get selected font or default
  const selectedFont = "'Times New Roman', serif";

  // Determine direction from resumeData.language
  const isResumeArabic = resumeData.language === 'ar' || resumeData.language === 'ar-SA';
  const dir = isResumeArabic ? 'rtl' : 'ltr';

  const imageStyle = React.useMemo(() => ({
    borderRadius:
      resumeData.borderStyle === BorderStyles.SQUARE
        ? "0px"
        : resumeData.borderStyle === BorderStyles.CIRCLE
          ? "50%"
          : "12px",
  }), [resumeData.borderStyle]);

  return (
    <div className="relative">
      {/* Resume Content */}
      <div
        className={cn(
          "aspect-[210/297] h-fit w-full bg-white text-black print:w-[210mm] print:h-[297mm] resume-container",
          className,
        )}
        ref={containerRef}
        dir={dir} // Set direction based on resumeData.language
        data-template="template4ar"
      >
        <div
          className={cn("space-y-3 p-4 print:space-y-2", !width && !isClient && "invisible")}
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
          {/* First Page */}
          <div>
            {/* Header with Name and Job Title */}
            <div className="relative">
              {/* Profile Image - positioned on the left */}
              {isClient && photoSrc && (
                <div className="absolute left-6 top-8 z-20">
                  <Image
                    src={photoSrc}
                    width={120}
                    height={120}
                    alt="Profile Photo"
                    className="object-cover"
                    style={{
                      width: '120px',
                      height: '120px',
                      border: "4px solid white",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                      ...imageStyle,
                    }}
                  />
                </div>
              )}
            
              {/* Header Bar */}
              <div
                className="w-full py-8 text-white"
                style={{ backgroundColor: resumeData.sidebarColorHex || "#0E7490" }}
              >
                <div className="text-right px-8">
                  <div className="mb-3">
                    <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
                      {resumeData.firstName} {resumeData.lastName}
                    </h1>
                  </div>
                  {resumeData.jobTitle && (
                    <h2 className="text-lg sm:text-xl font-medium opacity-95">
                      {resumeData.jobTitle}
                    </h2>
                  )}
                </div>
              </div>
            </div>

            {/* Two Column Layout */}
            <div className="flex gap-6">
              {/* Right Column - Contact, Education, Skills (RTL: right side) */}
              <div className="w-1/3 space-y-6 pt-16">
                {/* Contact Information */}
                <div>
                  <h3 className="text-base font-bold mb-3 pb-1 border-b-2" style={{ color: resumeData.colorHex || "#000000", borderColor: resumeData.colorHex || "#000000" }}>
                    معلومات الاتصال
                  </h3>
                  <div className="space-y-2 text-sm">
                    {resumeData.phone && (
                      <div className="flex items-center gap-2">
                        <span className="font-medium">الهاتف:</span>
                        <span>{resumeData.phone}</span>
                      </div>
                    )}
                    {resumeData.email && (
                      <div className="flex items-center gap-2">
                        <span className="font-medium">البريد الإلكتروني:</span>
                        <span className="break-all">{resumeData.email}</span>
                      </div>
                    )}
                    {(resumeData.city || resumeData.country) && (
                      <div className="flex items-center gap-2">
                        <span className="font-medium">الموقع:</span>
                        <span>{[resumeData.city, resumeData.country].filter(Boolean).join("، ")}</span>
                      </div>
                    )}
                  </div>
                </div>
                  
                {/* Education */}
                <div>
                  <h3 className="text-base font-bold mb-3 pb-1 border-b-2" style={{ color: resumeData.colorHex || "#000000", borderColor: resumeData.colorHex || "#000000" }}>
                    التعليم
                  </h3>
                  {resumeData.educations && resumeData.educations.filter(edu => Object.values(edu).some(Boolean)).length > 0 ? (
                    <div className="space-y-3">
                      {resumeData.educations.filter(edu => Object.values(edu).some(Boolean)).map((edu, idx) => (
                        <div key={idx} className="text-sm">
                          {edu.degree && (
                            <div className="font-semibold text-gray-900">{edu.degree}</div>
                          )}
                          {edu.school && (
                            <div className="font-medium text-gray-700">{edu.school}</div>
                          )}
                          {(edu.startDate || edu.endDate) && (
                            <div className="font-medium text-gray-600">
                              {edu.startDate && formatDate(new Date(edu.startDate), "MMM yyyy")}
                              {edu.endDate && ` - ${formatDate(new Date(edu.endDate), "MMM yyyy")}`}
                              {!edu.endDate && " - الحالي"}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500 italic text-right">لم يتم إضافة تعليم بعد</p>
                  )}
                </div>

                {/* Skills */}
                <div>
                  <h3 className="text-base font-bold mb-3 pb-1 border-b-2" style={{ color: resumeData.colorHex || "#000000", borderColor: resumeData.colorHex || "#000000" }}>
                    المهارات
                  </h3>
                  {resumeData.skills && resumeData.skills.length > 0 ? (
                    <div className="text-sm grid grid-cols-2 gap-x-4 gap-y-1">
                      {resumeData.skills.map((skill, index) => (
                        <div key={index} className="flex items-start gap-2">
                          <span className="text-gray-600 flex-shrink-0 mt-0.5">•</span>
                          <span className="flex-1">{skill}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500 italic">لم يتم إضافة مهارات بعد</p>
                  )}
                </div>
                {resumeData.userLanguages && resumeData.userLanguages.length > 0 && (
                  <div>
                    <h3 className="text-base font-bold mb-3 pb-1 border-b-2" style={{ color: resumeData.colorHex || "#000000", borderColor: resumeData.colorHex || "#000000" }}>
                      اللغات
                    </h3>
                    <div className="text-sm">
                      {resumeData.userLanguages.join(', ')}
                    </div>
                  </div>
                )}
              </div>

              {/* Left Column - Summary and Work Experience (RTL: left side) */}
              <div className="w-2/3 space-y-6 pt-16">
                <SummarySection resumeData={resumeData} />
                <WorkExperienceSection resumeData={resumeData} workExperiences={firstPageWorkExperiences} />
              </div>
            </div>
          </div>

          {/* Second Page (if needed) - when 4+ work experiences */}
          {showSecondPage && (
            <div className="mt-6">
              {/* Header Bar - Full Page Width */}
              <div
                className="w-full py-8 text-white"
                style={{ backgroundColor: resumeData.sidebarColorHex || "#0E7490" }}
              >
                <div className="text-right px-8">
                  <div className="mb-3">
                    <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
                      {resumeData.firstName} {resumeData.lastName}
                    </h1>
                  </div>
                  {resumeData.jobTitle && (
                    <h2 className="text-lg sm:text-xl font-medium opacity-95">
                      {resumeData.jobTitle}
                    </h2>
                  )}
                </div>
              </div>

              {/* Two Column Layout */}
              <div className="flex gap-6">
                {/* Right Column - Contact, Education, Skills (RTL: right side) */}
                <div className="w-1/3 space-y-6 pt-20">
                  {/* Contact Information */}
                  <div>
                    <h3 className="text-base font-bold mb-3 pb-1 border-b-2" style={{ color: resumeData.colorHex || "#000000", borderColor: resumeData.colorHex || "#000000" }}>
                      معلومات الاتصال
                    </h3>
                    <div className="space-y-2 text-sm">
                      {resumeData.phone && (
                        <div className="flex items-center gap-2">
                          <span className="font-medium">الهاتف:</span>
                          <span>{resumeData.phone}</span>
                        </div>
                      )}
                      {resumeData.email && (
                        <div className="flex items-center gap-2">
                          <span className="font-medium">البريد الإلكتروني:</span>
                          <span className="break-all">{resumeData.email}</span>
                        </div>
                      )}
                      {(resumeData.city || resumeData.country) && (
                        <div className="flex items-center gap-2">
                          <span className="font-medium">الموقع:</span>
                          <span>{[resumeData.city, resumeData.country].filter(Boolean).join("، ")}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Education */}
                  <div>
                    <h3 className="text-base font-bold mb-3 pb-1 border-b-2" style={{ color: resumeData.colorHex || "#000000", borderColor: resumeData.colorHex || "#000000" }}>
                      التعليم
                    </h3>
                    {resumeData.educations && resumeData.educations.filter(edu => Object.values(edu).some(Boolean)).length > 0 ? (
                      <div className="space-y-3">
                        {resumeData.educations.filter(edu => Object.values(edu).some(Boolean)).map((edu, idx) => (
                          <div key={idx} className="text-sm">
                            {edu.degree && (
                              <div className="font-semibold text-gray-900">{edu.degree}</div>
                            )}
                            {edu.school && (
                              <div className="font-medium text-gray-700">{edu.school}</div>
                            )}
                            {(edu.startDate || edu.endDate) && (
                              <div className="text-gray-600">
                                {edu.startDate && formatDate(new Date(edu.startDate), "MMM yyyy")}
                                {edu.endDate && ` - ${formatDate(new Date(edu.endDate), "MMM yyyy")}`}
                                {!edu.endDate && " - الحالي"}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500 italic text-right">لم يتم إضافة تعليم بعد</p>
                    )}
                  </div>

                  {/* Skills */}
                  <div>
                    <h3 className="text-base font-bold mb-3 pb-1 border-b-2" style={{ color: resumeData.colorHex || "#000000", borderColor: resumeData.colorHex || "#000000" }}>
                      المهارات
                    </h3>
                    {resumeData.skills && resumeData.skills.length > 0 ? (
                      <div className="text-sm grid grid-cols-2 gap-x-4 gap-y-1">
                        {resumeData.skills.map((skill, index) => (
                          <div key={index} className="flex items-start gap-2">
                            <span className="text-gray-600 flex-shrink-0 mt-0.5">•</span>
                            <span className="flex-1">{skill}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500 italic">لم يتم إضافة مهارات بعد</p>
                    )}
                  </div>
                </div>

                {/* Left Column - Work Experience Continuation (RTL: left side) */}
                <div className="w-2/3 space-y-6 pt-20">
                  <section>
                    <h3 className="text-base font-bold mb-4 pb-1 border-b-2" style={{ color: resumeData.colorHex || "#000000", borderColor: resumeData.colorHex || "#000000" }}>
                      الخبرة العملية (تابع)
                    </h3>
                    {secondPageWorkExperiences.length > 0 ? (
                      <div className="space-y-5">
                        {secondPageWorkExperiences.map((exp, idx) => (
                          <div key={idx} className="relative pr-5 border-r-2 border-gray-200">
                            <div className="absolute -right-1.5 top-0 w-3 h-3 rounded-full" style={{ backgroundColor: resumeData.colorHex || "#000000" }}></div>
                            <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start mb-1">
                              <div>
                                <h4 className="text-sm font-semibold text-gray-900">{exp.position}</h4>
                                {exp.company && (
                                  <p className="font-medium text-gray-700 text-xs">{exp.company}</p>
                                )}
                              </div>
                              {(exp.startDate || exp.endDate) && (
                                <div className="text-gray-600 text-xs lg:text-right">
                                  {exp.startDate && formatDate(new Date(exp.startDate), "MMM yyyy")}
                                  {exp.endDate && ` - ${formatDate(new Date(exp.endDate), "MMM yyyy")}`}
                                  {!exp.endDate && " - الحالي"}
                                </div>
                              )}
                            </div>
                            {exp.description && (
                              <div className="text-gray-700 leading-relaxed text-xs">
                                {exp.description.split('\n').filter(Boolean).map((line: string, i: number) => (
                                  <p key={i} className="mb-1">• {line.replace(/^[-•]\s*/, "")}</p>
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500 italic text-right">لا توجد خبرة عمل إضافية</p>
                    )}
                  </section>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
});

ResumeTemplate4Ar.displayName = 'ResumeTemplate4Ar';

export default ResumeTemplate4Ar;
