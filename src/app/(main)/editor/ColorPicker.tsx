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

interface ColorPickerProps {
  color: Color | undefined;
  onChange: ColorChangeHandler;
  colors?: string[];
  language?: string;
}

// Enhanced color palette with more professional and Arabic-friendly colors
const DEFAULT_COLORS = [
  '#5409DA', // Primary purple
  '#1f2937', // Dark gray (professional)
  '#0F172A', // Slate 900
  '#374151', // Gray 700
  '#059669', // Emerald 600
  '#DC2626', // Red 600
  '#EA580C', // Orange 600
  '#CA8A04', // Yellow 600
  '#9333EA', // Violet 600
  '#C2410C', // Orange 700
  '#0891B2', // Cyan 600
  '#7C3AED', // Violet 700
  '#BE123C', // Rose 700
  '#047857', // Emerald 700
  '#1D4ED8', // Blue 700
  '#7C2D12', // Orange 900
  '#166534', // Green 800
  '#92400E', // Amber 800
  '#6B21A8', // Purple 800
  '#1E3A8A', // Blue 800
];

export default function ColorPicker({ color, onChange, colors = DEFAULT_COLORS, language }: ColorPickerProps) {
  const subscriptionLevel = useSubscriptionLevel();
  const premiumModal = usePremiumModal();
  const [showPopover, setShowPopover] = useState(false);

  // Arabic-friendly title
  const title = language === 'ar' ? 'تغيير لون السيرة الذاتية' : 'Change resume color';

  // Safe color extraction function (currently unused but kept for future use)
  // const getCurrentColor = (color: Color | undefined): string => {
  //   if (!color) return '#5409DA';
  //   if (typeof color === 'string') return color;
  //   if (typeof color === 'object' && 'hex' in color) return color.hex as string;
  //   if (typeof color === 'object' && 'r' in color) return `rgb(${color.r}, ${color.g}, ${color.b})`;
  //   if (typeof color === 'object' && 'h' in color) return `hsl(${color.h}, ${color.s * 100}%, ${color.l * 100}%)`;
  //   return '#5409DA';
  // };

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
          data-color-picker
        >
          لون الخط
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
              اختر لون السيرة الذاتية
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
              💡 اللون المختار سيظهر في العناوين والتفاصيل
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
