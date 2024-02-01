"use server";
import { z } from "zod";
import { AssessmentSchema } from "@/schemas";
import prisma from "@/lib/prisma";

export async function addAssessment(
  assessmentData: z.infer<typeof AssessmentSchema>,
) {
  return prisma.assessment.create({
    data: assessmentData,
  });
}
