import { outputDir } from "@/utils/utils";
import { type NextRequest } from "next/server";
import OpenAI from "openai";
import { openAIAPIKey } from "@/config/env";
import { put } from "@vercel/blob";

const openai = new OpenAI({
  apiKey: openAIAPIKey,
});


export async function POST(req: NextRequest) {
  try {
    const params = req.nextUrl.searchParams;
    const fileName = params.get("fileName");

    if (!fileName) {
      return Response.json({ error: "No file name" }, { status: 400 });
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

    const file = new File([finalAudio], `${fileName}-audio.mp3`, { type: "audio/mpeg" });

    // Upload file to Vercel Blob
    const blob = await put(`${outputDir}/${file.name}`, file, {
      access: "public",
    });

    const url = blob.url;

    // Return the file URL
    return Response.json({ fileUrl: url}, { status: 200 });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error(error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}
