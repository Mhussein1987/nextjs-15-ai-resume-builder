"use client";

import { useToast } from "@/hooks/use-toast";
import { ResumeServerData } from "@/lib/types";
import { mapToResumeValues } from "@/lib/utils";



import { Trash2 } from "lucide-react";
import Link from "next/link";
import React, { useState, useTransition } from "react";
import { 
  generateTemplateCode, 
  migrateLegacyTemplate, 
  getTemplateByCode, 
  getTemplateDisplayName as getTemplateDisplayNameFromCode
} from "@/lib/templateReferenceSystem";
import LoadingButton from "@/components/LoadingButton";
import ResumeTemplate1Ar from "@/components/ResumeTemplate1Ar";
import ResumeTemplate1En from "@/components/ResumeTemplate1En";
import ResumeTemplate2Ar from "@/components/ResumeTemplate2Ar";
import ResumeTemplate2En from "@/components/ResumeTemplate2En";
import ResumeTemplate4Ar from "@/components/ResumeTemplate4Ar";
import ResumeTemplate4En from "@/components/ResumeTemplate4En";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { deleteResume } from "./actions";
import { useRouter } from "next/navigation";

interface ResumeItemProps {
  resume: ResumeServerData;
}

export default function ResumeItem({ resume }: ResumeItemProps) {
  // Get template using new reference system
  const getTemplateInfo = () => {
    // Use templateCode if available, otherwise migrate from legacy system
    let templateCode = resume.templateCode;
    
    if (!templateCode && resume.templatePreference) {
      // Migrate from legacy system using the actual resume language
      const resumeLanguage = (resume.language as 'ar' | 'en') || 'ar';
      templateCode = migrateLegacyTemplate(resume.templatePreference, resumeLanguage);
    }
    
    if (!templateCode) {
      // Generate default template code using the actual resume language
      const resumeLanguage = (resume.language as 'ar' | 'en') || 'ar';
      templateCode = generateTemplateCode('default', resumeLanguage);
    }
    
    const template = getTemplateByCode(templateCode);
    const resumeLanguage = (resume.language as 'ar' | 'en') || 'ar';
    return {
      code: templateCode,
      number: template?.number || 1,
      displayName: getTemplateDisplayNameFromCode(templateCode, resumeLanguage),
      language: resumeLanguage
    };
  };
  
  const templateInfo = getTemplateInfo();
  
  // Debug: Log the resume data to see if colors are included
  console.log('ResumeItem - resume data:', {
    id: resume.id,
    colorHex: resume.colorHex,
    sidebarColorHex: resume.sidebarColorHex,
    templatePreference: resume.templatePreference,
    templateCode: resume.templateCode,
    language: resume.language,
    updatedAt: resume.updatedAt
  });



  return (
    <div 
      className="group relative rounded-lg border border-transparent bg-secondary p-2 md:p-3 transition-colors hover:border-border w-full max-w-md mx-auto md:max-w-none" 
      key={`${resume.id}-${resume.updatedAt.getTime()}`}
      dir="rtl"
    >
      {/* Main content with RTL flow - Right to Left layout */}
      <div className="flex flex-col md:flex-row-reverse gap-3 md:gap-4 h-auto">
        
        {/* Right Section: Resume Preview and Template Badge */}
        <div className="flex-1 relative md:w-1/2 lg:w-2/5">
          {/* Template Badge - positioned at top-right of preview */}
          <div className="absolute z-10 rounded-full bg-primary/10 px-2 py-1 text-xs font-medium text-primary opacity-80 group-hover:opacity-100 right-2 top-2">
            {templateInfo.displayName}
          </div>
          
          <Link
            href={`/editor?resumeId=${resume.id}&lang=${templateInfo.language}&templateCode=${templateInfo.code}`}
            className="relative inline-block w-full"
          >
            <div
              className="w-[150px] h-[200px] md:w-full md:h-[200px] overflow-hidden rounded border bg-white mx-auto"
              dir="rtl"
            >
              <div className="transform w-[400%] h-[400%] scale-[0.25] origin-top-right">
                {templateInfo.number === 4 ? (
                  templateInfo.language === 'ar' ? (
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
                ) : templateInfo.number === 2 ? (
                  templateInfo.language === 'ar' ? (
                    <ResumeTemplate2Ar
                      key={`${resume.id}-${resume.updatedAt.getTime()}-2ar`}
                      resumeData={mapToResumeValues(resume)}
                      className="shadow-sm transition-shadow group-hover:shadow-lg"
                    />
                  ) : (
                    <ResumeTemplate2En
                      key={`${resume.id}-${resume.updatedAt.getTime()}-2en`}
                      resumeData={mapToResumeValues(resume)}
                      className="shadow-sm transition-shadow group-hover:shadow-lg"
                    />
                  )
                ) : (
                  templateInfo.language === 'ar' ? (
                    <ResumeTemplate1Ar
                      key={`${resume.id}-${resume.updatedAt.getTime()}-1ar`}
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

        {/* Left Section: Resume Info and Actions */}
        <div className="flex-1 flex flex-col justify-between md:w-1/2 lg:w-3/5">
          {/* Resume Information */}
          <Link
            href={`/editor?resumeId=${resume.id}&lang=${templateInfo.language}&templateCode=${templateInfo.code}`}
            className="inline-block w-full px-3 py-2 text-right flex-1"
            dir="rtl"
          >
            {/* Resume Title - Arabic and RTL */}
            <p className="line-clamp-1 font-semibold text-base md:text-base leading-tight text-right">
              {resume.title || "بدون عنوان"}
            </p>
          </Link>

          {/* Delete Button Component */}
          <div className="border-t border-gray-100 pt-3 mt-3 relative z-50">
            <DeleteButton resumeId={resume.id} />
          </div>
        </div>
      </div>
    </div>
  );
}

function DeleteButton({ resumeId }: { resumeId: string }) {
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

  const handleDeleteClick = () => {
    setShowDeleteConfirmation(true);
  };

  return (
    <>
      <div className="flex justify-center gap-2 px-2" dir="rtl">
        {/* Delete Button */}
        <Button
          variant="destructive"
          size="icon"
          onClick={handleDeleteClick}
          type="button"
          className="w-8 h-8 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 border-0 shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-105 active:scale-95"
          title="حذف السيرة الذاتية"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
      
      <DeleteConfirmationDialog
        resumeId={resumeId}
        open={showDeleteConfirmation}
        onOpenChange={setShowDeleteConfirmation}
      />
    </>
  );
}

interface DeleteConfirmationDialogProps {
  resumeId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function DeleteConfirmationDialog({
  resumeId,
  open,
  onOpenChange,
}: DeleteConfirmationDialogProps) {
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const router = useRouter();

  async function handleDelete() {
    startTransition(async () => {
      try {
        await deleteResume(resumeId);
        toast({
          title: "تم الحذف",
          description: "تم حذف السيرة الذاتية بنجاح",
        });
        // Close the dialog and refresh the page
        onOpenChange(false);
        router.refresh();
      } catch (error) {
        console.error('Delete error:', error);
        toast({
          title: "خطأ",
          description: "حدث خطأ أثناء حذف السيرة الذاتية",
          variant: "destructive",
        });
      }
    });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent 
        className="sm:max-w-md"
        dir="rtl"
      >
        <DialogHeader className="text-right">
          <div className="ml-auto mr-0 mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-red-100 to-red-200">
            <Trash2 className="h-6 w-6 text-red-600" />
          </div>
          <DialogTitle className="text-xl font-semibold bg-gradient-to-r from-[#8e2de2] to-[#4a00e0] bg-clip-text text-transparent text-right font-bold">
            تأكيد الحذف
          </DialogTitle>
          <DialogDescription className="text-gray-600 mt-2 leading-relaxed text-right">
            هل أنت متأكد أنك تريد حذف هذه السيرة الذاتية؟ لا يمكن التراجع عن هذا الإجراء.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter 
          className="flex flex-col sm:flex-row gap-3 mt-6 sm:flex-row-reverse"
          dir="rtl"
        >
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isPending}
            className="w-full sm:w-auto border-gray-300 hover:bg-gray-50 font-medium"
          >
            إلغاء
          </Button>
          <LoadingButton
            onClick={handleDelete}
            loading={isPending}
            className="w-full sm:w-auto bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-200 font-medium"
          >
            حذف
          </LoadingButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}