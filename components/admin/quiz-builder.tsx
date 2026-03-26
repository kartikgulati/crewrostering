"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Trash2, WandSparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RichTextEditor } from "@/components/rich-text-editor";
import { quizSchema } from "@/lib/validations";

type QuestionInput = {
  id?: string;
  questionText: string;
  options: string[];
  correctAnswer: number;
  explanation?: string | null;
  order: number;
};

type QuizInput = {
  id?: string;
  title: string;
  description: string;
  content: Record<string, unknown>;
  questions: QuestionInput[];
};

export function QuizBuilder({
  initialValue,
  onSaved,
}: {
  initialValue?: QuizInput | null;
  onSaved: () => void;
}) {
  const [content, setContent] = useState<Record<string, unknown>>(
    initialValue?.content ?? { type: "doc", content: [{ type: "paragraph", content: [{ type: "text", text: "New launch content" }] }] },
  );
  const [questions, setQuestions] = useState<QuestionInput[]>(
    initialValue?.questions ?? [{ questionText: "", options: ["", ""], correctAnswer: 0, explanation: "", order: 1 }],
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<Omit<QuizInput, "content" | "questions">>({
    defaultValues: {
      title: initialValue?.title ?? "",
      description: initialValue?.description ?? "",
    },
    resolver: zodResolver(quizSchema.pick({ title: true, description: true })),
  });

  async function saveQuiz() {
    const valid = await form.trigger();
    const payload = {
      ...form.getValues(),
      content,
      questions: questions.map((question, index) => ({ ...question, order: index + 1 })),
    };

    const parsed = quizSchema.safeParse(payload);
    if (!valid || !parsed.success) {
      setError(parsed.success ? "Fix the form errors before saving." : parsed.error.issues[0]?.message ?? "Fix the form errors.");
      return;
    }

    setLoading(true);
    setError(null);

    const response = await fetch(initialValue?.id ? `/api/admin/quizzes/${initialValue.id}` : "/api/admin/quizzes", {
      method: initialValue?.id ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const data = await response.json();
      setError(data.error ?? "Unable to save quiz.");
      setLoading(false);
      return;
    }

    onSaved();
    setLoading(false);
  }

  async function suggestQuestions() {
    setLoading(true);
    setError(null);
    const response = await fetch("/api/admin/ai/suggest-questions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: JSON.stringify(content) }),
    });

    const data = await response.json();
    if (!response.ok) {
      setError(data.error ?? "Unable to generate suggestions.");
      setLoading(false);
      return;
    }

    setQuestions(
      data.questions.map((question: QuestionInput, index: number) => ({
        ...question,
        order: index + 1,
      })),
    );
    setLoading(false);
  }

  return (
    <div className="space-y-6">
      <Card className="p-5">
        <div className="grid gap-5 lg:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="quiz-title">Launch title</Label>
            <Input id="quiz-title" {...form.register("title")} placeholder="Ex: Spicy Maple Breakfast Launch" />
            <p className="text-xs text-red-600">{form.formState.errors.title?.message}</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="quiz-description">Short description</Label>
            <Input id="quiz-description" {...form.register("description")} placeholder="High-level summary for crew and managers" />
            <p className="text-xs text-red-600">{form.formState.errors.description?.message}</p>
          </div>
        </div>
      </Card>

      <div>
        <div className="mb-3 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">Rich Launch Content</h3>
            <p className="text-sm text-slate-500">Use headings, paragraphs, lists, and image URLs to create the training module.</p>
          </div>
        </div>
        <RichTextEditor value={content} onChange={setContent} />
      </div>

      <div className="space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">Quiz Builder</h3>
            <p className="text-sm text-slate-500">Questions should be directly answerable from the launch content.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button type="button" variant="secondary" onClick={suggestQuestions} disabled={loading}>
              <WandSparkles className="mr-2 size-4" /> AI Suggest
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() =>
                setQuestions((current) => [
                  ...current,
                  { questionText: "", options: ["", ""], correctAnswer: 0, explanation: "", order: current.length + 1 },
                ])
              }
            >
              <Plus className="mr-2 size-4" /> Add Question
            </Button>
          </div>
        </div>

        {questions.map((question, index) => (
          <Card className="p-5" key={`question-${index}`}>
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.16em] text-amber-700">Question {index + 1}</p>
              </div>
              {questions.length > 1 ? (
                <Button type="button" variant="ghost" size="sm" onClick={() => setQuestions((current) => current.filter((_, itemIndex) => itemIndex !== index))}>
                  <Trash2 className="size-4" />
                </Button>
              ) : null}
            </div>
            <div className="mt-4 space-y-4">
              <div className="space-y-2">
                <Label>Question text</Label>
                <Textarea
                  value={question.questionText}
                  onChange={(event) =>
                    setQuestions((current) =>
                      current.map((item, itemIndex) => (itemIndex === index ? { ...item, questionText: event.target.value } : item)),
                    )
                  }
                />
              </div>
              <div className="grid gap-3 lg:grid-cols-2">
                {question.options.map((option, optionIndex) => (
                  <div key={`option-${index}-${optionIndex}`} className="space-y-2">
                    <Label>Option {optionIndex + 1}</Label>
                    <Input
                      value={option}
                      onChange={(event) =>
                        setQuestions((current) =>
                          current.map((item, itemIndex) =>
                            itemIndex === index
                              ? {
                                  ...item,
                                  options: item.options.map((opt, optIndex) => (optIndex === optionIndex ? event.target.value : opt)),
                                }
                              : item,
                          ),
                        )
                      }
                    />
                  </div>
                ))}
              </div>
              <div className="flex flex-wrap gap-2">
                {question.options.map((_, optionIndex) => (
                  <Button
                    key={`correct-${index}-${optionIndex}`}
                    type="button"
                    variant={question.correctAnswer === optionIndex ? "default" : "outline"}
                    size="sm"
                    onClick={() =>
                      setQuestions((current) => current.map((item, itemIndex) => (itemIndex === index ? { ...item, correctAnswer: optionIndex } : item)))
                    }
                  >
                    Correct: Option {optionIndex + 1}
                  </Button>
                ))}
              </div>
              <div className="space-y-2">
                <Label>Explanation (optional)</Label>
                <Textarea
                  value={question.explanation ?? ""}
                  onChange={(event) =>
                    setQuestions((current) =>
                      current.map((item, itemIndex) => (itemIndex === index ? { ...item, explanation: event.target.value } : item)),
                    )
                  }
                  placeholder="Add an optional explanation shown after submission."
                />
              </div>
            </div>
          </Card>
        ))}

        {error ? <p className="text-sm text-red-600">{error}</p> : null}
        <Button type="button" onClick={saveQuiz} disabled={loading}>
          {loading ? "Saving..." : initialValue?.id ? "Update Launch Module" : "Create Launch Module"}
        </Button>
      </div>
    </div>
  );
}
