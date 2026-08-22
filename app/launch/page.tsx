import { ActiveLaunchPage } from "@/components/crew/active-launch-page";
import { QuizPicker } from "@/components/crew/quiz-picker";
import { hasDatabaseUrl, isPrismaConnectionError, logPrismaConnectionError } from "@/lib/prisma";
import { getActiveQuizzes, getQuizById } from "@/lib/quiz";

export const dynamic = "force-dynamic";

function DatabaseUnavailableState() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-20">
      <div className="rounded-lg border border-cyan-200 bg-white p-8 text-center shadow-sm">
        <h1 className="text-3xl font-semibold text-slate-900">Database Unavailable</h1>
        <p className="mt-3 text-sm text-slate-500">
          The application cannot reach the database right now. Verify the PostgreSQL database is online and that
          <code> DATABASE_URL </code>
          is correct for this environment.
        </p>
      </div>
    </div>
  );
}

export default async function LaunchPage({
  searchParams,
}: {
  searchParams?: Promise<{ quizId?: string }>;
}) {
  if (!hasDatabaseUrl) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20">
        <div className="rounded-lg border border-cyan-200 bg-white p-8 text-center shadow-sm">
          <h1 className="text-3xl font-semibold text-slate-900">Database Setup Required</h1>
          <p className="mt-3 text-sm text-slate-500">
            Set <code>DATABASE_URL</code> and <code>DIRECT_URL</code> in your environment, then run <code>npm run db:push</code> and <code>npm run seed</code>.
          </p>
        </div>
      </div>
    );
  }

  const params = await searchParams;
  const quizId = params?.quizId?.trim();
  let activeQuizzes: Awaited<ReturnType<typeof getActiveQuizzes>> = [];
  let quiz: Awaited<ReturnType<typeof getQuizById>> = null;
  let databaseUnavailable = false;

  try {
    if (quizId) {
      quiz = await getQuizById(quizId);
    } else {
      activeQuizzes = await getActiveQuizzes();
    }
  } catch (error) {
    if (isPrismaConnectionError(error)) {
      logPrismaConnectionError(error, "app/launch/page");
      databaseUnavailable = true;
    } else {
      throw error;
    }
  }

  if (databaseUnavailable) {
    return <DatabaseUnavailableState />;
  }

  if (quizId) {
    if (!quiz) {
      return (
        <div className="mx-auto max-w-3xl px-4 py-20">
          <div className="rounded-lg border border-slate-200 bg-white p-8 text-center shadow-sm">
            <h1 className="text-3xl font-semibold text-slate-900">Quiz Not Found</h1>
            <p className="mt-3 text-sm text-slate-500">The requested quiz could not be found.</p>
          </div>
        </div>
      );
    }
  } else if (activeQuizzes.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20">
        <div className="rounded-lg border border-slate-200 bg-white p-8 text-center shadow-sm">
          <h1 className="text-3xl font-semibold text-slate-900">No Active Launch Module</h1>
          <p className="mt-3 text-sm text-slate-500">
            An administrator needs to publish a launch before crew can complete verification.
          </p>
        </div>
      </div>
    );
  } else if (activeQuizzes.length > 1) {
    return (
      <QuizPicker
        quizzes={activeQuizzes.map((q) => ({ id: q.id, title: q.title, description: q.description }))}
      />
    );
  } else {
    quiz = activeQuizzes[0];
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
