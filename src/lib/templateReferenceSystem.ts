// Template Reference Code System
// Standardized template identification system

export interface TemplateReference {
  code: string;           // e.g., "EN1", "AR2", "EN4"
  language: 'en' | 'ar';  // Template language
  number: number;         // Template number (1, 2, 4)
  name: string;           // Display name
  description: string;    // Template description
  component: string;      // Component identifier
  cssClass: string;       // CSS data attribute
  legacyPreference: string; // Current templatePreference value
}

// Comprehensive template reference mapping
export const TEMPLATE_REFERENCES: TemplateReference[] = [
  // English Templates
  {
    code: 'EN1',
    language: 'en',
    number: 1,
    name: 'Classic',
    description: 'Traditional layout with clean design',
    component: 'ResumeTemplate1En',
    cssClass: 'template1en',
    legacyPreference: 'default'
  },
  {
    code: 'EN2',
    language: 'en',
    number: 2,
    name: 'Modern',
    description: 'Contemporary sidebar layout',
    component: 'ResumeTemplate2En',
    cssClass: 'template2en',
    legacyPreference: 'alternative'
  },
  {
    code: 'EN4',
    language: 'en',
    number: 4,
    name: 'Comprehensive',
    description: 'Multi-page design for extensive experience',
    component: 'ResumeTemplate4En',
    cssClass: 'template4en',
    legacyPreference: 'template4'
  },
  
  // Arabic Templates
  {
    code: 'AR1',
    language: 'ar',
    number: 1,
    name: 'التقليدي',
    description: 'تصميم تقليدي ونظيف',
    component: 'ResumeTemplate1Ar',
    cssClass: 'template1ar',
    legacyPreference: 'default'
  },
  {
    code: 'AR2',
    language: 'ar',
    number: 2,
    name: 'الحديث',
    description: 'تصميم عصري مع شريط جانبي',
    component: 'ResumeTemplate2Ar',
    cssClass: 'template2ar',
    legacyPreference: 'alternative'
  },
  {
    code: 'AR4',
    language: 'ar',
    number: 4,
    name: 'الشامل',
    description: 'تصميم متعدد الصفحات للخبرة الواسعة',
    component: 'ResumeTemplate4Ar',
    cssClass: 'template4ar',
    legacyPreference: 'template4'
  }
];

// Helper functions for template reference system

/**
 * Get template reference by code
 */
export function getTemplateByCode(code: string): TemplateReference | undefined {
  return TEMPLATE_REFERENCES.find(template => template.code === code);
}

/**
 * Get template reference by legacy preference and language
 */
export function getTemplateByPreference(
  preference: string, 
  language: 'en' | 'ar'
): TemplateReference | undefined {
  return TEMPLATE_REFERENCES.find(
    template => template.legacyPreference === preference && template.language === language
  );
}

/**
 * Get template reference by number and language
 */
export function getTemplateByNumber(
  number: number, 
  language: 'en' | 'ar'
): TemplateReference | undefined {
  return TEMPLATE_REFERENCES.find(
    template => template.number === number && template.language === language
  );
}

/**
 * Generate template reference code from preference and language
 */
export function generateTemplateCode(
  preference: string, 
  language: 'en' | 'ar'
): string {
  const template = getTemplateByPreference(preference, language);
  return template?.code || `${language.toUpperCase()}1`; // Default fallback
}

/**
 * Get legacy preference from template code
 */
export function getLegacyPreference(code: string): string {
  const template = getTemplateByCode(code);
  return template?.legacyPreference || 'default';
}

/**
 * Get template number from code
 */
export function getTemplateNumber(code: string): number {
  const template = getTemplateByCode(code);
  return template?.number || 1;
}

/**
 * Get template language from code
 */
export function getTemplateLanguage(code: string): 'en' | 'ar' {
  const template = getTemplateByCode(code);
  return template?.language || 'en';
}

/**
 * Get templates for a specific language
 */
export function getTemplatesForLanguage(language: 'en' | 'ar'): TemplateReference[] {
  return TEMPLATE_REFERENCES.filter(template => template.language === language);
}

/**
 * Get available template numbers for a language
 */
export function getAvailableTemplateNumbers(language: 'en' | 'ar'): number[] {
  return getTemplatesForLanguage(language).map(template => template.number).sort();
}

/**
 * Validate template code format
 */
export function isValidTemplateCode(code: string): boolean {
  return /^(EN|AR)[1-4]$/.test(code);
}

/**
 * Get next template in cycle for a language
 */
export function getNextTemplate(currentCode: string): string {
  const current = getTemplateByCode(currentCode);
  if (!current) return 'EN1';
  
  const templates = getTemplatesForLanguage(current.language);
  const currentIndex = templates.findIndex(t => t.code === currentCode);
  const nextIndex = (currentIndex + 1) % templates.length;
  
  return templates[nextIndex].code;
}

/**
 * Get previous template in cycle for a language
 */
export function getPreviousTemplate(currentCode: string): string {
  const current = getTemplateByCode(currentCode);
  if (!current) return 'EN1';
  
  const templates = getTemplatesForLanguage(current.language);
  const currentIndex = templates.findIndex(t => t.code === currentCode);
  const previousIndex = currentIndex === 0 ? templates.length - 1 : currentIndex - 1;
  
  return templates[previousIndex].code;
}

/**
 * Convert legacy system to new reference codes
 */
export function migrateLegacyTemplate(
  legacyPreference: string,
  resumeLanguage: string
): string {
  const language = (resumeLanguage === 'ar' || resumeLanguage === 'ar-SA') ? 'ar' : 'en';
  return generateTemplateCode(legacyPreference, language);
}

/**
 * Get display name for template (language-aware)
 */
export function getTemplateDisplayName(
  code: string, 
  displayLanguage: 'en' | 'ar' = 'en'
): string {
  const template = getTemplateByCode(code);
  if (!template) return 'Unknown';
  
  // If display language matches template language, use template name
  if (displayLanguage === template.language) {
    return template.name;
  }
  
  // Cross-language display names
  const crossLanguageNames: Record<string, Record<'en' | 'ar', string>> = {
    'EN1': { en: 'Classic', ar: 'التقليدي' },
    'EN2': { en: 'Modern', ar: 'الحديث' },
    'EN4': { en: 'Comprehensive', ar: 'الشامل' },
    'AR1': { en: 'Classic', ar: 'التقليدي' },
    'AR2': { en: 'Modern', ar: 'الحديث' },
    'AR4': { en: 'Comprehensive', ar: 'الشامل' }
  };
  
  return crossLanguageNames[code]?.[displayLanguage] || template.name;
}

/**
 * Get all template codes
 */
export function getAllTemplateCodes(): string[] {
  return TEMPLATE_REFERENCES.map(template => template.code);
}

/**
 * Generate URL-friendly template identifier
 */
export function getTemplateUrlParam(code: string): string {
  const template = getTemplateByCode(code);
  return template?.number.toString() || '1';
}

/**
 * Get template from URL param and language
 */
export function getTemplateFromUrl(
  templateParam: string | undefined,
  language: 'en' | 'ar'
): string {
  const templateNumber = templateParam ? parseInt(templateParam) : 1;
  const template = getTemplateByNumber(templateNumber, language);
  return template?.code || `${language.toUpperCase()}1`;
}
