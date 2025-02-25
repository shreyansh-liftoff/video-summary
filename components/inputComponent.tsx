"use client";

import {
  Box,
  Divider,
  MenuItem,
  Select,
  Typography,
  type SelectChangeEvent,
} from "@mui/material";
import DragAndDrop from "./drag-and-drop";
import { useState } from "react";
import { supportedLanguages } from "@/utils/utils";
import LinkComponent from "./linkComponent";
import ActionButtons from "./buttonsComponents";
import CheckBoxComponent, { ConversionType } from "./checkBoxComponent";

interface InputComponentProps {
  transcription: {
    text: string;
  };
  setLoading: (loading: boolean) => void;
  setTranscription: (transcription: { text: string }) => void;
  loading: boolean;
}

const InputComponent = ({
  setTranscription,
  transcription,
}: InputComponentProps) => {
  const [files, setFiles] = useState<File[]>([]);
  const [error, setError] = useState<string>("");
  const [selectedLanguage, setSelectedLanguage] = useState<string>("en");
  const [audioFile, setAudioFile] = useState<string>("");
  const [link, setLink] = useState<string>("");
  const [checked, setChecked] = useState<ConversionType>(ConversionType.VIDEO);

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
      <LinkComponent link={link} onLinkChange={setLink} error={error} />
      <CheckBoxComponent checked={checked} onChange={setChecked} />
      <Divider>
        <Typography variant="body1">OR</Typography>
      </Divider>
      <Typography variant="body1">
        Upload a file to generate a transcription.
      </Typography>
      <DragAndDrop callback={(files) => setFiles(files)} />
      <ActionButtons
        link={link}
        files={files}
        setError={setError}
        transcription={transcription}
        setTranscription={setTranscription}
        selectedLanguage={selectedLanguage}
        showLanguage={showLanguage}
        setAudioFile={setAudioFile}
        action={checked}
      />

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
