import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { ResumeServerData } from "./types";
import { ResumeValues } from "./validation";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function fileReplacer(key: unknown, value: unknown) {
  return value instanceof File
    ? {
        name: value.name,
        size: value.size,
        type: value.type,
        lastModified: value.lastModified,
      }
    : value;
}

// Arabic text detection utility
export function detectArabic(text: string): boolean {
  // Arabic Unicode range: \u0600-\u06FF (Arabic), \u0750-\u077F (Arabic Supplement)
  const arabicRegex = /[\u0600-\u06FF\u0750-\u077F]/;
  return arabicRegex.test(text);
}

// Map server data to ResumeValues format
export function mapToResumeValues(data: ResumeServerData): ResumeValues {
  // Debug: Log the color information being mapped
  console.log('mapToResumeValues - color data:', {
    id: data.id,
    colorHex: data.colorHex,
    sidebarColorHex: data.sidebarColorHex,
    templatePreference: data.templatePreference
  });

  return {
    id: data.id,
    title: data.title || undefined,
    description: data.description || undefined,
    photo: data.photoUrl || undefined,
    firstName: data.firstName || undefined,
    lastName: data.lastName || undefined,
    jobTitle: data.jobTitle || undefined,
    city: data.city || undefined,
    country: data.country || undefined,
    phone: data.phone || undefined,
    email: data.email || undefined,
    colorHex: data.colorHex || undefined,
    sidebarColorHex: data.sidebarColorHex || undefined,
    borderStyle: data.borderStyle || undefined,
    fontFamily: data.fontFamily || undefined,
    bulletStyle: data.bulletStyle || undefined,
    templatePreference: data.templatePreference || undefined,
    templateCode: data.templateCode || undefined,
    language: data.language || undefined,
    summary: data.summary || undefined,
    workExperiences: data.workExperiences?.map((exp) => ({
      position: exp.position || undefined,
      company: exp.company || undefined,
      startDate: exp.startDate?.toISOString().split('T')[0] || undefined,
      endDate: exp.endDate?.toISOString().split('T')[0] || undefined,
      description: exp.description || undefined,
    })) || [],
    educations: data.educations?.map((edu) => ({
      degree: edu.degree || undefined,
      school: edu.school || undefined,
      startDate: edu.startDate?.toISOString().split('T')[0] || undefined,
      endDate: edu.endDate?.toISOString().split('T')[0] || undefined,
    })) || [],
    skills: data.skills || [],
    userLanguages: data.userLanguages || [],
  };
}
