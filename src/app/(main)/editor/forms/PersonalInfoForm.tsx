import { Button } from "@/components/ui/button";
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
import { personalInfoSchema, PersonalInfoValues } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useRef } from "react";
import { useForm, useWatch } from "react-hook-form"; // Import useWatch

export default function PersonalInfoForm({
  resumeData,
  setResumeData,
}: EditorFormProps) {
  const form = useForm<PersonalInfoValues>({
    resolver: zodResolver(personalInfoSchema),
    defaultValues: {
      firstName: resumeData.firstName || "",
      lastName: resumeData.lastName || "",
      jobTitle: resumeData.jobTitle || "",
      city: resumeData.city || "",
      country: resumeData.country || "",
      phone: resumeData.phone || "",
      email: resumeData.email || "",
      // Initialize photo default value:
      // If resumeData.photo is a File, use it. Otherwise, use null (as file inputs don't display URLs).
      photo: resumeData.photo instanceof File ? resumeData.photo : null,
    },
    mode: "onChange",
  });

  const watchedValues = useWatch({ control: form.control });
  const { isValid } = form.formState;

  useEffect(() => {
    if (isValid && watchedValues) {
      const newPersonalInfoPart: PersonalInfoValues = {
        firstName: watchedValues.firstName,
        lastName: watchedValues.lastName,
        jobTitle: watchedValues.jobTitle,
        city: watchedValues.city,
        country: watchedValues.country,
        phone: watchedValues.phone,
        email: watchedValues.email,
        photo: watchedValues.photo, // watchedValues.photo will correctly be File | null | undefined
      };

      // Create a comparison object from the current `resumeData` for relevant fields.
      // Explicitly handle `resumeData.photo` to match `PersonalInfoValues` type.
      const currentPersonalInfoPart: PersonalInfoValues = {
        firstName: resumeData.firstName,
        lastName: resumeData.lastName,
        jobTitle: resumeData.jobTitle,
        city: resumeData.city,
        country: resumeData.country,
        phone: resumeData.phone,
        email: resumeData.email,
        // If resumeData.photo is a File, use it. If it's null, use null. If it's a string, treat as null for comparison.
        photo: resumeData.photo instanceof File ? resumeData.photo : null,
      };

      let hasChanged = false;
      for (const key of Object.keys(newPersonalInfoPart) as Array<keyof PersonalInfoValues>) {
        if (newPersonalInfoPart[key] !== currentPersonalInfoPart[key]) {
          hasChanged = true;
          break;
        }
      }

      if (hasChanged) {
        setResumeData((prevResumeData) => ({
          ...prevResumeData,
          ...newPersonalInfoPart,
        }));
      }
    }
  }, [watchedValues, isValid, setResumeData, resumeData]);

  useEffect(() => {
    const currentFormValues = form.getValues();

    // Prepare resumeData.photo for comparison to match currentFormValues.photo type
    const resumePhotoForComparison = resumeData.photo instanceof File ? resumeData.photo : null;

    const needsReset =
      resumeData.firstName !== currentFormValues.firstName ||
      resumeData.lastName !== currentFormValues.lastName ||
      resumeData.jobTitle !== currentFormValues.jobTitle ||
      resumeData.city !== currentFormValues.city ||
      resumeData.country !== currentFormValues.country ||
      resumeData.phone !== currentFormValues.phone ||
      resumeData.email !== currentFormValues.email ||
      // Compare the processed resumeData.photo with currentFormValues.photo
      resumePhotoForComparison !== currentFormValues.photo;

    if (needsReset) {
      form.reset({
        firstName: resumeData.firstName || "",
        lastName: resumeData.lastName || "",
        jobTitle: resumeData.jobTitle || "",
        city: resumeData.city || "",
        country: resumeData.country || "",
        phone: resumeData.phone || "",
        email: resumeData.email || "",
        // When resetting, if resumeData.photo is a string, set form photo to null
        photo: resumeData.photo instanceof File ? resumeData.photo : null,
      });

      if (resumeData.photo === null && photoInputRef.current) {
        photoInputRef.current.value = "";
      }
    }
  }, [resumeData, form]);

  const photoInputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="mx-auto max-w-xl space-y-6" dir="rtl">
      <div className="space-y-1.5 text-center">
        <h2 className="text-2xl font-semibold">المعلومات الشخصية</h2>
        <p className="text-sm text-muted-foreground">يرجى إدخال معلوماتك الشخصية.</p>
      </div>
      <Form {...form}>
        <form className="space-y-3" dir="rtl">
          <FormField
            control={form.control}
            name="photo"
            render={({ field: { value, ...fieldValues } }) => (
              <FormItem>
                <FormLabel>صورتك الشخصية</FormLabel>
                <div className="flex items-center gap-2">
                  <FormControl>
                    <Input
                      {...fieldValues}
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        fieldValues.onChange(file);
                      }}
                      ref={photoInputRef}
                    />
                  </FormControl>
                  <Button
                    variant="secondary"
                    type="button"
                    onClick={() => {
                      fieldValues.onChange(null);
                      if (photoInputRef.current) {
                        photoInputRef.current.value = "";
                      }
                    }}
                  >
                    حذف
                  </Button>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="grid grid-cols-2 gap-3">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>الاسم الأول</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>اسم العائلة</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="jobTitle"
            render={({ field }) => (
              <FormItem>
                <FormLabel>المسمى الوظيفي</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="grid grid-cols-2 gap-3">
            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>المدينة</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="country"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>الدولة</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>رقم الهاتف</FormLabel>
                <FormControl>
                  <Input {...field} type="tel" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>البريد الإلكتروني</FormLabel>
                <FormControl>
                  <Input {...field} type="email" />
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