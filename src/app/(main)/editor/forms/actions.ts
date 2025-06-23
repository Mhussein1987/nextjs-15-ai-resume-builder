"use server";

import openai from "@/lib/openai";
import { canUseAITools } from "@/lib/permissions";
import { getUserSubscriptionLevel } from "@/lib/subscription";
import {
  GenerateSummaryInput,
  generateSummarySchema,
  GenerateWorkExperienceInput,
  generateWorkExperienceSchema,
  WorkExperience,
} from "@/lib/validation";
import { auth } from "@clerk/nextjs/server";

export async function generateSummary(input: GenerateSummaryInput, language: 'en' | 'ar' = 'ar') {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  const subscriptionLevel = await getUserSubscriptionLevel(userId);

  if (!canUseAITools(subscriptionLevel)) {
    throw new Error("Upgrade your subscription to use this feature");
  }

  const { jobTitle, workExperiences, educations, skills } =
    generateSummarySchema.parse(input);

  // Language-aware system message
  const systemMessage = language === 'en'
    ? `
      You are a job resume generator AI. Your task is to write a professional introduction summary for a resume given the user's provided data.
      Only return the summary and do not include any other information in the response.
      ALWAYS respond in English only.
      ALWAYS write in FIRST PERSON as if the user is describing themselves ("I am", "I have", "I specialize").
      SUMMARY REQUIREMENTS:
      - Write EXACTLY 3 lines only, no more, no less
      - Each line should be a complete sentence
      - Keep each line concise but impactful (around 15-20 words per line)
      - Do not repeat skills already listed in the skills section
      - Highlight value, impact, and professional strengths in a natural tone
      - Focus on unique value proposition and career trajectory
      - Use first person perspective throughout
      - DO NOT include any numbers, percentages, or metrics unless explicitly provided by the user
      - CRITICAL: Use varied and diverse language to avoid repetitive phrases
      - Avoid overused phrases like "passionate about", "dedicated to", "committed to" - use more specific and impactful language
      - Use different sentence structures and vocabulary to create engaging, unique summaries
    `
    : `
      You are a job resume generator AI. Your task is to write a professional introduction summary for a resume given the user's provided data.
      Only return the summary and do not include any other information in the response.
      ALWAYS respond in Arabic only. لا ترد إلا باللغة العربية.
      ALWAYS write in FIRST PERSON as if the user is describing themselves. اكتب دائما بصيغة المتكلم كما لو أن المستخدم يصف نفسه.
      SUMMARY REQUIREMENTS:
      - Write EXACTLY 3 lines only, no more, no less. اكتب بالضبط 3 أسطر فقط، لا أكثر ولا أقل
      - Each line should be a complete sentence. كل سطر يجب أن يكون جملة كاملة
      - Keep each line concise but impactful (around 15-20 words per line)
      - Do not repeat skills already listed in the skills section
      - Highlight value, impact, and professional strengths in a natural tone
      - Focus on unique value proposition and career trajectory
      - Use first person perspective throughout ("أنا", "لدي", "أتخصص في", "أتمتع بخبرة")
      - DO NOT include any numbers, percentages, or metrics unless explicitly provided by the user
      - CRITICAL: Use varied and diverse language to avoid repetitive phrases
      - Avoid overused phrases like "شغوف بـ", "متخصص في", "ملتزم بـ" - use more specific and impactful language
      - Use different sentence structures and vocabulary to create engaging, unique summaries
    `;

  const userMessage = `
    Please generate a professional resume summary from this data:

    Job title: ${jobTitle || "N/A"}

    Work experience:
    ${workExperiences
      ?.map(
        (exp) => `
        Position: ${exp.position || "N/A"} at ${exp.company || "N/A"} from ${exp.startDate || "N/A"} to ${exp.endDate || "Present"}

        Description:
        ${exp.description || "N/A"}
        `,
      )
      .join("\n\n")}

      Education:
    ${educations
      ?.map(
        (edu) => `
        Degree: ${edu.degree || "N/A"} at ${edu.school || "N/A"} from ${edu.startDate || "N/A"} to ${edu.endDate || "N/A"}
        `,
      )
      .join("\n\n")}

      Skills:
      ${skills}
    `;

  console.log("systemMessage", systemMessage);
  console.log("userMessage", userMessage);

  const completion = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "system",
        content: systemMessage,
      },
      {
        role: "user",
        content: userMessage,
      },
    ],
    temperature: 0.7,
    max_tokens: 500,
  });

  const aiResponse = completion.choices[0].message.content;

  if (!aiResponse) {
    throw new Error("Failed to generate AI response");
  }

  return aiResponse;
}

