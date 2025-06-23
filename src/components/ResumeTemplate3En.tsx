import { BorderStyles } from "@/app/(main)/editor/BorderStyleButton";
import { cn } from "@/lib/utils";
import { ResumeValues } from "@/lib/validation";
import { formatDate } from "date-fns";
import Image from "next/image";
import React, { useEffect, useMemo, useState } from "react";
import { Phone, Mail, MapPin, Calendar, Building, Award } from "lucide-react";

interface ResumePreviewProps {
  resumeData: ResumeValues;
  contentRef?: React.Ref<HTMLDivElement>;
  className?: string;
  colorHex?: string;
}

// Type definitions for resume data
interface WorkExperience {
  position?: string;
  company?: string;
  startDate?: string;
  endDate?: string;
  description?: string;
}

interface Education {
  degree?: string;
  school?: string;
  startDate?: string;
  endDate?: string;
}

export default React.memo(function ResumeTemplate3En({
  resumeData,
  contentRef,
  className,
}: ResumePreviewProps) {
  // Extract style props for use throughout the template
  const { 
    colorHex = '#1f2937', 
    borderStyle = BorderStyles.SQUIRCLE, 
    fontFamily = "'Inter', sans-serif", 
    bulletStyle = 'dot' 
  } = resumeData;

  // Determine direction from resumeData.language
  const isResumeArabic = resumeData.language === 'ar' || resumeData.language === 'ar-SA';
  const dir = isResumeArabic ? 'rtl' : 'ltr';

  // Photo handling with client-side rendering
  const [photoSrc, setPhotoSrc] = useState<string>("");
  const [isClient, setIsClient] = useState(false);

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

  // Memoized computed values
  const imageStyle = useMemo(() => ({
    borderRadius:
      borderStyle === BorderStyles.SQUARE
        ? "0px"
        : borderStyle === BorderStyles.CIRCLE
          ? "9999px"
          : "10%",
  }), [borderStyle]);

  const location = useMemo(() =>
    [resumeData.city, resumeData.country].filter(Boolean).join(", "),
    [resumeData.city, resumeData.country]
  );

  const filteredWorkExperiences = useMemo(() =>
    resumeData.workExperiences?.filter(exp => Object.values(exp).filter(Boolean).length > 0) || [],
    [resumeData.workExperiences]
  );

  const filteredEducations = useMemo(() =>
    resumeData.educations?.filter(edu => Object.values(edu).filter(Boolean).length > 0) || [],
    [resumeData.educations]
  );

  // Split work experiences: first 3 on page 1, rest on page 2 (same as ResumeTemplate4En)
  const firstPageWorkExperiences = useMemo(() => 
    filteredWorkExperiences.slice(0, 3), 
    [filteredWorkExperiences]
  );
  
  const secondPageWorkExperiences = useMemo(() => 
    filteredWorkExperiences.slice(3), 
    [filteredWorkExperiences]
  );

  return (
    <div
      dir={dir}
      className={cn(
        // A4 style container
        "resume-container pdf-export-ready bg-white text-slate-900 flex flex-col items-center w-full min-h-screen",
        className,
      )}
       style={{ fontFamily, minHeight: '297mm', width: '210mm' }}
      ref={(el) => {
        // Assign the contentRef to the outermost container so PDF generation can find all .a4-page elements
        if (contentRef && typeof contentRef === 'function') {
          contentRef(el);
        } else if (contentRef && 'current' in contentRef) {
          (contentRef as React.MutableRefObject<HTMLDivElement | null>).current = el;
        }
      }}
    >
      {/* Main A4 Page */}
      <div className="a4-page" style={{ width: '210mm', height: '297mm', background: 'white', boxShadow: '0 0 8px 2px rgba(0,0,0,0.08)', margin: '0', display: 'flex', flexDirection: 'column', position: 'relative', borderRadius: '8px', overflow: 'hidden' }}>
        <div className="flex h-full relative" style={{ height: '297mm' }}>
          {/* Left Sidebar */}
          <Sidebar 
            resumeData={resumeData} 
            photoSrc={photoSrc}
            isClient={isClient}
            imageStyle={imageStyle}
            location={location}
            filteredEducations={filteredEducations}
            sidebarColorHex={resumeData.sidebarColorHex || '#0E7490'}
          />

          {/* Main Content */}
          <MainContent 
            resumeData={resumeData}
            filteredWorkExperiences={firstPageWorkExperiences}
            colorHex={colorHex}
            bulletStyle={bulletStyle}
          />
        </div>
      </div>

      {/* Second Page (if needed) - when 4+ work experiences */}
      {secondPageWorkExperiences.length > 0 && (
        <div className="a4-page" style={{ width: '210mm', height: '297mm', background: 'white', boxShadow: '0 0 8px 2px rgba(0,0,0,0.08)', margin: '20px 0 0 0', display: 'flex', flexDirection: 'column', position: 'relative', borderRadius: '8px', overflow: 'hidden' }}>
          <div className="flex h-full relative" style={{ height: '297mm' }}>
            {/* Complete Sidebar Copy (same as page 1) */}
            <Sidebar 
              resumeData={resumeData} 
              photoSrc={photoSrc}
              isClient={isClient}
              imageStyle={imageStyle}
              location={location}
              filteredEducations={filteredEducations}
              sidebarColorHex={resumeData.sidebarColorHex || '#0E7490'}
            />
            
            {/* Main Content - Additional Work Experience */}
            <div className="w-2/3 bg-white text-slate-800 relative">
              <div className="p-6">
                <h2 className="text-xl font-bold mb-6 flex items-center gap-3" style={{ color: colorHex }}>
                  <Award className="w-6 h-6" />
                  <span>Work Experience (Continued)</span>
                  <div className="flex-1 h-px bg-gradient-to-r from-gray-300 to-transparent"></div>
                </h2>
                
                {/* Additional Work Experience */}
                <section className="mb-6">
                  <div className="space-y-6">
                    {secondPageWorkExperiences.map((exp, index) => (
                      <WorkExperienceItem
                        key={index + 3}
                        experience={exp}
                        bulletStyle={bulletStyle}
                        colorHex={colorHex}
                      />
                    ))}
                  </div>
                </section>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modern Print Styles */}
      <style jsx>{`
        .a4-page {
          width: 100%;
          height: 100%;
          background: white;
          margin: 0 auto 0;
          box-shadow: 
            0 25px 50px -12px rgba(0, 0, 0, 0.1), 
            0 8px 16px -4px rgba(0, 0, 0, 0.05),
            0 0 0 1px rgba(0, 0, 0, 0.05);
          position: relative;
          overflow: hidden;
          border-radius: 8px;
          display: flex;
          flex-direction: column;
          font-family: ${fontFamily};
        }
        
        /* Override any default margins on the container */
        .resume-container {
          margin: 0 !important;
          padding: 0 !important;
        }
        
        /* PDF Export Optimizations - Force exact styling */
        .resume-container * {
          box-sizing: border-box;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }
        
        .resume-container {
          font-family: ${fontFamily};
          line-height: 1.5;
          color: #1e293b;
        }
        
        /* Ensure all text elements have proper font rendering */
        .resume-container h1,
        .resume-container h2,
        .resume-container h3,
        .resume-container p,
        .resume-container span,
        .resume-container div {
          font-family: ${fontFamily};
          text-rendering: optimizeLegibility;
        }
        
        /* Page break indicator */
        .a4-page:not(:last-child)::after {
          content: "Page break - Content continues on next page";
          display: block;
          position: absolute;
          left: 50%;
          bottom: -24px;
          transform: translateX(-50%);
          color: #6B7280;
          font-size: 12px;
          font-weight: 500;
          background: linear-gradient(90deg, #f3f4f6, #ffffff, #f3f4f6);
          padding: 4px 16px;
          border-radius: 12px;
          z-index: 10;
          border: 1px solid #E5E7EB;
          white-space: nowrap;
        }

        @media print {
          body, html {
            background: white !important;
            margin: 0 !important;
            padding: 0 !important;
          }
          .a4-page {
            width: 210mm !important;
            height: 297mm !important;
            margin: 0 !important;
            box-shadow: none !important;
            border-radius: 0 !important;
            page-break-after: always;
            break-after: page;
            overflow: visible !important;
          }
          .a4-page:last-child {
            page-break-after: auto;
            break-after: auto;
          }
          .a4-page:not(:last-child)::after {
            display: none !important;
          }
          /* Ensure proper print colors */
          * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            color-adjust: exact !important;
          }
          
          /* Make sidebar fill full A4 height in print */
          .a4-page > div {
            height: 297mm !important;
            min-height: 297mm !important;
          }
          
          .a4-page .w-1\\/3 {
            height: 297mm !important;
            min-height: 297mm !important;
          }
          
          /* Ensure both first and second page sidebars fill full height */
          .a4-page div[style*="background: linear-gradient"] {
            height: 297mm !important;
            min-height: 297mm !important;
          }
          
          /* Specific targeting for sidebar backgrounds in print */
          .a4-page .text-white.flex.flex-col {
            height: 297mm !important;
            min-height: 297mm !important;
          }
        }
        
        @keyframes slideIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .animate-slide-in {
          animation: slideIn 0.6s ease-out;
        }
        
        /* Scale for preview - maintain A4 aspect ratio */
        @media screen {
          .resume-container {
            transform-origin: top center;
            max-width: 100%;
          }
        }
        
        /* PDF Export specific styles - ensure exact rendering */
        @media screen {
          .pdf-export-ready {
            font-family: ${fontFamily} !important;
            -webkit-font-smoothing: antialiased !important;
            -moz-osx-font-smoothing: grayscale !important;
            font-variant-ligatures: none !important;
            text-rendering: optimizeLegibility !important;
            visibility: visible !important;
            opacity: 1 !important;
          }
          
          .pdf-export-ready * {
            font-family: inherit !important;
            box-sizing: border-box !important;
            visibility: visible !important;
            opacity: 1 !important;
          }
          
          /* Ensure gradients render properly */
          .pdf-export-ready [style*="linear-gradient"] {
            background-attachment: local !important;
          }
          
          /* Ensure shadows render properly */
          .pdf-export-ready [style*="box-shadow"],
          .pdf-export-ready [class*="shadow"] {
            box-shadow: inherit !important;
          }
          
          /* Force exact color rendering */
          .pdf-export-ready [style*="background:"],
          .pdf-export-ready [style*="backgroundColor"] {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            color-adjust: exact !important;
          }
          
          /* Ensure all spacing is preserved */
          .pdf-export-ready .mt-2 {
            margin-top: 0.5rem !important;
          }
          
          .pdf-export-ready .mb-2 {
            margin-bottom: 0.5rem !important;
          }
          
          .pdf-export-ready .p-3 {
            padding: 0.75rem !important;
          }
          
          .pdf-export-ready .p-6 {
            padding: 1.5rem !important;
          }
          
          /* Ensure bullet point alignment is preserved */
          .pdf-export-ready [style*="marginTop: '12px'"] {
            margin-top: 12px !important;
          }
          
          /* Ensure work experience positioning is preserved */
          .pdf-export-ready [style*="marginTop: '-3px'"] {
            margin-top: -3px !important;
          }
          
          /* Ensure padding top override is preserved */
          .pdf-export-ready [style*="paddingTop: '10px'"] {
            padding-top: 10px !important;
          }
        }
          }
          
          /* Ensure gradients render properly */
          .pdf-export-ready [style*="linear-gradient"] {
            background-attachment: local !important;
          }
          
          /* Ensure shadows render properly */
          .pdf-export-ready [style*="box-shadow"],
          .pdf-export-ready [class*="shadow"] {
            box-shadow: inherit !important;
          }
        }
      `}</style>
    </div>
  );
});

// Sidebar Component
interface SidebarProps {
  resumeData: ResumeValues;
  photoSrc: string;
  isClient: boolean;
  imageStyle: React.CSSProperties;
  location: string;
  filteredEducations: Education[];
  sidebarColorHex: string;
}

const Sidebar = React.memo(function Sidebar({ 
  resumeData, 
  photoSrc, 
  isClient, 
  imageStyle, 
  location,
  filteredEducations,
  sidebarColorHex
}: SidebarProps) {
  const { firstName, lastName, jobTitle, phone, email, skills, userLanguages } = resumeData;

  return (
    <div 
      className="w-1/3 text-white flex flex-col relative overflow-hidden"
      style={{ 
        background: sidebarColorHex || '#0E7490',
        height: '297mm',
      }}
    >
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 right-10 w-32 h-32 rounded-full bg-white"></div>
        <div className="absolute bottom-20 left-10 w-24 h-24 rounded-full bg-white"></div>
        <div className="absolute top-1/2 right-0 w-16 h-16 rounded-full bg-white transform translate-x-8"></div>
      </div>
      
      <div className="relative z-10 p-6 pt-8 flex-1 flex flex-col overflow-y-auto">
        {/* Profile Photo */}
        {isClient && photoSrc && (
          <div className="mb-4 flex justify-center">
            <div className="relative group">
              <div className="absolute inset-0 bg-white/20 rounded-full blur-xl transform scale-110"></div>
              <Image
                src={photoSrc}
                alt={`${firstName || ""} ${lastName || ""}`.trim() || "Profile photo"}
                width={100}
                height={100}
                className="object-cover relative z-10 ring-4 ring-white/30"
                style={{
                  ...imageStyle,
                  filter: 'brightness(1.1) contrast(1.1)',
                }}
              />
            </div>
          </div>
        )}

        {/* Personal Info */}
        <div className="mb-4 text-center">
          <h1 className="text-xl font-bold mb-2 tracking-tight text-white">
            {[firstName, lastName].filter(Boolean).join(" ")}
          </h1>
          {jobTitle && (
            <div className="relative">
              <div className="absolute inset-0 bg-white/10 rounded-lg blur-sm"></div>
              <p className="text-sm font-medium opacity-95 relative z-10 py-1 px-2 bg-white/20 rounded-lg backdrop-blur-sm text-white">
                {jobTitle}
              </p>
            </div>
          )}
        </div>

        {/* Contact Information */}
        <div className="mb-4">
          <h2 className="text-base font-bold mb-3 flex items-center gap-2 text-white">
            <div 
              className="w-4 h-0.5 rounded-full"
              style={{ backgroundColor: 'white' }}
            ></div>
            Contact
            <div className="flex-1 h-0.5 bg-white/30 rounded-full"></div>
          </h2>
          <div className="space-y-1.5">
            {phone && (
              <div className="flex items-center gap-2 group hover:bg-white/10 p-1.5 rounded-lg transition-all duration-300">
                <div 
                  className="p-1 rounded-lg group-hover:bg-white/30 transition-colors"
                  style={{ backgroundColor: `rgba(255, 255, 255, 0.2)` }}
                >
                  <Phone size={12} style={{ color: 'white' }} />
                </div>
                <span className="text-xs font-medium text-white">{phone}</span>
              </div>
            )}
            {email && (
              <div className="flex items-center gap-2 group hover:bg-white/10 p-1.5 rounded-lg transition-all duration-300">
                <div 
                  className="p-1 rounded-lg group-hover:bg-white/30 transition-colors"
                  style={{ backgroundColor: `rgba(255, 255, 255, 0.2)` }}
                >
                  <Mail size={12} style={{ color: 'white' }} />
                </div>
                <span className="text-xs font-medium break-all text-white">{email}</span>
              </div>
            )}
            {location && (
              <div className="flex items-center gap-2 group hover:bg-white/10 p-1.5 rounded-lg transition-all duration-300">
                <div 
                  className="p-1 rounded-lg group-hover:bg-white/30 transition-colors"
                  style={{ backgroundColor: `rgba(255, 255, 255, 0.2)` }}
                >
                  <MapPin size={12} style={{ color: 'white' }} />
                </div>
                <span className="text-xs font-medium text-white">{location}</span>
              </div>
            )}
          </div>
        </div>

        {/* Skills */}
        {skills && skills.length > 0 && (
          <div className="mb-4">
            <h2 className="text-base font-bold mb-3 flex items-center gap-2 text-white">
              <div 
                className="w-4 h-0.5 rounded-full"
                style={{ backgroundColor: 'white' }}
              ></div>
              Skills
              <div className="flex-1 h-0.5 bg-white/30 rounded-full"></div>
            </h2>
            <div className="grid grid-cols-2 gap-1.5">
              {skills.map((skill, index) => (
                <div key={index} className="group">
                  <div className="p-2 bg-white/15 backdrop-blur-sm rounded-lg border border-white/20 hover:bg-white/25 transition-all duration-300">
                    <h3 className="font-bold text-xs text-white">{skill}</h3>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Languages */}
        {userLanguages && userLanguages.length > 0 && (
          <div className="mb-4">
            <h2 className="text-base font-bold mb-3 flex items-center gap-2 text-white">
              <div 
                className="w-4 h-0.5 rounded-full"
                style={{ backgroundColor: 'white' }}
              ></div>
              Languages
              <div className="flex-1 h-0.5 bg-white/30 rounded-full"></div>
            </h2>
            <div className="grid grid-cols-2 gap-1.5">
              {userLanguages.map((language, index) => (
                <div key={index} className="group">
                  <div className="p-2 bg-white/15 backdrop-blur-sm rounded-lg border border-white/20 hover:bg-white/25 transition-all duration-300">
                    <h3 className="font-bold text-xs text-white">{language}</h3>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Education */}
        {filteredEducations && filteredEducations.length > 0 && (
          <div className="mb-4">
            <h2 className="text-base font-bold mb-3 flex items-center gap-2 text-white">
              <div 
                className="w-4 h-0.5 rounded-full"
                style={{ backgroundColor: 'white' }}
              ></div>
              Education
              <div className="flex-1 h-0.5 bg-white/30 rounded-full"></div>
            </h2>
            <div className="space-y-2">
              {filteredEducations.map((edu, index) => (
                <div key={index} className="group">
                  <div className="p-2 bg-white/15 backdrop-blur-sm rounded-lg border border-white/20 hover:bg-white/25 transition-all duration-300">
                    {edu.degree && (
                      <h3 className="font-bold text-xs mb-1 text-white">{edu.degree}</h3>
                    )}
                    {edu.school && (
                      <p className="text-xs text-white/90 mb-1 font-medium">{edu.school}</p>
                    )}
                    {(edu.startDate || edu.endDate) && (
                      <div className="flex items-center gap-1 text-white/80">
                        <Calendar size={8} style={{ color: 'white' }} />
                        <span className="text-xs font-medium">
                          {edu.startDate && edu.endDate
                            ? `${formatDate(new Date(edu.startDate), "MMM yyyy")} - ${formatDate(new Date(edu.endDate), "MMM yyyy")}`
                            : edu.startDate
                            ? `${formatDate(new Date(edu.startDate), "MMM yyyy")} - Present`
                            : edu.endDate
                            ? formatDate(new Date(edu.endDate), "MMM yyyy")
                            : ""
                          }
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
});

// Main Content Component
interface MainContentProps {
  resumeData: ResumeValues;
  filteredWorkExperiences: WorkExperience[];
  colorHex: string;
  bulletStyle: string;
}

const MainContent = React.memo(function MainContent({ 
  resumeData, 
  filteredWorkExperiences, 
  colorHex, 
  bulletStyle 
}: MainContentProps) {
  const { summary } = resumeData;
  
  return (
    <div className="w-2/3 text-slate-800 relative" style={{ backgroundColor: 'white' }}>
      <div className="p-6">
        {/* Summary */}
        {summary && (
          <section className="mb-6 animate-slide-in">
            <div className="relative mb-3">
              <h2 className="text-xl font-bold flex items-center gap-3 group">
                <div 
                  className="w-1 h-6 rounded-full"
                  style={{ backgroundColor: colorHex }}
                ></div>
                <span style={{ color: colorHex }}>Professional Summary</span>
                <div className="flex-1 h-px bg-gradient-to-r from-gray-300 to-transparent"></div>
              </h2>
            </div>
            <div className="relative">
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-gray-200 to-transparent rounded-full"></div>
              <p className="text-slate-600 leading-relaxed whitespace-pre-line pl-4 text-xs">
                {summary}
              </p>
            </div>
          </section>
        )}

        {/* Work Experience - Always show */}
        <section className="mb-6 animate-slide-in">
          <div className="relative mb-4">
            <h2 className="text-xl font-bold flex items-center gap-3 group">
              <div 
                className="w-1 h-6 rounded-full"
                style={{ backgroundColor: colorHex }}
              ></div>
              <span style={{ color: colorHex }}>Work Experience</span>
              <div className="flex-1 h-px bg-gradient-to-r from-gray-300 to-transparent"></div>
            </h2>
          </div>
          {filteredWorkExperiences.length > 0 ? (
            <div className="space-y-6">
              {/* Show only the work experiences passed as prop (first 3) */}
              {filteredWorkExperiences.map((exp, index) => (
                <WorkExperienceItem
                  key={index}
                  experience={exp}
                  bulletStyle={bulletStyle}
                  colorHex={colorHex}
                />
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500 italic pl-4">No work experience added yet</p>
          )}
        </section>
      </div>
    </div>
  );
});

// Work Experience Item Component
interface WorkExperienceItemProps {
  experience: WorkExperience;
  bulletStyle: string;
  colorHex: string;
}

const WorkExperienceItem = React.memo(function WorkExperienceItem({ 
  experience, 
  bulletStyle,
  colorHex
}: WorkExperienceItemProps) {
  const { position, company, startDate, endDate, description } = experience;

  const dateRange = useMemo(() => {
    if (!startDate && !endDate) return "";
    if (startDate && endDate) {
      return `${formatDate(new Date(startDate), "MMM yyyy")} - ${formatDate(new Date(endDate), "MMM yyyy")}`;
    }
    if (startDate) {
      return `${formatDate(new Date(startDate), "MMM yyyy")} - Present`;
    }
    if (endDate) {
      return formatDate(new Date(endDate), "MMM yyyy");
    }
    return "";
  }, [startDate, endDate]);

  return (
    <div 
      className="relative pl-4 group"
    >
      {/* Timeline line only - dot removed */}
      <div className="absolute left-1 top-0 bottom-0 w-0.5 bg-gradient-to-b from-gray-200 to-transparent"></div>
      
      <div className="bg-white border border-gray-100 rounded-xl p-3 shadow-sm hover:shadow-md transition-all duration-300 group-hover:border-gray-200">
        <div className="flex justify-between items-start mb-2">
          <div className="flex-1">
            <h3 className="font-bold text-base text-slate-800 mb-1 leading-tight">{position}</h3>
            {company && (
              <div className="flex items-center gap-2 text-slate-600">
                <div 
                  className="p-1 rounded-lg"
                  style={{ backgroundColor: `${colorHex}15` }}
                >
                  <Building size={12} style={{ color: colorHex }} />
                </div>
                <span className="font-medium text-xs">{company}</span>
              </div>
            )}
          </div>
          {dateRange && (
            <div className="flex items-center gap-1.5 text-slate-500 text-xs bg-slate-50 px-2 py-1 rounded-lg ml-2">
              <Calendar size={10} />
              <span className="font-medium whitespace-nowrap">{dateRange}</span>
            </div>
          )}
        </div>
        
        {description && (
          <div className="mt-2">
            {description.split('\n').filter(Boolean).map((line: string, index: number) => (
              <div key={index} className="flex items-start gap-2 mb-1.5 last:mb-0">
                {bulletStyle === 'dash' ? (
                  <div 
                    className="flex-shrink-0 w-2 h-0.5"
                    style={{ 
                      backgroundColor: colorHex,
                      marginTop: '12px' // 8px (mt-2) + 4px additional for better PDF alignment
                    }}
                  ></div>
                ) : (
                  <div 
                    className="flex-shrink-0 w-1 h-1 rounded-full"
                    style={{ 
                      backgroundColor: colorHex,
                      marginTop: '12px' // 8px (mt-2) + 4px additional for better PDF alignment
                    }}
                  ></div>
                )}
                <span className="text-slate-600 leading-relaxed text-xs">{line.trim()}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
});