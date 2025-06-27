import { EditorFormProps } from "@/lib/types";
import React from "react";
import { cn } from "@/lib/utils";

interface BreadcrumbsProps {
  currentStep: string;
  setCurrentStep: (step: string) => void;
  language?: 'ar' | 'en';
  steps: {
    title: string;
    titleEn: string;
    component: React.ComponentType<EditorFormProps>;
    key: string;
  }[];
}

export default function Breadcrumbs({
  currentStep,
  setCurrentStep,
  language = 'en',
  steps,
}: BreadcrumbsProps) {
  const currentStepIndex = steps.findIndex(step => step.key === currentStep);

  return (
    <div className="flex justify-center mb-8" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <div className="w-full max-w-4xl px-4">
        {/* Progress Bar */}
        <div className="relative mb-4">
          <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-[#5409DA] to-[#2563EB] transition-all duration-500 ease-out"
              style={{ width: `${((currentStepIndex + 1) / steps.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Step Dots and Labels */}
        <div className="flex justify-between items-start relative">
          {steps.map((step, index) => {
            const isActive = step.key === currentStep;
            const isCompleted = index < currentStepIndex;
            const isFuture = index > currentStepIndex;
            
            return (
              <div key={step.key} className="flex flex-col items-center relative flex-1">
                {/* Step Dot */}
                <button
                  onClick={() => setCurrentStep(step.key)}
                  className={cn(
                    "relative z-10 flex items-center justify-center w-8 h-8 rounded-full transition-all duration-300",
                    "focus:outline-none focus:ring-2 focus:ring-[#5409DA] focus:ring-offset-2",
                    "hover:scale-110",
                    isActive && [
                      "bg-gradient-to-r from-[#5409DA] to-[#2563EB] text-white shadow-lg",
                      "ring-4 ring-[#5409DA] ring-opacity-30"
                    ],
                    isCompleted && [
                      "bg-gradient-to-r from-[#10B981] to-[#059669] text-white shadow-md"
                    ],
                    isFuture && [
                      "bg-white border-2 border-gray-300 text-gray-400",
                      "hover:border-[#5409DA] hover:text-[#5409DA]"
                    ]
                  )}
                >
                  {isCompleted ? (
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <span className="text-xs font-bold">{index + 1}</span>
                  )}
                </button>

                {/* Step Label */}
                <div className="mt-2 text-center max-w-20">
                  <span className={cn(
                    "text-xs font-medium transition-colors duration-200 block",
                    isActive && "text-[#5409DA] font-semibold",
                    isCompleted && "text-[#10B981]",
                    isFuture && "text-gray-500"
                  )}>
                    {step.title}
                  </span>
                </div>

                {/* Connection Line */}
                {index < steps.length - 1 && (
                  <div className="absolute top-4 left-1/2 w-full h-0.5 bg-gray-200 -z-10" />
                )}
              </div>
            );
          })}
        </div>

        {/* Current Step Indicator */}
        <div className="text-center mt-4">
          <span className="text-sm text-gray-600">
            الخطوة {currentStepIndex + 1} من {steps.length}
          </span>
        </div>
      </div>
    </div>
  );
}
