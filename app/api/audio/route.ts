import { outputDir } from "@/utils/utils";
import { type NextRequest } from "next/server";
import fs from "fs";
import OpenAI from "openai";
import { openAIAPIKey } from "@/config/env";
import path from "path";

const openai = new OpenAI({
  apiKey: openAIAPIKey,
});

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

export async function POST(req: NextRequest) {
  try {
    const params = req.nextUrl.searchParams;
    const fileKey = params.get("file");

    if (!fileKey) {
      return Response.json({ error: "No file key" }, { status: 400 });
    }

    const { text } = await req.json();

    if (!text) {
      return Response.json({ message: "Text is required" }, { status: 400 });
    }

    const chunkSize = 4096; // OpenAI's max limit
    const textChunks = text.match(new RegExp(`.{1,${chunkSize}}`, "g")) || [];
    const audioBuffers: Buffer[] = [];

    // Process each chunk separately
    for (const chunk of textChunks) {
      const mp3Response = await openai.audio.speech.create({
        model: "tts-1",
        voice: "alloy",
        input: chunk,
        
      });

      const buffer = Buffer.from(await mp3Response.arrayBuffer());
      audioBuffers.push(buffer);
    }

    // Combine all MP3 buffers into one file
    const finalAudio = Buffer.concat(audioBuffers);

    // Create a path for the MP3 file
    const filePath = path.join(outputDir, fileKey);
    
    // Write the MP3 file to disk
    fs.writeFileSync(filePath, finalAudio);

    // Return the file URL
    return Response.json({ fileUrl: `/outputs/${fileKey}`}, { status: 200 });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error(error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}
