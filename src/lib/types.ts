import { Prisma } from "@prisma/client";
import { ResumeValues } from "./validation";

export interface ResumeData {
  id: string;
  title: string;
  description: string;
  firstName: string;
  lastName: string;
  jobTitle: string;
  city: string;
  country: string;
  phone: string;
  email: string;
  colorHex: string;
  sidebarColorHex: string;
  workExperienceHeaderColorHex?: string;
  sectionLabelColorHex?: string;
  borderStyle: string;
  templatePreference: string;
  templateCode: string;
  language: 'ar' | 'en';
  workExperiences: Array<{
    position: string;
    company: string;
    startDate?: string;
    endDate?: string;
    description: string;
  }>;
  educations: Array<{
    degree: string;
    institution: string;
    startDate?: string;
    endDate?: string;
  }>;
  skills: string[];
  userLanguages: string[];
  summary?: string;
  photo?: File | string | null;
}

export interface EditorFormProps {
  resumeData: ResumeValues;
  setResumeData: React.Dispatch<React.SetStateAction<ResumeValues>>;
  language?: 'ar' | 'en';
  onNext?: () => void;
  onPrevious?: () => void;
  hasNext?: boolean;
  hasPrevious?: boolean;
}

export const resumeDataInclude = {
  workExperiences: true,
  educations: true,
} satisfies Prisma.ResumeInclude;

export type ResumeServerData = Prisma.ResumeGetPayload<{
  include: typeof resumeDataInclude;
}>;