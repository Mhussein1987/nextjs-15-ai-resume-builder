import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { EditorFormProps } from "@/lib/types";
import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

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
  return (
    <div className="flex justify-center" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <Breadcrumb>
        <BreadcrumbList>
          {steps.map((step) => (
            <React.Fragment key={step.key}>
              <BreadcrumbItem>
                {step.key === currentStep ? (
                  <BreadcrumbPage>
                    {language === 'ar' ? step.title : step.titleEn}
                  </BreadcrumbPage>
                ) : (
                  <BreadcrumbLink asChild>
                    <button onClick={() => setCurrentStep(step.key)}>
                      {language === 'ar' ? step.title : step.titleEn}
                    </button>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
              <BreadcrumbSeparator className="last:hidden">
                {language === 'ar' ? <ChevronLeft /> : <ChevronRight />}
              </BreadcrumbSeparator>
            </React.Fragment>
          ))}
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  );
}
