import { useState } from "react";

interface AudioProps {
    onSuccess: (audioFile: string) => void;
}

const useAudio = ({onSuccess}: AudioProps) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const generateAudio = async (text: string, fileName: string) => {
    try {
      setError("");
      setLoading(true);
      const response = await fetch(`/api/audio/?fileName=${fileName}`, {
        method: "POST",
        body: JSON.stringify({ text: text }),
      });
      const data = await response.json();
      onSuccess(data.fileUrl);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      setError(`Failed to generate audio. ${e.message}`);
    } finally {
        setLoading(false);
    }
  };

  return {
    loading,
    error,
    generateAudio,
  };
};

export default useAudio;
