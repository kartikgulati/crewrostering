import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import { buildSubmissionPdf } from "@/lib/pdf";
import { prisma } from "@/lib/prisma";
import { submissionFiltersSchema } from "@/lib/validations";
import { endOfDayUtc, startOfDayUtc } from "@/lib/utils";

export const runtime = "nodejs";

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return new Response("Unauthorized", { status: 401 });
    if (!prisma) return new Response("Database is not configured", { status: 503 });

    const { searchParams } = new URL(request.url);
    const parsed = submissionFiltersSchema.safeParse(Object.fromEntries(searchParams.entries()));
    if (!parsed.success) return new Response("Invalid filters", { status: 400 });

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

    const submissions = await prisma.userSubmission.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: {
        quiz: {
          select: {
            title: true,
          },
        },
      },
    });

    const pdf = await buildSubmissionPdf(
      submissions.map((submission) => ({
        name: submission.name,
        quizTitle: submission.quiz.title,
        storeNumber: submission.storeNumber,
        submissionDate: submission.submissionDate,
        score: submission.score,
        createdAt: submission.createdAt,
      })),
    );

    return new Response(new Uint8Array(pdf), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": 'attachment; filename="submission-report.pdf"',
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    console.error("Failed to export submissions PDF", error);
    return new Response("Unable to export PDF.", { status: 500 });
  }
}
