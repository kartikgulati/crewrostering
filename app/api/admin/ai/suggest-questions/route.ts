import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import { quizSuggestionSchema } from "@/lib/validations";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const parsed = quizSuggestionSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid content." }, { status: 400 });

  const text = parsed.data.content;
  const sentences = text
    .replace(/[{}[\]"]/g, " ")
    .split(/[.!?]/)
    .map((item) => item.trim())
    .filter((item) => item.length > 20)
    .slice(0, 3);

  const fallback = sentences.map((sentence, index) => ({
    questionText: `Which statement matches the launch guidance in point ${index + 1}?`,
    options: [sentence, "It applies only after 11 AM", "It is optional for the launch", "It is not mentioned in the content"],
    correctAnswer: 0,
    explanation: "This suggestion is derived directly from the launch content.",
    order: index + 1,
  }));

  return NextResponse.json({
    questions:
      fallback.length > 0
        ? fallback
        : [
            {
              questionText: "What is the most important crew action described in the launch content?",
              options: ["Follow the launch guidance exactly as written", "Skip the launch steps during busy periods", "Guess if details are unclear", "Only managers need to know the content"],
              correctAnswer: 0,
              explanation: "This fallback keeps the question tied to the briefing requirement.",
              order: 1,
            },
          ],
  });
}
