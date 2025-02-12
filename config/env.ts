import dotenv from 'dotenv';

dotenv.config();

export const openAIAPIKey = process.env.OPENAI_API_KEY;
export const blobKey = process.env.NEXT_PUBLIC_BLOB_READ_WRITE_TOKEN;