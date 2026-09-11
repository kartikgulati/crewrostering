import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "SUPER_ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!prisma) return NextResponse.json({ error: "Database is not configured" }, { status: 503 });

  try {
    const admins = await prisma.user.findMany({
      where: { role: "ADMIN" },
      include: {
        _count: {
          select: { quizzes: true },
        },
      },
    });

    // Calculate more detailed metrics for each admin
    const adminsWithMetrics = await Promise.all(
      admins.map(async (admin) => {
        const liveQuizzesCount = await prisma!.quiz.count({
          where: { adminId: admin.id, isActive: true },
        });
        const totalInteractions = await prisma!.userSubmission.count({
          where: { quiz: { adminId: admin.id } },
        });

        return {
          ...admin,
          _count: {
            ...admin._count,
            liveQuizzes: liveQuizzesCount,
            interactions: totalInteractions,
          },
        };
      })
    );

    return NextResponse.json({ admins: adminsWithMetrics });
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "SUPER_ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!prisma) return NextResponse.json({ error: "Database is not configured" }, { status: 503 });

  try {
    const body = await request.json();
    const { username, password, quizLimit } = body;

    if (!username || !password) {
      return NextResponse.json({ error: "Username and password are required" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = await prisma.user.create({
      data: {
        username,
        password: hashedPassword,
        role: "ADMIN",
        quizLimit: quizLimit || 10,
      },
    });

    return NextResponse.json({ admin }, { status: 201 });
  } catch (error: any) {
    if (error.code === "P2002") {
      return NextResponse.json({ error: "Username already exists" }, { status: 400 });
    }
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
