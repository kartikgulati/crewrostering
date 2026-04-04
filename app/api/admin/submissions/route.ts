import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { submissionFiltersSchema } from "@/lib/validations";
import { endOfDayUtc, startOfDayUtc } from "@/lib/utils";

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!prisma) return NextResponse.json({ error: "Database is not configured" }, { status: 503 });

  const { searchParams } = new URL(request.url);
  const parsed = submissionFiltersSchema.safeParse(Object.fromEntries(searchParams.entries()));
  if (!parsed.success) return NextResponse.json({ error: "Invalid filters." }, { status: 400 });

  const where = {
    ...(parsed.data.storeNumber ? { storeNumber: parsed.data.storeNumber } : {}),
    ...(parsed.data.quizId ? { quizId: parsed.data.quizId } : {}),
    ...(parsed.data.minScore !== undefined ? { score: { gte: parsed.data.minScore } } : {}),
    ...(parsed.data.startDate || parsed.data.endDate
      ? {
          submissionDate: {
            ...(parsed.data.startDate ? { gte: startOfDayUtc(parsed.data.startDate) } : {}),
            ...(parsed.data.endDate ? { lte: endOfDayUtc(parsed.data.endDate) } : {}),
          },
        }
      : {}),
  };

  const [submissions, total] = await Promise.all([
    prisma.userSubmission.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (parsed.data.page - 1) * parsed.data.pageSize,
      take: parsed.data.pageSize,
      include: {
        quiz: {
          select: {
            title: true,
          },
        },
      },
    }),
    prisma.userSubmission.count({ where }),
  ]);

  return NextResponse.json({
    submissions: submissions.map((submission) => ({
      ...submission,
      quizTitle: submission.quiz.title,
      submissionDate: submission.submissionDate.toISOString(),
      createdAt: submission.createdAt.toISOString(),
    })),
    total,
    page: parsed.data.page,
    pageSize: parsed.data.pageSize,
  });
}
