import { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";

import { gradeSubmission } from "@/lib/quiz";
import { prisma } from "@/lib/prisma";
import { submissionLookupSchema, submissionSchema } from "@/lib/validations";
import { startOfDayUtc } from "@/lib/utils";

export async function GET(request: Request) {
  if (!prisma) {
    return NextResponse.json({ error: "Database is not configured." }, { status: 503 });
  }

  const { searchParams } = new URL(request.url);
  const parsed = submissionLookupSchema.safeParse({
    name: searchParams.get("name"),
    storeNumber: searchParams.get("storeNumber"),
  });

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid lookup." }, { status: 400 });
  }

  const existingSubmission = await prisma.userSubmission.findUnique({
    where: {
      name_storeNumber: {
        name: parsed.data.name.trim(),
        storeNumber: parsed.data.storeNumber.trim(),
      },
    },
    select: {
      id: true,
      score: true,
      createdAt: true,
    },
  });

  return NextResponse.json({
    exists: Boolean(existingSubmission),
    submission: existingSubmission
      ? {
          ...existingSubmission,
          createdAt: existingSubmission.createdAt.toISOString(),
        }
      : null,
  });
}

export async function POST(request: Request) {
  try {
    if (!prisma) {
      return NextResponse.json({ error: "Database is not configured." }, { status: 503 });
    }

    const body = await request.json();
    const parsed = submissionSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid submission." }, { status: 400 });
    }

    const { name, storeNumber, submissionDate, quizId, answers, durationSeconds } = parsed.data;
    const graded = await gradeSubmission(quizId, answers);
    const storedDate = startOfDayUtc(submissionDate);

    const submission = await prisma.userSubmission.create({
      data: {
        name: name.trim(),
        storeNumber: storeNumber.trim(),
        submissionDate: storedDate,
        quizId,
        answers: graded.evaluated,
        score: graded.score,
        durationSeconds,
      },
    });

    return NextResponse.json({
      id: submission.id,
      score: graded.score,
      evaluated: graded.evaluated,
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return NextResponse.json(
        { error: "A submission already exists for this crew member and store number." },
        { status: 409 },
      );
    }

    return NextResponse.json({ error: "Unable to save submission." }, { status: 500 });
  }
}
