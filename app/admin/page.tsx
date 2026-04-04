import { AdminDashboard } from "@/components/admin/admin-dashboard";
import { hasDatabaseUrl, prisma } from "@/lib/prisma";
import { requireAdminSession } from "@/lib/session";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  await requireAdminSession();

  if (!hasDatabaseUrl || !prisma) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20">
        <div className="rounded-[32px] border border-amber-200 bg-white p-8 text-center shadow-sm">
          <h1 className="text-3xl font-semibold text-slate-900">Database Setup Required</h1>
          <p className="mt-3 text-sm text-slate-500">
            Configure <code>DATABASE_URL</code> before using the admin panel, then run <code>npm run db:push</code> and <code>npm run seed</code>.
          </p>
        </div>
      </div>
    );
  }

  const [quizzes, submissions, storeStats, leaderboardRaw] = await Promise.all([
    prisma.quiz.findMany({
      include: { questions: { orderBy: { order: "asc" } } },
      orderBy: { createdAt: "desc" },
    }),
    prisma.userSubmission.findMany({
      take: 10,
      orderBy: { createdAt: "desc" },
      include: {
        quiz: {
          select: {
            title: true,
          },
        },
      },
    }),
    prisma.userSubmission.groupBy({
      by: ["storeNumber"],
      _count: { _all: true },
      _avg: { score: true },
    }),
    prisma.userSubmission.findMany({
      orderBy: [{ score: "desc" }, { createdAt: "asc" }],
      take: 5,
      select: { storeNumber: true, score: true, name: true },
    }),
  ]);

  const totalSubmissions = await prisma.userSubmission.count();
  const averageAggregate = await prisma.userSubmission.aggregate({ _avg: { score: true } });

  return (
    <AdminDashboard
      initialQuizzes={quizzes.map((quiz) => ({
        ...quiz,
        content: quiz.content as Record<string, unknown>,
        questions: quiz.questions.map((question) => ({
          ...question,
          options: question.options as string[],
          explanation: question.explanation,
        })),
        createdAt: quiz.createdAt.toISOString(),
      }))}
      initialSubmissions={submissions.map((submission) => ({
        ...submission,
        quizTitle: submission.quiz.title,
        submissionDate: submission.submissionDate.toISOString(),
        createdAt: submission.createdAt.toISOString(),
      }))}
      initialAnalytics={{
        totalSubmissions,
        averageScore: Math.round(averageAggregate._avg.score ?? 0),
        completionByStore: storeStats.map((item) => ({
          storeNumber: item.storeNumber,
          count: item._count._all,
          averageScore: Math.round(item._avg.score ?? 0),
        })),
        leaderboard: leaderboardRaw,
      }}
    />
  );
}
