import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import { generateHTML } from "@tiptap/html";

export const richContentClassName = [
  "max-w-none text-slate-700",
  "[&_h2]:mt-6 [&_h2]:text-2xl [&_h2]:font-semibold [&_h2]:text-slate-900",
  "[&_p]:my-3 [&_p]:leading-7",
  "[&_ul]:my-4 [&_ul]:list-disc [&_ul]:pl-6",
  "[&_ol]:my-4 [&_ol]:list-decimal [&_ol]:pl-6",
  "[&_li]:my-1",
  "[&_strong]:font-semibold [&_strong]:text-slate-900",
  "[&_em]:italic",
  "[&_img]:my-4 [&_img]:max-h-80 [&_img]:rounded-2xl [&_img]:object-cover",
].join(" ");

export function renderRichContent(content: unknown) {
  try {
    return generateHTML(content as Record<string, unknown>, [StarterKit, Image]);
  } catch {
    return "<p>Content unavailable.</p>";
  }
}
