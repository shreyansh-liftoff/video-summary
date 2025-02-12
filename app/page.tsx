'use client';

import InputComponent from "@/components/inputComponent";
import Trancription from "@/components/transcription";
import { Grid2 } from "@mui/material";
import { useState } from "react";

export default function Home() {
  const [transcription, setTranscription] = useState<{text: string}>({ text: '' });
  const [loading, setLoading] = useState<boolean>(false);
  
  return (
    <Grid2 container spacing={2}>
      <Grid2 size={5}>
        <InputComponent loading={loading} transcription={transcription} setLoading={setLoading} setTranscription={setTranscription} />
      </Grid2>
      <Grid2 size={7}>
        <Trancription loading={loading} transcription={transcription} />
      </Grid2>
    </Grid2>
  );
}
