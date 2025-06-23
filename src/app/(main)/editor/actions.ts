"use server";

import { canCreateResume, canUseCustomizations } from "@/lib/permissions";
import prisma from "@/lib/prisma";
import { getUserSubscriptionLevel } from "@/lib/subscription";
import { resumeSchema, ResumeValues } from "@/lib/validation";
import { auth } from "@clerk/nextjs/server";
import { del, put } from "@vercel/blob";
import path from "path";

export async function saveResume(values: ResumeValues) {
  const { id } = values;

  console.log("received values", values);

  const { photo, workExperiences, educations, ...resumeValues } =
    resumeSchema.parse(values);

  const { userId } = await auth();

  if (!userId) {
    throw new Error("User not authenticated");
  }

  const subscriptionLevel = await getUserSubscriptionLevel(userId);

  if (!id) {
    const resumeCount = await prisma.resume.count({ where: { userId } });

    if (!canCreateResume(subscriptionLevel, resumeCount)) {
      throw new Error(
        "Maximum resume count reached for this subscription level",
      );
    }
  }

  const existingResume = id
    ? await prisma.resume.findUnique({ where: { id, userId } })
    : null;

  if (id && !existingResume) {
    throw new Error("Resume not found");
  }

  const hasCustomizations =
    (resumeValues.borderStyle &&
      resumeValues.borderStyle !== existingResume?.borderStyle) ||
    (resumeValues.colorHex &&
      resumeValues.colorHex !== existingResume?.colorHex);

  if (hasCustomizations && !canUseCustomizations(subscriptionLevel)) {
    throw new Error("Customizations not allowed for this subscription level");
  }

  let newPhotoUrl: string | undefined | null = undefined;

  if (photo instanceof File) {
    if (existingResume?.photoUrl) {
      await del(existingResume.photoUrl);
    }

    const blob = await put(`resume_photos/${path.extname(photo.name)}`, photo, {
      access: "public",
    });

    newPhotoUrl = blob.url;
  } else if (photo === null) {
    if (existingResume?.photoUrl) {
      await del(existingResume.photoUrl);
    }
    newPhotoUrl = null;
  }

  // Prepare the data object for Prisma
  const prismaData = {
    title: resumeValues.title || "",
    description: resumeValues.description || "",
    summary: resumeValues.summary || "",
    firstName: resumeValues.firstName || "",
    lastName: resumeValues.lastName || "",
    jobTitle: resumeValues.jobTitle || "",
    city: resumeValues.city || "",
    country: resumeValues.country || "",
    phone: resumeValues.phone || "",
    email: resumeValues.email || "",
    language: resumeValues.language || "en",
    photoUrl: newPhotoUrl,
    colorHex: resumeValues.colorHex || "#000000",
    sidebarColorHex: resumeValues.sidebarColorHex || "#0E7490",
    borderStyle: resumeValues.borderStyle || "squircle",
    skills: { set: resumeValues.skills || [] },
    userLanguages: { set: resumeValues.userLanguages || [] },
    templatePreference: resumeValues.templatePreference || "default",
    workExperiences: {
      deleteMany: {},
      create: workExperiences?.filter(exp => Object.values(exp).some(Boolean)).map((exp) => ({
        ...exp,
        startDate: exp.startDate ? new Date(exp.startDate) : undefined,
        endDate: exp.endDate ? new Date(exp.endDate) : undefined,
      })) || [],
    },
    educations: {
      deleteMany: {},
      create: educations?.filter(edu => Object.values(edu).some(Boolean)).map((edu) => ({
        ...edu,
        startDate: edu.startDate ? new Date(edu.startDate) : undefined,
        endDate: edu.endDate ? new Date(edu.endDate) : undefined,
      })) || [],
    },
    updatedAt: new Date(),
  };

  if (id) {
    return prisma.resume.update({
      where: { id },
      data: prismaData,
    });
  } else {
    return prisma.resume.create({
      data: {
        ...prismaData,
        userId,
        workExperiences: {
          create: workExperiences?.filter(exp => Object.values(exp).some(Boolean)).map((exp) => ({
            ...exp,
            startDate: exp.startDate ? new Date(exp.startDate) : undefined,
            endDate: exp.endDate ? new Date(exp.endDate) : undefined,
          })) || [],
        },
        educations: {
          create: educations?.filter(edu => Object.values(edu).some(Boolean)).map((edu) => ({
            ...edu,
            startDate: edu.startDate ? new Date(edu.startDate) : undefined,
            endDate: edu.endDate ? new Date(edu.endDate) : undefined,
          })) || [],
        },
      },
    });
  }
}
