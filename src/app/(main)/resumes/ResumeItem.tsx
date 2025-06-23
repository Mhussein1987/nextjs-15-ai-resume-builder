"use client";

import LoadingButton from "@/components/LoadingButton";
import ResumeTemplate1Ar from "@/components/ResumeTemplate1Ar";
import ResumeTemplate1En from "@/components/ResumeTemplate1En";
import ResumeTemplate2Ar from "@/components/ResumeTemplate2Ar";
import ResumeTemplate2En from "@/components/ResumeTemplate2En";
import ResumeTemplate3En from "@/components/ResumeTemplate3En";
import ResumeTemplate3Ar from "@/components/ResumeTemplate3Ar";
import ResumeTemplate4En from "@/components/ResumeTemplate4En";
import ResumeTemplate4Ar from "@/components/ResumeTemplate4Ar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { ResumeServerData } from "@/lib/types";
import { mapToResumeValues } from "@/lib/utils";
import { formatDate } from "date-fns";
import { MoreVertical, Trash2 } from "lucide-react";
import Link from "next/link";
import { useState, useTransition } from "react";
import { deleteResume } from "./actions";
import { useRouter } from "next/navigation";

interface ResumeItemProps {
  resume: ResumeServerData;
}

export default function ResumeItem({ resume }: ResumeItemProps) {
  const [uiLanguage, setUiLanguage] = useState<'ar' | 'en'>('ar');
  const isResumeArabic = resume.language === 'ar' || resume.language === 'ar-SA';
  
  // Debug: Log the resume data to see if colors are included
  console.log('ResumeItem - resume data:', {
    id: resume.id,
    colorHex: resume.colorHex,
    sidebarColorHex: resume.sidebarColorHex,
    templatePreference: resume.templatePreference,
    language: resume.language,
    updatedAt: resume.updatedAt
  });

  const wasUpdated = resume.updatedAt !== resume.createdAt;
  const useAltTemplate = resume.templatePreference === "alternative";
  const useTemplate3 = resume.templatePreference === "template3";
  const useTemplate4 = resume.templatePreference === "template4";

  const toggleLanguage = () => {
    setUiLanguage(uiLanguage === 'ar' ? 'en' : 'ar');
  };

  const getText = (arText: string, enText: string) => {
    return uiLanguage === 'ar' ? arText : enText;
  };

  const getTemplateDisplayName = (templatePreference: string) => {
    if (uiLanguage === 'ar') {
      switch (templatePreference) {
        case 'default': return 'القالب التقليدي';
        case 'alternative': return 'القالب الحديث';
        case 'template3': return 'القالب الاحترافي';
        case 'template4': return 'القالب الشامل';
        default: return templatePreference;
      }
    } else {
      switch (templatePreference) {
        case 'default': return 'Classic';
        case 'alternative': return 'Modern';
        case 'template3': return 'Professional';
        case 'template4': return 'Comprehensive';
        default: return templatePreference;
      }
    }
  };

  const getTemplateNumber = (templatePreference: string) => {
    switch (templatePreference) {
      case 'default': return 1;
      case 'alternative': return 2;
      case 'template3': return 3;
      case 'template4': return 4;
      default: return 1;
    }
  };

  return (
    <div 
      className="group relative rounded-lg border border-transparent bg-secondary p-2 md:p-3 transition-colors hover:border-border" 
      key={`${resume.id}-${resume.updatedAt.getTime()}`}
      dir={isResumeArabic ? "rtl" : "ltr"}
    >
      {/* Language Toggle Button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={toggleLanguage}
        className={`absolute z-10 opacity-60 transition-opacity hover:opacity-100 ${
          isResumeArabic ? 'right-1 md:right-2 top-1 md:top-2' : 'left-1 md:left-2 top-1 md:top-2'
        }`}
        title={getText("التبديل إلى الإنجليزية", "Switch to Arabic")}
      >
        <span className="text-xs font-medium">
          {uiLanguage === 'ar' ? 'EN' : 'عر'}
        </span>
      </Button>

      <div className={`absolute z-10 rounded-full bg-primary/10 px-1 md:px-2 py-1 text-xs font-medium text-primary opacity-80 group-hover:opacity-100 ${
        isResumeArabic ? 'right-1 md:right-2 bottom-1 md:bottom-2' : 'left-1 md:left-2 bottom-1 md:bottom-2'
      }`}>
        {getTemplateDisplayName(resume.templatePreference)}
      </div>
      
      <div className="space-y-2 md:space-y-3">
        <Link
          href={`/editor?resumeId=${resume.id}&lang=${resume.language === 'ar' || resume.language === 'ar-SA' ? 'ar' : 'en'}&template=${getTemplateNumber(resume.templatePreference)}`}
          className="inline-block w-full text-center"
        >
          <p className="line-clamp-1 font-semibold text-sm md:text-base">
            {resume.title || getText("بدون عنوان", "Untitled")}
          </p>
          {resume.description && (
            <p className="line-clamp-2 text-xs md:text-sm">{resume.description}</p>
          )}
          <p className="text-xs text-muted-foreground">
            {getText(
              `${wasUpdated ? "تم التحديث" : "تم الإنشاء"} في`,
              `${wasUpdated ? "Updated" : "Created"} on`
            )} {formatDate(resume.updatedAt, "MMM d, yyyy h:mm a")}
          </p>
        </Link>
        <Link
          href={`/editor?resumeId=${resume.id}&lang=${resume.language === 'ar' || resume.language === 'ar-SA' ? 'ar' : 'en'}&template=${getTemplateNumber(resume.templatePreference)}`}
          className="relative inline-block w-full"
        >
          <div
            className="w-full h-[150px] md:h-[200px] overflow-hidden rounded border bg-white"
            dir={isResumeArabic ? "rtl" : "ltr"}
          >
            <div className={`transform w-[400%] h-[400%] ${
              isResumeArabic 
                ? 'scale-[0.25] origin-top-right' 
                : 'scale-[0.25] origin-top-left'
            }`}>
              {useTemplate4 ? (
                // Template 4 - Use Arabic version for Arabic resumes, English for others
                isResumeArabic ? (
                  <ResumeTemplate4Ar
                    key={`${resume.id}-${resume.updatedAt.getTime()}-4ar`}
                    resumeData={mapToResumeValues(resume)}
                    className="shadow-sm transition-shadow group-hover:shadow-lg"
                  />
                ) : (
                  <ResumeTemplate4En
                    key={`${resume.id}-${resume.updatedAt.getTime()}-4en`}
                    resumeData={mapToResumeValues(resume)}
                    className="shadow-sm transition-shadow group-hover:shadow-lg"
                  />
                )
              ) : useTemplate3 ? (
                // Template 3 - Use Arabic version for Arabic resumes, English for others
                isResumeArabic ? (
                  <ResumeTemplate3Ar
                    key={`${resume.id}-${resume.updatedAt.getTime()}-3ar`}
                    resumeData={mapToResumeValues(resume)}
                    className="shadow-sm transition-shadow group-hover:shadow-lg"
                  />
                ) : (
                  <ResumeTemplate3En
                    key={`${resume.id}-${resume.updatedAt.getTime()}-3en`}
                    resumeData={mapToResumeValues(resume)}
                    className="shadow-sm transition-shadow group-hover:shadow-lg"
                  />
                )
              ) : isResumeArabic ? (
                useAltTemplate ? (
                  <ResumeTemplate2Ar
                    key={`${resume.id}-${resume.updatedAt.getTime()}-2ar`}
                    resumeData={mapToResumeValues(resume)}
                    className="shadow-sm transition-shadow group-hover:shadow-lg"
                  />
                ) : (
                  <ResumeTemplate1Ar
                    key={`${resume.id}-${resume.updatedAt.getTime()}-1ar`}
                    resumeData={mapToResumeValues(resume)}
                    className="shadow-sm transition-shadow group-hover:shadow-lg"
                  />
                )
              ) : (
                useAltTemplate ? (
                  <ResumeTemplate2En
                    key={`${resume.id}-${resume.updatedAt.getTime()}-2en`}
                    resumeData={mapToResumeValues(resume)}
                    className="shadow-sm transition-shadow group-hover:shadow-lg"
                  />
                ) : (
                  <ResumeTemplate1En
                    key={`${resume.id}-${resume.updatedAt.getTime()}-1en`}
                    resumeData={mapToResumeValues(resume)}
                    className="shadow-sm transition-shadow group-hover:shadow-lg"
                  />
                )
              )}
            </div>
          </div>
          <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-white to-transparent" />
        </Link>
      </div>
      <MoreMenu 
        resumeId={resume.id} 
        language={uiLanguage} 
      />
    </div>
  );
}

interface MoreMenuProps {
  resumeId: string;
  language: 'ar' | 'en';
}

function MoreMenu({ resumeId, language }: MoreMenuProps) {
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

  const getText = (arText: string, enText: string) => {
    return language === 'ar' ? arText : enText;
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className={`absolute z-10 opacity-60 transition-opacity hover:opacity-100 ${
            language === 'ar' ? 'left-1 md:left-2 top-1 md:top-2' : 'right-1 md:right-2 top-1 md:top-2'
          }`}
        >
          <MoreVertical className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align={language === 'ar' ? 'start' : 'end'}>
        <DropdownMenuItem
          className="text-destructive focus:text-destructive"
          onClick={() => setShowDeleteConfirmation(true)}
        >
          <Trash2 className={`h-4 w-4 ${language === 'ar' ? 'ml-2' : 'mr-2'}`} />
          {getText("حذف", "Delete")}
        </DropdownMenuItem>
      </DropdownMenuContent>
      <DeleteConfirmationDialog
        resumeId={resumeId}
        open={showDeleteConfirmation}
        onOpenChange={setShowDeleteConfirmation}
        language={language}
      />
    </DropdownMenu>
  );
}

interface DeleteConfirmationDialogProps {
  resumeId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  language: 'ar' | 'en';
}

function DeleteConfirmationDialog({
  resumeId,
  open,
  onOpenChange,
  language,
}: DeleteConfirmationDialogProps) {
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const router = useRouter();

  const getText = (arText: string, enText: string) => {
    return language === 'ar' ? arText : enText;
  };

  async function handleDelete() {
    console.log('Delete button clicked for resumeId:', resumeId);
    startTransition(async () => {
      try {
        await deleteResume(resumeId);
        console.log('Delete succeeded for resumeId:', resumeId);
        toast({
          title: getText("تم الحذف", "Deleted"),
          description: getText("تم حذف السيرة الذاتية بنجاح", "Resume deleted successfully"),
        });
        // Close the dialog and refresh the page
        onOpenChange(false);
        router.refresh();
      } catch (error) {
        console.error('Delete error:', error);
        toast({
          title: getText("خطأ", "Error"),
          description: getText("حدث خطأ أثناء حذف السيرة الذاتية", "Failed to delete resume"),
          variant: "destructive",
        });
      }
    });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {getText("تأكيد الحذف", "Confirm Delete")}
          </DialogTitle>
          <DialogDescription>
            {getText(
              "هل أنت متأكد أنك تريد حذف هذه السيرة الذاتية؟ لا يمكن التراجع عن هذا الإجراء.",
              "Are you sure you want to delete this resume? This action cannot be undone."
            )}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isPending}
          >
            {getText("إلغاء", "Cancel")}
          </Button>
          <LoadingButton
            variant="destructive"
            onClick={handleDelete}
            loading={isPending}
          >
            {getText("حذف", "Delete")}
          </LoadingButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}