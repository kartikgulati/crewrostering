import { z } from "zod";

export const editorJsonSchema = z.record(z.string(), z.any()).or(z.array(z.any()));

export const questionSchema = z.object({
  id: z.string().optional(),
  questionText: z.string().min(8, "Question must be at least 8 characters."),
  options: z.array(z.string().min(1, "Option cannot be empty.")).min(2).max(6),
  correctAnswer: z.number().int().min(0),
  explanation: z.string().optional(),
  order: z.number().int().min(1),
});

export const quizSchema = z.object({
  title: z.string().min(3).max(120),
  description: z.string().min(10).max(300),
  content: z.any(),
  questions: z.array(questionSchema).min(1, "At least one question is required."),
});

export const submissionSchema = z.object({
  name: z.string().min(2).max(120),
  storeNumber: z.string().min(1).max(20),
  submissionDate: z.string().date(),
  quizId: z.string().min(1),
  answers: z.array(
    z.object({
      questionId: z.string().min(1),
      selectedAnswer: z.number().int().min(0),
    }),
  ),
  durationSeconds: z.number().int().min(0).max(7200).optional(),
});

export const submissionFiltersSchema = z.object({
  storeNumber: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  minScore: z.coerce.number().int().min(0).max(100).optional(),
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(10),
});

export const quizSuggestionSchema = z.object({
  content: z.string().min(50),
});
