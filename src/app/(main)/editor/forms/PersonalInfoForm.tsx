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
import { useEffect, useRef, useCallback, useMemo } from "react";
import { useForm, useWatch } from "react-hook-form"; // Import useWatch
import useIsMobile from "@/hooks/useIsMobile";
import { cn } from "@/lib/utils";

export default function PersonalInfoForm({
  resumeData,
  setResumeData,
  language = 'en',
}: EditorFormProps) {
  const isMobile = useIsMobile();
  
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

  // Create a memoized version of the current resumeData personal info to avoid circular dependencies
  const currentPersonalInfo = useMemo(() => ({
    firstName: resumeData.firstName,
    lastName: resumeData.lastName,
    jobTitle: resumeData.jobTitle,
    city: resumeData.city,
    country: resumeData.country,
    phone: resumeData.phone,
    email: resumeData.email,
    photo: resumeData.photo instanceof File ? resumeData.photo : null,
  }), [
    resumeData.firstName,
    resumeData.lastName,
    resumeData.jobTitle,
    resumeData.city,
    resumeData.country,
    resumeData.phone,
    resumeData.email,
    resumeData.photo
  ]);

  // Stable update function to avoid recreating on every render
  const updateResumeData = useCallback((newData: PersonalInfoValues) => {
    setResumeData((prevResumeData) => ({
      ...prevResumeData,
      ...newData,
    }));
  }, [setResumeData]);

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

      // Check if the form data has actually changed compared to current resume data
      let hasChanged = false;
      for (const key of Object.keys(newPersonalInfoPart) as Array<keyof PersonalInfoValues>) {
        if (newPersonalInfoPart[key] !== currentPersonalInfo[key]) {
          hasChanged = true;
          break;
        }
      }

      if (hasChanged) {
        updateResumeData(newPersonalInfoPart);
      }
    }
  }, [watchedValues, isValid, currentPersonalInfo, updateResumeData]);

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
          المعلومات الشخصية
        </h2>
        <p className={cn(
          "text-sm text-muted-foreground",
          isMobile && "text-xs px-2"
        )}>
          يرجى إدخال معلوماتك الشخصية.
        </p>
      </div>
      <Form {...form}>
        <form className={cn(
          "space-y-3",
          isMobile && "space-y-4"
        )} dir={language === 'ar' ? 'rtl' : 'ltr'}>
          <FormField
            control={form.control}
            name="photo"
            render={({ field: { value, ...fieldValues } }) => (
              <FormItem>
                {!isMobile && (
                  <FormLabel className="font-bold">
                    صورتك الشخصية
                  </FormLabel>
                )}
                <div className={cn(
                  "flex items-center gap-2",
                  isMobile && "flex-col items-stretch gap-3"
                )}>
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
                      className={cn(
                        isMobile && "text-sm"
                      )}
                      placeholder={isMobile ? "صورتك الشخصية" : undefined}
                      data-photo-input
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
                    className={cn(
                      isMobile && "text-sm"
                    )}
                  >
                    حذف
                  </Button>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className={cn(
            "grid grid-cols-2 gap-3",
            isMobile && "grid-cols-1 gap-4"
          )}>
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  {!isMobile && (
                    <FormLabel className="font-bold">
                      الاسم الأول
                    </FormLabel>
                  )}
                  <FormControl>
                    <Input 
                      {...field} 
                      placeholder={isMobile ? "الاسم الأول" : undefined}
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
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  {!isMobile && (
                    <FormLabel className="font-bold">
                      اسم العائلة
                    </FormLabel>
                  )}
                  <FormControl>
                    <Input 
                      {...field} 
                      placeholder={isMobile ? "اسم العائلة" : undefined}
                      className={cn(
                        isMobile && "text-sm h-10"
                      )} 
                    />
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
                {!isMobile && (
                  <FormLabel className="font-bold">
                    المسمى الوظيفي
                  </FormLabel>
                )}
                <FormControl>
                  <Input 
                    {...field} 
                    placeholder={isMobile ? "المسمى الوظيفي" : undefined}
                    className={cn(
                      isMobile && "text-sm h-10"
                    )} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className={cn(
            "grid grid-cols-2 gap-3",
            isMobile && "grid-cols-1 gap-4"
          )}>
            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem>
                  {!isMobile && (
                    <FormLabel className="font-bold">
                      المدينة
                    </FormLabel>
                  )}
                  <FormControl>
                    <Input 
                      {...field} 
                      placeholder={isMobile ? "المدينة" : undefined}
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
              name="country"
              render={({ field }) => (
                <FormItem>
                  {!isMobile && (
                    <FormLabel className="font-bold">
                      البلد
                    </FormLabel>
                  )}
                  <FormControl>
                    <Input 
                      {...field} 
                      placeholder={isMobile ? "البلد" : undefined}
                      className={cn(
                        isMobile && "text-sm h-10"
                      )} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className={cn(
            "grid grid-cols-2 gap-3",
            isMobile && "grid-cols-1 gap-4"
          )}>
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  {!isMobile && (
                    <FormLabel className="font-bold">
                      رقم الهاتف
                    </FormLabel>
                  )}
                  <FormControl>
                    <Input 
                      {...field} 
                      placeholder={isMobile ? "رقم الهاتف" : undefined}
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
              name="email"
              render={({ field }) => (
                <FormItem>
                  {!isMobile && (
                    <FormLabel className="font-bold">
                      البريد الإلكتروني
                    </FormLabel>
                  )}
                  <FormControl>
                    <Input 
                      {...field} 
                      placeholder={isMobile ? "البريد الإلكتروني" : undefined}
                      className={cn(
                        isMobile && "text-sm h-10"
                      )} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </form>
      </Form>
    </div>
  );
}