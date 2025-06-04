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
import { useForm, useWatch } from "react-hook-form"; // Import useWatch
import GenerateSummaryButton from "./GenerateSummaryButton";

const SummaryForm = memo(function SummaryForm({
  resumeData,
  setResumeData,
}: EditorFormProps) {
  const form = useForm<SummaryValues>({
    resolver: zodResolver(summarySchema),
    defaultValues: {
      summary: resumeData.summary || "",
    },
    mode: "onChange",
  });

  // 1. Watch the summary field with useWatch
  const watchedSummary = useWatch({
    control: form.control,
    name: "summary",
  });

  // 2. Get form validity status
  const { isValid } = form.formState;

  const handleSummaryChange = useCallback(
    (newSummary: string) => {
      setResumeData((prev) => {
        if (prev.summary === newSummary) return prev;
        return { ...prev, summary: newSummary };
      });
    },
    [setResumeData]
  );

  // 3. Sync form value to parent's resumeData
  useEffect(() => {
    if (!isValid) return;

    const trimmedSummary = watchedSummary?.trim() || "";
    const currentSummary = resumeData.summary?.trim() || "";

    if (trimmedSummary !== currentSummary) {
      handleSummaryChange(trimmedSummary);
    }
  }, [watchedSummary, isValid, handleSummaryChange, resumeData.summary]);

  // 4. Reset form if resumeData changes externally
  useEffect(() => {
    const currentValue = form.getValues("summary")?.trim() || "";
    const newValue = resumeData.summary?.trim() || "";

    if (currentValue !== newValue) {
      form.reset({ summary: resumeData.summary || "" });
    }
  }, [resumeData.summary, form]);

  const onSummaryGenerated = useCallback(
    (summary: string) => {
      form.setValue("summary", summary, { shouldValidate: true });
    },
    [form]
  );

  return (
    <div className="mx-auto max-w-xl space-y-6" dir="rtl">
      <div className="space-y-1.5 text-center">
        <h2 className="text-2xl font-semibold">الملف المهني</h2>
        <p className="text-sm text-muted-foreground">
          اكتب ملخص عن نفسك وخبراتك العملية.
        </p>
      </div>
      <Form {...form}>
        <form className="space-y-4" dir="rtl">
          <FormField
            control={form.control}
            name="summary"
            render={({ field }) => (
              <FormItem>
                <FormLabel>الملف المهني</FormLabel>
                <FormControl>
                  <Textarea
                    className="min-h-[150px] resize-y"
                    rows={6}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <GenerateSummaryButton
            resumeData={resumeData}
            onSummaryGenerated={onSummaryGenerated}
          />
        </form>
      </Form>
    </div>
  );
});

SummaryForm.displayName = "SummaryForm";

export default SummaryForm;