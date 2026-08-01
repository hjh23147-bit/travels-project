"use client";

import UploadFile from "./UploadFile";

interface UploadImageProps {
  value: string | null;
  onChange: (url: string) => void;
  label?: string;
}

export default function UploadImage({ value, onChange, label = "صورة" }: UploadImageProps) {
  return <UploadFile value={value} onChange={onChange} label={label} accept="image" />;
}
