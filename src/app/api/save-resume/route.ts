import { saveResume } from "@/app/(main)/editor/actions";
import { resumeSchema, ResumeValues } from "@/lib/validation";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = resumeSchema.parse(body);
    const savedResume = await saveResume(validatedData as ResumeValues);
    return NextResponse.json(savedResume);
  } catch (error) {
    console.error("API save-resume error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to save resume" },
      { status: 500 }
    );
  }
}