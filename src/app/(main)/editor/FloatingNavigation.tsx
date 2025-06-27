"use client";

import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface FloatingNavigationProps {
  onNext?: () => void;
  onPrevious?: () => void;
  hasNext?: boolean;
  hasPrevious?: boolean;
  language?: 'ar' | 'en';
}

export default function FloatingNavigation({
  onNext,
  onPrevious,
  hasNext = false,
  hasPrevious = false,
  language = 'en',
}: FloatingNavigationProps) {
  // Arabic layout: Previous on left, Next on right
  // English layout: Previous on left, Next on right
  const isArabic = language === 'ar';

  return (
    <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 md:hidden">
      <div className={`flex items-center gap-3 ${isArabic ? 'flex-row-reverse' : 'flex-row'}`}>
        {isArabic ? (
          <>
            {/* Arabic: Previous Button on left - points RIGHT for RTL flow */}
            <Button
              variant="secondary"
              size="icon"
              onClick={onPrevious}
              disabled={!hasPrevious}
              className="w-12 h-12 rounded-full shadow-lg bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
              title="السابق"
            >
              <ChevronRight className="w-5 h-5" />
            </Button>

            {/* Arabic: Next Button on right - points LEFT for RTL flow */}
            <Button
              size="icon"
              onClick={onNext}
              disabled={!hasNext}
              className="w-12 h-12 rounded-full shadow-lg bg-gradient-to-r from-[#5409DA] to-[#6b29ee] hover:from-[#4a08c4] hover:to-[#5f25d4]"
              title="التالي"
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>
          </>
        ) : (
          <>
            {/* English: Previous Button on left - points LEFT to go back in LTR */}
            <Button
              variant="secondary"
              size="icon"
              onClick={onPrevious}
              disabled={!hasPrevious}
              className="w-12 h-12 rounded-full shadow-lg bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
              title="Previous"
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>

            {/* English: Next Button on right - points RIGHT for LTR step flow */}
            <Button
              size="icon"
              onClick={onNext}
              disabled={!hasNext}
              className="w-12 h-12 rounded-full shadow-lg bg-gradient-to-r from-[#5409DA] to-[#6b29ee] hover:from-[#4a08c4] hover:to-[#5f25d4]"
              title="Next"
            >
              <ChevronRight className="w-5 h-5" />
            </Button>
          </>
        )}
      </div>
    </div>
  );
} 