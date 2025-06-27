import { Button } from "@/components/ui/button";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { EditorFormProps } from "@/lib/types";
import { useRouter } from "next/navigation";

interface FooterProps {
  currentStep: string;
  setCurrentStep: (step: string) => void;
  steps: {
    title: string;
    titleEn: string;
    component: React.ComponentType<EditorFormProps>;
    key: string;
  }[];
  isSaving?: boolean;
  hasUnsavedChanges?: boolean;
  language?: 'ar' | 'en';
}

export default function Footer({
  currentStep,
  setCurrentStep,
  steps,
  isSaving = false,
  hasUnsavedChanges = false,
  language = 'en',
}: FooterProps) {
  const router = useRouter();
  const isArabic = language === 'ar';
  
  const previousStep = steps.find(
    (_, index) => steps[index + 1]?.key === currentStep,
  )?.key;

  const nextStep = steps.find(
    (_, index) => steps[index - 1]?.key === currentStep,
  )?.key;

  // Check if we're on mobile preview step
  const isMobilePreviewStep = currentStep === 'mobile-preview';

  // Language-specific text
  const getText = () => {
    if (isArabic) {
      return {
        next: 'التالي',
        previous: 'السابق',
        close: 'إغلاق',
        saving: 'جاري الحفظ...',
        unsavedChanges: 'تغييرات غير محفوظة',
        saved: 'تم الحفظ'
      };
    } else {
      return {
        next: 'Next',
        previous: 'Previous',
        close: 'Close',
        saving: 'Saving...',
        unsavedChanges: 'Unsaved changes',
        saved: 'Saved'
      };
    }
  };

  const text = getText();

  return (
    <footer className="w-full" dir={isArabic ? 'rtl' : 'ltr'}>
      {/* Navigation buttons positioned under the editor form */}
      {!isMobilePreviewStep && (
        <div className="border-t px-3 py-4 bg-gray-50 dark:bg-secondary">
          <div className="mx-auto max-w-7xl">
            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-3 md:gap-0">
              {isArabic ? (
                <>
                  {/* Arabic: Navigation buttons on right, Close on left */}
                  <div className="hidden md:flex items-center gap-2 md:gap-3 justify-center md:justify-start">
                    {/* Arabic RTL: Previous button on left, Next button on right */}
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
                        <ChevronRight className="w-4 h-4" />
                        {text.previous}
                      </span>
                    </Button>
                    <Button
                      onClick={nextStep ? () => setCurrentStep(nextStep) : undefined}
                      disabled={!nextStep}
                      size="sm"
                      className="md:text-base"
                    >
                      <span className="inline-flex items-center gap-1">
                        {text.next}
                        <ChevronLeft className="w-4 h-4" />
                      </span>
                    </Button>
                  </div>

                  {/* Autosave status in the center */}
                  <div className="flex items-center gap-2 text-xs md:text-sm justify-center">
                    {isSaving && (
                      <div className="flex items-center gap-1 md:gap-2 text-blue-600 dark:text-blue-400">
                        <div className="w-3 h-3 md:w-4 md:h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                        <span>{text.saving}</span>
                      </div>
                    )}
                    {!isSaving && hasUnsavedChanges && (
                      <div className="flex items-center gap-1 md:gap-2 text-amber-600 dark:text-amber-400">
                        <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-amber-600 rounded-full"></div>
                        <span>{text.unsavedChanges}</span>
                      </div>
                    )}
                    {!isSaving && !hasUnsavedChanges && (
                      <div className="flex items-center gap-1 md:gap-2 text-green-600 dark:text-green-400">
                        <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-green-600 rounded-full"></div>
                        <span>{text.saved}</span>
                      </div>
                    )}
                  </div>

                  {/* Close button - Hide on mobile */}
                  <Button
                    variant="outline"
                    onClick={() => router.push('/resumes')}
                    className="hidden md:flex items-center gap-2 justify-center md:justify-start"
                    size="sm"
                  >
                    <X className="w-4 h-4" />
                    {text.close}
                  </Button>
                </>
              ) : (
                <>
                  {/* English: Close button on left, Navigation buttons on right - Hide on mobile */}
                  <Button
                    variant="outline"
                    onClick={() => router.push('/resumes')}
                    className="hidden md:flex items-center gap-2 justify-center md:justify-start"
                    size="sm"
                  >
                    <X className="w-4 h-4" />
                    {text.close}
                  </Button>

                  {/* Autosave status in the center */}
                  <div className="flex items-center gap-2 text-xs md:text-sm justify-center">
                    {isSaving && (
                      <div className="flex items-center gap-1 md:gap-2 text-blue-600 dark:text-blue-400">
                        <div className="w-3 h-3 md:w-4 md:h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                        <span>{text.saving}</span>
                      </div>
                    )}
                    {!isSaving && hasUnsavedChanges && (
                      <div className="flex items-center gap-1 md:gap-2 text-amber-600 dark:text-amber-400">
                        <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-amber-600 rounded-full"></div>
                        <span>{text.unsavedChanges}</span>
                      </div>
                    )}
                    {!isSaving && !hasUnsavedChanges && (
                      <div className="flex items-center gap-1 md:gap-2 text-green-600 dark:text-green-400">
                        <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-green-600 rounded-full"></div>
                        <span>{text.saved}</span>
                      </div>
                    )}
                  </div>

                  {/* Navigation buttons on right */}
                  <div className="hidden md:flex items-center gap-2 md:gap-3 justify-center md:justify-end">
                    {/* English LTR: Previous button on left, Next button on right */}
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
                        <ChevronLeft className="w-4 h-4" />
                        {text.previous}
                      </span>
                    </Button>
                    <Button
                      onClick={nextStep ? () => setCurrentStep(nextStep) : undefined}
                      disabled={!nextStep}
                      size="sm"
                      className="md:text-base"
                    >
                      <span className="inline-flex items-center gap-1">
                        {text.next}
                        <ChevronRight className="w-4 h-4" />
                      </span>
                    </Button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </footer>
  );
}
