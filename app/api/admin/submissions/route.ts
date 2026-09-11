import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { submissionFiltersSchema } from "@/lib/validations";
import { endOfDayUtc, startOfDayUtc } from "@/lib/utils";

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!prisma) return NextResponse.json({ error: "Database is not configured" }, { status: 503 });

  const userId = (session.user as any).id;
  const role = (session.user as any).role;

  const { searchParams } = new URL(request.url);
  const parsed = submissionFiltersSchema.safeParse(Object.fromEntries(searchParams.entries()));
  if (!parsed.success) return NextResponse.json({ error: "Invalid filters." }, { status: 400 });

  const where: any = {
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

  // If not a SUPER_ADMIN, only allow submissions from their own quizzes
  if (role !== "SUPER_ADMIN") {
    where.quiz = { adminId: userId };
  }

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
