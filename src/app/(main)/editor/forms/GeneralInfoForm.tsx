import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { EditorFormProps } from "@/lib/types";
import { generalInfoSchema, GeneralInfoValues } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm, useWatch } from "react-hook-form"; // Import useWatch
import useIsMobile from "@/hooks/useIsMobile";
import { cn } from "@/lib/utils";

export default function GeneralInfoForm({
  resumeData,
  setResumeData,
  language = 'en',
}: EditorFormProps) {
  const isMobile = useIsMobile();
  const form = useForm<GeneralInfoValues>({
    resolver: zodResolver(generalInfoSchema),
    defaultValues: {
      title: resumeData.title || "",
      description: resumeData.description || "",
    },
    // Set mode to 'onChange' or 'onBlur' to trigger validation as user types/leaves field.
    // This makes form.trigger() inside watch redundant for "validity".
    mode: "onChange",
  });

  // Use useWatch to subscribe to all form values
  const watchedValues = useWatch({ control: form.control });
  const { isValid } = form.formState; // Get isValid from formState

  useEffect(() => {
    // Only update parent state if form is valid and values have actually changed
    // compared to the last state update. JSON.stringify is a quick way to compare
    // plain objects, but for complex objects, you might need a deep equality check.
    // Also, ensure `watchedValues` is not empty or initial render state.
    if (isValid && watchedValues && Object.keys(watchedValues).length > 0) {
      // Check if the current watched values are different from the ones in resumeData
      // to avoid unnecessary updates and potential loops.
      const newResumeDataPart = { ...watchedValues };
      const currentResumeDataPart = {
        title: resumeData.title,
        description: resumeData.description,
      };

      if (JSON.stringify(newResumeDataPart) !== JSON.stringify(currentResumeDataPart)) {
        setResumeData((prevResumeData) => ({
          ...prevResumeData,
          ...newResumeDataPart,
        }));
      }
    }
  }, [watchedValues, isValid, setResumeData, resumeData]); // Include resumeData for the comparison check

  // IMPORTANT: If you need to initialize `defaultValues` based on `resumeData`
  // when `resumeData` might change *after* the initial render of the component,
  // you might need an additional `useEffect` to `reset` the form.
  // This is typically for cases where the parent `resumeData` can be loaded or changed dynamically.
  // Otherwise, `defaultValues` is only used on the first render of `useForm`.
  useEffect(() => {
    // Only reset if resumeData has actual values and they are different from current form values
    // This helps re-populate the form if the parent's resumeData changes.
    if (resumeData && (resumeData.title !== form.getValues("title") || resumeData.description !== form.getValues("description"))) {
      form.reset({
        title: resumeData.title || "",
        description: resumeData.description || "",
      });
    }
  }, [resumeData, form]); // Depend on resumeData to re-initialize form when it changes


  return (
    <div className={cn(
      "mx-auto space-y-6",
      isMobile ? "max-w-full space-y-4 justify-center min-h-[60vh] px-6 flex flex-col items-center" : "max-w-xl space-y-6"
    )} dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <div className={cn(
        "space-y-1.5",
        isMobile ? "text-center space-y-1" : "text-center"
      )}>
        <h2 className={cn(
          "text-2xl font-semibold",
          isMobile && "text-xl"
        )}>
          معلومات عامة
        </h2>
        <p className={cn(
          "text-sm text-muted-foreground",
          isMobile && "text-xs px-2"
        )}>
          هذه المعلومات لن تظهر في السيرة الذاتية.
        </p>
      </div>
      <Form {...form}>
        <form className={cn(
          "space-y-3",
          isMobile && "space-y-4 w-full max-w-sm"
        )} dir={language === 'ar' ? 'rtl' : 'ltr'}>
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                {!isMobile && (
                  <FormLabel className="font-bold">
                    اسم المشروع
                  </FormLabel>
                )}
                <FormControl>
                  <Input 
                    {...field} 
                    placeholder={isMobile ? "اسم المشروع - مثال: سيرتي الذاتية" : "مثال: سيرتي الذاتية"}
                    autoFocus 
                    className={cn(
                      isMobile && "text-sm h-10"
                    )}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                {!isMobile && (
                  <FormLabel className="font-bold">
                    الوصف
                  </FormLabel>
                )}
                <FormControl>
                  <Input 
                    {...field} 
                    placeholder={isMobile ? "الوصف - مثال: سيرة ذاتية لوظيفة جديدة" : "مثال: سيرة ذاتية لوظيفة جديدة"}
                    className={cn(
                      isMobile && "text-sm h-10"
                    )}
                  />
                </FormControl>
                {!isMobile && (
                  <FormDescription>
                    اكتب وصفاً لهذا المشروع.
                  </FormDescription>
                )}
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>
    </div>
  );
}