import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const data = await request.json();

    const res = await fetch("http://localhost:8080/photo/getPhotos", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data.address),
    });

    if (!res.ok) {
      const errorData = await res.json();
      return NextResponse.json({ error: errorData.error || "Failed to create photo" }, { status: res.status });
    }

    const responseData = await res.json();
    return NextResponse.json(responseData);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
