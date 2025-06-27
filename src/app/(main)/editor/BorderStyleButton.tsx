import { Button } from "@/components/ui/button";
import usePremiumModal from "@/hooks/usePremiumModal";
import { canUseCustomizations } from "@/lib/permissions";
import { useEffect, useState } from "react";
import { useSubscriptionLevel } from "../SubscriptionLevelProvider";

export const BorderStyles = {
  SQUARE: "square",
  CIRCLE: "circle",
  SQUIRCLE: "squircle",
};

const borderStyles = Object.values(BorderStyles);

interface BorderStyleButtonProps {
  borderStyle: string | undefined;
  onChange: (borderStyle: string) => void;
}

export default function BorderStyleButton({
  borderStyle,
  onChange,
}: BorderStyleButtonProps) {
  const subscriptionLevel = useSubscriptionLevel();
  const premiumModal = usePremiumModal();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  function handleClick() {
    if (!canUseCustomizations(subscriptionLevel)) {
      premiumModal.setOpen(true);
      return;
    }

    // Default to squircle if borderStyle is undefined
    const currentBorderStyle = borderStyle || BorderStyles.SQUIRCLE;
    const currentIndex = borderStyles.indexOf(currentBorderStyle);
    const nextIndex = (currentIndex + 1) % borderStyles.length;
    onChange(borderStyles[nextIndex]);
  }

  // Don't render until mounted to prevent hydration mismatch
  if (!mounted) {
    return (
      <Button
        variant="default"
        size="sm"
        title="Change border style"
        className="bg-gradient-to-r from-[#5409DA] to-[#2563EB] hover:from-[#4A08C4] hover:to-[#1D4ED8] text-white border-0 w-16 px-1"
        disabled
      >
        شكل الصورة
      </Button>
    );
  }

  return (
    <Button
      variant="default"
      size="sm"
      title="Change border style"
      className="bg-gradient-to-r from-[#5409DA] to-[#2563EB] hover:from-[#4A08C4] hover:to-[#1D4ED8] text-white border-0 w-16 px-1"
      onClick={handleClick}
    >
      شكل الصورة
    </Button>
  );
}
