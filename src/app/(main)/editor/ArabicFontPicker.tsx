import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import usePremiumModal from "@/hooks/usePremiumModal";
import { canUseCustomizations } from "@/lib/permissions";
import { Type } from "lucide-react";
import { useState } from "react";
import { useSubscriptionLevel } from "../SubscriptionLevelProvider";

// Define Arabic fonts - both system fonts and Google Fonts
export const ARABIC_FONTS = {
  SYSTEM: "نظام افتراضي",
  ARIAL: "Arial",
  TAHOMA: "Tahoma", 
  TIMES: "Times New Roman",
  AMIRI: "Amiri",
  CAIRO: "Cairo",
  TAJAWAL: "Tajawal",
  CHANGA: "Changa",
  REEM_KUFI: "Reem Kufi",
  ALMARAI: "Almarai"
};

const arabicFonts = [
  {
    value: "system-ui, -apple-system, 'Segoe UI', 'Tahoma', 'Arial', sans-serif",
    label: ARABIC_FONTS.SYSTEM,
    isSystemFont: true
  },
  {
    value: "'Arial', sans-serif",
    label: ARABIC_FONTS.ARIAL,
    isSystemFont: true
  },
  {
    value: "'Tahoma', sans-serif",
    label: ARABIC_FONTS.TAHOMA,
    isSystemFont: true
  },
  {
    value: "'Times New Roman', serif",
    label: ARABIC_FONTS.TIMES,
    isSystemFont: true
  },
  {
    value: "var(--font-amiri), serif",
    label: ARABIC_FONTS.AMIRI,
    isSystemFont: false,
    googleFont: true
  },
  {
    value: "var(--font-cairo), sans-serif",
    label: ARABIC_FONTS.CAIRO,
    isSystemFont: false,
    googleFont: true
  },
  {
    value: "var(--font-tajawal), sans-serif", 
    label: ARABIC_FONTS.TAJAWAL,
    isSystemFont: false,
    googleFont: true
  },
  {
    value: "var(--font-changa), cursive",
    label: ARABIC_FONTS.CHANGA,
    isSystemFont: false,
    googleFont: true
  },
  {
    value: "var(--font-reem-kufi), cursive",
    label: ARABIC_FONTS.REEM_KUFI,
    isSystemFont: false,
    googleFont: true
  },
  {
    value: "var(--font-almarai), sans-serif",
    label: ARABIC_FONTS.ALMARAI,
    isSystemFont: false,
    googleFont: true
  }
];

interface ArabicFontPickerProps {
  selectedFont: string | undefined;
  onChange: (font: string) => void;
}

export default function ArabicFontPicker({ selectedFont, onChange }: ArabicFontPickerProps) {
  const subscriptionLevel = useSubscriptionLevel();
  const premiumModal = usePremiumModal();
  const [showPopover, setShowPopover] = useState(false);

  const handleFontSelect = (fontValue: string) => {
    if (!canUseCustomizations(subscriptionLevel)) {
      premiumModal.setOpen(true);
      return;
    }
    onChange(fontValue);
    setShowPopover(false);
  };

  return (
    <Popover open={showPopover} onOpenChange={setShowPopover}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          title="تغيير خط السيرة الذاتية"
          className="bg-white hover:bg-white/90 text-[#5409DA] border-[#5409DA] dark:border-border dark:bg-secondary dark:text-inherit"
          onClick={() => {
            if (!canUseCustomizations(subscriptionLevel)) {
              premiumModal.setOpen(true);
              return;
            }
            setShowPopover(true);
          }}
        >
          <Type className="size-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-64 p-2"
        align="end"
      >
        <div className="space-y-2">
          <div className="text-sm font-medium text-center mb-3" dir="rtl">
            اختيار خط السيرة الذاتية
          </div>
          <div className="max-h-64 overflow-y-auto space-y-1">
            {arabicFonts.map((font) => (
              <button
                key={font.value}
                onClick={() => handleFontSelect(font.value)}
                className={`
                  w-full px-3 py-2 text-right rounded-md border transition-colors
                  ${selectedFont === font.value 
                    ? 'bg-[#5409DA] text-white border-[#5409DA]' 
                    : 'bg-white hover:bg-gray-50 border-gray-200 text-gray-900'
                  }
                `}
                style={{ 
                  fontFamily: font.value,
                  fontSize: '14px',
                  direction: 'rtl'
                }}
                dir="rtl"
              >
                <div className="flex flex-col items-end">
                  <span className="font-medium">{font.label}</span>
                  <span className="text-xs opacity-75">
                    نموذج: السيرة الذاتية
                  </span>
                  {!font.isSystemFont && (
                    <span className="text-xs opacity-60">
                      خط جوجل
                    </span>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
