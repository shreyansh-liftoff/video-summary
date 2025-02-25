import { FormControlLabel, Radio, RadioGroup } from "@mui/material";

export enum ConversionType {
  VIDEO,
  TRANSCRIPT,
}

interface CheckBoxComponentProps {
  checked: ConversionType;
  onChange: (checked: ConversionType) => void;
}

const options = [
  { value: ConversionType.VIDEO, label: "Use video" },
  { value: ConversionType.TRANSCRIPT, label: "Use transcript" },
];

const CheckBoxComponent = ({ checked, onChange }: CheckBoxComponentProps) => {
  return (
    <RadioGroup sx={{ flexDirection: "row" }}>
      {options.map((option) => (
        <FormControlLabel
          key={option.value}
          value={option.value}
          control={<Radio />}
          label={option.label}
          checked={checked === option.value}
          onChange={() => onChange(option.value)}
        />
      ))}
    </RadioGroup>
  );
};

export default CheckBoxComponent;
