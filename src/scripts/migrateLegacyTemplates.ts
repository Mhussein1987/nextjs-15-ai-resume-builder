/**
 * Script to migrate legacy templatePreference values to new templateCode system
 * This should be run once to update existing resumes in the database
 */

import { PrismaClient } from '@prisma/client';
import { migrateLegacyTemplate } from '../lib/templateReferenceSystem';

const prisma = new PrismaClient();

async function migrateLegacyTemplates() {
  console.log('🔄 Starting template migration...');
  
  try {
    // Find all resumes that need migration (missing templateCode)
    const resumesToMigrate = await prisma.resume.findMany({
      where: {
        OR: [
          { templateCode: null },
          { templateCode: '' }
        ]
      },
      select: {
        id: true,
        templatePreference: true,
        language: true,
        templateCode: true
      }
    });

    console.log(`📊 Found ${resumesToMigrate.length} resumes to migrate`);

    if (resumesToMigrate.length === 0) {
      console.log('✅ No resumes need migration');
      return;
    }

    let migratedCount = 0;
    let errorCount = 0;

    for (const resume of resumesToMigrate) {
      try {
        // Generate new template code
        const templateCode = migrateLegacyTemplate(
          resume.templatePreference || 'default',
          resume.language || 'en'
        );

        // Update the resume
        await prisma.resume.update({
          where: { id: resume.id },
          data: { templateCode }
        });

        console.log(`✅ Migrated resume ${resume.id}: ${resume.templatePreference} → ${templateCode}`);
        migratedCount++;
      } catch (error) {
        console.error(`❌ Error migrating resume ${resume.id}:`, error);
        errorCount++;
      }
    }

    console.log(`\n📈 Migration Summary:`);
    console.log(`   ✅ Successfully migrated: ${migratedCount}`);
    console.log(`   ❌ Errors: ${errorCount}`);
    console.log(`   📊 Total processed: ${resumesToMigrate.length}`);

    if (errorCount === 0) {
      console.log('\n🎉 Template migration completed successfully!');
    } else {
      console.log('\n⚠️  Template migration completed with some errors. Please check the logs above.');
    }

  } catch (error) {
    console.error('💥 Fatal error during migration:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the migration if this file is executed directly
if (require.main === module) {
  migrateLegacyTemplates()
    .then(() => {
      console.log('🏁 Migration script finished');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Migration script failed:', error);
      process.exit(1);
    });
}

export { migrateLegacyTemplates };
