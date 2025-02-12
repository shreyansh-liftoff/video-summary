import OpenAI from "openai";
import { openAIAPIKey } from "@/config/env";
import { type NextRequest } from "next/server";

const openai = new OpenAI({
  apiKey: openAIAPIKey,
});

export async function POST(req: NextRequest) {
  try {
    const { text, language } = await req.json();

    if (!text) {
      return Response.json({ error: "Text is required" }, { status: 400 });
    }

    if (!language) {
      return Response.json({ error: "Language is required" }, { status: 400 });
    }

    // Step 1: Translate the text
    const translationResponse = await openai.chat.completions.create({
      model: "gpt-4-turbo",
      messages: [
        { role: "system", content: `Translate the text into ${language}.` },
        { role: "user", content: text },
      ],
    });

    const translatedText = translationResponse.choices[0].message.content;
    console.log(`Translated Text: ${translatedText}`);

    return Response.json({ translation: translatedText }, { status: 200 });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error(error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}
