"use client";

import { useAppSelector } from "@/lib/hooks";
import MarkdownHTML from "./MarkdownRender";

export default function JobDescription() {
  const jobDetails = useAppSelector((state) => state.jobDetails.value);
  return (
    <div>
      <div className="text-lg font-semibold my-3">Job Description</div>
      <div className="text-gray-400">
        <MarkdownHTML content={jobDetails?.description ?? "null"} />
      </div>
    </div>
  );
}
