import { canCreateResume } from "@/lib/permissions";
import prisma from "@/lib/prisma";
import { getUserSubscriptionLevel } from "@/lib/subscription";
import { resumeDataInclude } from "@/lib/types";
import { auth } from "@clerk/nextjs/server";
import { Metadata } from "next";
import { Facebook, Twitter, Instagram, Linkedin, Globe, Mail, Phone } from "lucide-react";
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
          <div className="grid gap-4 md:gap-6 grid-cols-2 md:grid-cols-3">
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

        {/* Create Resume Button - Now below components */}
        {canCreate && (
          <div className="flex justify-center pt-8">
            <CreateResumeButton canCreate={canCreate} />
          </div>
        )}
      </main>

      {/* Modern Footer */}
      <footer className="bg-gradient-to-r from-[#625BF8] to-[#625BF8]/80 border-t border-border/20 mt-12">
        <div className="mx-auto max-w-7xl px-3 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Company Information */}
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  شركة السيرة الذاتية الذكية
                </h3>
                <p className="text-sm text-white/80">
                  أداة احترافية لإنشاء السير الذاتية
                </p>
              </div>
            </div>

            {/* Contact Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white mb-2">معلومات التواصل</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-white/80">
                  <Mail className="h-4 w-4" />
                  <span>info@smartresume.com</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-white/80">
                  <Phone className="h-4 w-4" />
                  <span>+1 (555) 123-4567</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-white/80">
                  <Globe className="h-4 w-4" />
                  <span>www.smartresume.com</span>
                </div>
              </div>
            </div>

            {/* Social Media */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white mb-2">تابعنا</h3>
              <div className="flex gap-3">
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-full bg-white/20 text-white hover:bg-white/30 transition-colors"
                  title="Facebook"
                >
                  <Facebook className="h-4 w-4" />
                </a>
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-full bg-white/20 text-white hover:bg-white/30 transition-colors"
                  title="Twitter"
                >
                  <Twitter className="h-4 w-4" />
                </a>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-full bg-white/20 text-white hover:bg-white/30 transition-colors"
                  title="Instagram"
                >
                  <Instagram className="h-4 w-4" />
                </a>
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-full bg-white/20 text-white hover:bg-white/30 transition-colors"
                  title="LinkedIn"
                >
                  <Linkedin className="h-4 w-4" />
                </a>
              </div>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="mt-8 pt-6 border-t border-white/20 text-center">
            <p className="text-sm text-white/80">
              2025 Zero Gravity جميع الحقوق محفوظة لشركة
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}