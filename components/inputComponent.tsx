"use client";

import { Box, Button, MenuItem, Select, Typography } from "@mui/material";
import DragAndDrop from "./drag-and-drop";
import { useState } from "react";
import { supportedLanguages } from "@/utils/utils";

interface InputComponentProps {
  transcription: {
    text: string;
  };
  setLoading: (loading: boolean) => void;
  setTranscription: (transcription: { text: string }) => void;
  loading: boolean;
}

const InputComponent = ({
  loading,
  setLoading,
  setTranscription,
  transcription,
}: InputComponentProps) => {
  const [files, setFiles] = useState<File[]>([]);
  const [error, setError] = useState<string>("");
  const [filePath, setFilePath] = useState<string>("");
  const [audioFile, setAudioFile] = useState<string>("");
  const [selectedLanguage, setSelectedLanguage] = useState<string>("en");
  const [loadingAudio, setLoadingAudio] = useState<boolean>(false);
  const [loadingTranslation, setLoadingTranslation] = useState<boolean>(false);

  const uploadFile = async () => {
    const formData = new FormData();
    formData.append("file", files[0]);
    try {
      setLoading(true);
      const response = await fetch("/api/file", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      return data.file;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      setError(`Failed to upload file. ${e.message}`);
    } finally {
      setLoading(false);
    }
  };

  const generateScript = async (filePath: string) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/transcription/?file=${filePath}`, {
        method: "POST",
      });
      const data = await response.json();
      setTranscription(data.transcription);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      setError(`Failed to generate transcription. ${e.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateTranscript = async () => {
    if (files.length) {
      const filePath = await uploadFile();
      setFilePath(filePath);
      await generateScript(filePath);
    }
  };

  const generateTranslation = async () => {
    try {
      setLoadingTranslation(true);
      const response = await fetch(`/api/translation/`, {
        method: "POST",
        body: JSON.stringify({
          text: transcription.text,
          language: selectedLanguage,
        }),
      });
      const data = await response.json();
      setTranscription({ text: data.translation });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      setError(`Failed to generate translation. ${e.message}`);
    } finally {
      setLoadingTranslation(false);
    }
  };

  const generateAudio = async () => {
    try {
      setLoadingAudio(true);
      const mp3 = filePath.replace("mp4", "mp3");
      const response = await fetch(`/api/audio/?file=${mp3}`, {
        method: "POST",
        body: JSON.stringify({ text: transcription.text }),
      });
      const data = await response.json();
      setAudioFile(data.fileUrl);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      setError(`Failed to generate audio. ${e.message}`);
    } finally {
      setLoadingAudio(false);
    }
  };

  const showLanguage = () => {
    return (
      <>
        <Select
          variant={"standard"}
          label="Language"
          value={selectedLanguage}
          onChange={(e) => setSelectedLanguage(e.target.value)}
        >
          {supportedLanguages.map((lang) => (
            <MenuItem key={lang.code} value={lang.code}>
              {lang.name}
            </MenuItem>
          ))}
        </Select>
      </>
    );
  };
  return (
    <Box
      sx={{
        margin: 2,
        border: 1,
        borderColor: "divider",
        borderRadius: 5,
        p: 2,
        overflow: "auto",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        gap: 2,
      }}
    >
      <Typography variant="h2">Converter</Typography>
      <DragAndDrop callback={(files) => setFiles(files)} />

      <Button
        variant={loading ? "outlined" : "contained"}
        color="primary"
        onClick={handleGenerateTranscript}
        disabled={!files.length}
      >
        {loading ? "Summarizing..." : "Summarize"}
      </Button>

      <br />

      {transcription.text && (
        <>
          {showLanguage()}
          <Button
            variant={loadingTranslation ? "outlined" : "contained"}
            color="primary"
            onClick={generateTranslation}
            disabled={!filePath}
          >
            {loadingTranslation ? "Translating..." : `Translate to ${selectedLanguage}`}
          </Button>
        </>
      )}

      {transcription.text && !loadingTranslation && (
        <Button
          variant={loadingAudio ? "outlined" : "contained"}
          color="primary"
          onClick={generateAudio}
          disabled={!filePath}
        >
          {loadingAudio ? "Generating Audio..." : "Generate Audio"}
        </Button>
      )}

      {audioFile && (
        <audio controls>
          <source src={audioFile} type="audio/mpeg" />
          Your browser does not support the audio element.
        </audio>
      )}
      {error && <Typography color="error">{error}</Typography>}
    </Box>
  );
};

export default InputComponent;
