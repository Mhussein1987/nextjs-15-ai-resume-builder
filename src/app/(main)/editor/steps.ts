import { EditorFormProps } from "@/lib/types";
import EducationForm from "./forms/EducationForm";
import GeneralInfoForm from "./forms/GeneralInfoForm";
import PersonalInfoForm from "./forms/PersonalInfoForm";
import SkillsForm from "./forms/SkillsForm";
import SummaryForm from "./forms/SummaryForm";
import WorkExperienceForm from "./forms/WorkExperienceForm";
import LanguagesForm from "./forms/LanguagesForm";
import MobilePreviewForm from "./forms/MobilePreviewForm";

export const steps: {
  title: string;
  titleEn: string;
  component: React.ComponentType<EditorFormProps>;
  key: string;
}[] = [
  { title: "معلومات عامة", titleEn: "General Info", component: GeneralInfoForm, key: "general-info" },
  { title: "معلومات شخصية", titleEn: "Personal Info", component: PersonalInfoForm, key: "personal-info" },
  {
    title: "الخبرات السابقة",
    titleEn: "Work Experience",
    component: WorkExperienceForm,
    key: "work-experience",
  },
  { title: "التعليم", titleEn: "Education", component: EducationForm, key: "education" },
  { title: "المهارات", titleEn: "Skills", component: SkillsForm, key: "skills" },
  { title: "اللغات", titleEn: "Languages", component: LanguagesForm, key: "languages" },
  {
    title: "الملخص",
    titleEn: "Summary",
    component: SummaryForm,
    key: "summary",
  },
  {
    title: "معاينة الجوال",
    titleEn: "Mobile Preview",
    component: MobilePreviewForm,
    key: "mobile-preview",
  }
];
