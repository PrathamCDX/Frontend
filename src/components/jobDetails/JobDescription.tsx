"use client";

import { useAppSelector } from "@/lib/hooks";
import MarkdownHTML from "./MarkdownRender";

export default function JobDescription() {
  const jobDetails = useAppSelector((state) => state.jobDetails.value);

  return (
    <div className="text-[15px] leading-8 text-[#344054] max-md:p-3">
      <MarkdownHTML content={jobDetails?.description ?? "No job description available."} />
    </div>
  );
}