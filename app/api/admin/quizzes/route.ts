import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { quizSchema } from "@/lib/validations";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!prisma) return NextResponse.json({ error: "Database is not configured" }, { status: 503 });

  const role = (session.user as any).role;
  const userId = (session.user as any).id;

  const quizzes = await prisma.quiz.findMany({
    where: role === "SUPER_ADMIN" ? {} : { adminId: userId },
    include: { questions: { orderBy: { order: "asc" } } },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({
    quizzes: quizzes.map((quiz) => ({
      ...quiz,
      createdAt: quiz.createdAt.toISOString(),
      updatedAt: quiz.updatedAt.toISOString(),
      questions: quiz.questions.map((question) => ({
        ...question,
        createdAt: question.createdAt.toISOString(),
        updatedAt: question.updatedAt.toISOString(),
      })),
    })),
  });
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!prisma) return NextResponse.json({ error: "Database is not configured" }, { status: 503 });

  const userId = (session.user as any).id;
  const quizLimit = (session.user as any).quizLimit;
  const role = (session.user as any).role;

  if (!userId) {
    return NextResponse.json({ error: "User ID not found in session." }, { status: 401 });
  }

  // Check if the admin has reached their quiz limit (only for non-SUPER_ADMINs)
  if (role !== "SUPER_ADMIN") {
    const quizCount = await prisma.quiz.count({
      where: { adminId: userId },
    });

    if (quizLimit && quizCount >= quizLimit) {
      return NextResponse.json(
        { error: `You have reached your quiz limit of ${quizLimit} quizzes.` },
        { status: 403 }
      );
    }
  }

  const body = await request.json();
  const parsed = quizSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid quiz." }, { status: 400 });
  }

  const quiz = await prisma.quiz.create({
    data: {
      title: parsed.data.title,
      description: parsed.data.description,
      content: parsed.data.content,
      adminId: userId,
      questions: {
        create: parsed.data.questions.map((question) => ({
          questionText: question.questionText,
          options: question.options,
          correctAnswer: question.correctAnswer,
          explanation: question.explanation,
          order: question.order,
        })),
      },
    },
    include: { questions: { orderBy: { order: "asc" } } },
  });

  return NextResponse.json({ quiz });
}
