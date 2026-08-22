import { NextResponse } from "next/server";

import { isPrismaConnectionError } from "@/lib/prisma";
import { getActiveQuizzes } from "@/lib/quiz";

export async function GET() {
  try {
    const quizzes = await getActiveQuizzes();

    return NextResponse.json({
      quizzes: quizzes.map((quiz) => ({
        ...quiz,
        questions: quiz.questions.map((question) => ({
          id: question.id,
          questionText: question.questionText,
          options: question.options,
          explanation: question.explanation,
        })),
      })),
    });
  } catch (error) {
    if (isPrismaConnectionError(error)) {
      return NextResponse.json({ error: "Database is temporarily unavailable." }, { status: 503 });
    }

    throw error;
  }
}
