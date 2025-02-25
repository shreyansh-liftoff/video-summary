import useAudio from "@/hooks/useAudio";
import useTranslation from "@/hooks/useTranstlation";
import useUploadFile from "@/hooks/useUploadFIle";
import { Button } from "@mui/material";
import { ConversionType } from "./checkBoxComponent";
import useTranscript from "@/hooks/useTranscript";
import { useMemo, useState } from "react";

interface ActionButtonsProps {
  link: string;
  files: File[];
  setError: (error: string) => void;
  transcription: { text: string };
  setTranscription: (transcription: { text: string }) => void;
  selectedLanguage: string;
  showLanguage: () => void;
  setAudioFile: (audioFile: string) => void;
  action: ConversionType;
}

const ActionButtons = ({
  link,
  files,
  setError,
  setTranscription,
  transcription,
  selectedLanguage,
  showLanguage,
  setAudioFile,
  action,
}: ActionButtonsProps) => {
  const [downloading, setDownloading] = useState<boolean>(false);
  const { uploadFileToBlob } = useUploadFile();
  const { loading: loadingTranslation, generateTranslation } = useTranslation({
    onSuccess: setTranscription,
  });
  const { loading: loadingAudio, generateAudio } = useAudio({
    onSuccess: setAudioFile,
  });
  const { generateTranscriptSummary, getTranscriptFromURL, loading } =
    useTranscript({
      onSuccess: setTranscription,
    });

  const downloadVideo = async () => {
    try {
      setError("");
      setDownloading(true);
      const response = await fetch(`/api/download/?link=${link}`, {
        method: "POST",
      });
      const data = await response.json();
      return data.fileUrl;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      setError(`Failed to generate transcription. ${e.message}`);
    } finally {
      setDownloading(false);
    }
  };

  const handleGenerateTranscript = async () => {
    let filePath;
    if (link) {
      if (action === ConversionType.VIDEO) {
        filePath = await downloadVideo();
      } else {
        await getTranscriptFromURL(link);
      }
    } else if (files.length) {
      filePath = await uploadFileToBlob(files[0]);
    }
    if (filePath && action === ConversionType.VIDEO) {
      await generateTranscriptSummary(filePath, action.toString());
    }
  };

  const isLoading = useMemo(
    () => loading || downloading,
    [loading, downloading]
  );

  return (
    <>
      <Button
        variant={isLoading ? "outlined" : "contained"}
        color="primary"
        onClick={handleGenerateTranscript}
        disabled={(!link && !files.length) || isLoading}
      >
        {isLoading ? "Summarizing..." : "Summarize"}
      </Button>
      {transcription.text && (
        <>
          {showLanguage()}
          <Button
            variant={loadingTranslation ? "outlined" : "contained"}
            color="primary"
            onClick={() =>
              generateTranslation(transcription.text, selectedLanguage)
            }
            disabled={!transcription.text}
          >
            {loadingTranslation
              ? "Translating..."
              : `Translate to ${selectedLanguage}`}
          </Button>
          {transcription.text && !loadingTranslation && (
            <Button
              variant={loadingAudio ? "outlined" : "contained"}
              color="primary"
              onClick={() => generateAudio(transcription.text, link)}
              disabled={!transcription.text}
            >
              {loadingAudio ? "Generating Audio..." : "Generate Audio"}
            </Button>
          )}
        </>
      )}
    </>
  );
};

export default ActionButtons;
