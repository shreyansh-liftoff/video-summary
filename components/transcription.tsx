import { Box } from "@mui/material";

interface TrancriptionProps {
    transcription: {
        text: string;
    };
    loading: boolean;
}

const Trancription = ({transcription, loading}: TrancriptionProps) => {
    console.log(transcription);
    return (
        <Box sx={{
            margin: 2,
            border: 1,
            borderColor: 'divider',
            borderRadius: 5,
            p: 2,
            height: '95vh',
            overflow: 'auto',
        }}>
            {loading ? 'Loading...' : transcription?.text}
        </Box>
    );
};

export default Trancription;