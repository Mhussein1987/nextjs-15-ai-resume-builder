import logo from "@/assets/logo.png";
import aiResume from "@/assets/aiResume.png";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-8 bg-gradient-to-br from-white to-gray-100 px-5 py-12 text-center text-gray-900 md:flex-row md:text-start lg:gap-16">
      <div className="max-w-prose space-y-5">
        <Image
          src={logo}
          alt="Logo"
          width={150}
          height={150}
          className="mx-auto rounded-full shadow-md md:ms-0"
        />
        <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
          اصنع{" "}
          <span className="inline-block bg-gradient-to-r from-[#4300FF] to-purple-500 bg-clip-text text-transparent">
            سيرتك الذاتية
          </span>{" "}
          بدقائق مع الذكاء الاصطناعي
        </h1>
        <p className="text-lg text-gray-500">
          Our <span className="font-bold">AI resume builder</span> helps you
          design a professional resume, even if you&apos;re not very smart.
        </p>
        <Button asChild size="lg" variant="premium">
          <Link href="/resumes"> انقر لنبدأ</Link>
        </Button>
      </div>
      <div className="flex-shrink-0">
        <Image
          src={aiResume}
          alt="Resume preview"
          width={600}
          className="rounded-xl shadow-xl lg:rotate-[1.5deg]"
        />
      </div>
    </main>
  );
}
