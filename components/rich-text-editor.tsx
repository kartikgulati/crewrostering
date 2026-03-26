"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import { ImagePlus, List, ListOrdered, Pilcrow, Type } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useState } from "react";

type Props = {
  value: Record<string, unknown> | null;
  onChange: (value: Record<string, unknown>) => void;
};

export function RichTextEditor({ value, onChange }: Props) {
  const [imageUrl, setImageUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [StarterKit, Image],
    content: value ?? {
      type: "doc",
      content: [{ type: "paragraph", content: [{ type: "text", text: "Add launch content here." }] }],
    },
    editorProps: {
      attributes: {
        class: "min-h-[240px] rounded-b-[24px] px-4 py-4 outline-none",
      },
    },
    onUpdate: ({ editor: instance }) => {
      onChange(instance.getJSON());
    },
  });

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
        <div className="flex min-w-[260px] flex-1 items-center gap-2">
          <Input value={imageUrl} onChange={(event) => setImageUrl(event.target.value)} placeholder="Paste image URL" />
          <label className="inline-flex cursor-pointer items-center justify-center rounded-2xl border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50">
            {uploading ? "Uploading..." : "Upload file"}
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={async (event) => {
                const file = event.target.files?.[0];
                if (!file) return;

                setUploading(true);
                const formData = new FormData();
                formData.append("file", file);

                const response = await fetch("/api/admin/uploads", {
                  method: "POST",
                  body: formData,
                });

                const data = await response.json();
                if (response.ok && data.url) {
                  editor?.chain().focus().setImage({ src: data.url }).run();
                }

                setUploading(false);
                event.target.value = "";
              }}
            />
          </label>
          <Button
            type="button"
            size="sm"
            variant="outline"
            disabled={uploading}
            onClick={() => {
              if (!imageUrl.trim()) return;
              editor?.chain().focus().setImage({ src: imageUrl }).run();
              setImageUrl("");
            }}
          >
            <ImagePlus className="mr-1 size-4" /> Add image
          </Button>
        </div>
      </div>
      <EditorContent editor={editor} className={cn("prose prose-slate max-w-none")} />
    </div>
  );
}
