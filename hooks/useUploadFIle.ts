'use client';

import { blobKey } from "@/config/env";
import { uploadDir } from "@/utils/utils";
import { put } from "@vercel/blob";
import { useState } from "react";

const useUploadFile = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>("");

    const uploadFileToBlob = async (file: File) => {
        try {
            const blob = await put(`${uploadDir}/${file.name}`, file, {
                access: "public",
                token: blobKey,
            });
            return blob.url;
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (e: any) {
            setError(`Failed to upload file. ${e.message}`);
        } finally {
            setLoading(false);
        }
    };

    return { loading, error, uploadFileToBlob };
};

export default useUploadFile;