"use client";

import useUnloadWarning from "@/hooks/useUnloadWarning";
import useIsMobile from "@/hooks/useIsMobile";
import { ResumeServerData } from "@/lib/types";
import { cn, mapToResumeValues } from "@/lib/utils";
import { ResumeValues } from "@/lib/validation";
import { useSearchParams, useRouter } from "next/navigation";
import { useState, useCallback, useEffect, useMemo, useRef } from "react";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import Breadcrumbs from "./Breadcrumbs";
import Footer from "./Footer";
import FloatingNavigation from "./FloatingNavigation";
import { ResumePreviewSection } from "./ResumePreviewSection";
import ResumeControls from "./ResumeControls";
import { steps } from "./steps";
import useAutoSaveResume from "./useAutoSaveResume";
import { 
  getTemplateFromUrl, 
  generateTemplateCode, 
  migrateLegacyTemplate,
  isValidTemplateCode 
} from "@/lib/templateReferenceSystem";

interface ResumeEditorProps {
  resumeToEdit: ResumeServerData | null;
  initialLanguage?: 'ar' | 'en';
}

export default function ResumeEditor({ resumeToEdit, initialLanguage }: ResumeEditorProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const isMobile = useIsMobile();
  const resumePreviewRef = useRef<HTMLDivElement>(null);
  const resumeContentRef = useRef<HTMLDivElement>(null);

  const [resumeData, setResumeData] = useState<ResumeValues>(() => 
    resumeToEdit ? mapToResumeValues(resumeToEdit) : {} as ResumeValues
  );

  const setResumeDataStable = useCallback((updater: React.SetStateAction<ResumeValues>) => {
    setResumeData((prev) => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      const hasChanged = JSON.stringify(prev) !== JSON.stringify(next);
      
      if (process.env.NODE_ENV === 'development' && hasChanged) {
        console.log('ResumeEditor - setResumeDataStable called with changes:', {
          prevKeys: Object.keys(prev).filter(key => prev[key as keyof ResumeValues] !== undefined),
          nextKeys: Object.keys(next).filter(key => next[key as keyof ResumeValues] !== undefined),
          changed: hasChanged
        });
      }
      
      return hasChanged ? next : prev;
    });
  }, []);

  const { isSaving, hasUnsavedChanges } = useAutoSaveResume(resumeData);

  // Filter steps based on device type
  const availableSteps = useMemo(() => {
    if (isMobile) {
      // On mobile, include all steps including mobile preview
      return steps;
    } else {
      // On desktop, exclude mobile preview step
      return steps.filter(step => step.key !== 'mobile-preview');
    }
  }, [isMobile]);

  // Debug logging for auto-save
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log('ResumeEditor - resumeData changed:', {
        id: resumeData.id,
        title: resumeData.title,
        firstName: resumeData.firstName,
        lastName: resumeData.lastName,
        email: resumeData.email,
        hasUnsavedChanges,
        isSaving
      });
    }
  }, [resumeData, hasUnsavedChanges, isSaving]);

  useUnloadWarning(hasUnsavedChanges);

  const currentStep = searchParams.get("step") || availableSteps[0].key;

  const setStep = useCallback((key: string) => {
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set("step", key);
    window.history.pushState(null, "", `?${newSearchParams.toString()}`);
  }, [searchParams]);

  const FormComponent = availableSteps.find(
    (step) => step.key === currentStep,
  )?.component;

  // Navigation logic for all steps on mobile
  const currentStepIndex = availableSteps.findIndex(step => step.key === currentStep);
  const hasNext = currentStepIndex < availableSteps.length - 1;
  const hasPrevious = currentStepIndex > 0;
  
  const handleNext = useCallback(() => {
    if (hasNext) {
      const nextStep = availableSteps[currentStepIndex + 1];
      setStep(nextStep.key);
    }
  }, [hasNext, currentStepIndex, availableSteps, setStep]);
  
  const handlePrevious = useCallback(() => {
    if (hasPrevious) {
      const previousStep = availableSteps[currentStepIndex - 1];
      setStep(previousStep.key);
    }
  }, [hasPrevious, currentStepIndex, availableSteps, setStep]);

  // Handle initial language selection for new resumes
  useEffect(() => {
    // Only set language-specific defaults for new resumes (no resumeToEdit)
    if (!resumeToEdit && initialLanguage) {
      setResumeData(prev => {
        // Only set defaults if the resume data is empty/minimal
        if (!prev.title && !prev.firstName && !prev.lastName) {
          const defaultData = initialLanguage === 'ar' ? {
            language: 'ar',
            // Arabic defaults can be added here if needed
          } : {
            language: 'en',
            // English defaults can be added here if needed
          };
          
          return {
            ...prev,
            ...defaultData,
          };
        }
        return prev;
      });
    }
  }, [resumeToEdit, initialLanguage]);

  // Handle template code from URL parameters
  useEffect(() => {
    const templateCodeParam = searchParams.get('templateCode');
    const templateParam = searchParams.get('template');
    
    if (templateCodeParam || templateParam) {
      setResumeData(prev => {
        let newTemplateCode = prev.templateCode;
        
        // Handle new template code system
        if (templateCodeParam && isValidTemplateCode(templateCodeParam)) {
          newTemplateCode = templateCodeParam;
        }
        // Handle legacy template parameter
        else if (templateParam) {
          const currentLanguage = (prev.language as 'ar' | 'en') || initialLanguage || 'en';
          newTemplateCode = getTemplateFromUrl(templateParam, currentLanguage);
        }
        
        // Also migrate existing templatePreference if no templateCode
        if (!newTemplateCode && prev.templatePreference) {
          const currentLanguage = (prev.language as 'ar' | 'en') || initialLanguage || 'en';
          newTemplateCode = migrateLegacyTemplate(prev.templatePreference, currentLanguage);
        }
        
        // Set default if still no template code
        if (!newTemplateCode) {
          const currentLanguage = (prev.language as 'ar' | 'en') || initialLanguage || 'en';
          newTemplateCode = generateTemplateCode('default', currentLanguage);
        }
        
        return {
          ...prev,
          templateCode: newTemplateCode
        };
      });
    }
  }, [searchParams, initialLanguage]);

  // Get current language - prioritize resume's saved language, then initialLanguage, then default to English
  const currentLanguage: 'ar' | 'en' = (resumeData.language as 'ar' | 'en') || initialLanguage || 'en';

  // Language-specific text - Always return Arabic labels while keeping LTR layout
  const getText = () => {
    // Always return Arabic labels while keeping LTR layout
    return {
      title: 'صمم سيرتك الذاتية',
      description: 'لطفا اتبع الخطوات التالية لإكمال سيرتك الذاتية. سيتم حفظ التغييرات بصورة اوتماتيكية'
    };
  };

  const uiText = getText();

  // Check if we're on mobile preview step
  const isMobilePreviewStep = currentStep === 'mobile-preview';

  return (
    <div className="flex grow flex-col">
      {/* Mobile Header with Close Button */}
      {isMobile && !isMobilePreviewStep && (
        <header className="flex items-center justify-between border-b px-4 py-3 bg-gray-50 dark:bg-secondary">
          <div className="flex-1 text-center">
            <h1 className="text-lg font-bold bg-gradient-to-r from-[#5409DA] to-[#6b29ee] dark:from-white dark:to-white bg-clip-text text-transparent">
              {uiText.title}
            </h1>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push('/resumes')}
            className="flex items-center gap-1 flex-shrink-0"
            title={currentLanguage === 'ar' ? 'إغلاق' : 'Close'}
          >
            <X className="w-4 h-4" />
            <span className="text-xs">
              {currentLanguage === 'ar' ? 'إغلاق' : 'Close'}
            </span>
          </Button>
        </header>
      )}
      
      {/* Desktop Header - Hide on mobile preview step */}
      {!isMobile && !isMobilePreviewStep && (
        <header className="border-b px-3 py-5 bg-gray-50 dark:bg-secondary">
          <div className="flex items-center justify-between">
            {/* Resume Controls moved 20% to the right */}
            <div className="flex-shrink-0 ml-[20%]">
              <ResumeControls
                resumeData={resumeData}
                setResumeData={setResumeDataStable}
                language={currentLanguage}
                resumeContentRef={resumeContentRef}
                className="bg-white dark:bg-gray-800 border rounded-lg px-4 py-2 shadow-sm"
              />
            </div>
            
            {/* Title and description in the center, moved 15% to the right */}
            <div className="flex-1 text-center ml-[15%]">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-[#5409DA] to-[#6b29ee] dark:from-white dark:to-white bg-clip-text text-transparent drop-shadow-sm">
                {uiText.title}
              </h1>
              <p className="text-sm text-muted-foreground">
                {uiText.description}
              </p>
            </div>
            
            {/* Empty space on the right for balance */}
            <div className="flex-shrink-0 w-[200px]"></div>
          </div>
        </header>
      )}
      <main className="relative grow">
        <div className="absolute bottom-0 top-0 flex w-full">
          <ResumePreviewSection
            ref={resumePreviewRef}
            resumeData={resumeData}
            setResumeData={setResumeDataStable}
            language={currentLanguage}
            resumeContentRef={resumeContentRef}
            className={cn(
              "hidden md:flex",
            )}
          />
          <div className="grow md:border-l" />
          <div
            className={cn(
              "w-full space-y-6 overflow-y-auto p-3 md:block md:w-1/2",
              isMobile && "p-4 space-y-4"
            )}
          >
            {/* Hide breadcrumbs on mobile preview step and on mobile devices */}
            {!isMobilePreviewStep && !isMobile && (
              <Breadcrumbs 
                currentStep={currentStep} 
                setCurrentStep={setStep} 
                language={currentLanguage}
                steps={availableSteps}
              />
            )}
            
            {FormComponent && (
              <FormComponent
                resumeData={resumeData}
                setResumeData={setResumeDataStable}
                language={currentLanguage}
                {...(currentStep === 'summary' && { resumePreviewRef })}
                {...(isMobile && {
                  onNext: handleNext,
                  onPrevious: handlePrevious,
                  hasNext,
                  hasPrevious,
                })}
              />
            )}
          </div>
        </div>
      </main>
      
      {/* Floating Navigation for Mobile */}
      {isMobile && (
        <FloatingNavigation
          onNext={handleNext}
          onPrevious={handlePrevious}
          hasNext={hasNext}
          hasPrevious={hasPrevious}
          language={currentLanguage}
        />
      )}
      
      <Footer
        currentStep={currentStep}
        setCurrentStep={setStep}
        steps={availableSteps}
        isSaving={isSaving}
        hasUnsavedChanges={hasUnsavedChanges}
        language={currentLanguage}
      />
    </div>
  );
}
