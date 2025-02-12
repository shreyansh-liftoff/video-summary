import {
  Container,
  IconButton,
  List,
  ListItem,
  Typography,
} from "@mui/material";
import { dragAndDropContainerSxProps } from "./styles";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import React, { useRef, useState } from "react";
import DeleteIcon from "@mui/icons-material/Delete";

interface IProps {
  callback: (files: File[]) => void;
}

const DragAndDrop = ({ callback }: IProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [isActive, setIsActive] = useState(false);

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const files = Array.from(e.dataTransfer.files);
    setFiles(files);
    callback(files);
    setIsActive(false);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsActive(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsActive(false);
  };

  const handleRemoveFile = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    index: number
  ) => {
    event.stopPropagation();
    setFiles((prev) => prev.filter((_, i) => i !== index));
    callback(files ? files.filter((_, i) => i !== index) : []);
  };

  return (
    <Container
      sx={dragAndDropContainerSxProps(isActive)}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onClick={() => inputRef.current?.click()}
    >
      <input
        ref={inputRef}
        type={"file"}
        style={{ display: "none" }}
        onChange={(e) => {
          if (e.target.files) {
            setFiles(Array.from(e.target.files));
            callback(Array.from(e.target.files));
          }
        }}
        multiple
      />
      {!files?.length && (
        <>
          <FileUploadIcon />
          <Typography textAlign={"center"} sx={{ marginLeft: 1 }} gutterBottom>
            {" Drag & drop your files here, or click to select files"}
          </Typography>
        </>
      )}
      <List dense={true} sx={{ padding: 0 }}>
        {files?.map((file, index) => (
          <ListItem key={index} sx={{ padding: 0 }}>
            <Typography>
              {index + 1}. {file.name}
            </Typography>
            <IconButton onClick={(e) => handleRemoveFile(e, index)}>
              <DeleteIcon fontSize={"small"} color={"error"} />
            </IconButton>
          </ListItem>
        ))}
      </List>
    </Container>
  );
};

export default DragAndDrop;
