"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Plus, X } from "lucide-react";
import { useForm, useFieldArray, useWatch } from "react-hook-form";
import { EditorFormProps } from "@/lib/types";
import useIsMobile from "@/hooks/useIsMobile";
import { cn } from "@/lib/utils";

// Use { name: string, proficiency: string }[] for react-hook-form, map to string[] for resumeData
interface LanguageItem {
  name: string;
  proficiency: string;
}

export default function LanguagesForm({ resumeData, setResumeData, language = 'en' }: EditorFormProps) {
  const isMobile = useIsMobile();
  
  // Always Arabic
  const initialLanguages: LanguageItem[] = (resumeData.userLanguages || []).map((lang) => {
    const match = lang.match(/(.*?)\s*\((.*?)\)$/);
    return {
      name: match ? match[1].trim() : lang,
      proficiency: match ? match[2].trim() : (language === 'ar' ? "متوسط" : "Intermediate")
    };
  });

  const form = useForm<{ userLanguages: LanguageItem[] }>({
    defaultValues: {
      userLanguages: initialLanguages.length > 0 ? initialLanguages : [{ name: "", proficiency: "" }],
    },
    mode: "onChange",
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "userLanguages",
  });

  // Use useWatch to subscribe to changes in the languages array
  const watchedLanguages = useWatch({ control: form.control, name: "userLanguages" });
  const { isValid } = form.formState;

  React.useEffect(() => {
    // Only update parent state if form is valid and values have changed
    if (isValid && watchedLanguages && Array.isArray(watchedLanguages)) {
      // Filter out entries without language name, but allow proficiency to be optional
      const filteredLanguages = watchedLanguages.filter(l => l.name && l.name.trim());
      // Map to string[] format - include proficiency if provided, otherwise just the name
      const userLanguages = filteredLanguages.map(l => {
        if (l.proficiency && l.proficiency.trim()) {
          return `${l.name} (${l.proficiency})`;
        } else {
          return l.name;
        }
      });
      // Only update if changed
      if (JSON.stringify(userLanguages) !== JSON.stringify(resumeData.userLanguages)) {
        setResumeData(prev => ({
          ...prev,
          userLanguages
        }));
      }
    }
  }, [watchedLanguages, isValid, setResumeData, resumeData.userLanguages]);

  const handleAddLanguage = () => {
    append({ name: "", proficiency: "" });
  };

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
          {language === 'ar' ? 'اللغات' : 'Languages'}
        </h2>
        <p className={cn(
          "text-sm text-muted-foreground",
          isMobile && "text-xs px-2"
        )}>
          {language === 'ar' 
            ? 'أضف جميع اللغات التي تتحدثها مع مستوى إتقانك لكل لغة'
            : 'Add all languages you speak with your proficiency level for each language'
          }
        </p>
      </div>
      <form className={cn(
        "space-y-6",
        isMobile && "space-y-4"
      )} autoComplete="off" dir={language === 'ar' ? 'rtl' : 'ltr'}>
        <Card>
          <CardContent className={cn(
            "space-y-6 pt-6",
            isMobile && "space-y-4 pt-4"
          )}>
            {fields.map((field, index) => (
              <div key={field.id} className={cn(
                "flex gap-4",
                isMobile && "flex-col gap-3"
              )}>
                <div className="flex-1">
                  <Label className={cn(
                    isMobile && "text-sm"
                  )}>{language === 'ar' ? 'اللغة' : 'Language'}</Label>
                  <Input
                    {...form.register(`userLanguages.${index}.name`)}
                    placeholder={language === 'ar' ? 'اكتب اسم اللغة' : 'Enter language name'}
                    className={cn(
                      "mt-1.5",
                      isMobile && "text-sm h-10"
                    )}
                  />
                </div>
                <div className="flex-1">
                  <Label className={cn(
                    isMobile && "text-sm"
                  )}>{language === 'ar' ? 'مستوى الإتقان' : 'Proficiency Level'}</Label>
                  <Input
                    {...form.register(`userLanguages.${index}.proficiency`)}
                    placeholder={
                      language === 'ar' 
                        ? 'مثال: ممتاز، جيد جداً، متوسط'
                        : 'Example: Fluent, Advanced, Intermediate'
                    }
                    className={cn(
                      "mt-1.5",
                      isMobile && "text-sm h-10"
                    )}
                  />
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => remove(index)}
                  className={cn(
                    "mt-8",
                    isMobile && "mt-0 self-end"
                  )}
                >
                  <X className={cn(
                    "h-4 w-4",
                    isMobile && "h-5 w-5"
                  )} />
                </Button>
              </div>
            ))}

            <Button
              type="button"
              variant="outline"
              onClick={handleAddLanguage}
              className={cn(
                "w-full",
                isMobile && "text-sm h-10"
              )}
            >
              <Plus className={cn(
                "h-4 w-4 ml-2",
                isMobile && "h-4 w-4 ml-1"
              )} />
              {language === 'ar' ? 'إضافة لغة' : 'Add Language'}
            </Button>
          </CardContent>
        </Card>
      </form>
    </div>
  );
} 