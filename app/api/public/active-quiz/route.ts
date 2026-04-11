import { NextResponse } from "next/server";

import { isPrismaConnectionError } from "@/lib/prisma";
import { getActiveQuiz } from "@/lib/quiz";

export async function GET() {
  try {
    const quiz = await getActiveQuiz();

    if (!quiz) {
      return NextResponse.json({ quiz: null });
    }

    return NextResponse.json({
      quiz: {
        ...quiz,
        questions: quiz.questions.map((question) => ({
          id: question.id,
          questionText: question.questionText,
          options: question.options,
          explanation: question.explanation,
        })),
      },
    });
  } catch (error) {
    if (isPrismaConnectionError(error)) {
      return NextResponse.json({ error: "Database is temporarily unavailable." }, { status: 503 });
    }

    throw error;
  }
}
