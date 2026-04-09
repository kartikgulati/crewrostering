"use client";

import { KeyboardEvent, useEffect, useMemo, useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import { ImagePlus, List, ListOrdered, Pilcrow, Type } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { richContentClassName } from "@/lib/content";
import { cn } from "@/lib/utils";

type Props = {
  value: Record<string, unknown> | null;
  onChange: (value: Record<string, unknown>) => void;
};

const EMPTY_DOC = {
  type: "doc",
  content: [{ type: "paragraph", content: [{ type: "text", text: "Add launch content here." }] }],
} as const;

function isEditorDocument(value: Record<string, unknown> | null): value is Record<string, unknown> {
  return !!value && value.type === "doc";
}

export function RichTextEditor({ value, onChange }: Props) {
  const [imageUrl, setImageUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const content = useMemo(() => (isEditorDocument(value) ? value : EMPTY_DOC), [value]);

  const editor = useEditor({
    immediatelyRender: false,
    shouldRerenderOnTransaction: false,
    extensions: [StarterKit, Image],
    content,
    editorProps: {
      attributes: {
        class: "ProseMirror min-h-[240px] rounded-b-[24px] px-4 py-4 outline-none",
      },
    },
    onUpdate: ({ editor: instance }) => {
      setError(null);
      onChange(instance.getJSON());
    },
  });

  useEffect(() => {
    if (!editor) {
      return;
    }

    const currentValue = editor.getJSON();
    if (JSON.stringify(currentValue) !== JSON.stringify(content)) {
      editor.commands.setContent(content, { emitUpdate: false });
    }
  }, [content, editor]);

  function addImageFromUrl() {
    const nextUrl = imageUrl.trim();
    if (!nextUrl) {
      setError("Enter an image URL.");
      return;
    }

    try {
      const parsedUrl = new URL(nextUrl);
      if (!["http:", "https:"].includes(parsedUrl.protocol)) {
        setError("Use an http or https image URL.");
        return;
      }
    } catch {
      setError("Enter a valid image URL.");
      return;
    }

    const inserted = editor?.chain().focus().setImage({ src: nextUrl }).run();
    if (!inserted) {
      setError("Image could not be added.");
      return;
    }

    setError(null);
    setImageUrl("");
  }

  async function handleFileUpload(file: File) {
    if (!file.type.startsWith("image/")) {
      setError("Only image files can be uploaded.");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError("Image must be smaller than 10MB.");
      return;
    }

    setUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/admin/uploads", {
        method: "POST",
        body: formData,
      });

      const data = (await response.json()) as { error?: string; url?: string };
      if (!response.ok) {
        throw new Error(data.error ?? "Upload failed.");
      }

      if (!data.url) {
        throw new Error("Upload completed without an image URL.");
      }

      const inserted = editor?.chain().focus().setImage({ src: data.url }).run();
      if (!inserted) {
        throw new Error("Uploaded image could not be added to the editor.");
      }
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : "Upload failed.");
    } finally {
      setUploading(false);
    }
  }

  function handleImageUrlKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key !== "Enter") {
      return;
    }

    event.preventDefault();
    addImageFromUrl();
  }

  return (
    <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-white">
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 px-4 py-3">
        <Button type="button" size="sm" variant="secondary" onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}>
          <Type className="mr-1 size-4" /> Heading
        </Button>
        <Button type="button" size="sm" variant="secondary" onClick={() => editor?.chain().focus().setParagraph().run()}>
          <Pilcrow className="mr-1 size-4" /> Paragraph
        </Button>
        <Button type="button" size="sm" variant="secondary" onClick={() => editor?.chain().focus().toggleBulletList().run()}>
          <List className="mr-1 size-4" /> Bullets
        </Button>
        <Button type="button" size="sm" variant="secondary" onClick={() => editor?.chain().focus().toggleOrderedList().run()}>
          <ListOrdered className="mr-1 size-4" /> Steps
        </Button>
        <div className="flex min-w-[230px] flex-1 items-center gap-1">
          <Input
            value={imageUrl}
            onChange={(event) => setImageUrl(event.target.value)}
            onKeyDown={handleImageUrlKeyDown}
            placeholder="Paste image URL"
            disabled={uploading}
          />
          <label className="flex-shrink-0 inline-flex cursor-pointer items-center justify-center rounded-2xl border border-slate-300 px-6 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50">
            {uploading ? "Uploading..." : "Upload file"}
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={async (event) => {
                const file = event.target.files?.[0];
                if (file) {
                  await handleFileUpload(file);
                }
                event.target.value = "";
              }}
            />
          </label>
          <Button 
            type="button"
            size="sm"
            variant="outline"
            disabled={uploading}
            onClick={addImageFromUrl}
            className=" flex-shrink-0 py-5  "
          >
            <ImagePlus className="mr-1 size-6" /> Add image
          </Button>
        </div>
      </div>
      <EditorContent
        editor={editor}
        className={cn(
          richContentClassName,
        )}
      />
      {error ? <p className="border-t border-slate-200 px-4 py-3 text-sm text-red-600">{error}</p> : null}
    </div>
  );
}
