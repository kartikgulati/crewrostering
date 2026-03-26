import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import { generateHTML } from "@tiptap/html";

export function renderRichContent(content: unknown) {
  try {
    return generateHTML(content as Record<string, unknown>, [StarterKit, Image]);
  } catch {
    return "<p>Content unavailable.</p>";
  }
}
