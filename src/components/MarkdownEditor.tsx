import MDEditor from "@uiw/react-md-editor";
import { FC, useEffect, useRef, useState } from "react";
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
  height = 200,
}) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const [dynamicHeight, setDynamicHeight] = useState(height);

  useEffect(() => {
    const textarea = editorRef.current?.querySelector("textarea");

    if (textarea) {
      textarea.style.height = "auto";
      const newHeight = textarea.scrollHeight;
      textarea.style.height = newHeight + "px";

      setDynamicHeight(Math.max(height, newHeight));
    }
  }, [value, height]);

  return (
    <div ref={editorRef}>
      <MDEditor
        value={value}
        onChange={onValueChange}
        data-color-mode="light"
        height={dynamicHeight}
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
