import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import { buildSubmissionPdf } from "@/lib/pdf";
import { prisma } from "@/lib/prisma";
import { submissionFiltersSchema } from "@/lib/validations";
import { endOfDayUtc, startOfDayUtc } from "@/lib/utils";

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return new Response("Unauthorized", { status: 401 });
  if (!prisma) return new Response("Database is not configured", { status: 503 });

  const { searchParams } = new URL(request.url);
  const parsed = submissionFiltersSchema.safeParse(Object.fromEntries(searchParams.entries()));
  if (!parsed.success) return new Response("Invalid filters", { status: 400 });

  const where = {
    ...(parsed.data.storeNumber ? { storeNumber: parsed.data.storeNumber } : {}),
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
    select: {
      name: true,
      storeNumber: true,
      submissionDate: true,
      score: true,
      createdAt: true,
    },
  });

  const pdf = await buildSubmissionPdf(submissions);
  const pdfBuffer = pdf.buffer.slice(pdf.byteOffset, pdf.byteOffset + pdf.byteLength) as ArrayBuffer;

  return new Response(pdfBuffer, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": 'attachment; filename="submission-report.pdf"',
      "Cache-Control": "no-store",
    },
  });
}
