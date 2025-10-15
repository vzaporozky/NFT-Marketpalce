import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const data = await request.json();

    const res = await fetch("http://104.248.92.251:8080/photo/createPhoto", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      return NextResponse.json({ error: "Failed to create photo" }, { status: res.status });
    }

    const arrayBuffer = await res.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const base64Image = buffer.toString("base64");
    const mimeType = res.headers.get("content-type") || "image/jpeg";
    const dataUrl = `data:${mimeType};base64,${base64Image}`;

    return NextResponse.json({ photoUrl: dataUrl });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
