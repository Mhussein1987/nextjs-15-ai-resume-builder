import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { EditorFormProps } from "@/lib/types";
import { skillsSchema, SkillsValues } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm, useWatch } from "react-hook-form"; // Import useWatch

export default function SkillsForm({
  resumeData,
  setResumeData,
}: EditorFormProps) {
  const form = useForm<SkillsValues>({
    resolver: zodResolver(skillsSchema),
    defaultValues: {
      skills: resumeData.skills || [],
    },
    // Crucial: This ensures validation runs automatically on every change,
    // so you don't need to call form.trigger() manually inside the watch.
    mode: "onChange",
  });

  // 1. Efficiently watch the 'skills' field using useWatch.
  // This hook is optimized to re-render only this component when 'skills' change.
  const watchedSkills = useWatch({
    control: form.control,
    name: "skills", // Specify the field array name
  });

  // 2. Get the current validity status of the form.
  const { isValid } = form.formState;

  // 3. Effect to sync form array values to the parent's `resumeData`.
  // This effect will run whenever `watchedSkills` (form inputs) or `isValid` changes.
  useEffect(() => {
    // Only proceed if the form is currently valid and `watchedSkills` exists.
    if (isValid && watchedSkills) {
      // Process the skills: filter, trim, and filter again for empty strings.
      const processedSkills =
        watchedSkills
          .filter((skill) => skill !== undefined && skill !== null) // Ensure no undefined/null entries
          .map((skill) => skill.trim())
          .filter((skill) => skill !== "") || [];

      // Perform a deep comparison to avoid unnecessary state updates.
      // `JSON.stringify` works well for arrays of strings.
      if (
        JSON.stringify(processedSkills) !== JSON.stringify(resumeData.skills)
      ) {
        setResumeData((prevResumeData) => ({
          ...prevResumeData,
          skills: processedSkills, // Update with the new, valid, and processed skills
        }));
      }
    }
  }, [watchedSkills, isValid, setResumeData, resumeData.skills]); // Dependencies: watched skills array, validity, state setter, and current resumeData.skills for comparison.

  // 4. Effect to reset form default values if the parent's `resumeData` prop changes externally.
  // This is important if `resumeData` can be updated from a source outside this component.
  useEffect(() => {
    // Compare current form skills with the incoming `resumeData.skills` to decide if a reset is needed.
    const currentFormSkills = form.getValues("skills");
    if (
      JSON.stringify(currentFormSkills) !== JSON.stringify(resumeData.skills)
    ) {
      form.reset({
        skills: resumeData.skills || [],
      });
    }
  }, [resumeData.skills, form]); // Depend on the specific skills array prop and the form instance.

  return (
    <div className="mx-auto max-w-xl space-y-6" dir="rtl">
      <div className="space-y-1.5 text-center">
        <h2 className="text-2xl font-semibold">المهارات</h2>
        <p className="text-sm text-muted-foreground">اذكر جميع المهارات</p>
      </div>
      <Form {...form}>
        <form className="space-y-3" dir="rtl">
          <FormField
            control={form.control}
            name="skills"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="sr-only">المهارات</FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    placeholder="مثال: مايكروسوفت اوفيس, محاسبة, برنامج البيان ....."
                    className="min-h-[150px] resize-y"
                    rows={6}
                    value={Array.isArray(field.value) ? field.value.join(", ") : field.value}
                    onChange={(e) => {
                      const skills = e.target.value.split(",");
                      field.onChange(skills);
                    }}
                  />
                </FormControl>
                <FormDescription>
                  افصل كل مهارة بفاصلة ( , )
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>
    </div>
  );
}