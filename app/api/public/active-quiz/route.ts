import { NextResponse } from "next/server";

import { getActiveQuiz } from "@/lib/quiz";

export async function GET() {
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
}
