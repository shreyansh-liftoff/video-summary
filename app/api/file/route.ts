import { uploadDir } from "@/utils/utils";
import { put } from "@vercel/blob";

export const config = {
  api: {
    bodyParser: false, // Required for FormData handling
  },
};

export async function POST (req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return Response.json({ error: "No file provided" }, { status: 400 });
    }

    // Upload file to Vercel Blob
    const blob = await put(`${uploadDir}/${file.name}`, file, {
      access: "public",
    });

    return Response.json({ file: blob.url }, { status: 200 });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}