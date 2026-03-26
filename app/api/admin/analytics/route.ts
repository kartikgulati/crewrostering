import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!prisma) return NextResponse.json({ error: "Database is not configured" }, { status: 503 });

  const [count, average, byStore, leaderboard] = await Promise.all([
    prisma.userSubmission.count(),
    prisma.userSubmission.aggregate({ _avg: { score: true } }),
    prisma.userSubmission.groupBy({
      by: ["storeNumber"],
      _count: { _all: true },
      _avg: { score: true },
      orderBy: { storeNumber: "asc" },
    }),
    prisma.userSubmission.findMany({
      take: 5,
      orderBy: [{ score: "desc" }, { createdAt: "asc" }],
      select: { storeNumber: true, score: true, name: true },
    }),
  ]);

  return NextResponse.json({
    totalSubmissions: count,
    averageScore: Math.round(average._avg.score ?? 0),
    completionByStore: byStore.map((item) => ({
      storeNumber: item.storeNumber,
      count: item._count._all,
      averageScore: Math.round(item._avg.score ?? 0),
    })),
    leaderboard,
  });
}
