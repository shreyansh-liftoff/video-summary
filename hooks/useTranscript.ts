import { useState } from "react";

interface TranscriptProps {
    onSuccess: (transcription: { text: string }) => void;
}

const useTranscript = ({onSuccess}: TranscriptProps) => {
    const [error, setError] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);

    const getTranscriptFromURL = async(videoUrl: string) => {
        try {
            setError("");
            setLoading(true);
            const response = await fetch(`/api/transcription/?link=${videoUrl}`);
            const data = await response.json();
            onSuccess({text: data.transcription.text});
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (e: any) {
            setError(`Failed to generate transcription. ${e.message}`);
        }
    }

    const generateTranscriptSummary = async (fileURL: string, type: string) => {
        try {
            setError("");
            setLoading(true);
            const response = await fetch(`/api/transcription/?file=${fileURL}&type=${type}`, {
                method: "POST",
            });
            const data = await response.json();
            onSuccess({text: data.transcription.text});
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (e: any) {
            setError(`Failed to generate transcription. ${e.message}`);
        }
    }

    return {
        error,
        loading,
        getTranscriptFromURL,
        generateTranscriptSummary,
    }
};

export default useTranscript;