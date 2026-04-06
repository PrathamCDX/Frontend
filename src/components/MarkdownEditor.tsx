import MDEditor from "@uiw/react-md-editor";
import { FC } from "react";
import { FieldError } from "react-hook-form";
import rehypeKatex from "rehype-katex";
import rehypeRaw from "rehype-raw";
import remarkMath from "remark-math";

interface MarkdownEditorProps {
  value: string | undefined;
  onValueChange: (value: string | undefined) => void;
  error?: FieldError;
  placeholder: string;
  height?: number;
}

const MarkdownEditor: FC<MarkdownEditorProps> = ({
  value,
  onValueChange,
  error,
  placeholder,
  height,
}) => {
  return (
    <div>
      <MDEditor
        value={value}
        onChange={onValueChange}
        data-color-mode="light"
        height={height ?? 600}
        overflow
        preview="edit"
        textareaProps={{
          placeholder,
        }}
        previewOptions={{
          rehypePlugins: [rehypeRaw, rehypeKatex],
          remarkPlugins: [remarkMath],
        }}
      />

      {error && <p className="mt-1 text-sm text-red-500">{error.message}</p>}
    </div>
  );
};

export default MarkdownEditor;
