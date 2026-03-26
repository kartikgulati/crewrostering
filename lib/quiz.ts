import { prisma } from "@/lib/prisma";
import { percent } from "@/lib/utils";

export async function getActiveQuiz() {
  if (!prisma) return null;

  return prisma.quiz.findFirst({
    where: { isActive: true },
    include: {
      questions: {
        orderBy: { order: "asc" },
      },
    },
  });
}

export async function gradeSubmission(quizId: string, answers: { questionId: string; selectedAnswer: number }[]) {
  if (!prisma) {
    throw new Error("Database is not configured");
  }

  const quiz = await prisma.quiz.findUnique({
    where: { id: quizId },
    include: { questions: { orderBy: { order: "asc" } } },
  });

  if (!quiz) throw new Error("Quiz not found");

  const answerMap = new Map(answers.map((item) => [item.questionId, item.selectedAnswer]));
  const evaluated = quiz.questions.map((question) => {
    const selectedAnswer = answerMap.get(question.id);
    const isCorrect = selectedAnswer === question.correctAnswer;
    return {
      questionId: question.id,
      questionText: question.questionText,
      options: question.options as string[],
      correctAnswer: question.correctAnswer,
      selectedAnswer,
      explanation: question.explanation,
      isCorrect,
    };
  });

  const correct = evaluated.filter((item) => item.isCorrect).length;

  return {
    quiz,
    evaluated,
    score: percent(correct, quiz.questions.length),
  };
}
