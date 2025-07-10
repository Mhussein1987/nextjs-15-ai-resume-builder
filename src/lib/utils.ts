import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { ResumeServerData, ResumeData } from "./types";
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

// Ensure resume has default content to prevent empty prints
export function ensureResumeContent(resumeData: ResumeValues): ResumeValues {
  const defaults = {
    firstName: resumeData.firstName || 'Your',
    lastName: resumeData.lastName || 'Name',
    jobTitle: resumeData.jobTitle || 'Professional Title',
    email: resumeData.email || 'your.email@example.com',
    phone: resumeData.phone || '+1 (555) 123-4567',
    city: resumeData.city || 'City',
    country: resumeData.country || 'Country',
    summary: resumeData.summary || 'Professional summary goes here...',
    workExperiences: Array.isArray(resumeData.workExperiences) && resumeData.workExperiences.length > 0 ? resumeData.workExperiences : [{
      position: 'Sample Position',
      company: 'Sample Company',
      startDate: '2023-01-01',
      endDate: '2023-12-31',
      description: 'Describe your role and achievements here.'
    }],
    educations: Array.isArray(resumeData.educations) && resumeData.educations.length > 0 ? resumeData.educations : [{
      degree: 'Sample Degree',
      school: 'Sample University',
      startDate: '2019-09-01',
      endDate: '2023-06-30'
    }],
    skills: Array.isArray(resumeData.skills) && resumeData.skills.length > 0 ? resumeData.skills : ['Sample Skill 1', 'Sample Skill 2', 'Sample Skill 3'],
    userLanguages: Array.isArray(resumeData.userLanguages) && resumeData.userLanguages.length > 0 ? resumeData.userLanguages : ['English (Native)', 'Sample Language (Intermediate)'],
    colorHex: resumeData.colorHex || '#1d4ed8',
    sidebarColorHex: resumeData.sidebarColorHex || '#3f51b5',
    borderStyle: resumeData.borderStyle || 'squircle',
    templateCode: resumeData.templateCode || 'EN1',
    language: resumeData.language || 'en'
  };

  return {
    ...resumeData,
    ...defaults
  };
}

// Convert ResumeValues to ResumeData for PDF service
export function convertToResumeData(resumeValues: ResumeValues): ResumeData {
  return {
    id: resumeValues.id || 'temp-id',
    title: resumeValues.title || '',
    description: resumeValues.description || '',
    firstName: resumeValues.firstName || '',
    lastName: resumeValues.lastName || '',
    jobTitle: resumeValues.jobTitle || '',
    city: resumeValues.city || '',
    country: resumeValues.country || '',
    phone: resumeValues.phone || '',
    email: resumeValues.email || '',
    colorHex: resumeValues.colorHex || '#000000',
    sidebarColorHex: resumeValues.sidebarColorHex || '#0E7490',
    workExperienceHeaderColorHex: resumeValues.workExperienceHeaderColorHex,
    sectionLabelColorHex: resumeValues.sectionLabelColorHex,
    borderStyle: resumeValues.borderStyle || 'squircle',
    templatePreference: resumeValues.templatePreference || 'default',
    templateCode: resumeValues.templateCode || 'EN1',
    language: (resumeValues.language as 'en' | 'ar') || 'en',
    workExperiences: resumeValues.workExperiences?.map(exp => ({
      position: exp.position || '',
      company: exp.company || '',
      startDate: exp.startDate,
      endDate: exp.endDate,
      description: exp.description || ''
    })) || [],
    educations: resumeValues.educations?.map(edu => ({
      degree: edu.degree || '',
      institution: edu.school || '',
      startDate: edu.startDate,
      endDate: edu.endDate
    })) || [],
    skills: resumeValues.skills || [],
    userLanguages: resumeValues.userLanguages || [],
    summary: resumeValues.summary,
    photo: resumeValues.photo
  };
}
