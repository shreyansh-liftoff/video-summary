import { useState } from "react";

interface TranslationProps {
  onSuccess: (transcription: { text: string }) => void;
}

const useTranslation = ({ onSuccess }: TranslationProps) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const generateTranslation = async (text: string, lang: string) => {
    try {
      setError("");
      setLoading(true);
      const response = await fetch(`/api/translation/`, {
        method: "POST",
        body: JSON.stringify({
          text: text,
          language: lang,
        }),
      });
      const data = await response.json();
      onSuccess({text: data.translation});
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      setError(`Failed to generate translation. ${e.message}`);
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    generateTranslation,
  };
};

export default useTranslation;
