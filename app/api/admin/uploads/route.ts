import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import { uploadImage } from "@/lib/cloudinary";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "No file uploaded." }, { status: 400 });
    }

    if (!file.type.startsWith("image/")) {
      return NextResponse.json({ error: "Only image files are supported." }, { status: 400 });
    }

    const uploaded = await uploadImage(file);
    return NextResponse.json({ url: uploaded.secure_url });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Upload failed.";
    const status = message === "Cloudinary is not configured." ? 503 : 400;
    return NextResponse.json({ error: message }, { status });
  }
}
