import { type NextRequest } from "next/server";
import OpenAI from "openai";
import { openAIAPIKey } from "@/config/env";
import { fetchFile } from "@/utils/utils";

const openai = new OpenAI({
  apiKey: openAIAPIKey,
});

export async function POST(req: NextRequest) {
  try {
    const params = req.nextUrl.searchParams;
    const fileURL = params.get("file");

    if (!fileURL) {
      return Response.json({ error: "No file key" }, { status: 400 });
    }

    const file = await fetchFile(fileURL);

    // load file to disk
    const transcription = await openai.audio.transcriptions.create({
      file: new File([file], "audio.wav", { type: file.type, lastModified: Date.now() }),
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
