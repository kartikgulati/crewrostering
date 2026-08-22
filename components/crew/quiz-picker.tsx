import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

type QuizOption = {
  id: string;
  title: string;
  description: string;
};

export function QuizPicker({ quizzes }: { quizzes: QuizOption[] }) {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <div className="rounded-lg bg-slate-950 p-6 text-white shadow-[0_24px_80px_rgba(15,23,42,0.16)]">
        <Badge className="border-white/10 bg-white/[0.08] text-cyan-100">Available Quizzes</Badge>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight">Choose a launch module</h1>
        <p className="mt-2 max-w-2xl text-sm text-slate-300">
          Multiple quizzes are currently active. Pick the one your store needs to complete.
        </p>
      </div>

      <div className="mt-6 space-y-3">
        {quizzes.map((quiz) => (
          <Card key={quiz.id} className="p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">{quiz.title}</h2>
                <p className="mt-1 text-sm text-slate-500">{quiz.description}</p>
              </div>
              <Button asChild>
                <Link href={`/launch?quizId=${encodeURIComponent(quiz.id)}`}>Start</Link>
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
