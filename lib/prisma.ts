import { Prisma, PrismaClient } from "@prisma/client";

declare global {
  var prisma: PrismaClient | undefined;
}

export const hasDatabaseUrl = Boolean(process.env.DATABASE_URL);

export const prisma =
  hasDatabaseUrl
    ? global.prisma ??
      new PrismaClient({
        log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
      })
    : null;

if (process.env.NODE_ENV !== "production" && prisma) global.prisma = prisma;

export function isPrismaConnectionError(error: unknown) {
  if (error instanceof Prisma.PrismaClientInitializationError) {
    return true;
  }

  return error instanceof Error && error.message.includes("Can't reach database server");
}

function getDatabaseHost() {
  const url = process.env.DATABASE_URL;

  if (!url) {
    return null;
  }

  try {
    return new URL(url).hostname;
  } catch {
    return "invalid-database-url";
  }
}

export function logPrismaConnectionError(error: unknown, context: string) {
  const databaseHost = getDatabaseHost();
  const details =
    error instanceof Prisma.PrismaClientInitializationError || error instanceof Error
      ? {
          name: error.name,
          message: error.message,
        }
      : { message: "Unknown Prisma connection error" };

  console.error("[database] Prisma connection error", {
    context,
    databaseHost,
    hasDatabaseUrl,
    ...details,
  });
}
