"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { PlusSquare, Trash2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

interface CreateResumeButtonProps {
  canCreate: boolean;
}

export default function CreateResumeButton({
  canCreate,
}: CreateResumeButtonProps) {
  const [showLimitModal, setShowLimitModal] = useState(false);

  if (canCreate) {
    return (
      <Link href="/templates/select-language">
        <Button
          className="mx-auto flex w-fit gap-3 px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
          type="button"
          data-testid="create-resume-button"
        >
          <PlusSquare className="size-6" />
          سيرة ذاتية جديدة
        </Button>
      </Link>
    );
  }

  return (
    <>
      <Button
        onClick={() => setShowLimitModal(true)}
        className="mx-auto flex w-fit gap-3 px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
      >
        <PlusSquare className="size-6" />
        سيرة ذاتية جديدة
      </Button>

      <Dialog open={showLimitModal} onOpenChange={setShowLimitModal}>
        <DialogContent className="sm:max-w-md" dir="rtl">
          <DialogHeader className="text-right">
            <div className="ml-auto mr-0 mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-orange-100 to-orange-200">
              <Trash2 className="h-6 w-6 text-orange-600" />
            </div>
            <DialogTitle className="text-xl font-semibold bg-gradient-to-r from-[#8e2de2] to-[#4a00e0] bg-clip-text text-transparent text-right font-bold">
              وصلت للحد الأقصى
            </DialogTitle>
            <DialogDescription className="text-gray-600 mt-2 leading-relaxed text-right">
              يمكنك إنشاء 5 سير ذاتية كحد أقصى. لإنشاء سيرة ذاتية جديدة، يرجى حذف إحدى السير الذاتية الموجودة أولاً.
            </DialogDescription>
          </DialogHeader>
          <div className="mt-6 flex justify-center">
            <Button
              variant="outline"
              onClick={() => setShowLimitModal(false)}
              className="w-full sm:w-auto border-gray-300 hover:bg-gray-50 font-medium"
            >
              فهمت
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
