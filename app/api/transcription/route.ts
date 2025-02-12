import { uploadDir } from "@/utils/utils";
import { type NextRequest } from "next/server";
import fs from "fs";
import OpenAI from "openai";
import { openAIAPIKey } from "@/config/env";
import path from "path";

const openai = new OpenAI({
  apiKey: openAIAPIKey,
});

export async function POST(req: NextRequest) {
  try {
    const params = req.nextUrl.searchParams;
    const fileKey = params.get("file");

    if (!fileKey) {
      return Response.json({ error: "No file key" }, { status: 400 });
    }

    const filePath = path.join(uploadDir, fileKey);
    // load file from disk
    const transcription = await openai.audio.transcriptions.create({
      file: fs.createReadStream(filePath),
      model: "whisper-1",
      temperature: 0.2,
    });
    //summary of the transcription
    const summaryResponse = await openai.chat.completions.create({
      model: "gpt-4-turbo",
      messages: [
        { role: "system", content: "Summarize the transcription." },
        { role: "user", content: transcription.text },
      ],
    });

    const summary = summaryResponse.choices[0].message.content;
    return Response.json({ transcription: {text: summary} }, { status: 200 });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error(error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}
