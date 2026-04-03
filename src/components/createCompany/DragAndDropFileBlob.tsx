import Image from "next/image";
import React, { useEffect, useMemo, useState, DragEvent } from "react";
import { FieldError } from "react-hook-form";

interface DragAndDropFileProps {
  file: File | null;
  onFileChange: (file: File | null) => void;
  error?: FieldError;
  onChangeFn?: () => void;
}

export default function DragAndDropFileBlob({
  file,
  onFileChange,
  error,
  onChangeFn,
}: DragAndDropFileProps) {
  const [dragActive, setDragActive] = useState(false);

  const previewUrl = useMemo(() => {
    if (!file) return null;
    return URL.createObjectURL(file);
  }, [file]);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const handleFileUpload = (selectedFile: File) => {
    onFileChange(selectedFile);
    onChangeFn?.();
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const selectedFile = e.dataTransfer.files?.[0];
    if (selectedFile) {
      handleFileUpload(selectedFile);
    }
  };

  return (
    <div
      className={`components-createCompany-DragAndDropFile drag-drop-container justify-center ${
        dragActive ? "active" : ""
      }`}
      onDragEnter={() => setDragActive(true)}
      onDragOver={(e) => e.preventDefault()}
      onDragLeave={() => setDragActive(false)}
      onDrop={handleDrop}
    >
      <input
        type="file"
        onChange={(e) => {
          const selectedFile = e.target.files?.[0] ?? null;
          if (selectedFile) {
            handleFileUpload(selectedFile);
          }
        }}
        className="components-createCompany-DragAndDropFile border w-full rounded-lg p-4 hover:cursor-pointer"
        id="upload-input"
      />

      {file && previewUrl && (
        <div className="mt-2">
          <Image
            src={previewUrl}
            height={1000}
            width={1000}
            alt="preview"
            className="h-20 w-20"
          />
          <p className="mt-1 text-sm text-gray-600">{file.name}</p>
        </div>
      )}

      {error && (
        <p className="text-sm text-red-500 mt-1 ml-1">
          {error.message}
        </p>
      )}
    </div>
  );
}