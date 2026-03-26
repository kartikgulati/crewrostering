import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  await prisma.userSubmission.deleteMany();
  await prisma.question.deleteMany();
  await prisma.quiz.updateMany({ data: { isActive: false } });

  const launch = await prisma.quiz.create({
    data: {
      title: "Spicy Maple Breakfast Launch",
      description:
        "Crew briefing for the new spicy maple breakfast lineup, guest messaging, and assembly standards.",
      isActive: true,
      content: {
        type: "doc",
        content: [
          {
            type: "heading",
            attrs: { level: 2 },
            content: [{ type: "text", text: "What launches this week" }],
          },
          {
            type: "paragraph",
            content: [
              {
                type: "text",
                text: "The Spicy Maple Chicken Biscuit launches chain-wide on Monday. It includes a buttermilk biscuit, crispy chicken, spicy maple glaze, and a dill pickle chip.",
              },
            ],
          },
          {
            type: "heading",
            attrs: { level: 2 },
            content: [{ type: "text", text: "Guest promise" }],
          },
          {
            type: "paragraph",
            content: [
              {
                type: "text",
                text: "Every sandwich must be assembled fresh to order. Guests should be told that the glaze adds sweet heat and the pickle balances the flavor.",
              },
            ],
          },
          {
            type: "bulletList",
            content: [
              {
                type: "listItem",
                content: [{ type: "paragraph", content: [{ type: "text", text: "Hold time for glazed chicken is 20 minutes." }] }],
              },
              {
                type: "listItem",
                content: [{ type: "paragraph", content: [{ type: "text", text: "Breakfast launch runs from open until 10:30 AM." }] }],
              },
              {
                type: "listItem",
                content: [{ type: "paragraph", content: [{ type: "text", text: "Upsell with hash browns and premium roast coffee." }] }],
              },
            ],
          },
        ],
      },
      questions: {
        create: [
          {
            order: 1,
            questionText: "Which ingredient gives the sandwich its sweet heat flavor?",
            options: ["Spicy maple glaze", "Dill pickle chip", "Premium roast coffee", "Hash browns"],
            correctAnswer: 0,
            explanation: "The training content states the spicy maple glaze provides the sweet heat profile.",
          },
          {
            order: 2,
            questionText: "How long can glazed chicken be held before it must be replaced?",
            options: ["10 minutes", "15 minutes", "20 minutes", "30 minutes"],
            correctAnswer: 2,
            explanation: "Hold time is 20 minutes.",
          },
          {
            order: 3,
            questionText: "When does the breakfast launch window end?",
            options: ["9:30 AM", "10:00 AM", "10:30 AM", "11:00 AM"],
            correctAnswer: 2,
            explanation: "Breakfast launch runs until 10:30 AM.",
          },
        ],
      },
    },
    include: { questions: true },
  });

  console.log("Seeded quiz:", launch.title);
  console.log("Admin email:", process.env.ADMIN_EMAIL ?? "admin@example.com");
  console.log("Admin password:", process.env.ADMIN_PASSWORD ?? "ChangeThis123!");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
