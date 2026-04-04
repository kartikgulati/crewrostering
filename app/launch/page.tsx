import { ActiveLaunchPage } from "@/components/crew/active-launch-page";
import { hasDatabaseUrl } from "@/lib/prisma";
import { getActiveQuiz } from "@/lib/quiz";

export const dynamic = "force-dynamic";

export default async function LaunchPage() {
  if (!hasDatabaseUrl) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20">
        <div className="rounded-[32px] border border-amber-200 bg-white p-8 text-center shadow-sm">
          <h1 className="text-3xl font-semibold text-slate-900">Database Setup Required</h1>
          <p className="mt-3 text-sm text-slate-500">
            Set <code>DATABASE_URL</code> in your environment, then run <code>npm run db:push</code> and <code>npm run seed</code>.
          </p>
        </div>
      </div>
    );
  }

  const quiz = await getActiveQuiz();

  if (!quiz) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20">
        <div className="rounded-[32px] border border-slate-200 bg-white p-8 text-center shadow-sm">
          <h1 className="text-3xl font-semibold text-slate-900">No Active Launch Module</h1>
          <p className="mt-3 text-sm text-slate-500">An administrator needs to publish a launch before crew can complete verification.</p>
        </div>
      </div>
    );
  }

  return (
    <ActiveLaunchPage
      quiz={{
        id: quiz.id,
        title: quiz.title,
        description: quiz.description,
        content: quiz.content,
        questions: quiz.questions.map((question) => ({
          id: question.id,
          questionText: question.questionText,
          options: question.options as string[],
          explanation: question.explanation,
        })),
      }}
    />
  );
}
