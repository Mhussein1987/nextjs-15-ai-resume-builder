import { Button } from "@/components/ui/button";
import usePremiumModal from "@/hooks/usePremiumModal";
import { canUseCustomizations } from "@/lib/permissions";
import { Circle, Square, Squircle } from "lucide-react";
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
        variant="outline"
        size="icon"
        title="Change border style"
        className="bg-white hover:bg-white/90 text-[#5409DA] border-[#5409DA] dark:border-border dark:bg-secondary dark:text-inherit"
        disabled
      >
        <Squircle className="size-5" />
      </Button>
    );
  }

  const Icon =
    borderStyle === BorderStyles.SQUARE
      ? Square
      : borderStyle === BorderStyles.CIRCLE
        ? Circle
        : Squircle; // Default to Squircle for undefined or squircle

  return (
    <Button
      variant="outline"
      size="icon"
      title="Change border style"
      className="bg-white hover:bg-white/90 text-[#5409DA] border-[#5409DA] dark:border-border dark:bg-secondary dark:text-inherit"
      onClick={handleClick}
    >
      <Icon className="size-5" />
    </Button>
  );
}
