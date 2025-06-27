// Template Migration Utilities
// Handles migration from legacy templatePreference to new templateCode system

import prisma from "@/lib/prisma";
import { migrateLegacyTemplate, isValidTemplateCode } from "./templateReferenceSystem";

/**
 * Migrate a single resume from legacy system to new template code system
 */
export async function migrateResumeTemplate(resumeId: string): Promise<string | null> {
  try {
    const resume = await prisma.resume.findUnique({
      where: { id: resumeId },
      select: { 
        id: true, 
        templatePreference: true, 
        templateCode: true, 
        language: true 
      }
    });

    if (!resume) {
      throw new Error(`Resume not found: ${resumeId}`);
    }

    // Skip if already has valid template code
    if (resume.templateCode && isValidTemplateCode(resume.templateCode)) {
      return resume.templateCode;
    }

    // Migrate from legacy preference
    const templateCode = migrateLegacyTemplate(
      resume.templatePreference || 'default',
      resume.language || 'en'
    );

    // Update the database
    await prisma.resume.update({
      where: { id: resumeId },
      data: { templateCode }
    });

    console.log(`Migrated resume ${resumeId} from "${resume.templatePreference}" to "${templateCode}"`);
    return templateCode;

  } catch (error) {
    console.error(`Failed to migrate resume template: ${resumeId}`, error);
    return null;
  }
}

/**
 * Migrate all resumes from legacy system to new template code system
 */
export async function migrateAllResumeTemplates(): Promise<{
  total: number;
  migrated: number;
  skipped: number;
  errors: number;
}> {
  const stats = { total: 0, migrated: 0, skipped: 0, errors: 0 };

  try {
    // Get all resumes that need migration
    const resumes = await prisma.resume.findMany({
      where: {
        OR: [
          { templateCode: null },
          { templateCode: "" }
        ]
      },
      select: { 
        id: true, 
        templatePreference: true, 
        templateCode: true, 
        language: true 
      }
    });

    stats.total = resumes.length;

    if (stats.total === 0) {
      console.log('No resumes need template migration');
      return stats;
    }

    console.log(`Starting migration of ${stats.total} resumes...`);

    // Process each resume
    for (const resume of resumes) {
      try {
        // Skip if already has valid template code
        if (resume.templateCode && isValidTemplateCode(resume.templateCode)) {
          stats.skipped++;
          continue;
        }

        // Migrate from legacy preference
        const templateCode = migrateLegacyTemplate(
          resume.templatePreference || 'default',
          resume.language || 'en'
        );

        // Update the database
        await prisma.resume.update({
          where: { id: resume.id },
          data: { templateCode }
        });

        stats.migrated++;
        
        if (stats.migrated % 10 === 0) {
          console.log(`Migrated ${stats.migrated}/${stats.total} resumes...`);
        }

      } catch (error) {
        console.error(`Failed to migrate resume: ${resume.id}`, error);
        stats.errors++;
      }
    }

    console.log(`Migration complete: ${stats.migrated} migrated, ${stats.skipped} skipped, ${stats.errors} errors`);
    return stats;

  } catch (error) {
    console.error('Failed to migrate resume templates:', error);
    throw error;
  }
}

/**
 * Check if a resume needs template migration
 */
export function needsTemplateMigration(resume: {
  templateCode?: string | null;
  templatePreference?: string | null;
}): boolean {
  return !resume.templateCode || !isValidTemplateCode(resume.templateCode);
}

/**
 * Get template code for a resume, with automatic migration
 */
export async function getResumeTemplateCode(resumeId: string): Promise<string> {
  const resume = await prisma.resume.findUnique({
    where: { id: resumeId },
    select: { 
      templateCode: true, 
      templatePreference: true, 
      language: true 
    }
  });

  if (!resume) {
    throw new Error(`Resume not found: ${resumeId}`);
  }

  // Return existing template code if valid
  if (resume.templateCode && isValidTemplateCode(resume.templateCode)) {
    return resume.templateCode;
  }

  // Migrate and return new template code
  const templateCode = await migrateResumeTemplate(resumeId);
  if (!templateCode) {
    throw new Error(`Failed to migrate template for resume: ${resumeId}`);
  }

  return templateCode;
}

/**
 * Template migration utilities
 */
const templateMigrationUtils = {
  migrateResumeTemplate,
  migrateAllResumeTemplates,
  needsTemplateMigration,
  getResumeTemplateCode
};

export default templateMigrationUtils;
