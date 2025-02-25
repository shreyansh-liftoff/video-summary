import { Typography, TextField } from "@mui/material";

interface LinkComponentProps {
  error: string;
  onLinkChange: (link: string) => void;
  link: string;
}

const LinkComponent = ({ error, onLinkChange, link }: LinkComponentProps) => {
  return (
    <>
      <Typography variant="body1">
        Copy and paste link to generate a transcription.
      </Typography>
      <TextField
        id="outlined-basic"
        label="Link"
        variant="outlined"
        value={link}
        onChange={(e) => onLinkChange(e.target.value)}
        fullWidth
      />
      <Typography variant="body1" color="error">
        {error}
      </Typography>
    </>
  );
};

export default LinkComponent;
