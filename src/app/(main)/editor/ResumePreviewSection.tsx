import ResumePreview from "@/components/ResumePreview";
import ResumePreviewAlt from "@/components/ResumePreviewAlt";
import { cn } from "@/lib/utils";
import { ResumeValues } from "@/lib/validation";
import BorderStyleButton from "./BorderStyleButton";
import ColorPicker from "./ColorPicker";
import ArabicFontPicker from "./ArabicFontPicker";
import { useRef, useState } from "react";
import { LayoutTemplate, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useReactToPrint } from "react-to-print";


interface ResumePreviewSectionProps {
  resumeData: ResumeValues;
  setResumeData: (data: ResumeValues) => void;
  className?: string;
}

export default function ResumePreviewSection({
  resumeData,
  setResumeData,
  className,
}: ResumePreviewSectionProps) {
  const previewRef = useRef<HTMLDivElement>(null);
  const [useAltTemplate, setUseAltTemplate] = useState(false);

  const handlePrint = useReactToPrint({
    contentRef: previewRef,
    documentTitle: `${resumeData.firstName}_${resumeData.lastName}_Resume` || "Resume",
  });

  return (
    <div
      className={cn("group relative hidden w-full md:flex md:w-1/2 order-first", className)}
    >
      {/* Left side editor controls */}
      <div className="flex flex-none flex-col gap-3 p-3 pt-24 bg-[#5409DA]/5 dark:bg-secondary items-center">
        <ColorPicker
          color={resumeData.colorHex}
          onChange={(color) =>
            setResumeData({ ...resumeData, colorHex: color.hex })
          }
        />
        <BorderStyleButton
          borderStyle={resumeData.borderStyle}
          onChange={(borderStyle) =>
            setResumeData({ ...resumeData, borderStyle })
          }
        />
        <ArabicFontPicker
          selectedFont={resumeData.fontFamily}
          onChange={(fontFamily) =>
            setResumeData({ ...resumeData, fontFamily })
          }
        />
        <Button
          variant="outline"
          size="icon"
          onClick={() => setUseAltTemplate((v) => !v)}
          className=""
          title="تبديل قالب السيرة الذاتية"
        >
          <LayoutTemplate className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={handlePrint}
          className=""
          title="تحميل السيرة الذاتية كـ PDF"
        >
          <Download className="h-4 w-4" />
        </Button>
      </div>

      {/* Resume preview */}
      <div className="flex grow justify-center overflow-y-auto bg-[#5409DA]/5 dark:bg-secondary p-3">
        <div
          ref={previewRef}
          className="aspect-[210/297] h-fit max-w-[210mm] bg-white shadow-md"
        >
          {useAltTemplate ? (
            <ResumePreviewAlt
              resumeData={resumeData}
              contentRef={previewRef}
              className="aspect-[210/297] h-fit w-full bg-white text-black"
              direction="rtl"
            />
          ) : (
            <ResumePreview
              resumeData={resumeData}
              contentRef={previewRef}
              className="aspect-[210/297] h-fit w-full bg-white text-black"
              direction="rtl"
            />
          )}
        </div>
      </div>
    </div>
  );
}
