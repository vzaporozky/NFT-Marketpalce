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
    const dataPhotos = responseData.map(item => item.photoPath);

    const photosUrls = await Promise.all(
      dataPhotos.map(async photo => {
        try {
          const response = await fetch("http://localhost:8080/photo/getPhoto", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ photoPath: photo }),
          });

          if (!response.ok) {
            console.error(`Failed to fetch photo ${photo}: ${response.statusText}`);
            return null;
          }

          const photoBlob = await response.blob();

          const photoUrl = `data:image/jpeg;base64,${Buffer.from(await photoBlob.arrayBuffer()).toString("base64")}`;

          return photoUrl;
        } catch (error) {
          console.error(`Error fetching photo ${photo}:`, error);
          return null;
        }
      }),
    );

    // console.log(photosUrls);

    const validPhotosUrls = photosUrls.filter(url => url !== null);

    return NextResponse.json(validPhotosUrls);
    // return NextResponse.json("validPhotosUrls");
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
