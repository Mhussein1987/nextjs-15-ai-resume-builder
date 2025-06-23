import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { EditorFormProps } from "@/lib/types";
import { useRouter } from "next/navigation";

interface FooterProps {
  currentStep: string;
  setCurrentStep: (step: string) => void;
  language?: 'ar' | 'en';
  steps: {
    title: string;
    titleEn: string;
    component: React.ComponentType<EditorFormProps>;
    key: string;
  }[];
  isSaving?: boolean;
  hasUnsavedChanges?: boolean;
}

export default function Footer({
  currentStep,
  setCurrentStep,
  language = 'en',
  steps,
  isSaving = false,
  hasUnsavedChanges = false,
}: FooterProps) {
  const router = useRouter();
  
  const previousStep = steps.find(
    (_, index) => steps[index + 1]?.key === currentStep,
  )?.key;

  const nextStep = steps.find(
    (_, index) => steps[index - 1]?.key === currentStep,
  )?.key;

  // Check if we're on mobile preview step
  const isMobilePreviewStep = currentStep === 'mobile-preview';

  return (
    <footer className="w-full" dir="rtl">
      {/* Navigation buttons positioned under the editor form */}
      {!isMobilePreviewStep && (
        <div className="border-t px-3 py-4 bg-gray-50 dark:bg-secondary">
          <div className="mx-auto max-w-7xl">
            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-3 md:gap-0">
              {/* Navigation buttons on the right */}
              <div className="hidden md:flex items-center gap-2 md:gap-3 justify-center md:justify-start">
                <Button
                  onClick={nextStep ? () => setCurrentStep(nextStep) : undefined}
                  disabled={!nextStep}
                  size="sm"
                  className="md:text-base"
                >
                  <span className="inline-flex items-center gap-1">
                    {language === 'ar' ? 'التالي' : 'Next'}
                    {language === 'ar' ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        className="w-4 h-4"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M15.75 19.5L8.25 12l7.5-7.5"
                        />
                      </svg>
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        className="w-4 h-4"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M8.25 4.5l7.5 7.5-7.5 7.5"
                        />
                      </svg>
                    )}
                  </span>
                </Button>
                <Button
                  variant="secondary"
                  onClick={
                    previousStep ? () => setCurrentStep(previousStep) : undefined
                  }
                  disabled={!previousStep}
                  size="sm"
                  className="md:text-base"
                >
                  <span className="inline-flex items-center gap-1">
                    {language === 'ar' ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        className="w-4 h-4"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M8.25 4.5l7.5 7.5-7.5 7.5"
                        />
                      </svg>
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        className="w-4 h-4"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M15.75 19.5L8.25 12l7.5-7.5"
                        />
                      </svg>
                    )}
                    {language === 'ar' ? 'السابق' : 'Previous'}
                  </span>
                </Button>
              </div>

              {/* Autosave status in the center */}
              <div className="flex items-center gap-2 text-xs md:text-sm justify-center">
                {isSaving && (
                  <div className="flex items-center gap-1 md:gap-2 text-blue-600 dark:text-blue-400">
                    <div className="w-3 h-3 md:w-4 md:h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                    <span>{language === 'ar' ? 'جاري الحفظ...' : 'Saving...'}</span>
                  </div>
                )}
                {!isSaving && hasUnsavedChanges && (
                  <div className="flex items-center gap-1 md:gap-2 text-amber-600 dark:text-amber-400">
                    <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-amber-600 rounded-full"></div>
                    <span>{language === 'ar' ? 'تغييرات غير محفوظة' : 'Unsaved changes'}</span>
                  </div>
                )}
                {!isSaving && !hasUnsavedChanges && (
                  <div className="flex items-center gap-1 md:gap-2 text-green-600 dark:text-green-400">
                    <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-green-600 rounded-full"></div>
                    <span>{language === 'ar' ? 'تم الحفظ' : 'All changes saved'}</span>
                  </div>
                )}
              </div>

              {/* Close button on the left */}
              <Button
                variant="outline"
                onClick={() => router.push('/resumes')}
                className="flex items-center gap-2 justify-center md:justify-start"
                size="sm"
              >
                <X className="w-4 h-4" />
                {language === 'ar' ? 'إغلاق' : 'Close'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </footer>
  );
}
