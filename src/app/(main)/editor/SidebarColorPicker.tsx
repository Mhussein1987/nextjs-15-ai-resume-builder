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

interface SidebarColorPickerProps {
  color: Color | undefined;
  onChange: ColorChangeHandler;
  colors?: string[];
  language?: string;
}

// Professional & Modern color palette
const PROFESSIONAL_COLORS = [
  '#0E7490', // Default - Dark Cyan (keep as first)
  '#1F2A44', // Navy Blue
  '#2E2E2E', // Charcoal Gray
  '#0E4D4D', // Deep Teal
  '#37474F', // Slate
];

// Warm & Approachable color palette
const WARM_COLORS = [
  '#3E2723', // Chocolate Brown
  '#4E2A2A', // Deep Maroon
  '#5C4033', // Muted Rust
  '#3B4D3B', // Olive Green
];

// Cool & Creative color palette
const CREATIVE_COLORS = [
  '#2C3E50', // Midnight Blue
  '#3F51B5', // Indigo
  '#1B5E20', // Forest Green
];

// Minimalist Monochrome color palette
const MONOCHROME_COLORS = [
  '#212121', // Graphite
  '#1C1C1C', // Soft Black
  '#263238', // Muted Navy
  '#4A4A4A', // Ash Gray
];

// Combined color palette for the picker
const LIGHT_SIDEBAR_COLORS = [
  ...PROFESSIONAL_COLORS,
  ...WARM_COLORS,
  ...CREATIVE_COLORS,
  ...MONOCHROME_COLORS,
];

export default function SidebarColorPicker({ color, onChange, colors = LIGHT_SIDEBAR_COLORS, language }: SidebarColorPickerProps) {
  const subscriptionLevel = useSubscriptionLevel();
  const premiumModal = usePremiumModal();
  const [showPopover, setShowPopover] = useState(false);

  // Arabic-friendly title
  const title = language === 'ar' ? 'تغيير لون خلفية الشريط الجانبي' : 'Change sidebar background color';

  // Safe color extraction function (currently unused but kept for future use)
  // const getCurrentColor = (color: Color | undefined): string => {
  //   if (!color) return '#0E7490'; // Default sidebar color for templates 2, 3, 4
  //   if (typeof color === 'string') return color;
  //   if (typeof color === 'object' && 'hex' in color) return color.hex as string;
  //   if (typeof color === 'object' && 'r' in color) return `rgb(${color.r}, ${color.g}, ${color.b})`;
  //   if (typeof color === 'object' && 'h' in color) return `hsl(${color.h}, ${color.s * 100}%, ${color.l * 100}%)`;
  //   return '#0E7490';
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
          data-sidebar-color-picker
        >
          لون الخلفية
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
              اختر لون خلفية الشريط الجانبي
            </div>
          )}
          {language === 'en' && (
            <div className="text-xs text-gray-600 mb-2 text-left">
              Choose sidebar background color
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
              💡 اللون المختار سيظهر كخلفية للشريط الجانبي
            </div>
          )}
          {language === 'en' && (
            <div className="text-xs text-gray-500 mt-2 text-left">
              💡 Selected color will appear as sidebar background
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
