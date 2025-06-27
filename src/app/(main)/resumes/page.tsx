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

// Force dynamic rendering to ensure fresh data
export const dynamic = 'force-dynamic';

export default async function Page() {
  const { userId } = await auth();

  if (!userId) {
    return null;
  }

  const [resumes, totalCount, subscriptionLevel] = await Promise.all([
    prisma.resume.findMany({
      where: { userId },
      include: resumeDataInclude,
      orderBy: { updatedAt: "desc" },
    }),
    prisma.resume.count({ where: { userId } }),
    getUserSubscriptionLevel(userId),
  ]);

  const canCreate = canCreateResume(subscriptionLevel, totalCount);

  console.log(`Resumes page - subscriptionLevel: ${subscriptionLevel} totalCount: ${totalCount} canCreate: ${canCreate}`);

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 mx-auto w-full max-w-7xl space-y-6 px-3 py-6">
        {/* Header */}
        <div className="flex flex-col gap-2" dir="rtl">
          <h1 className="text-3xl font-bold tracking-tight text-right bg-gradient-to-r from-[#8e2de2] to-[#4a00e0] bg-clip-text text-transparent">
            السير الذاتية الخاصة بك
          </h1>
          <p className="text-muted-foreground text-right">
            قم بإنشاء وإدارة سيرتك الذاتية بسهولة
          </p>
        </div>

        {/* Resume Items Grid */}
        {resumes.length > 0 ? (
          <div className="grid gap-4 md:gap-6 grid-cols-1 md:grid-cols-3 justify-items-center">
            {resumes.map((resume) => (
              <ResumeItem key={resume.id} resume={resume} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center space-y-4 py-12" dir="rtl">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-right">لا توجد سير ذاتية</h3>
              <p className="text-muted-foreground text-right">
                ابدأ بإنشاء سيرتك الذاتية الأولى
              </p>
            </div>
          </div>
        )}

        {/* Create Resume Button - Always show */}
        <div className="flex justify-center pt-8">
          <CreateResumeButton canCreate={canCreate} />
        </div>
      </main>


    </div>
  );
}