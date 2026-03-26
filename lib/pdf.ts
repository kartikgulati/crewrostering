import PDFDocument from "pdfkit";
import { format } from "date-fns";

type SubmissionRow = {
  name: string;
  storeNumber: string;
  submissionDate: Date;
  score: number;
  createdAt: Date;
};

export async function buildSubmissionPdf(rows: SubmissionRow[]) {
  const doc = new PDFDocument({ margin: 40, size: "A4" });
  const chunks: Buffer[] = [];
  const pageWidth = doc.page.width - doc.page.margins.left - doc.page.margins.right;
  const columns = {
    name: doc.page.margins.left,
    store: doc.page.margins.left + pageWidth * 0.33,
    date: doc.page.margins.left + pageWidth * 0.5,
    score: doc.page.margins.left + pageWidth * 0.72,
    completed: doc.page.margins.left + pageWidth * 0.82,
  };

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
    doc.text("Name", columns.name + 10, top + 9, { width: pageWidth * 0.28 });
    doc.text("Store", columns.store + 10, top + 9, { width: pageWidth * 0.12 });
    doc.text("Date", columns.date + 10, top + 9, { width: pageWidth * 0.18 });
    doc.text("Score", columns.score + 10, top + 9, { width: pageWidth * 0.08 });
    doc.text("Completed", columns.completed + 10, top + 9, { width: pageWidth * 0.16 });
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
    doc.text(row.name, columns.name + 10, top + 11, { width: pageWidth * 0.28, ellipsis: true });
    doc.text(row.storeNumber, columns.store + 10, top + 11, { width: pageWidth * 0.12, ellipsis: true });
    doc.text(format(row.submissionDate, "MMM d, yyyy"), columns.date + 10, top + 11, { width: pageWidth * 0.18, ellipsis: true });
    doc.text(`${row.score}%`, columns.score + 10, top + 11, { width: pageWidth * 0.08, ellipsis: true });
    doc.text(format(row.createdAt, "MMM d, yyyy h:mm a"), columns.completed + 10, top + 11, { width: pageWidth * 0.16, ellipsis: true });
    doc.moveDown(1.8);
  });

  doc.end();
  return completed;
}
