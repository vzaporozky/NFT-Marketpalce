import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const metadata = await request.json();

    if (!metadata || typeof metadata !== "object") {
      return NextResponse.json({ error: "Invalid metadata provided" }, { status: 400 });
    }

    const metadataJson = JSON.stringify(metadata);

    const metadataBlob = new Blob([metadataJson], { type: "application/json" });

    const uploadFormData = new FormData();
    uploadFormData.append("file", metadataBlob, "metadata.json");

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
    console.error("Error uploading metadata to bgipfs:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
