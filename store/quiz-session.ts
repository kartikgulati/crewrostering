"use client";

import { create } from "zustand";

type QuizSessionState = {
  hasViewedContent: boolean;
  startedAt: number | null;
  markContentViewed: () => void;
  startQuiz: () => void;
  reset: () => void;
};

export const useQuizSessionStore = create<QuizSessionState>((set) => ({
  hasViewedContent: false,
  startedAt: null,
  markContentViewed: () => set({ hasViewedContent: true }),
  startQuiz: () => set((state) => ({ startedAt: state.startedAt ?? Date.now() })),
  reset: () => set({ hasViewedContent: false, startedAt: null }),
}));
