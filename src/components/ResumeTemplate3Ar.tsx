import { cn } from "@/lib/utils";
import { ResumeValues } from "@/lib/validation";
import Image from "next/image";
import React, { useEffect, useState } from "react";

interface ResumePreviewProps {
  resumeData: ResumeValues;
  contentRef?: React.Ref<HTMLDivElement>;
  className?: string;
}

export default React.memo(function ResumeTemplate3Ar({
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
  const fontFamily = resumeData.fontFamily || "'Roboto', sans-serif";

  // Force RTL for Arabic template
  const dir = 'rtl';

  return (
    <div
      dir={dir}
      className={cn(
        "bg-[#f0f2f5] text-black flex flex-col items-center min-h-screen w-full resume-container",
        className,
      )}
      style={{ minHeight: '100vh', width: '100%', fontFamily }}
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
      {/* First Page */}
      <div className="a4-page">
        <div
          className="space-y-0 p-0"
          ref={setFirstPageContentEl}
          id="resumePreviewContent"
          style={{ fontFamily }}
        >
          <HeaderSection resumeData={resumeData} />
          <MainContent resumeData={resumeData} />
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
            box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1);
            margin: 32px 0;
            display: flex;
            flex-direction: column;
            position: relative;
            border-radius: 1rem;
            overflow: hidden;
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
            background: #f0f2f5;
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
          [data-template="template3ar"], [data-template="template3ar"] * {
            visibility: visible !important;
          }
          
          /* Style the resume container for print */
          [data-template="template3ar"] {
            position: fixed !important;
            left: 0 !important;
            top: 0 !important;
            width: 210mm !important;
            height: 297mm !important;
            background: white !important;
            margin: 0 !important;
            padding: 0 !important;
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
            padding: 0 !important;
            background: white !important;
            box-shadow: none !important;
            page-break-after: always !important;
            break-after: page !important;
            position: relative !important;
            border-radius: 0 !important;
          }
          
          /* Ensure sidebar colors and styling print correctly */
          .sidebar {
            background-color: var(--sidebar-color, #ecf0f1) !important;
            border-radius: 12px !important;
            -webkit-print-color-adjust: exact !important;
            color-adjust: exact !important;
            print-color-adjust: exact !important;
            box-shadow: none !important;
            overflow: hidden !important;
          }
          
          /* Ensure all sidebar text is white in print */
          .sidebar h2,
          .sidebar p,
          .sidebar li,
          .sidebar span,
          .sidebar .contact-info,
          .sidebar .contact-info p,
          .sidebar .contact-info svg {
            color: white !important;
            -webkit-print-color-adjust: exact !important;
            color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          
          /* Ensure all SVG elements in sidebar are white */
          .sidebar svg,
          .sidebar svg * {
            color: white !important;
            fill: white !important;
            stroke: white !important;
            -webkit-print-color-adjust: exact !important;
            color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          
          /* Ensure degree text is white in print */
          .sidebar h3,
          .sidebar .mb-4 h3 {
            color: white !important;
            -webkit-print-color-adjust: exact !important;
            color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          
          /* Ensure sidebar bullet points are white */
          .sidebar .list-disc-custom li span {
            color: white !important;
            -webkit-print-color-adjust: exact !important;
            color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          
          /* Ensure section label colors print correctly */
          .main-area h2 {
            -webkit-print-color-adjust: exact !important;
            color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          
          /* Ensure header colors print correctly */
          .header-section {
            background-color: var(--sidebar-color, #2c3e50) !important;
            color: white !important;
            -webkit-print-color-adjust: exact !important;
            color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          
          /* Ensure header text is white in print */
          .header-section h1,
          .header-section p {
            color: white !important;
            -webkit-print-color-adjust: exact !important;
            color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          
          /* Ensure all icons are white in print */
          .sidebar svg,
          .contact-info svg,
          .sidebar .contact-info svg {
            color: white !important;
            fill: white !important;
            -webkit-print-color-adjust: exact !important;
            color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          
          /* Ensure main content grid matches screen padding */
          .main-content {
            padding: 32px !important;
            gap: 32px !important;
          }
          
          /* Ensure sidebar maintains proper height and layout in print */
          .sidebar {
            min-height: 297mm !important;
            height: 297mm !important;
            display: flex !important;
            flex-direction: column !important;
            padding: 24px !important;
          }
          
          /* Ensure sidebar content is properly distributed */
          .sidebar > div {
            display: flex !important;
            flex-direction: column !important;
            flex: 1 !important;
          }
          
          /* Ensure all elements preserve their colors */
          * {
            -webkit-print-color-adjust: exact !important;
            color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
        }
      `}</style>
    </div>
  );
});

interface ResumeSectionProps {
  resumeData: ResumeValues;
}

const HeaderSection = React.memo(function HeaderSection({ resumeData }: ResumeSectionProps) {
  const fullName = [resumeData.firstName, resumeData.lastName].filter(Boolean).join(' ');
  
  return (
    <header className="header-section text-center py-3" style={{ 
      backgroundColor: resumeData.sidebarColorHex || '#2c3e50',
      '--sidebar-color': resumeData.sidebarColorHex || '#2c3e50'
    } as React.CSSProperties}>
      <h1 className="text-5xl font-bold mb-2 text-white" style={{ fontSize: '3rem', fontWeight: 700, color: 'white' }}>
        {fullName || '[الاسم الكامل]'}
      </h1>
      <p className="text-xl font-light text-white" style={{ color: 'white' }}>
        {resumeData.jobTitle || '[المسمى الوظيفي]'}
      </p>
    </header>
  );
});

const MainContent = React.memo(function MainContent({ resumeData }: ResumeSectionProps) {
  return (
    <div className="main-content grid grid-cols-1 md:grid-cols-12 gap-8 p-8">
      {/* Sidebar (Right Column for RTL) */}
      <aside className="sidebar md:col-span-5 p-6 rounded-xl flex flex-col" style={{ 
        backgroundColor: resumeData.sidebarColorHex || '#ecf0f1',
        minHeight: '297mm',
        height: '297mm',
        '--sidebar-color': resumeData.sidebarColorHex || '#ecf0f1'
      } as React.CSSProperties}>
        <div className="flex-1 flex flex-col">
          <ProfileImage resumeData={resumeData} />
          <ContactSection resumeData={resumeData} />
          <SkillsSection resumeData={resumeData} />
          <LanguagesSection resumeData={resumeData} />
          <EducationSection resumeData={resumeData} />
        </div>
      </aside>

      {/* Main Content Area (Left Column for RTL) */}
      <main className="main-area md:col-span-7 p-6">
        <SummarySection resumeData={resumeData} />
        <WorkExperienceSection resumeData={resumeData} />
      </main>
    </div>
  );
});

const ProfileImage = React.memo(function ProfileImage({ resumeData }: ResumeSectionProps) {
  if (!resumeData.photo) {
    return (
      <div className="mb-6 flex justify-center">
        <div className="w-32 h-32 bg-gray-300 rounded-full flex items-center justify-center">
          <svg className="w-16 h-16 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
          </svg>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-6 flex justify-center">
      <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg">
        {typeof resumeData.photo === 'string' ? (
          <Image
            src={resumeData.photo}
            alt="Profile"
            width={128}
            height={128}
            className="w-full h-full object-cover"
          />
        ) : (
          <Image
            src={URL.createObjectURL(resumeData.photo)}
            alt="Profile"
            width={128}
            height={128}
            className="w-full h-full object-cover"
          />
        )}
      </div>
    </div>
  );
});

const ContactSection = React.memo(function ContactSection({ resumeData }: ResumeSectionProps) {
  return (
    <section className="mb-6">
      <h2 className="text-xl font-semibold mb-3 text-white" style={{ color: 'white' }}>معلومات الاتصال</h2>
      <div className="contact-info text-white space-y-2">
        {resumeData.phone && (
          <p className="flex items-center text-sm" style={{ color: 'white' }}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2 text-white" viewBox="0 0 20 20" fill="currentColor" style={{ color: 'white' }}>
              <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.774a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.06-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
            </svg>
            {resumeData.phone}
          </p>
        )}
        {resumeData.email && (
          <p className="flex items-center text-sm" style={{ color: 'white' }}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2 text-white" viewBox="0 0 20 20" fill="currentColor" style={{ color: 'white' }}>
              <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
              <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
            </svg>
            {resumeData.email}
          </p>
        )}
        {(resumeData.city || resumeData.country) && (
          <p className="flex items-center text-sm" style={{ color: 'white' }}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2 text-white" viewBox="0 0 20 20" fill="currentColor" style={{ color: 'white' }}>
              <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
            </svg>
            {[resumeData.city, resumeData.country].filter(Boolean).join('، ')}
          </p>
        )}
      </div>
    </section>
  );
});

const SummarySection = React.memo(function SummarySection({ resumeData }: ResumeSectionProps) {
  if (!resumeData.summary) return null;

  return (
    <section className="mb-8">
      <h2 className="text-xl font-semibold mb-4 pb-2 border-b-2 border-black" style={{ 
        color: resumeData.sectionLabelColorHex || '#1f2937' 
      }}>
        الملخص المهني
      </h2>
      <p className="text-gray-700 leading-relaxed text-sm">
        {resumeData.summary}
      </p>
    </section>
  );
});

const WorkExperienceSection = React.memo(function WorkExperienceSection({ 
  resumeData
}: ResumeSectionProps) {
  const workExperiences = resumeData.workExperiences?.filter(
    (exp) => Object.values(exp).filter(Boolean).length > 0
  ) || [];

  if (workExperiences.length === 0) return null;

  return (
    <section className="mb-8">
      <h2 className="text-xl font-semibold mb-4 pb-2 border-b-2 border-black" style={{ 
        color: resumeData.sectionLabelColorHex || '#1f2937' 
      }}>
        الخبرة العملية
      </h2>
      <div className="space-y-6">
        {workExperiences.map((experience, index) => (
          <WorkExperienceItem 
            key={index} 
            experience={experience}
            colorHex={resumeData.colorHex}
            bulletStyle={resumeData.bulletStyle}
          />
        ))}
      </div>
    </section>
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
  const formatDate = (date: Date | string | undefined) => {
    if (!date) return '';
    if (typeof date === 'string') return date;
    return date.toLocaleDateString('ar-SA', { month: 'short', year: 'numeric' });
  };

  const startDate = formatDate(experience.startDate);
  const endDate = formatDate(experience.endDate);
  const dateRange = [startDate, endDate].filter(Boolean).join(' – ');

  const getBulletContent = () => {
    switch (bulletStyle) {
      case 'dash': return '–';
      case 'arrow': return '→';
      default: return '•';
    }
  };

  return (
    <div className="mb-6 pb-4 border-b border-gray-200 last:border-b-0">
      <h3 className="text-lg font-semibold text-black mb-1">
        {experience.position || 'مهندس برمجيات'}
      </h3>
      <p className="text-gray-600 mb-1 text-sm">
        {experience.company || '[اسم الشركة]'}
      </p>
      {dateRange && (
        <p className="text-gray-600 text-sm mb-2">
          {dateRange}
        </p>
      )}
      {experience.description && (
        <ul className="mt-2 text-gray-700 space-y-1 text-sm">
          {experience.description.split('\n').filter(Boolean).map((line, index) => (
            <li key={index} className="flex items-start">
              <span className="ml-2 text-black" style={{ color: colorHex }}>
                {getBulletContent()}
              </span>
              {line.trim()}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
});

const EducationSection = React.memo(function EducationSection({ resumeData }: ResumeSectionProps) {
  const educations = resumeData.educations?.filter(
    (edu) => Object.values(edu).filter(Boolean).length > 0
  ) || [];

  if (educations.length === 0) return null;

  return (
    <section className="mt-8">
      <h2 className="text-xl font-semibold mb-3 text-white" style={{ color: 'white' }}>التعليم</h2>
      <div className="space-y-4">
        {educations.map((education, index) => (
          <EducationItem key={index} education={education} />
        ))}
      </div>
    </section>
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
  const formatDate = (date: Date | string | undefined) => {
    if (!date) return '';
    if (typeof date === 'string') return date;
    return date.toLocaleDateString('ar-SA', { month: 'short', year: 'numeric' });
  };

  const startDate = formatDate(education.startDate);
  const endDate = formatDate(education.endDate);
  const dateRange = [startDate, endDate].filter(Boolean).join(' – ');

  return (
    <div className="mb-4">
      <h3 className="text-lg font-semibold text-white mb-1" style={{ color: 'white' }}>
        {education.degree || '[اسم الدرجة العلمية]'}
      </h3>
      <p className="text-white mb-1" style={{ color: 'white' }}>
        {education.school || '[اسم الجامعة]'}
      </p>
      {dateRange && (
        <p className="text-white text-sm" style={{ color: 'white' }}>
          {dateRange}
        </p>
      )}
    </div>
  );
});

const SkillsSection = React.memo(function SkillsSection({ resumeData }: ResumeSectionProps) {
  const skills = resumeData.skills?.filter(Boolean) || [];

  if (skills.length === 0) return null;

  return (
    <section className="mt-8 mb-6">
      <h2 className="text-xl font-semibold mb-3 text-white" style={{ color: 'white' }}>المهارات</h2>
      <div className="text-white" style={{ color: 'white' }}>
        <ul className="list-disc-custom space-y-1">
          {skills.map((skill, index) => (
            <li key={index} className="flex items-start" style={{ color: 'white' }}>
              <span className="ml-2 text-white" style={{ color: 'white' }}>•</span>
              {skill}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
});

const LanguagesSection = React.memo(function LanguagesSection({ resumeData }: ResumeSectionProps) {
  const languages = resumeData.userLanguages?.filter(Boolean) || [];

  if (languages.length === 0) return null;

  return (
    <section>
      <h2 className="text-xl font-semibold mb-3 text-white" style={{ color: 'white' }}>اللغات</h2>
      <ul className="list-disc-custom text-white space-y-1">
        {languages.map((language, index) => (
          <li key={index} className="flex items-start" style={{ color: 'white' }}>
            <span className="ml-2 text-white" style={{ color: 'white' }}>•</span>
            {language}
          </li>
        ))}
      </ul>
    </section>
  );
}); 