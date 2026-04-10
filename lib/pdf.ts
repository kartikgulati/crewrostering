import PDFDocument from "pdfkit";
import { format } from "date-fns";
import path from "node:path";

type SubmissionRow = {
  name: string;
  quizTitle: string;
  storeNumber: string;
  submissionDate: Date;
  score: number;
  createdAt: Date;
};

const PDF_FONT_PATH = path.join(process.cwd(), "node_modules/next/dist/compiled/@vercel/og/noto-sans-v27-latin-regular.ttf");

export async function buildSubmissionPdf(rows: SubmissionRow[]) {
  const doc = new PDFDocument({ margin: 40, size: "A4", font: PDF_FONT_PATH });
  const chunks: Buffer[] = [];
  const pageWidth = doc.page.width - doc.page.margins.left - doc.page.margins.right;
  const columnLayout = [
    { key: "name", label: "Name", width: 0.2 },
    { key: "quizTitle", label: "Quiz", width: 0.28 },
    { key: "storeNumber", label: "Store", width: 0.1 },
    { key: "submissionDate", label: "Date", width: 0.14 },
    { key: "score", label: "Score", width: 0.1 },
    { key: "createdAt", label: "Completed", width: 0.18 },
  ] as const;
  const columns = columnLayout.reduce<Record<(typeof columnLayout)[number]["key"], { x: number; width: number }>>(
    (accumulator, column, index) => {
      const previous = index === 0 ? doc.page.margins.left : accumulator[columnLayout[index - 1].key].x + accumulator[columnLayout[index - 1].key].width;
      accumulator[column.key] = {
        x: previous,
        width: pageWidth * column.width,
      };
      return accumulator;
    },
    {} as Record<(typeof columnLayout)[number]["key"], { x: number; width: number }>,
  );

  doc.on("data", (chunk) => chunks.push(chunk));
  const completed = new Promise<Buffer>((resolve) => {
    doc.on("end", () => resolve(Buffer.concat(chunks)));
  });

  doc.info.Title = "Crew Launch Submission Report";
  doc.info.Author = "Crew Launch Verification";

  doc.fontSize(20).fillColor("#111827").text("Crew Launch Submission Report", { align: "left" });
  doc.moveDown();
  doc.fontSize(10).fillColor("#4b5563").text(`Generated ${format(new Date(), "PPP p")}`);
  doc.moveDown(0.5);
  doc.fontSize(10).fillColor("#4b5563").text(`Total matching submissions: ${rows.length}`);
  doc.moveDown(1.2);

  if (rows.length === 0) {
    doc
      .roundedRect(doc.page.margins.left, doc.y, pageWidth, 72, 12)
      .fillAndStroke("#f8fafc", "#e5e7eb");
    doc
      .fillColor("#111827")
      .fontSize(12)
      .text("No submissions matched the current filters.", doc.page.margins.left + 16, doc.y - 54);
    doc
      .fontSize(10)
      .fillColor("#6b7280")
      .text("Clear the date, store, or score filters and export again.", doc.page.margins.left + 16, doc.y + 4);
    doc.end();
    return completed;
  }

  const drawHeader = () => {
    const top = doc.y;
    doc
      .roundedRect(doc.page.margins.left, top, pageWidth, 28, 8)
      .fill("#111827");
    doc.fillColor("#ffffff").fontSize(9);
    columnLayout.forEach((column) => {
      doc.text(column.label, columns[column.key].x + 10, top + 9, { width: columns[column.key].width - 12 });
    });
    doc.moveDown(1.8);
  };

  drawHeader();

  rows.forEach((row, index) => {
    if (doc.y > doc.page.height - 80) {
      doc.addPage();
      drawHeader();
    }

    const top = doc.y;
    doc
      .roundedRect(doc.page.margins.left, top, pageWidth, 36, 8)
      .fill(index % 2 === 0 ? "#f8fafc" : "#ffffff");

    doc.fillColor("#111827").fontSize(10);
    doc.text(row.name, columns.name.x + 10, top + 11, { width: columns.name.width - 12, ellipsis: true });
    doc.text(row.quizTitle, columns.quizTitle.x + 10, top + 11, { width: columns.quizTitle.width - 12, ellipsis: true });
    doc.text(row.storeNumber, columns.storeNumber.x + 10, top + 11, { width: columns.storeNumber.width - 12, ellipsis: true });
    doc.text(format(row.submissionDate, "MMM d, yyyy"), columns.submissionDate.x + 10, top + 11, {
      width: columns.submissionDate.width - 12,
      ellipsis: true,
    });
    doc.text(`${row.score}%`, columns.score.x + 10, top + 11, { width: columns.score.width - 12, ellipsis: true });
    doc.text(format(row.createdAt, "MMM d, yyyy h:mm a"), columns.createdAt.x + 10, top + 11, {
      width: columns.createdAt.width - 12,
      ellipsis: true,
    });
    doc.moveDown(1.8);
  });

  doc.end();
  return completed;
}
