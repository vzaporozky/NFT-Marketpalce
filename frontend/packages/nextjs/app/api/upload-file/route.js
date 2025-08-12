import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const uploadFormData = new FormData();
    uploadFormData.append("file", file);

    const response = await fetch("https://upload.bgipfs.com/api/v0/add", {
      method: "POST",
      headers: {
        "X-API-Key": "fc3f01b4-6689-4dc3-bff8-5230285f82d2",
      },
      body: uploadFormData,
    });

    if (!response.ok) {
      throw new Error(`Upload failed with status: ${response.status}`);
    }

    const result = await response.json();
    const hash = result.Hash;

    if (!hash) {
      throw new Error("No hash returned from bgipfs");
    }

    const link = `https://ipfs.io/ipfs/${hash}`;

    return NextResponse.json({ link });
  } catch (error) {
    console.error("Error uploading to bgipfs:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
