import { NextRequest } from "next/server";
import fs from "fs";
import ytdl from "@distube/ytdl-core";
import { put } from "@vercel/blob";
import path from "path";
import { blobKey } from "@/config/env";
import { pipeline } from "stream/promises";
import os from "os";
import { uploadDir } from "@/utils/utils";

export async function POST(req: NextRequest) {
  try {
    const videoUrl = req.nextUrl.searchParams.get("link");
    if (!videoUrl)
      return Response.json({ error: "Missing video URL" }, { status: 400 });

    if (!ytdl.getURLVideoID(videoUrl)) {
      return new Response(JSON.stringify({ error: "Invalid YouTube URL" }), {
        status: 400,
      });
    }

    // Extract video ID from URL
    const videoId = ytdl.getURLVideoID(videoUrl);
    const outputPath = path.join(os.tmpdir(), `${videoId}.mp3`);

    console.log("Downloading audio...");
    const audioStream = ytdl(videoUrl, {
      quality: "highestaudio",
      filter: "audioonly",
    });
    const fileStream = fs.createWriteStream(outputPath);
    // Use pipeline to handle the stream properly
    await pipeline(audioStream, fileStream);
    console.log("Download complete.");

    console.log("Uploading to Vercel Blob...");
    const uploadedBlob = await put(
      `${uploadDir}/${videoId}.mp3`,
      fs.createReadStream(outputPath),
      {
        access: "public",
        token: blobKey,
      }
    );

    // Cleanup: Delete file after upload
    if (fs.existsSync(outputPath)) fs.unlinkSync(outputPath);

    console.log("Uploaded Successfully:", uploadedBlob.url);
    return Response.json({ fileUrl: uploadedBlob.url }, { status: 200 });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Error:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}
