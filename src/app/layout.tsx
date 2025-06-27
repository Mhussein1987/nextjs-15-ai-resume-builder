import { Toaster } from "@/components/ui/toaster";
import { ClerkProvider } from "@clerk/nextjs";
import type { Metadata } from "next";
import { ThemeProvider } from "next-themes";
import { Inter, Amiri, Cairo, Tajawal, Changa, Almarai, Reem_Kufi } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

// Arabic fonts
const amiri = Amiri({ 
  subsets: ["arabic", "latin"], 
  weight: ["400", "700"],
  variable: "--font-amiri"
});
const cairo = Cairo({ 
  subsets: ["arabic", "latin"],
  variable: "--font-cairo"
});
const tajawal = Tajawal({ 
  subsets: ["arabic", "latin"], 
  weight: ["200", "300", "400", "500", "700", "800", "900"],
  variable: "--font-tajawal"
});
const changa = Changa({ 
  subsets: ["arabic", "latin"],
  variable: "--font-changa"
});
const almarai = Almarai({ 
  subsets: ["arabic"], 
  weight: ["300", "400", "700", "800"],
  variable: "--font-almarai"
});
const reemKufi = Reem_Kufi({ 
  subsets: ["arabic", "latin"],
  variable: "--font-reem-kufi"
});

export const metadata: Metadata = {
  title: {
    template: "%s - SeeraAi",
    absolute: "SeeraAi - AI Resume Builder",
  },
  description:
    "SeeraAi is the easiest way to create a professional resume that will help you land your dream job. Support for English and Arabic.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} ${amiri.variable} ${cairo.variable} ${tajawal.variable} ${changa.variable} ${almarai.variable} ${reemKufi.variable}`} suppressHydrationWarning>
        <ClerkProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
            <Toaster />
          </ThemeProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}
