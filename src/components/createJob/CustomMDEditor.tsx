import MDEditor from "@uiw/react-md-editor";
import React from "react";
import { FieldError } from "react-hook-form";
import rehypeKatex from "rehype-katex";
import rehypeRaw from "rehype-raw";
import remarkMath from "remark-math";

export default function CustomMDEditor({
  value,
  onChange,
  error,
}: {
  value: string;
  onChange: (value?: string) => void;
  error?: FieldError | undefined;
}) {
  return (
    <div>
      <MDEditor
        value={value ?? null}
        onChange={onChange}
        data-color-mode="light"
        height={600}
        overflow
        preview="edit"
        previewOptions={{
          rehypePlugins: [rehypeRaw, rehypeKatex],
          remarkPlugins: [remarkMath],
        }}
      />

      {error && <p className="mt-1 text-sm text-red-500">{error.message}</p>}
    </div>
  );
}
