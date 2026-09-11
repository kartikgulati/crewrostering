import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { quizSchema } from "@/lib/validations";

type Context = {
  params: Promise<{ id: string }>;
};

export async function PUT(request: Request, context: Context) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!prisma) return NextResponse.json({ error: "Database is not configured" }, { status: 503 });

  const { id } = await context.params;
  const userId = (session.user as any).id;
  const role = (session.user as any).role;

  // Ensure the user is either a SUPER_ADMIN or the owner of the quiz
  const quiz = await prisma.quiz.findUnique({ where: { id } });
  if (!quiz) return NextResponse.json({ error: "Quiz not found." }, { status: 404 });
  if (role !== "SUPER_ADMIN" && quiz.adminId !== userId) {
    return NextResponse.json({ error: "Forbidden: You do not own this quiz." }, { status: 403 });
  }

  const body = await request.json();
  const parsed = quizSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid quiz." }, { status: 400 });
  }

  const updatedQuiz = await prisma.$transaction(async (tx) => {
    await tx.question.deleteMany({ where: { quizId: id } });
    return tx.quiz.update({
      where: { id },
      data: {
        title: parsed.data.title,
        description: parsed.data.description,
        content: parsed.data.content,
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
  });

  return NextResponse.json({ quiz: updatedQuiz });
}

export async function DELETE(_request: Request, context: Context) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!prisma) return NextResponse.json({ error: "Database is not configured" }, { status: 503 });

  const { id } = await context.params;
  const userId = (session.user as any).id;
  const role = (session.user as any).role;

  // Ensure the user is either a SUPER_ADMIN or the owner of the quiz
  const quiz = await prisma.quiz.findUnique({ where: { id } });
  if (!quiz) return NextResponse.json({ error: "Quiz not found." }, { status: 404 });
  if (role !== "SUPER_ADMIN" && quiz.adminId !== userId) {
    return NextResponse.json({ error: "Forbidden: You do not own this quiz." }, { status: 403 });
  }

  await prisma.quiz.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
