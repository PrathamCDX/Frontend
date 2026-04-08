import Image from "next/image";
import React, { useEffect, useMemo, useState, DragEvent } from "react";
import { FieldError } from "react-hook-form";
import { CloudUpload } from "lucide-react";

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

  const handleDrop = (e: DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const selectedFile = e.dataTransfer.files?.[0];
    if (selectedFile) {
      handleFileUpload(selectedFile);
    }
  };

  const initials = file?.name ? file.name.charAt(0).toUpperCase() : "CL";

  return (
    <div className="mt-5">
      <label
        htmlFor="upload-input"
        className={`flex h-[190px] w-full cursor-pointer flex-col items-center justify-center rounded-[20px] border-2 border-dashed px-5 text-center transition ${
          dragActive
            ? "border-[#8EB6FF] bg-[#F4F8FF]"
            : "border-[#B8D1FF] bg-[#f5f9fd] hover:border-[#8EB6FF] hover:bg-[#F4F8FF]"
        }`}
        onDragEnter={() => setDragActive(true)}
        onDragOver={(e) => {
          e.preventDefault();
          setDragActive(true);
        }}
        onDragLeave={() => setDragActive(false)}
        onDrop={handleDrop}
      >
        <input
          id="upload-input"
          type="file"
          accept=".png,.jpg,.jpeg"
          className="hidden"
          onChange={(e) => {
            const selectedFile = e.target.files?.[0] ?? null;
            if (selectedFile) {
              handleFileUpload(selectedFile);
            }
          }}
        />

        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#DCE9FF]">
          <CloudUpload color="#2157C9" size={26} />
        </div>

        <h5 className="mt-3 text-[0.98rem] font-semibold text-[#2157C9]">
          Drag & drop or click to upload
        </h5>

        <p className="mt-1.5 text-[0.9rem] font-medium text-[#7C8798]">
          PNG, JPG or JPEG (max 2MB)
        </p>
      </label>

      {error && (
        <p className="mt-2 ml-1 text-sm text-red-500">{error.message}</p>
      )}

      <div className="mt-5 flex items-center gap-3">
        <div className="h-px flex-1 bg-[#D6DBE4]" />
        <span className="text-[0.95rem] font-medium text-[#7C8798]">
          Preview
        </span>
        <div className="h-px flex-1 bg-[#D6DBE4]" />
      </div>

      <div className="mt-4 flex items-center gap-3">
        <div className="flex h-[70px] w-[70px] items-center justify-center overflow-hidden rounded-[18px] bg-[#DCE9FF]">
          {file && previewUrl ? (
            <Image
              src={previewUrl}
              alt="preview"
              width={70}
              height={70}
              className="h-full w-full object-cover"
            />
          ) : (
            <span className="text-[1.7rem] font-semibold text-[#2B6DEB]">
              {initials}
            </span>
          )}
        </div>

        <div className="min-w-0">
          <h5 className="text-[1rem] font-semibold text-[#111827]">
            Company logo
          </h5>
          <p className="mt-1 truncate text-[0.92rem] font-medium leading-snug text-[#8A94A6]">
            {file ? file.name : "Preview will appear here"}
          </p>
        </div>
      </div>
    </div>
  );
}
