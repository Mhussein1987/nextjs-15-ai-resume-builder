import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { EditorFormProps } from "@/lib/types";
import { useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import useIsMobile from "@/hooks/useIsMobile";
import { cn } from "@/lib/utils";

export default function SkillsForm({
  resumeData,
  setResumeData,
  language = 'en',
}: EditorFormProps) {
  const isMobile = useIsMobile();
  
  // Convert skills array to string for display
  const skillsString = Array.isArray(resumeData.skills) 
    ? resumeData.skills.join(', ')
    : (resumeData.skills || '');

  const form = useForm<{ skills: string }>({
    defaultValues: {
      skills: skillsString,
    },
    mode: "onChange",
  });

  // Use useWatch to subscribe to form values
  const watchedValues = useWatch({ control: form.control });
  const { isValid } = form.formState;



  useEffect(() => {
    // Only update parent state if form is valid and values have actually changed
    if (isValid && watchedValues && Object.keys(watchedValues).length > 0) {
      const newSkillsString = watchedValues.skills || '';
      const currentSkillsString = skillsString;

      if (newSkillsString !== currentSkillsString) {
        // Convert string to array for storage
        const skillsArray = newSkillsString.split(',').map(s => s.trim()).filter(s => s);
        setResumeData((prevResumeData) => ({
          ...prevResumeData,
          skills: skillsArray,
        }));
      }
    }
  }, [watchedValues, isValid, setResumeData, skillsString]);

  // Reset form when resumeData changes
  useEffect(() => {
    const currentFormSkills = form.getValues("skills") || '';
    const newSkillsString = skillsString;

    if (currentFormSkills !== newSkillsString) {
      form.reset({
        skills: newSkillsString,
      });
    }
  }, [resumeData, form, skillsString]);

  return (
    <div className={cn(
      "mx-auto space-y-8 flex flex-col items-center",
      isMobile ? "max-w-full space-y-6 justify-center min-h-[60vh] px-6" : "max-w-2xl space-y-10 py-8"
    )} dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <div className={cn(
        "space-y-3 text-center",
        isMobile && "space-y-2"
      )}>
        <h2 className={cn(
          "text-3xl font-semibold",
          isMobile && "text-2xl"
        )}>
          المهارات
        </h2>
        <p className={cn(
          "text-base text-muted-foreground max-w-lg mx-auto",
          isMobile && "text-sm px-2"
        )}>
          أضف مهاراتك مفصولة بفواصل (مثال: JavaScript, React, Node.js)
        </p>
      </div>
      <Form {...form}>
        <form className={cn(
          "space-y-6 w-full",
          isMobile && "space-y-4 max-w-sm"
        )} dir={language === 'ar' ? 'rtl' : 'ltr'}>
          <FormField
            control={form.control}
            name="skills"
            render={({ field }) => (
              <FormItem className="space-y-3">
                {!isMobile && (
                  <FormLabel className="text-lg font-bold">
                    المهارات
                  </FormLabel>
                )}
                <FormControl>
                  <Input 
                    {...field} 
                    placeholder={isMobile ? "المهارات - مثال: JavaScript, React, تصميم المواقع" : "مثال: JavaScript, React, تصميم المواقع"}
                    className={cn(
                      "text-base h-12 px-4",
                      isMobile && "text-sm h-11 px-3"
                    )}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>
    </div>
  );
} 