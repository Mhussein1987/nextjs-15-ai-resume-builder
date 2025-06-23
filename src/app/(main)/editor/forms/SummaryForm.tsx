import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { EditorFormProps } from "@/lib/types";
import { summarySchema, SummaryValues } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { memo, useCallback, useEffect } from "react";
import { useForm } from "react-hook-form";
import GenerateSummaryButton from "./GenerateSummaryButton";
import useIsMobile from "@/hooks/useIsMobile";
import { cn } from "@/lib/utils";

const SummaryForm = memo(function SummaryForm({
  resumeData,
  setResumeData,
  language = 'en',
}: EditorFormProps) {
  const isMobile = useIsMobile();
  
  const form = useForm<SummaryValues>({
    resolver: zodResolver(summarySchema),
    defaultValues: {
      summary: resumeData.summary || "",
    },
    mode: "onChange",
  });

  // Update form when resumeData changes
  useEffect(() => {
    form.setValue("summary", resumeData.summary || "");
  }, [resumeData.summary, form]);

  const handleSummaryChange = useCallback(
    (value: string) => {
      setResumeData((prev) => ({
        ...prev,
        summary: value,
      }));
    },
    [setResumeData]
  );

  const onSummaryGenerated = useCallback(
    (summary: string) => {
      form.setValue("summary", summary, { shouldValidate: true });
      handleSummaryChange(summary);
    },
    [form, handleSummaryChange]
  );

  return (
    <div className={cn(
      "mx-auto space-y-6",
      isMobile ? "max-w-full space-y-4" : "max-w-xl space-y-6"
    )} dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <div className={cn(
        "space-y-1.5 text-center",
        isMobile && "space-y-1"
      )}>
        <h2 className={cn(
          "text-2xl font-semibold",
          isMobile && "text-xl"
        )}>
          {language === 'ar' ? 'الملف المهني' : 'Professional Summary'}
        </h2>
        <p className={cn(
          "text-sm text-muted-foreground",
          isMobile && "text-xs px-2"
        )}>
          {language === 'ar' 
            ? 'اكتب ملخص عن نفسك وخبراتك العملية.'
            : 'Write a summary about yourself and your work experience.'
          }
        </p>
      </div>
      <Form {...form}>
        <form className={cn(
          "space-y-4",
          isMobile && "space-y-3"
        )} dir={language === 'ar' ? 'rtl' : 'ltr'}>
          <FormField
            control={form.control}
            name="summary"
            render={({ field }) => (
              <FormItem>
                <FormLabel className={cn(
                  isMobile && "text-sm"
                )}>
                  {language === 'ar' ? 'الملف المهني' : 'Professional Summary'}
                </FormLabel>
                <FormControl>
                  <Textarea
                    className={cn(
                      "min-h-[150px] resize-y",
                      isMobile && "min-h-[120px] text-sm"
                    )}
                    rows={isMobile ? 4 : 6}
                    placeholder={
                      language === 'ar' 
                        ? "اكتب ملخص عن خبراتك ومهاراتك..."
                        : "Write a summary about your experience and skills..."
                    }
                    {...field}
                    onChange={(e) => {
                      field.onChange(e);
                      handleSummaryChange(e.target.value);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <GenerateSummaryButton
            resumeData={resumeData}
            onSummaryGenerated={onSummaryGenerated}
            language={language}
          />
        </form>
      </Form>
    </div>
  );
});

SummaryForm.displayName = "SummaryForm";

export default SummaryForm;