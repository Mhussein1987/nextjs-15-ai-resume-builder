import { canCreateResume } from "@/lib/permissions";
import prisma from "@/lib/prisma";
import { getUserSubscriptionLevel } from "@/lib/subscription";
import { resumeDataInclude } from "@/lib/types";
import { auth } from "@clerk/nextjs/server";
import { Metadata } from "next";
import CreateResumeButton from "./CreateResumeButton";
import ResumeItem from "./ResumeItem";

export const metadata: Metadata = {
  title: "السير الذاتية الخاصة بك",
};

export default async function Page() {
  const { userId } = await auth();

  if (!userId) {
    return null;
  }

  const [resumes, totalCount, subscriptionLevel] = await Promise.all([
    prisma.resume.findMany({
      where: {
        userId,
      },
      orderBy: {
        updatedAt: "desc",
      },
      include: resumeDataInclude,
    }),
    prisma.resume.count({
      where: {
        userId,
      },
    }),
    getUserSubscriptionLevel(userId),
  ]);

  return (
    <main className="mx-auto w-full max-w-7xl space-y-6 px-3 py-6" dir="rtl">
      <CreateResumeButton
        canCreate={canCreateResume(subscriptionLevel, totalCount)}
      />
      <header className="space-y-3 border-b border-border/20 pb-6 text-center bg-gradient-to-br from-[#5409DA]/5 via-transparent to-[#6b29ee]/5 rounded-lg p-6">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-[#5409DA] to-[#6b29ee] dark:from-white dark:to-white bg-clip-text text-transparent drop-shadow-sm">
          السير الذاتية الخاصة بك
        </h1>
        <p className="text-muted-foreground">
          إدارة وتنظيم جميع سيرك الذاتية في مكان واحد
        </p>
        <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
          <span>المجموع:</span>
          <span className="font-bold">{totalCount}</span>
        </div>
        <p className="text-sm text-muted-foreground mt-2">
          اضغط على سيرتك الذاتية واختر القالب المفضل لديك ثم قم بتحميلها
        </p>
      </header>
      <div className="flex w-full grid-cols-2 flex-col gap-3 sm:grid md:grid-cols-3 lg:grid-cols-4">
        {resumes.map((resume) => (
          <ResumeItem key={resume.id} resume={resume} />
        ))}
      </div>
    </main>
  );
}