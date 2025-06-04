import { EditorFormProps } from "@/lib/types";
import EducationForm from "./forms/EducationForm";
import GeneralInfoForm from "./forms/GeneralInfoForm";
import PersonalInfoForm from "./forms/PersonalInfoForm";
import SkillsForm from "./forms/SkillsForm";
import SummaryForm from "./forms/SummaryForm";
import WorkExperienceForm from "./forms/WorkExperienceForm";

export const steps: {
  title: string;
  component: React.ComponentType<EditorFormProps>;
  key: string;
}[] = [
  { title: "معلومات عامة", component: GeneralInfoForm, key: "general-info" },
  { title: "معلومات شخصية", component: PersonalInfoForm, key: "personal-info" },
  {
    title: "الخبرات السابقة",
    component: WorkExperienceForm,
    key: "work-experience",
  },
  { title: "التعليم", component: EducationForm, key: "education" },
  { title: "المهارات", component: SkillsForm, key: "skills" },
  {
    title: "الملخص",
    component: SummaryForm,
    key: "summary",
  }
];
