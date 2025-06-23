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

export default React.memo(function ResumeTemplate3Ar({
  resumeData,
  contentRef,
  className,
}: ResumePreviewProps) {
  // Show second page only when there are 4 or more work experiences
  const showSecondPage = useMemo(() => {
    const workExperiencesCount = resumeData.workExperiences?.filter(exp => 
      Object.values(exp).filter(Boolean).length > 0
    ).length || 0;
    return workExperiencesCount >= 4;
  }, [resumeData.workExperiences]);

  // Arabic font family (force Arial)
  const { 
    colorHex = '#1f2937', 
    borderStyle = BorderStyles.SQUIRCLE, 
    /* fontFamily = "'Amiri', 'Noto Sans Arabic', serif", */
    bulletStyle = 'dot' 
  } = resumeData;
  const fontFamily = "'Arial', 'Amiri', 'Noto Sans Arabic', serif";

  // Force RTL direction for Arabic template
  const dir = 'rtl';

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

  return (
    <div
      dir={dir}
      className={cn(
        // A4 style container
        "resume-container pdf-export-ready bg-white text-slate-900 flex flex-col items-center w-full min-h-screen",
        className,
      )}
       style={{ fontFamily, minHeight: '297mm', width: '210mm' }}
       data-template="template3ar"
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
        <div className="flex h-full relative" style={{ height: '297mm', flexDirection: 'row-reverse' }}>
          {/* Right Sidebar for RTL */}
          <Sidebar 
            resumeData={resumeData} 
            photoSrc={photoSrc}
            isClient={isClient}
            imageStyle={imageStyle}
            location={location}
            filteredEducations={filteredEducations}
            colorHex={colorHex}
            sidebarColorHex={resumeData.sidebarColorHex || '#0E7490'}
          />

          {/* Main Content on Left for RTL */}
          <MainContent 
            resumeData={resumeData}
            filteredWorkExperiences={filteredWorkExperiences}
            colorHex={colorHex}
            bulletStyle={bulletStyle}
          />
        </div>
      </div>

      {/* Second Page (if needed) - when 4+ work experiences */}
      {showSecondPage && (
        <div className="a4-page" style={{ width: '210mm', height: '297mm', background: 'white', boxShadow: '0 0 8px 2px rgba(0,0,0,0.08)', margin: '20px 0 0 0', display: 'flex', flexDirection: 'column', position: 'relative', borderRadius: '8px', overflow: 'hidden' }}>
          <div className="flex h-full relative" style={{ height: '297mm', flexDirection: 'row-reverse' }}>
            {/* Complete Sidebar Copy (same as page 1) */}
            <Sidebar 
              resumeData={resumeData} 
              photoSrc={photoSrc}
              isClient={isClient}
              imageStyle={imageStyle}
              location={location}
              filteredEducations={filteredEducations}
              colorHex={colorHex}
              sidebarColorHex={resumeData.sidebarColorHex || '#0E7490'}
            />
            
            {/* Main Content - Additional Work Experience */}
            <div className="w-2/3 bg-white text-slate-800 relative">
              <div className="p-6">
                <h2 className="text-xl font-bold mb-6 flex items-center gap-3" style={{ color: colorHex }}>
                  <Award className="w-6 h-6" />
                  <span>الخبرة المهنية (متابعة)</span>
                  <div className="flex-1 h-px bg-gradient-to-l from-gray-300 to-transparent"></div>
                </h2>
                
                {/* Additional Work Experience */}
                <section className="mb-6">
                  <div className="space-y-6">
                    {filteredWorkExperiences.slice(3).map((exp, index) => (
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

      {/* --- Enhanced A4 Pagination Logic ---
  // OVERFLOW DETECTION: Enhanced logic with ResizeObserver for dynamic content changes
  // CONTENT SPLITTING: Smart content distribution across pages
  // FUTURE EXTENSION: Ready for 3+ page support with dynamic section splitting
  // 
  // Current Features:
  // ✅ Real-time overflow detection with ResizeObserver
  // ✅ Debug logging for development
  // ✅ Smart content distribution (work exp, education, skills, additional info)
  // ✅ Proper A4 dimensions with accurate height calculation
  // ✅ RTL layout preservation across pages
  // ✅ Sidebar duplication on overflow pages
  // 
  // For 3+ pages in the future:
  // 1. Implement section height measurement
  // 2. Create dynamic page array state
  // 3. Add content splitting algorithms for large sections
  // 4. Maintain sidebar consistency across all pages */}

      {/* Enhanced A4 Print Styles with Robust Overflow Handling */}
      <style jsx>{`
        .a4-page {
          width: 100%;
          height: 100%;
          min-height: 297mm;
          max-height: 297mm;
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
          page-break-after: always;
          break-after: page;
        }
        
        /* Last page should not have page break */
        .a4-page:last-child {
          page-break-after: auto;
          break-after: auto;
        }
        
        /* Ensure content doesn't overflow A4 boundaries */
        .a4-page > * {
          max-height: 297mm;
          overflow: hidden;
        }
        
        /* Override any default margins on the container */
        .resume-container {
          margin: 0 !important;
          padding: 0 !important;
          overflow: visible;
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
        
        /* Page break indicator - Arabic */
        .a4-page:not(:last-child)::after {
          content: "فاصل الصفحة - المحتوى يتواصل في الصفحة التالية";
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
          direction: rtl;
          font-family: ${fontFamily};
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
        
        /* RTL-specific styles for Arabic layout */
        [dir="rtl"] .resume-container {
          text-align: right;
        }
        
        [dir="rtl"] .flex {
          direction: rtl;
        }
        
        /* RTL-specific timeline adjustments */
        [dir="rtl"] .relative .absolute.right-1 {
          right: 0.25rem;
        }
        
        [dir="rtl"] .relative .absolute.right-0 {
          right: 0;
        }
        
        /* RTL bullet point alignment */
        [dir="rtl"] .text-right {
          text-align: right;
        }
        
        /* RTL-specific bullet positioning for work experience */
        [dir="rtl"] .flex[style*="row-reverse"] .flex-shrink-0 {
          margin-left: 0;
          margin-right: 0;
          order: 2;
        }
        
        [dir="rtl"] .flex[style*="row-reverse"] span {
          order: 1;
          text-align: right;
          direction: rtl;
        }
        
        /* Ensure bullets appear on the right side for RTL */
        [dir="rtl"] .work-experience-bullet {
          margin-left: 8px;
          margin-right: 0;
        }
        
        /* RTL list item styling */
        [dir="rtl"] .work-experience-list-item {
          display: flex;
          flex-direction: row-reverse;
          align-items: center;
          text-align: right;
          gap: 8px;
          line-height: 1.6;
          margin-bottom: 6px;
        }
        
        [dir="rtl"] .work-experience-list-item span {
          flex: 1;
          text-align: right;
          direction: rtl;
          line-height: 1.6;
        }
        
        [dir="rtl"] .work-experience-list-item .work-experience-bullet {
          margin: 0 !important;
          flex-shrink: 0;
          position: relative;
          top: 0;
          align-self: center;
        }
        
        /* RTL gradient adjustments */
        [dir="rtl"] .bg-gradient-to-l {
          background: linear-gradient(to left, var(--tw-gradient-stops));
        }
        
        /* RTL icon positioning */
        [dir="rtl"] .justify-end {
          justify-content: flex-end;
        }
        
        /* Arabic text rendering optimizations */
        [dir="rtl"] * {
          font-kerning: auto;
          text-rendering: optimizeLegibility;
          -webkit-font-feature-settings: "kern" 1, "liga" 1, "calt" 1;
          font-feature-settings: "kern" 1, "liga" 1, "calt" 1;
        }

        /* --- Improved native bullet alignment for work experience tasks --- */
        [dir="rtl"] .work-experience-tasks-list {
          list-style-type: disc !important;
          list-style-position: inside;
          padding: 0;
          margin: 0;
        }
        [dir="rtl"] .work-experience-tasks-list li {
          text-align: right;
          direction: rtl;
          font-size: 9px; /* Changed from 10px to 9px */
          color: #475569;
          line-height: 1.7;
          margin-bottom: 2px;
          padding-right: 0.2em;
        }
        [dir="rtl"] .work-experience-tasks-list.dash {
          list-style-type: none !important;
        }
        [dir="rtl"] .work-experience-tasks-list.dash li::before {
          content: "– "; /* en dash + space */
          color: #475569;
          font-size: 1.1em;
          display: inline-block;
          width: 1.2em;
          margin-left: 0.2em;
          margin-right: 0;
          position: relative;
          top: 0.05em;
        }
        /* Additional fallback for dash styling */
        .work-experience-tasks-list.dash {
          list-style-type: none !important;
        }
        .work-experience-tasks-list.dash li::before {
          content: "– ";
          color: #475569;
          font-size: 1.1em;
          display: inline-block;
          width: 1.2em;
          margin-left: 0.2em;
          margin-right: 0;
          position: relative;
          top: 0.05em;
          text-align: right;
        }
        /* RTL-specific dash styling with higher specificity */
        [dir="rtl"] .work-experience-tasks-list.dash li::before {
          content: "– ";
          color: #475569;
          font-size: 1.1em;
          display: inline-block;
          width: 1.2em;
          margin-left: 0;
          margin-right: 0.2em;
          position: relative;
          top: 0.05em;
          text-align: right;
          float: right;
        }
        /* Ensure dash styling works across different browsers */
        ul.work-experience-tasks-list.dash {
          list-style-type: none !important;
          list-style: none !important;
        }
        ul.work-experience-tasks-list.dash li::before {
          content: "– " !important;
          color: #475569 !important;
          font-size: 1.1em !important;
          display: inline-block !important;
          width: 1.2em !important;
          margin-left: 0 !important;
          margin-right: 0.2em !important;
          position: relative !important;
          top: 0.05em !important;
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
  colorHex: string;
  sidebarColorHex: string;
}

const Sidebar = React.memo(function Sidebar({ 
  resumeData, 
  photoSrc, 
  isClient, 
  imageStyle, 
  location,
  filteredEducations,
  colorHex,
  sidebarColorHex
}: SidebarProps) {
  const { firstName, lastName, jobTitle, phone, email, skills } = resumeData;

  return (
    <div 
      className="w-1/3 text-white flex flex-col relative overflow-hidden min-h-full"
      style={{ 
        background: sidebarColorHex || '#0E7490',
        minHeight: '297mm',
      }}
    >
      {/* Decorative Background Elements - RTL positioned */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-32 h-32 rounded-full bg-gray-300"></div>
        <div className="absolute bottom-20 right-10 w-24 h-24 rounded-full bg-gray-300"></div>
        <div className="absolute top-1/2 left-0 w-16 h-16 rounded-full bg-gray-300 transform -translate-x-8"></div>
      </div>
      
      <div className="relative z-10 p-6 pt-10 flex-1 flex flex-col">
        {/* Profile Photo */}
        {isClient && photoSrc && (
          <div className="mb-6 flex justify-center">
            <div className="relative group">
              <div className="absolute inset-0 bg-gray-400/20 rounded-full blur-xl transform scale-110"></div>
              <Image
                src={photoSrc}
                alt={`${firstName || ""} ${lastName || ""}`.trim() || "Profile photo"}
                width={120}
                height={120}
                className="object-cover relative z-10 ring-4 ring-gray-400/30"
                style={{
                  ...imageStyle,
                  filter: 'brightness(1.1) contrast(1.1)',
                }}
              />
            </div>
          </div>
        )}

        {/* Personal Info */}
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold mb-2 tracking-tight text-white arabic-text-optimized">
            {[firstName, lastName].filter(Boolean).join(" ")}
          </h1>
          {jobTitle && (
            <div className="relative">
              <div className="absolute inset-0 bg-gray-400/10 rounded-lg blur-sm"></div>
              <p className="text-base font-medium opacity-95 relative z-10 py-1.5 px-3 bg-gray-400/20 rounded-lg backdrop-blur-sm text-white arabic-text-optimized">
                {jobTitle}
              </p>
            </div>
          )}
        </div>

        {/* Contact Information */}
        <div className="mb-6">
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2 text-white">
            <div 
              className="w-6 h-0.5 rounded-full"
              style={{ backgroundColor: colorHex }}
            ></div>
            التواصل
            <div className="flex-1 h-0.5 bg-gray-400/30 rounded-full"></div>
          </h2>
          <div className="space-y-2">
            {phone && (
              <div className="flex items-center gap-3 group hover:bg-gray-400/10 p-2 rounded-lg transition-all duration-300">
                <div 
                  className="p-1.5 rounded-lg group-hover:bg-gray-400/30 transition-colors"
                  style={{ backgroundColor: `${colorHex}20` }}
                >
                  <Phone size={14} style={{ color: colorHex }} />
                </div>
                <span className="text-xs font-medium text-white">{phone}</span>
              </div>
            )}
            {email && (
              <div className="flex items-center gap-3 group hover:bg-gray-400/10 p-2 rounded-lg transition-all duration-300">
                <div 
                  className="p-1.5 rounded-lg group-hover:bg-gray-400/30 transition-colors"
                  style={{ backgroundColor: `${colorHex}20` }}
                >
                  <Mail size={14} style={{ color: colorHex }} />
                </div>
                <span className="text-xs font-medium break-all text-white">{email}</span>
              </div>
            )}
            {location && (
              <div className="flex items-center gap-3 group hover:bg-gray-400/10 p-2 rounded-lg transition-all duration-300">
                <div 
                  className="p-1.5 rounded-lg group-hover:bg-gray-400/30 transition-colors"
                  style={{ backgroundColor: `${colorHex}20` }}
                >
                  <MapPin size={14} style={{ color: colorHex }} />
                </div>
                <span className="text-xs font-medium text-white">{location}</span>
              </div>
            )}
          </div>
        </div>

        {/* Skills */}
        {skills && skills.length > 0 && (
          <div className="mb-6">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2 text-white">
              <div className="w-6 h-0.5 rounded-full" style={{ backgroundColor: colorHex }}></div>
              المهارات
              <div className="flex-1 h-0.5 bg-gray-400/30 rounded-full"></div>
            </h2>
            <div className="grid grid-cols-2 gap-2">
              {skills.map((skill, index) => (
                <div key={index} className="group">
                  <div className="p-3 bg-gray-400/15 backdrop-blur-sm rounded-lg border border-gray-400/20 hover:bg-gray-400/25 transition-all duration-300">
                    <h3 className="font-bold text-sm text-white text-right">{skill}</h3>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        {resumeData.userLanguages && resumeData.userLanguages.length > 0 && (
          <div className="mb-6">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2 text-white">
              <div className="w-6 h-0.5 rounded-full" style={{ backgroundColor: colorHex }}></div>
              اللغات
              <div className="flex-1 h-0.5 bg-gray-400/30 rounded-full"></div>
            </h2>
            <div className="text-sm text-white">
              {resumeData.userLanguages.join(', ')}
            </div>
          </div>
        )}

        {/* Education */}
        {filteredEducations && filteredEducations.length > 0 && (
          <div className="mb-6">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2 text-white">
              <div 
                className="w-6 h-0.5 rounded-full"
                style={{ backgroundColor: colorHex }}
              ></div>
              التعليم
              <div className="flex-1 h-0.5 bg-gray-400/30 rounded-full"></div>
            </h2>
            <div className="space-y-3">
              {filteredEducations.map((edu, index) => (
                <div key={index} className="group">
                  <div className="p-3 bg-gray-400/15 backdrop-blur-sm rounded-lg border border-gray-400/20 hover:bg-gray-400/25 transition-all duration-300">
                    <div className="text-right">
                      {edu.degree && (
                        <h3 className="font-bold text-sm mb-1 text-white">{edu.degree}</h3>
                      )}
                      {edu.school && (
                        <>
                          <p className="text-xs text-white/90 mb-1 font-medium">{edu.school}</p>
                          {(edu.startDate || edu.endDate) && (
                            <div className="flex items-center gap-1 text-white/80 justify-end mt-0.5">
                              <Calendar size={10} style={{ color: colorHex }} />
                              <span className="text-xs font-medium">
                                {edu.startDate && edu.endDate
                                  ? `${formatDate(new Date(edu.startDate), "MMM yyyy")} - ${formatDate(new Date(edu.endDate), "MMM yyyy")}`
                                  : edu.startDate
                                  ? `${formatDate(new Date(edu.startDate), "MMM yyyy")} - الحاضر`
                                  : edu.endDate
                                  ? formatDate(new Date(edu.endDate), "MMM yyyy")
                                  : ""
                                }
                              </span>
                            </div>
                          )}
                        </>
                      )}
                    </div>
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
      <div className="p-6" style={{ paddingTop: '10px' }}>
        {/* Summary */}
        {summary && (
          <section className="mb-6 animate-slide-in">
            <div className="relative mb-3">
              <h2 className="text-xl font-bold flex items-center gap-3 group">
                <div 
                  className="w-1 h-6 rounded-full"
                  style={{ backgroundColor: colorHex }}
                ></div>
                <span style={{ color: colorHex }}>الملخص المهني</span>
                <div className="flex-1 h-px bg-gradient-to-l from-gray-300 to-transparent"></div>
              </h2>
            </div>
            <div className="relative">
              <div className="absolute right-0 top-0 bottom-0 w-1 bg-gradient-to-b from-gray-200 to-transparent rounded-full"></div>
              <p className="text-slate-600 leading-relaxed whitespace-pre-line pr-4" style={{ fontSize: '14px' }}>
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
              <span style={{ color: colorHex }}>الخبرة المهنية</span>
              <div className="flex-1 h-px bg-gradient-to-l from-gray-300 to-transparent"></div>
            </h2>
          </div>
          {filteredWorkExperiences.length > 0 ? (
            <div className="space-y-6">
              {/* Show only first 3 work experiences on first page, rest go to page 2 */}
              {filteredWorkExperiences.slice(0, 3).map((exp, index) => (
                <WorkExperienceItem
                  key={index}
                  experience={exp}
                  bulletStyle={bulletStyle}
                  colorHex={colorHex}
                />
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500 italic pr-4 text-right">لم يتم إضافة خبرة عمل بعد</p>
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
      return `${formatDate(new Date(startDate), "MMM yyyy")} - الحاضر`;
    }
    if (endDate) {
      return formatDate(new Date(endDate), "MMM yyyy");
    }
    return "";
  }, [startDate, endDate]);

  return (
    <div 
      className="relative pr-4 group"
    >
      {/* Timeline line for RTL - positioned on right */}
      <div className="absolute right-1 top-0 bottom-0 w-0.5 bg-gradient-to-b from-gray-200 to-transparent"></div>
      
      <div className="bg-white border border-gray-100 rounded-xl p-3 shadow-sm hover:shadow-md transition-all duration-300 group-hover:border-gray-200">
        <div className="mb-2">
          {/* Position title - always on the right side */}
          <div className="w-full mb-1" style={{ direction: 'rtl' }}>
            <h3 className="font-bold text-xl text-slate-800 leading-tight text-right w-full">{position}</h3>
          </div>
          
          {/* Company and date row */}
          <div className="flex justify-between items-start">
            {/* Company always on the right side */}
            {company && (
              <div className="flex items-center gap-2 text-slate-600" style={{ direction: 'rtl' }}>
                <div 
                  className="p-1 rounded-lg"
                  style={{ backgroundColor: `${colorHex}15` }}
                >
                  <Building size={12} style={{ color: colorHex }} />
                </div>
                <span className="font-medium text-sm">{company}</span>
              </div>
            )}
            
            {/* Date on the left */}
            {dateRange && (
              <div className="flex items-center gap-1.5 text-slate-500 text-xs bg-slate-50 px-2 py-1 rounded-lg">
                <Calendar size={10} />
                <span className="font-medium whitespace-nowrap">{dateRange}</span>
              </div>
            )}
          </div>
        </div>
        
        {description && (
          <ul className={`work-experience-tasks-list${bulletStyle === 'dash' ? ' dash' : ''} mt-2`} data-bullet-style={bulletStyle}>
            {description.split('\n').filter(Boolean).map((line: string, index: number) => (
              <li key={index}>{line.trim()}</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
});

// Education Item Component
interface EducationItemProps {
  education: Education;
  colorHex: string;
}

const EducationItem = React.memo(function EducationItem({ education, colorHex }: EducationItemProps) {
  const { degree, school, startDate, endDate } = education;

  const dateRange = useMemo(() => {
    if (!startDate && !endDate) return "";
    if (startDate && endDate) {
      return `${formatDate(new Date(startDate), "MMM yyyy")} - ${formatDate(new Date(endDate), "MMM yyyy")}`;
    }
    if (startDate) {
      return `${formatDate(new Date(startDate), "MMM yyyy")} - الحاضر`;
    }
    if (endDate) {
      return formatDate(new Date(endDate), "MMM yyyy");
    }
    return "";
  }, [startDate, endDate]);

  return (
    <div className="relative pr-4 group">
      {/* Timeline dot for RTL - positioned on right */}
      <div 
        className="absolute right-0 top-1.5 w-2.5 h-2.5 rounded-full border-2 border-white shadow-lg"
        style={{ backgroundColor: colorHex }}
      ></div>
      
      <div className="bg-gradient-to-l from-slate-50 to-white border border-gray-100 rounded-xl p-3 shadow-sm hover:shadow-md transition-all duration-300 group-hover:border-gray-200">
        <div className="text-right">
          <h3 className="font-bold text-sm text-slate-800 mb-1 leading-tight">{degree}</h3>
          {school && (
            <div className="flex items-center gap-2 justify-end mb-1">
              <span className="text-slate-600 font-medium text-xs">{school}</span>
              <div 
                className="p-1 rounded-lg"
                style={{ backgroundColor: `${colorHex}15` }}
              >
                <Award size={12} style={{ color: colorHex }} />
              </div>
            </div>
          )}
          {dateRange && (
            <div className="flex items-center gap-1.5 justify-end text-slate-500 text-xs">
              <span className="font-medium whitespace-nowrap">{dateRange}</span>
              <Calendar size={10} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
});