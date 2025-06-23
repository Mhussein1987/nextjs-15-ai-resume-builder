"use client";

import useUnloadWarning from "@/hooks/useUnloadWarning";
import useIsMobile from "@/hooks/useIsMobile";
import { ResumeServerData } from "@/lib/types";
import { cn, mapToResumeValues } from "@/lib/utils";
import { ResumeValues } from "@/lib/validation";
import { useSearchParams } from "next/navigation";
import { useState, useCallback, useEffect, useMemo } from "react";
import Breadcrumbs from "./Breadcrumbs";
import Footer from "./Footer";
import FloatingNavigation from "./FloatingNavigation";
import { ResumePreviewSection } from "./ResumePreviewSection";
import { steps } from "./steps";
import useAutoSaveResume from "./useAutoSaveResume";

interface ResumeEditorProps {
  resumeToEdit: ResumeServerData | null;
  initialLanguage?: 'ar' | 'en';
  initialTemplate?: number;
}

export default function ResumeEditor({ resumeToEdit, initialLanguage, initialTemplate }: ResumeEditorProps) {
  const searchParams = useSearchParams();
  const isMobile = useIsMobile();

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

  // Get current language - prioritize resume's saved language, then initialLanguage, then default to English
  const currentLanguage: 'ar' | 'en' = (resumeData.language as 'ar' | 'en') || initialLanguage || 'en';

  // Language-specific text
  const getText = (language: 'ar' | 'en') => {
    return language === 'ar' ? {
      title: 'صمم سيرتك الذاتية',
      description: 'لطفا اتبع الخطوات التالية لإكمال سيرتك الذاتية. سيتم حفظ التغييرات بصورة اوتماتيكية'
    } : {
      title: 'Design Your Resume',
      description: 'Please follow the steps below to complete your resume. Changes will be saved automatically.'
    };
  };

  const uiText = getText(currentLanguage);

  // Check if we're on mobile preview step
  const isMobilePreviewStep = currentStep === 'mobile-preview';

  return (
    <div className="flex grow flex-col">
      {/* Hide header on mobile preview step */}
      {!isMobilePreviewStep && (
        <header className={cn(
          "space-y-1.5 border-b px-3 py-5 text-center bg-gray-50 dark:bg-secondary",
          isMobile && "px-4 py-4 space-y-1"
        )}>
          <h1 className={cn(
            "text-2xl font-bold bg-gradient-to-r from-[#5409DA] to-[#6b29ee] dark:from-white dark:to-white bg-clip-text text-transparent drop-shadow-sm",
            isMobile && "text-xl"
          )}>
            {uiText.title}
          </h1>
          <p className={cn(
            "text-sm text-muted-foreground",
            isMobile && "text-xs px-2"
          )}>
            {uiText.description}
          </p>
        </header>
      )}
      <main className="relative grow">
        <div className="absolute bottom-0 top-0 flex w-full">
          <ResumePreviewSection
            resumeData={resumeData}
            setResumeData={setResumeDataStable}
            language={currentLanguage}
            initialTemplate={initialTemplate}
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
              <div className={cn(
                "w-full",
                isMobile && "max-w-full"
              )}>
                <FormComponent
                  resumeData={resumeData}
                  setResumeData={setResumeDataStable}
                  language={currentLanguage}
                  onNext={isMobilePreviewStep ? handleNext : undefined}
                  onPrevious={isMobilePreviewStep ? handlePrevious : undefined}
                  hasNext={isMobilePreviewStep ? hasNext : undefined}
                  hasPrevious={isMobilePreviewStep ? hasPrevious : undefined}
                />
              </div>
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
        language={currentLanguage}
        steps={availableSteps}
        isSaving={isSaving}
        hasUnsavedChanges={hasUnsavedChanges}
      />
    </div>
  );
}
