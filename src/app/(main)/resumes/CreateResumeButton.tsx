"use client";

import { Button } from "@/components/ui/button";
import usePremiumModal from "@/hooks/usePremiumModal";
import { PlusSquare } from "lucide-react";
import Link from "next/link";

interface CreateResumeButtonProps {
  canCreate: boolean;
}

export default function CreateResumeButton({
  canCreate,
}: CreateResumeButtonProps) {
  const premiumModal = usePremiumModal();

  if (canCreate) {
    return (
      <Button
        asChild
        className="mx-auto flex w-fit gap-2 bg-[#4300FF] hover:bg-[#4300FF]/90 text-white"
      >
        <Link href="/editor">
          <PlusSquare className="size-5" />
          سيرة ذاتية جديدة
        </Link>
      </Button>
    );
  }

  return (
    <Button
      onClick={() => premiumModal.setOpen(true)}
      className="mx-auto flex w-fit gap-2 bg-[#4300FF] hover:bg-[#4300FF]/90 text-white"
    >
      <PlusSquare className="size-5" />
      سيرة ذاتية جديدة
    </Button>
  );
}
