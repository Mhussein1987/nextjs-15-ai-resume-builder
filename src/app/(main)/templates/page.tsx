import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import TemplateSelectionPage from "./TemplateSelectionPage";

interface PageProps {
  searchParams: Promise<{ lang?: string }>;
}

export default async function Page({ searchParams }: PageProps) {
  const { userId } = await auth();
  const { lang } = await searchParams;

  if (!userId) {
    return null;
  }

  // If no language is selected, redirect to language selection
  if (!lang || (lang !== 'ar' && lang !== 'en')) {
    redirect('/templates/select-language');
  }

  return <TemplateSelectionPage language={lang as 'ar' | 'en'} />;
} 