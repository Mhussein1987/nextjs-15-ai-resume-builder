import { auth } from "@clerk/nextjs/server";
import LanguageSelectionPage from "./LanguageSelectionPage";

export default async function Page() {
  const { userId } = await auth();

  if (!userId) {
    return null;
  }

  return <LanguageSelectionPage />;
} 