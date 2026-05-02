"use client";

import { useEffect, useState } from "react";
import { BarChart3, Download, ExternalLink, LogOut, Trash2, Trophy } from "lucide-react";
import { signOut } from "next-auth/react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { QuizBuilder } from "@/components/admin/quiz-builder";
import { Table, TD, TH } from "@/components/ui/table";
import { formatDate } from "@/lib/utils";

type QuizRow = {
  id: string;
  title: string;
  description: string;
  isActive: boolean;
  createdAt: string;
  content: Record<string, unknown>;
  questions: Array<{
    id: string;
    questionText: string;
    options: string[];
    correctAnswer: number;
    explanation?: string | null;
    order: number;
  }>;
};

type SubmissionRow = {
  id: string;
  name: string;
  storeNumber: string;
  quizId: string;
  quizTitle: string;
  submissionDate: string;
  score: number;
  createdAt: string;
};

type Analytics = {
  totalSubmissions: number;
  averageScore: number;
  completionByStore: Array<{ storeNumber: string; count: number; averageScore: number }>;
  leaderboard: Array<{ storeNumber: string; score: number; name: string }>;
};

export function AdminDashboard({
  initialQuizzes,
  initialSubmissions,
  initialAnalytics,
}: {
  initialQuizzes: QuizRow[];
  initialSubmissions: SubmissionRow[];
  initialAnalytics: Analytics;
}) {
  const [activeTab, setActiveTab] = useState<"dashboard" | "create" | "submissions">("dashboard");
  const [quizzes, setQuizzes] = useState(initialQuizzes);
  const [selectedQuiz, setSelectedQuiz] = useState<QuizRow | null>(initialQuizzes[0] ?? null);
  const [submissions, setSubmissions] = useState(initialSubmissions);
  const [analytics, setAnalytics] = useState(initialAnalytics);
  const [filters, setFilters] = useState({ storeNumber: "", quizId: "", startDate: "", endDate: "", minScore: "" });
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const [exportError, setExportError] = useState<string | null>(null);
  const [deletingSubmissionId, setDeletingSubmissionId] = useState<string | null>(null);

  function buildSubmissionQuery(currentPage: number) {
    const params = new URLSearchParams({
      page: String(currentPage),
      pageSize: String(pageSize),
    });

    if (filters.storeNumber) params.set("storeNumber", filters.storeNumber);
    if (filters.quizId) params.set("quizId", filters.quizId);
    if (filters.startDate) params.set("startDate", filters.startDate);
    if (filters.endDate) params.set("endDate", filters.endDate);
    if (filters.minScore) params.set("minScore", filters.minScore);

    return params.toString();
  }

  async function refresh() {
    const [quizResponse, submissionResponse, analyticsResponse] = await Promise.all([
      fetch("/api/admin/quizzes"),
      fetch(`/api/admin/submissions?${buildSubmissionQuery(page)}`),
      fetch("/api/admin/analytics"),
    ]);

    const [quizData, submissionData, analyticsData] = await Promise.all([
      quizResponse.json(),
      submissionResponse.json(),
      analyticsResponse.json(),
    ]);

    setQuizzes(quizData.quizzes);
    setSelectedQuiz((current) => quizData.quizzes.find((quiz: QuizRow) => quiz.id === current?.id) ?? quizData.quizzes[0] ?? null);
    setSubmissions(submissionData.submissions);
    setAnalytics(analyticsData);
  }

  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  async function activateQuiz(id: string) {
    await fetch(`/api/admin/quizzes/${id}/activate`, { method: "POST" });
    refresh();
  }

  async function deleteQuiz(id: string) {
    await fetch(`/api/admin/quizzes/${id}`, { method: "DELETE" });
    refresh();
  }

  async function exportPdf() {
    setExportError(null);
    const response = await fetch(`/api/admin/submissions/export?${buildSubmissionQuery(page)}`);
    if (!response.ok) {
      const message = (await response.text()).trim();
      setExportError(message || "Unable to export PDF.");
      return;
    }

    const contentType = response.headers.get("content-type") ?? "";
    if (!contentType.includes("application/pdf")) {
      setExportError("Export did not return a PDF file.");
      return;
    }

    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "submission-report.pdf";
    anchor.click();
    URL.revokeObjectURL(url);
  }

  async function deleteSubmission(id: string) {
    setDeletingSubmissionId(id);

    const response = await fetch(`/api/admin/submissions/${id}`, { method: "DELETE" });
    if (!response.ok) {
      setDeletingSubmissionId(null);
      return;
    }

    await refresh();
    setDeletingSubmissionId(null);
  }

  function openQuizInNewTab(id: string) {
    window.open(`/launch?quizId=${encodeURIComponent(id)}`, "_blank", "noopener,noreferrer");
  }

  const tabs = [
    { id: "dashboard", label: "Dashboard" },
    { id: "create", label: "Create Quiz" },
    { id: "submissions", label: "Submissions" },
  ] as const;

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
      <div className="rounded-lg bg-slate-950 p-6 text-white shadow-[0_24px_80px_rgba(15,23,42,0.16)]">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <Badge className="border-white/10 bg-white/[0.08] text-cyan-100">Admin Panel</Badge>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight">Crew Launch Control Center</h1>
            <p className="mt-2 max-w-3xl text-sm text-slate-300">
              Create launch quizes, keep exactly one quiz active, review completion rates, and export store-level reports.
            </p>
          </div>
          <Button variant="outline" className="border-white/20 bg-white/5 text-white hover:bg-white/10" onClick={() => signOut({ callbackUrl: "/admin/login" })}>
            <LogOut className="mr-2 size-4" /> Sign out
          </Button>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                  isActive ? "bg-white text-slate-950" : "bg-white/10 text-white hover:bg-white/15"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {activeTab === "dashboard" ? (
        <div className="mt-6 space-y-6">
          <Card className="p-5">
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <div className="rounded-lg bg-slate-50 p-4">
                <p className="text-sm text-slate-500">Total quizzes</p>
                <p className="mt-2 text-3xl font-semibold text-slate-950">{quizzes.length}</p>
              </div>
              <div className="rounded-lg bg-slate-50 p-4">
                <p className="text-sm text-slate-500">Total submissions</p>
                <p className="mt-2 text-3xl font-semibold text-slate-950">{analytics.totalSubmissions}</p>
              </div>
              <div className="rounded-lg bg-slate-50 p-4">
                <p className="text-sm text-slate-500">Average score</p>
                <p className="mt-2 text-3xl font-semibold text-slate-950">{analytics.averageScore}%</p>
              </div>
              <div className="rounded-lg bg-slate-50 p-4">
                <p className="flex items-center gap-2 text-sm text-slate-500">
                  <BarChart3 className="size-4" /> Stores tracked
                </p>
                <p className="mt-2 text-3xl font-semibold text-slate-950">{analytics.completionByStore.length}</p>
              </div>
            </div>
          </Card>

          <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
            <Card className="p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-lg font-semibold text-slate-900">All Quizzes</h2>
                  <p className="text-sm text-slate-500">Overview of every listed quiz and its current status.</p>
                </div>
                <Button
                  type="button"
                  onClick={() => {
                    setSelectedQuiz({
                      id: "",
                      title: "",
                      description: "",
                      isActive: false,
                      createdAt: new Date().toISOString(),
                      content: { type: "doc", content: [{ type: "paragraph", content: [{ type: "text", text: "New launch content" }] }] },
                      questions: [{ id: "", questionText: "", options: ["", ""], correctAnswer: 0, explanation: "", order: 1 }],
                    });
                    setActiveTab("create");
                  }}
                >
                  Create Quiz
                </Button>
              </div>
              <div className="mt-4 space-y-3">
                {quizzes.map((quiz) => (
                  <div key={quiz.id} className="rounded-lg border border-slate-200 p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-slate-900">{quiz.title}</h3>
                          {quiz.isActive ? <Badge>Active</Badge> : null}
                        </div>
                        <p className="mt-1 text-sm text-slate-500">{quiz.description}</p>
                        <p className="mt-2 text-xs uppercase tracking-[0.16em] text-slate-400">Created {formatDate(quiz.createdAt)}</p>
                      </div>
                      <p className="text-sm text-slate-500">{quiz.questions.length} questions</p>
                    </div>
                    <div className="mt-4 flex flex-wrap gap-2">
                      <Button type="button" variant="outline" size="sm" onClick={() => openQuizInNewTab(quiz.id)}>
                        <ExternalLink className="mr-2 size-4" /> Open Quiz
                      </Button>
                      <Button
                        type="button"
                        variant="secondary"
                        size="sm"
                        onClick={() => {
                          setSelectedQuiz(quiz);
                          setActiveTab("create");
                        }}
                      >
                        Edit
                      </Button>
                      <Button type="button" variant="outline" size="sm" onClick={() => activateQuiz(quiz.id)}>
                        Set active
                      </Button>
                      <Button type="button" variant="ghost" size="sm" onClick={() => deleteQuiz(quiz.id)}>
                        Delete
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-5">
              <h2 className="text-lg font-semibold text-slate-900">Top Store Performance</h2>
              <div className="mt-4 space-y-3">
                <div className="rounded-lg bg-slate-50 p-4">
                  <p className="flex items-center gap-2 text-sm text-slate-500">
                    <Trophy className="size-4" /> Leading store
                  </p>
                  <p className="mt-2 text-lg font-semibold text-slate-950">{analytics.leaderboard[0]?.storeNumber ?? "No data"}</p>
                </div>
                {analytics.leaderboard.map((entry, index) => (
                  <div key={`${entry.storeNumber}-${entry.name}-${index}`} className="flex items-center justify-between rounded-lg bg-slate-50 px-4 py-3">
                    <div>
                      <p className="font-medium text-slate-900">{entry.name}</p>
                      <p className="text-sm text-slate-500">Store {entry.storeNumber}</p>
                    </div>
                    <p className="text-lg font-semibold text-cyan-700">{entry.score}%</p>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      ) : null}

      {activeTab === "create" ? (
        <div className="mt-6 grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
          <Card className="p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">Quiz Menu</h2>
                <p className="text-sm text-slate-500">Create a new quiz or choose an existing one to edit.</p>
              </div>
              <Button
                type="button"
                onClick={() =>
                  setSelectedQuiz({
                    id: "",
                    title: "",
                    description: "",
                    isActive: false,
                    createdAt: new Date().toISOString(),
                    content: { type: "doc", content: [{ type: "paragraph", content: [{ type: "text", text: "New launch content" }] }] },
                    questions: [{ id: "", questionText: "", options: ["", ""], correctAnswer: 0, explanation: "", order: 1 }],
                  })
                }
              >
                New Quiz
              </Button>
            </div>
            <div className="mt-4 space-y-3">
              {quizzes.map((quiz) => (
                <div key={quiz.id} className="rounded-lg border border-slate-200 p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-slate-900">{quiz.title}</h3>
                        {quiz.isActive ? <Badge>Active</Badge> : null}
                      </div>
                      <p className="mt-1 text-sm text-slate-500">{quiz.description}</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Button type="button" variant="outline" size="sm" onClick={() => openQuizInNewTab(quiz.id)}>
                        <ExternalLink className="mr-2 size-4" /> Open Quiz
                      </Button>
                      <Button type="button" variant="secondary" size="sm" onClick={() => setSelectedQuiz(quiz)}>
                        Edit
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <QuizBuilder key={selectedQuiz?.id || "new-module"} initialValue={selectedQuiz} onSaved={refresh} />
        </div>
      ) : null}

      {activeTab === "submissions" ? (
        <div className="mt-6 space-y-6">
          <Card className="p-5">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">Submission Filters</h2>
                <p className="text-sm text-slate-500">View all submission data, filter records, and export reports.</p>
              </div>
              <Button type="button" variant="outline" onClick={exportPdf}>
                <Download className="mr-2 size-4" /> Export PDF
              </Button>
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <Input placeholder="Store number" value={filters.storeNumber} onChange={(event) => setFilters((current) => ({ ...current, storeNumber: event.target.value }))} />
              <select
                value={filters.quizId}
                onChange={(event) => setFilters((current) => ({ ...current, quizId: event.target.value }))}
                className="flex h-11 w-full rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm text-slate-900 outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20"
              >
                <option value="">All quizzes</option>
                {quizzes.map((quiz) => (
                  <option key={quiz.id} value={quiz.id}>
                    {quiz.title}
                  </option>
                ))}
              </select>
              <Input type="number" placeholder="Minimum score" value={filters.minScore} onChange={(event) => setFilters((current) => ({ ...current, minScore: event.target.value }))} />
              <Input type="date" value={filters.startDate} onChange={(event) => setFilters((current) => ({ ...current, startDate: event.target.value }))} />
              <Input type="date" value={filters.endDate} onChange={(event) => setFilters((current) => ({ ...current, endDate: event.target.value }))} />
            </div>
            <div className="mt-4">
              <Button
                type="button"
                onClick={() => {
                  setPage(1);
                  refresh();
                }}
              >
                Apply Filters
              </Button>
            </div>
            {exportError ? <p className="mt-3 text-sm text-red-600">{exportError}</p> : null}
          </Card>

          <Card className="overflow-hidden">
            <div className="border-b border-slate-200 px-5 py-4">
              <h2 className="text-lg font-semibold text-slate-900">All Submission Data</h2>
            </div>
            <div className="overflow-x-auto">
              <Table>
                <thead className="bg-slate-50">
                  <tr>
                    <TH>Name</TH>
                    <TH>Store</TH>
                    <TH>Quiz</TH>
                    <TH>Date</TH>
                    <TH>Score</TH>
                    <TH>Completed</TH>
                    <TH>Actions</TH>
                  </tr>
                </thead>
                <tbody>
                  {submissions.map((submission) => (
                    <tr key={submission.id} className="border-t border-slate-100">
                      <TD>{submission.name}</TD>
                      <TD>{submission.storeNumber}</TD>
                      <TD>{submission.quizTitle}</TD>
                      <TD>{formatDate(submission.submissionDate)}</TD>
                      <TD>{submission.score}%</TD>
                      <TD>{formatDate(submission.createdAt, "MMM d, yyyy h:mm a")}</TD>
                      <TD>
                        <Button
                          className="bg-red-50 text-red-700 hover:bg-red-100"
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteSubmission(submission.id)}
                          disabled={deletingSubmissionId === submission.id}
                        >
                          <Trash2 className="size-4" />
                        </Button>
                      </TD>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
            <div className="flex items-center justify-between border-t border-slate-200 px-5 py-4">
              <Button type="button" variant="outline" size="sm" onClick={() => setPage((current) => Math.max(1, current - 1))} disabled={page === 1}>
                Previous
              </Button>
              <p className="text-sm text-slate-500">Page {page}</p>
              <Button type="button" variant="outline" size="sm" onClick={() => setPage((current) => current + 1)} disabled={submissions.length < pageSize}>
                Next
              </Button>
            </div>
          </Card>
        </div>
      ) : null}
    </div>
  );
}
