"use client";

import {
  Box,
  Button,
  Divider,
  FormHelperText,
  MenuItem,
  Select,
  TextField,
  Typography,
  type SelectChangeEvent,
} from "@mui/material";
import DragAndDrop from "./drag-and-drop";
import { useState } from "react";
import { supportedLanguages } from "@/utils/utils";
import useUploadFile from "@/hooks/useUploadFIle";

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
  const [selectedLanguage, setSelectedLanguage] = useState<string>("en");
  const [loadingAudio, setLoadingAudio] = useState<boolean>(false);
  const [loadingTranslation, setLoadingTranslation] = useState<boolean>(false);
  const [audioFile, setAudioFile] = useState<string>("");
  const [link, setLink] = useState<string>("");
  const [cookies, setCookie] = useState("");
  const { uploadFileToBlob } = useUploadFile();

  const generateScript = async (fileURL: string) => {
    try {
      setError("");
      setLoading(true);
      const response = await fetch(`/api/transcription/?file=${fileURL}`, {
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

  const processLink = async () => {
    try {
      
      setError("");
      setLoading(true);
      const response = await fetch(`/api/download/?link=${link}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Cookie": cookies,
        },
      });
      const data = await response.json();
      return data.fileUrl;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      setError(`Failed to generate transcription. ${e.message}`);
    } finally {
      setLoading(false);
    }
  }

  const handleGenerateTranscript = async () => {
    let filePath;
    if (link) {
      filePath = await processLink();
    } 
    else if (files.length) {
      filePath = await uploadFileToBlob(files[0]);
    }
    if (filePath) {
      await generateScript(filePath);
    }
  };

  const generateTranslation = async () => {
    try {
      setError("");
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
      setError("");
      setLoadingAudio(true);
      const fileName = files?.[0]?.name ?? link;
      const response = await fetch(`/api/audio/?fileName=${fileName}`, {
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

  const handleLagugageChange = (e: SelectChangeEvent<string>) => {
    setSelectedLanguage(e.target.value as string);
    setAudioFile("");
  };

  const showLanguage = () => {
    return (
      <>
        <Select
          variant={"standard"}
          label="Language"
          value={selectedLanguage}
          onChange={handleLagugageChange}
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
      <Typography variant="h3">Transcribe and Summarize</Typography>
      <Typography variant="body1">
        Copy and paste link to generate a transcription.
      </Typography>
      <TextField
        id="outlined-basic"
        label="Link"
        variant="outlined"
        value={link}
        onChange={(e) => setLink(e.target.value)}
        fullWidth
      />
      <TextField
        id="outlined-basic"
        label="Cookie"
        variant="outlined"
        value={cookies}
        onChange={(e) => setCookie(e.target.value)}
        fullWidth
      />
      <FormHelperText>
        Note: Youtube requires cookies to access the content.
      </FormHelperText>
      <Divider>
        <Typography variant="body1">OR</Typography>
      </Divider>
      <Typography variant="body1">
        Upload a file to generate a transcription.
      </Typography>
      <DragAndDrop callback={(files) => setFiles(files)} />
      <Button
        variant={loading ? "outlined" : "contained"}
        color="primary"
        onClick={handleGenerateTranscript}
        disabled={(!link && !files.length) || loading}
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
            disabled={!transcription.text}
          >
            {loadingTranslation
              ? "Translating..."
              : `Translate to ${selectedLanguage}`}
          </Button>
        </>
      )}

      {transcription.text && !loadingTranslation && (
        <Button
          variant={loadingAudio ? "outlined" : "contained"}
          color="primary"
          onClick={generateAudio}
          disabled={!transcription.text}
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
