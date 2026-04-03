import MDEditor from "@uiw/react-md-editor";
import { FC } from "react";
import { FieldError } from "react-hook-form";
import rehypeKatex from "rehype-katex";
import rehypeRaw from "rehype-raw";
import remarkMath from "remark-math";

interface EditorProps {
    value: string | undefined
    onValueChange: (value: string | undefined) => void
    error?: FieldError
}

const CustomMarkdown: FC<EditorProps> = ({ value, onValueChange, error }) => {
    return (
        <div>
            <MDEditor
                value={value}
                onChange={onValueChange}
                data-color-mode="light"
                height={600}
                overflow
                preview="edit"
                previewOptions={{
                rehypePlugins: [rehypeRaw, rehypeKatex],
                remarkPlugins: [remarkMath],
                }}
            />

            {error && (
                <p className="mt-1 text-sm text-red-500">
                    {error.message}
                </p>
            )}
        </div>
    );
};

export default CustomMarkdown;