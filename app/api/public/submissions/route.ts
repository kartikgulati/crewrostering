import { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";

import { gradeSubmission } from "@/lib/quiz";
import { prisma } from "@/lib/prisma";
import { submissionSchema } from "@/lib/validations";
import { startOfDayUtc } from "@/lib/utils";

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
        { error: "A submission already exists for this crew member, store, and date." },
        { status: 409 },
      );
    }

    return NextResponse.json({ error: "Unable to save submission." }, { status: 500 });
  }
}
