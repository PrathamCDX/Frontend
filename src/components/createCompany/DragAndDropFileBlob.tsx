import Image from "next/image";
import React, { useState, DragEvent } from "react";
import { useFormContext } from "react-hook-form";

interface DragAndDropFileProps {
  file: File | null;
  setFile: React.Dispatch<React.SetStateAction<File | null>>;
  maxFileSize: number; // MB
  fileExtension: string[];
  jwtToken: string | null;
  onChangeFn?: () => void;
}

export default function DragAndDropFileBlob({
  file,
  setFile,
  maxFileSize,
  fileExtension,
  jwtToken,
  onChangeFn,
}: DragAndDropFileProps) {
  const [dragActive, setDragActive] = useState(false);

  const {
    register,
    setValue,
    formState: { errors },
    trigger,
  } = useFormContext();

  const validateFile = (file: File) => {
    if (file.size > maxFileSize * 1024 * 1024) {
      alert(`File too large. Max ${maxFileSize} MB`);
      return false;
    }
    if (!fileExtension.some((ext) => file.name.toLowerCase().endsWith(ext))) {
      alert(`Invalid file type. Allowed: ${fileExtension.join(", ")}`);
      return false;
    }
    return true;
  };

  const handleFileUpload = (file: File) => {
    if (!file || !jwtToken) return;

    if (validateFile(file)) {
      setValue("logoImage", file);
      trigger("logoImage");
      setFile(file);
    }
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const file = e.dataTransfer.files?.[0];
    if (file) handleFileUpload(file);
  };

  return (
    <div
      className={`components-createCompany-DragAndDropFile drag-drop-container justify-center ${dragActive ? "active" : ""}`}
      onDragEnter={() => setDragActive(true)}
      onDragOver={(e) => e.preventDefault()}
      onDragLeave={() => setDragActive(false)}
      onDrop={handleDrop}
    >
      <input
        type="file"
        {...register("logo")}
        accept={fileExtension.join(",")}
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFileUpload(file);
          onChangeFn?.();
        }}
        className="components-createCompany-DragAndDropFile border w-full rounded-lg p-4 hover:cursor-pointer "
        id="upload-input"
      />
      {file && (
        <Image
          src={URL.createObjectURL(file)}
          height={1000}
          width={1000}
          alt="preview"
          className="h-20 w-20"
        />
      )}
      <div>
        {errors.logoImage && (
          <p className="text-sm text-red-500 mt-1 ml-1">
            {"Please upload a valid logo image (PNG)"}
          </p>
        )}
      </div>
    </div>
  );
}
