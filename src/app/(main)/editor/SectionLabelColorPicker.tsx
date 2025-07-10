import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import usePremiumModal from "@/hooks/usePremiumModal";
import { canUseCustomizations } from "@/lib/permissions";
import { useState } from "react";
import { Color, ColorChangeHandler, TwitterPicker } from "react-color";
import { useSubscriptionLevel } from "../SubscriptionLevelProvider";

interface SectionLabelColorPickerProps {
  color: Color | undefined;
  onChange: ColorChangeHandler;
  colors?: string[];
  language?: string;
}

// Professional colors for section labels
const SECTION_LABEL_COLORS = [
  '#1f2937', // Gray 800
  '#374151', // Gray 700
  '#4b5563', // Gray 600
  '#6b7280', // Gray 500
  '#000000', // Black
  '#1d4ed8', // Blue 700
  '#059669', // Emerald 600
  '#7c3aed', // Violet 600
  '#dc2626', // Red 600
  '#ea580c', // Orange 600
  '#ca8a04', // Yellow 600
  '#0891b2', // Cyan 600
  '#be123c', // Rose 700
  '#047857', // Emerald 700
  '#1e3a8a', // Blue 800
  '#6b21a8', // Purple 800
  '#166534', // Green 800
  '#92400e', // Amber 800
];

export default function SectionLabelColorPicker({ color, onChange, colors = SECTION_LABEL_COLORS, language }: SectionLabelColorPickerProps) {
  const subscriptionLevel = useSubscriptionLevel();
  const premiumModal = usePremiumModal();
  const [showPopover, setShowPopover] = useState(false);

  // Arabic-friendly title
  const title = language === 'ar' ? 'تغيير لون العناوين' : 'Change section label color';

  return (
    <Popover open={showPopover} onOpenChange={setShowPopover}>
      <PopoverTrigger asChild>
        <Button
          variant="default"
          size="sm"
          title={title}
          className="bg-gradient-to-r from-[#5409DA] to-[#2563EB] hover:from-[#4A08C4] hover:to-[#1D4ED8] text-white border-0 w-16 px-1"
          onClick={() => {
            if (!canUseCustomizations(subscriptionLevel)) {
              premiumModal.setOpen(true);
              return;
            }
            setShowPopover(true);
          }}
          data-section-label-color-picker
        >
          لون العناوين
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="border-none bg-transparent shadow-none p-0"
        align="end"
        side="right"
        sideOffset={8}
      >
        <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-2">
          {language === 'ar' && (
            <div className="text-xs text-gray-600 mb-2 text-right" dir="rtl">
              اختر لون عناوين الأقسام
            </div>
          )}
          {language === 'en' && (
            <div className="text-xs text-gray-600 mb-2 text-left">
              Choose section label color
            </div>
          )}
          <TwitterPicker 
            color={color} 
            onChange={onChange} 
            triangle="hide"
            colors={colors}
            styles={{
              default: {
                card: {
                  boxShadow: 'none',
                  border: 'none',
                  borderRadius: '8px',
                },
                triangle: {
                  display: 'none',
                },
                body: {
                  padding: '8px',
                },
              },
            }}
          />
          {language === 'ar' && (
            <div className="text-xs text-gray-500 mt-2 text-right" dir="rtl">
              💡 اللون المختار سيظهر في عناوين الأقسام
            </div>
          )}
          {language === 'en' && (
            <div className="text-xs text-gray-500 mt-2 text-left">
              💡 Selected color will appear in section labels
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
} 