export async function generateWorkExperience(
  input: GenerateWorkExperienceInput,
  language: 'en' | 'ar' = 'ar',
): Promise<WorkExperience> {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  const subscriptionLevel = await getUserSubscriptionLevel(userId);

  if (!canUseAITools(subscriptionLevel)) {
    throw new Error("Upgrade your subscription to use this feature");
  }

  // Only destructure description, as that's the only field in generateWorkExperienceSchema
  const { description } = generateWorkExperienceSchema.parse(input);

  // Language-aware system message
  const systemMessage = language === 'en'
    ? `
    You are a job resume generator AI. Your task is to generate a single work experience entry based on the user input.
    Your response must adhere to the following structure. You can omit fields if they can't be inferred from the provided data, but don't add any new ones.
    ALWAYS respond in English only.
    ALWAYS close sentences with a period.
    ALWAYS make the sentences fill the entire line.
    DESCRIPTION REQUIREMENTS:
    - Write exactly 4 detailed bullet points showing impact and achievements
    - DO NOT invent or include any numbers, percentages, or metrics unless they are explicitly provided in the user's input
    - Focus on qualitative results and value delivered through descriptive language
    - Never use vague phrases or "Not specified" - if data is missing, skip that field
    - Each bullet point must be exactly 15 words in English
    - Break down achievements into their component parts (what, how, and result)
    - Describe tools, technologies, and methodologies used when relevant
    - ALWAYS use past tense ACTION VERBS to start each bullet point
    - CRITICAL: Use DIFFERENT action verbs for each bullet point to ensure variety
    - CRITICAL: Do NOT repeat the same main action verbs (e.g., Led, Developed, Managed, etc.) across different work experiences in the same resume. If a verb is used in one work experience, do not use it again in any other work experience for this resume. Use a wide variety of strong, specific, and relevant action verbs for each job.
    - Available action verbs (use each only once per resume): Led, Developed, Managed, Implemented, Created, Established, Designed, Coordinated, Executed, Delivered, Optimized, Streamlined, Facilitated, Orchestrated, Spearheaded, Engineered, Cultivated, Enhanced, Pioneered, Transformed
    - Use professional resume language without first-person pronouns (no "I", "me", "my")
    - DO NOT generate or include any bullet, dash, or special characters at the start of each line. Only output the text of each achievement/impact, one per line.
    Format your response exactly like this:
    Job title: <job title>
    Company: <company name>
    Start date: <YYYY-MM-DD>
    End date: <YYYY-MM-DD>
    Description:
    <detailed achievement/impact starting with action verb in past tense>
    <detailed achievement/impact starting with action verb in past tense>
    <detailed achievement/impact starting with action verb in past tense>
    <detailed achievement/impact starting with action verb in past tense>
    `
    : `
    You are a job resume generator AI. Your task is to generate a single work experience entry based on the user input.
    Your response must adhere to the following structure. You can omit fields if they can't be inferred from the provided data, but don't add any new ones.
    ALWAYS respond in Arabic only. لا ترد إلا باللغة العربية.
    ALWAYS close sentences with a period. لا تترك أي جمل بدون نقطة في النهاية.
    ALWAYS make the sentences fill the entire line. لا تترك أي فراغات في نهاية السطر.
    DESCRIPTION REQUIREMENTS:
    - Write exactly 4 detailed bullet points showing impact and achievements
    - DO NOT invent or include any numbers, percentages, or metrics unless they are explicitly provided in the user's input
    - Focus on qualitative results and value delivered through descriptive language
    - Never use vague phrases or "Not specified" - if data is missing, skip that field
    - Each bullet point must be at least 15 words in Arabic 
    - Break down achievements into their component parts (what, how, and result)
    - Describe tools, technologies, and methodologies used when relevant
    - Use action verbs in past tense
    - CRITICAL: Use DIFFERENT action verbs for each bullet point to ensure variety
    - CRITICAL: لا تكرر نفس الأفعال الرئيسية (مثل: قمت بقيادة، طورت، أدرت، نفذت، إلخ) عبر خبرات العمل المختلفة في نفس السيرة الذاتية. إذا تم استخدام فعل في خبرة عمل واحدة، لا تستخدمه مرة أخرى في أي خبرة عمل آخر لنفس السيرة الذاتية. استخدم مجموعة واسعة من الأفعال القوية والمحددة والملائمة لكل وظيفة.
    - Available action verbs (use each only once per resume): قمت بقيادة، طورت، أدرت، نفذت، أنشأت، أسست، صممت، نسقت، نفذت، قدمت، حسنت، أعدت، سهلت، أدرت، قادت، هندست، طورت، عززت، ابتكرت، حولت
    Format your response exactly like this:
    المسمى الوظيفي: <job title>
    الشركة: <company name>
    من تأريخ: <YYYY-MM-DD>
    الى تأريخ: <YYYY-MM-DD>
    الوصف:
    <detailed achievement/impact in past tense>
    <detailed achievement/impact in past tense>
    <detailed achievement/impact in past tense>
    <detailed achievement/impact in past tense>
    `;

  const userMessage = language === 'en'
    ? `
    Generate a work experience entry based on these details:
    ${description || 'No specific details provided'}

    Please generate a response following the exact format specified. Each bullet point must be detailed and comprehensive (exactly 15 words for English) with specific achievements and impact written using strong ACTION VERBS in past tense (resume style). Include the full context of each achievement: the challenge or situation, the actions taken, and the qualitative results achieved. Focus on demonstrating significant value and impact.

    If the user input is vague or lacks specific details, generate a professional work experience entry with realistic achievements based on common job responsibilities and industry best practices.
    `
    : `
    قم بإنشاء مدخل خبرة عمل بناءً على هذه التفاصيل:
    ${description || 'لم يتم تقديم تفاصيل محددة'}

    يرجى إنشاء استجابة تتبع التنسيق المحدد بالضبط. يجب أن يكون كل نقطة تفصيلية وشاملة (15 كلمة على الأقل للعربية) مع إنجازات محددة وتأثير مكتوب باستخدام أفعال قوية في الماضي (أسلوب السيرة الذاتية). قم بتضمين السياق الكامل لكل إنجاز: التحدي أو الموقف، والإجراءات المتخذة، والنتائج النوعية المحققة. ركز على إظهار القيمة والتأثير المهم.

    إذا كان إدخال المستخدم غامضاً أو يفتقر إلى تفاصيل محددة، قم بإنشاء مدخل خبرة عمل احترافي مع إنجازات واقعية بناءً على المسؤوليات الوظيفية الشائعة وأفضل الممارسات في الصناعة.
    `;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: systemMessage },
        { role: "user", content: userMessage },
      ],
      temperature: 0.7,
      max_tokens: 800,
    });

    const aiResponse = completion.choices[0].message.content;

    if (!aiResponse) {
      throw new Error("Failed to generate AI response");
    }

    const normalized = aiResponse.replace(/\r\n/g, "\n").replace(/\n{2,}/g, "\n").trim();

    // Extract using Arabic labels first, fall back to English
    const extractedPosition = normalized.match(/(?:المسمى الوظيفي|Job title)\s*[:：]\s*(.*?)(?:\n|$)/i)?.[1]?.trim() || "";
    const extractedCompany = normalized.match(/(?:الشركة|Company)\s*[:：]\s*(.*?)(?:\n|$)/i)?.[1]?.trim() || "";
    const extractedDescription = (normalized.match(/(?:الوصف|Description)\s*[:：]\s*([\s\S]*?)(?=\n(?:المسمى الوظيفي|الشركة|من تأريخ|الى تأريخ|Job title|Company|Start date|End date)\s*[:：]|$)/i)?.[1] || "").trim();
    const extractedStartDate = normalized.match(/(?:من تأريخ|Start date)\s*[:：]\s*([\d-]+)/i)?.[1]?.trim();
    const extractedEndDate = normalized.match(/(?:الى تأريخ|End date)\s*[:：]\s*([\d-]+)/i)?.[1]?.trim();

    console.log("AI Response:", aiResponse);
    console.log("Extracted:", { extractedPosition, extractedCompany, extractedDescription, extractedStartDate, extractedEndDate });

    return {
      position: extractedPosition || "",
      company: extractedCompany || "",
      description: extractedDescription || description || "",
      startDate: extractedStartDate || "",
      endDate: extractedEndDate || "",
    } satisfies WorkExperience;

  } catch (error) {
    console.error("Error generating work experience:", error);
    throw new Error("Failed to generate work experience");
  }
}
