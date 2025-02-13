import dotenv from 'dotenv';

dotenv.config();

export const openAIAPIKey = process.env.OPENAI_API_KEY;
export const blobKey = process.env.NEXT_PUBLIC_BLOB_READ_WRITE_TOKEN;
export const youtubeServerUrl = process.env.YOUTUBE_DOWNLOAD_SERVER_URL;
export const localServerUrl = process.env.LOCAL_SERVER_URL;