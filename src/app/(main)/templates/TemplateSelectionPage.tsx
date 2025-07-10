"use client";

import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import ResumeTemplate1En from '@/components/ResumeTemplate1En';
import ResumeTemplate2En from '@/components/ResumeTemplate2En';
import ResumeTemplate3En from '@/components/ResumeTemplate3En';
import ResumeTemplate4En from '@/components/ResumeTemplate4En';
import ResumeTemplate1Ar from '@/components/ResumeTemplate1Ar';
import ResumeTemplate2Ar from '@/components/ResumeTemplate2Ar';
import ResumeTemplate3Ar from '@/components/ResumeTemplate3Ar';
import ResumeTemplate4Ar from '@/components/ResumeTemplate4Ar';
import { ResumeValues } from '@/lib/validation';
import { generateTemplateCode } from '@/lib/templateReferenceSystem';

interface TemplateSelectionPageProps {
  language: 'ar' | 'en';
}

interface TemplateOption {
  id: number;
  name: string;
  description: string;
  component: React.ComponentType<{ resumeData: ResumeValues; className?: string }>;
  features: string[];
}

export default function TemplateSelectionPage({ language }: TemplateSelectionPageProps) {
  // Sample resume data for preview
  const sampleResumeData: ResumeValues = {
    firstName: language === 'ar' ? 'أحمد' : 'John',
    lastName: language === 'ar' ? 'محمد' : 'Doe',
    jobTitle: language === 'ar' ? 'مطور برمجيات' : 'Software Developer',
    email: 'john.doe@example.com',
    phone: '+1 (555) 123-4567',
    city: language === 'ar' ? 'الرياض' : 'New York',
    country: language === 'ar' ? 'المملكة العربية السعودية' : 'United States',
    colorHex: '#3b82f6',
    sidebarColorHex: '#0E7490',
    borderStyle: 'squircle' as const,
    bulletStyle: 'bullet' as const,
    language: language,
    workExperiences: [
      {
        position: language === 'ar' ? 'مطور برمجيات' : 'Software Developer',
        company: 'Tech Corp',
        startDate: '2022-01-01',
        endDate: '2023-12-31',
        description: language === 'ar' 
          ? 'تطوير تطبيقات الويب باستخدام React و Node.js'
          : 'Developed web applications using React and Node.js'
      }
    ],
    educations: [
      {
        degree: language === 'ar' ? 'بكالوريوس علوم الحاسوب' : 'Bachelor of Computer Science',
        school: language === 'ar' ? 'جامعة الملك سعود' : 'University of Technology',
        startDate: '2018-09-01',
        endDate: '2022-05-31'
      }
    ],
    skills: language === 'ar' 
      ? ['React', 'Node.js', 'TypeScript', 'Python'] 
      : ['React', 'Node.js', 'TypeScript', 'Python'],
    userLanguages: language === 'ar' 
      ? ['العربية (اللغة الأم)', 'الإنجليزية (متقدم)'] 
      : ['English (Native)', 'Arabic (Advanced)']
  };

  const templates: TemplateOption[] = language === 'ar' ? [
    {
      id: 1,
      name: "القالب التقليدي",
      description: "تصميم كلاسيكي وأنيق مناسب لجميع المجالات",
      component: ResumeTemplate1Ar,
      features: ["تصميم بسيط وأنيق", "مناسب لجميع المجالات", "سهولة القراءة"]
    },
    {
      id: 2,
      name: "القالب الحديث",
      description: "تصميم عصري مع شريط جانبي ملون",
      component: ResumeTemplate2Ar,
      features: ["شريط جانبي ملون", "تصميم عصري", "عرض بصري جذاب"]
    },
    {
      id: 3,
      name: "القالب المهني",
      description: "تصميم عمودين مع صورة شخصية",
      component: ResumeTemplate3Ar,
      features: ["صورة شخصية", "تصميم عمودين", "تصميم مهني"]
    },
    {
      id: 4,
      name: "القالب الشامل",
      description: "تصميم شامل يدعم صفحات متعددة",
      component: ResumeTemplate4Ar,
      features: ["دعم صفحات متعددة", "تصميم شامل", "مناسب للخبرات الطويلة"]
    }
  ] : [
    {
      id: 1,
      name: "Classic Template",
      description: "Clean and professional design suitable for all fields",
      component: ResumeTemplate1En,
      features: ["Clean and simple design", "Suitable for all fields", "Easy to read"]
    },
    {
      id: 2,
      name: "Modern Template",
      description: "Contemporary design with colored sidebar",
      component: ResumeTemplate2En,
      features: ["Colored sidebar", "Modern design", "Visually appealing"]
    },
    {
      id: 3,
      name: "Professional Template",
      description: "Two-column layout with profile image",
      component: ResumeTemplate3En,
      features: ["Profile image", "Two-column layout", "Professional design"]
    },
    {
      id: 4,
      name: "Comprehensive Template",
      description: "Comprehensive design supporting multiple pages",
      component: ResumeTemplate4En,
      features: ["Multi-page support", "Comprehensive design", "Suitable for extensive experience"]
    }
  ];

  const getText = (arText: string, enText: string) => {
    return language === 'ar' ? arText : enText;
  };

  return (
    <main className="mx-auto w-full max-w-7xl space-y-6 md:space-y-8 px-3 md:px-4 py-6 md:py-8" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <Link href="/resumes" className="self-start md:self-auto">
          <Button variant="ghost" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            {getText("العودة إلى السير الذاتية", "العودة إلى السير الذاتية")}
          </Button>
        </Link>
        <div className="text-center">
          <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-[#5409DA] to-[#6b29ee] bg-clip-text text-transparent">
            {getText("اختر قالب السيرة الذاتية", "اختر قالب السيرة الذاتية")}
          </h1>
          <p className="text-muted-foreground mt-2 text-xs md:text-sm">
            {getText("اختر القالب الذي يناسبك", "اختر القالب الذي يناسبك")}
          </p>
        </div>
        <div className="hidden md:block w-24" /> {/* Spacer for centering - hidden on mobile */}
      </div>

      {/* Template Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 max-w-6xl mx-auto">
        {templates.map((template) => {
          const TemplateComponent = template.component;
          
          // Generate template code for URL parameter
          const templateLegacyPreference = template.id === 1 ? 'default' : 
                                         template.id === 2 ? 'alternative' : 
                                         template.id === 3 ? 'template3' : 'template4';
          const templateCode = generateTemplateCode(templateLegacyPreference, language);
          
          return (
            <Link 
              key={template.id} 
              href={`/editor?lang=${language}&templateCode=${templateCode}`}
            >
              <Card 
                className="cursor-pointer transition-all duration-300 hover:shadow-xl hover:border-[#4300FF]/50 hover:scale-[1.02]"
              >
                <CardContent className="p-4 md:p-6">
                  {/* Template Info Header */}
                  <div className="mb-3 md:mb-4">
                    <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-1 md:mb-2">
                      {template.name}
                    </h3>
                    <p className="text-gray-600 text-xs md:text-sm mb-2 md:mb-3">
                      {template.description}
                    </p>
                    <div className="flex flex-wrap gap-1 mb-3 md:mb-4">
                      {template.features.map((feature, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full"
                        >
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Template Preview */}
                  <div className="relative w-full h-[250px] md:h-[400px] bg-gray-50 rounded-lg overflow-hidden shadow-inner">
                    <div className={`w-full h-full ${
                      language === 'ar' && template.id === 3 
                        ? 'transform origin-top-right scale-[0.75] translate-x-4' 
                        : 'transform scale-[0.75] origin-top'
                    }`}>
                      <TemplateComponent 
                        resumeData={sampleResumeData} 
                        className="w-full h-full"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
    </main>
  );
} 