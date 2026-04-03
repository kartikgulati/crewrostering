"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Clock3, ShieldCheck } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { renderRichContent } from "@/lib/content";
import { submissionSchema } from "@/lib/validations";
import { useQuizSessionStore } from "@/store/quiz-session";

type Question = {
  id: string;
  questionText: string;
  options: string[];
  explanation?: string | null;
};

type ActiveQuizPayload = {
  id: string;
  title: string;
  description: string;
  content: unknown;
  questions: Question[];
};

type ResultPayload = {
  score: number;
  evaluated: Array<{
    questionId: string;
    questionText: string;
    options: string[];
    selectedAnswer?: number;
    correctAnswer: number;
    explanation?: string | null;
    isCorrect: boolean;
  }>;
};

type CrewFormValues = {
  name: string;
  storeNumber: string;
  submissionDate: string;
};

export function ActiveLaunchPage({ quiz }: { quiz: ActiveQuizPayload }) {
  const { hasViewedContent, markContentViewed, startQuiz, startedAt, reset } = useQuizSessionStore();
  const [stage, setStage] = useState<"intro" | "quiz" | "result">("intro");
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [result, setResult] = useState<ResultPayload | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const contentContainerRef = useRef<HTMLDivElement | null>(null);

  const today = useMemo(() => new Date().toISOString().slice(0, 10), []);
  const form = useForm<CrewFormValues>({
    defaultValues: { name: "", storeNumber: "", submissionDate: today },
    resolver: zodResolver(
      submissionSchema.pick({
        name: true,
        storeNumber: true,
        submissionDate: true,
      }),
    ),
  });

  const answeredCount = Object.keys(answers).length;
  const progress = Math.round((answeredCount / quiz.questions.length) * 100);

  useEffect(() => {
    const element = contentContainerRef.current;
    if (!element || hasViewedContent) return;

    const fitsWithoutScroll = element.scrollHeight <= element.clientHeight + 16;
    if (fitsWithoutScroll) {
      markContentViewed();
    }
  }, [hasViewedContent, markContentViewed, quiz.content]);

  async function handleSubmit() {
    const values = await form.trigger();
    if (!values) return;
    if (answeredCount !== quiz.questions.length) {
      setError("Answer every question before submitting.");
      return;
    }

    setSubmitting(true);
    setError(null);

    const payload = {
      ...form.getValues(),
      quizId: quiz.id,
      answers: quiz.questions.map((question) => ({
        questionId: question.id,
        selectedAnswer: answers[question.id],
      })),
      durationSeconds: startedAt ? Math.round((Date.now() - startedAt) / 1000) : undefined,
    };

    const response = await fetch("/api/public/submissions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    if (!response.ok) {
      setError(data.error ?? "Submission failed.");
      setSubmitting(false);
      return;
    }

    setResult(data);
    setStage("result");
    setSubmitting(false);
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-5xl flex-col gap-6 px-4 py-6 sm:px-6">
      <div className="rounded-[32px] bg-[radial-gradient(circle_at_top_left,_rgba(245,158,11,0.25),_transparent_32%),linear-gradient(135deg,_#0f172a,_#1e293b)] p-6 text-white shadow-xl">
        <Badge className="bg-white/15 text-white">Active Launch</Badge>
        <h1 className="mt-4 font-serif text-3xl font-semibold tracking-tight sm:text-4xl">{quiz.title}</h1>
        <p className="mt-3 max-w-2xl text-sm text-slate-200 sm:text-base">{quiz.description}</p>
        <div className="mt-4 flex flex-wrap gap-3 text-sm text-slate-200">
          
          
        </div>
      </div>

      {stage === "intro" && (
        <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <Card className="p-5">
            <h2 className="text-lg font-semibold text-slate-900">Enter Crew Details </h2>
            <p className="mt-2 text-sm text-slate-500">Enter your details, review the launch notes, then start the quiz.</p>
            <div className="mt-5 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full name</Label>
                <Input id="name" {...form.register("name")} />
                <p className="text-xs text-red-600">{form.formState.errors.name?.message}</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="storeNumber">Store number</Label>
                <Input id="storeNumber" {...form.register("storeNumber")} />
                <p className="text-xs text-red-600">{form.formState.errors.storeNumber?.message}</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="submissionDate">Date</Label>
                <Input id="submissionDate" type="date" {...form.register("submissionDate")} disabled />
                <p className="text-xs text-red-600">{form.formState.errors.submissionDate?.message}</p>
              </div>
            </div>
          </Card>

          <Card className="overflow-hidden">
            <div className="border-b border-slate-200 px-5 py-4">
              <h2 className="text-lg font-semibold text-slate-900">Launch Briefing</h2>
              <p className="mt-1 text-sm text-slate-500">Read the content before continuing to the quiz.</p>
            </div>
            <div
              ref={contentContainerRef}
              className="max-h-[480px] overflow-y-auto px-5 py-4"
              onScroll={(event) => {
                const element = event.currentTarget;
                const reachedBottom = element.scrollTop + element.clientHeight >= element.scrollHeight - 16;
                if (reachedBottom && !hasViewedContent) markContentViewed();
              }}
            >
              <article
                className="prose prose-slate max-w-none prose-headings:font-serif prose-img:rounded-2xl"
                dangerouslySetInnerHTML={{ __html: renderRichContent(quiz.content) }}
              />
            </div>
            <div className="flex flex-col gap-3 border-t border-slate-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-slate-500">
                {hasViewedContent ? "Content fully viewed" : "Scroll to the bottom to unlock the quiz"}
              </p>
              <div className="flex flex-col gap-3 sm:flex-row">
                {!hasViewedContent ? (
                  <Button variant="outline" type="button" onClick={markContentViewed}>
                    I reviewed the content
                  </Button>
                ) : null}
                <Button
                  type="button"
                  onClick={async () => {
                    const isValid = await form.trigger();
                    if (!isValid) {
                      setError("Enter your details before starting the quiz.");
                      return;
                    }
                    if (!hasViewedContent) {
                      setError("Review the launch content before starting the quiz.");
                      return;
                    }

                    const values = form.getValues();
                    const query = new URLSearchParams({
                      name: values.name.trim(),
                      storeNumber: values.storeNumber.trim(),
                    });
                    const existingResponse = await fetch(`/api/public/submissions?${query.toString()}`);
                    const existingData = await existingResponse.json();

                    if (!existingResponse.ok) {
                      setError(existingData.error ?? "Unable to verify existing submission.");
                      return;
                    }

                    if (existingData.exists) {
                      setError("A submission already exists for this name, store number. The quiz cannot be started again.");
                      return;
                    }

                    setError(null);
                    startQuiz();
                    setStage("quiz");
                  }}
                >
                  Start Quiz
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}

      {stage === "intro" && error ? <p className="text-sm text-red-600">{error}</p> : null}

      {stage === "quiz" && (
        <Card className="p-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Launch Quiz</h2>
              <p className="mt-1 text-sm text-slate-500">Answer every question based on the briefing content above.</p>
            </div>
            <div className="min-w-[180px]">
              <div className="mb-2 flex items-center justify-between text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                <span>Progress</span>
                <span>{progress}%</span>
              </div>
              <Progress value={progress} />
            </div>
          </div>

          <div className="mt-6 space-y-5">
            {quiz.questions.map((question, index) => (
              <div key={question.id} className="rounded-[24px] border border-slate-200 p-4">
                <p className="text-sm font-semibold uppercase tracking-[0.16em] text-amber-700">Question {index + 1}</p>
                <h3 className="mt-2 text-base font-semibold text-slate-900">{question.questionText}</h3>
                <div className="mt-4 grid gap-3">
                  {question.options.map((option, optionIndex) => {
                    const selected = answers[question.id] === optionIndex;
                    return (
                      <button
                        key={`${question.id}-${optionIndex}`}
                        type="button"
                        aria-pressed={selected}
                        className={`rounded-2xl border px-4 py-3 text-left text-sm transition ${
                          selected ? "border-amber-500 bg-amber-50 text-slate-950" : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"
                        }`}
                        onClick={() => setAnswers((current) => ({ ...current, [question.id]: optionIndex }))}
                      >
                        {option}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {error ? <p className="mt-4 text-sm text-red-600">{error}</p> : null}
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Button variant="outline" onClick={() => setStage("intro")} type="button">
              Back to content
            </Button>
            <Button onClick={handleSubmit} disabled={submitting} type="button">
              {submitting ? "Submitting..." : "Submit Quiz"}
            </Button>
          </div>
        </Card>
      )}

      {stage === "result" && result && (
        <Card className="p-5">
          <Badge>Submission Complete</Badge>
          <h2 className="mt-3 text-2xl font-semibold text-slate-900">Score: {result.score}%</h2>
          <p className="mt-2 text-sm text-slate-500">Your answers have been saved. Review the result below before closing.</p>
          <div className="mt-6 space-y-4">
            {result.evaluated.map((item, index) => (
              <div key={item.questionId} className="rounded-[24px] border border-slate-200 p-4">
                <p className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-500">Question {index + 1}</p>
                <h3 className="mt-2 text-base font-semibold text-slate-900">{item.questionText}</h3>
                <p className="mt-3 text-sm text-slate-600">
                  Your answer:{" "}
                  <span className={item.isCorrect ? "font-semibold text-emerald-700" : "font-semibold text-red-700"}>
                    {typeof item.selectedAnswer === "number" ? item.options[item.selectedAnswer] : "No answer"}
                  </span>
                </p>
                <p className="mt-1 text-sm font-medium text-slate-900">Correct answer: {item.options[item.correctAnswer]}</p>
                {item.explanation ? <p className="mt-2 text-sm text-slate-500">{item.explanation}</p> : null}
              </div>
            ))}
          </div>
          <div className="mt-6">
            <Button
              type="button"
              onClick={() => {
                reset();
                form.reset({ name: "", storeNumber: "", submissionDate: today });
                setAnswers({});
                setResult(null);
                setStage("intro");
              }}
            >
             Home
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
}
