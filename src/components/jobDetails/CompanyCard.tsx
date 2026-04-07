"use client";

import { CompanyCardProps } from "@/types/CompanyCardProps";
import Image from "next/image";
import MarkdownHTML from "./MarkdownRender";
import { useEffect, useMemo, useRef, useState } from "react";

export default function CompanyCard({
  logoUrl,
  name,
  location,
  industry,
  size,
  description,
  website,
}: CompanyCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [contentHeight, setContentHeight] = useState(0);
  const contentRef = useRef<HTMLDivElement | null>(null);

  const cleanDescription = useMemo(
    () => (description ?? "").trim(),
    [description]
  );

  const collapsedHeight = 250;

  useEffect(() => {
    const el = contentRef.current;
    if (!el) return;

    const updateHeight = () => {
      setContentHeight(el.scrollHeight);
    };

    updateHeight();

    const observer = new ResizeObserver(() => {
      updateHeight();
    });

    observer.observe(el);

    window.addEventListener("resize", updateHeight);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", updateHeight);
    };
  }, [cleanDescription]);

  const shouldShowToggle = contentHeight > collapsedHeight + 4;

  return (
    <div className="mb-10 mt-5 space-y-4 rounded-lg bg-[#d6dce3] bg-radial from-black/10 to-white p-5 shadow-[0px_7px_29px_0px_rgba(100,100,111,0.2)] backdrop-blur-2xl">
      <h3 className="text-lg font-semibold text-gray-900">About Company</h3>

      <div className="flex items-center gap-4">
        {logoUrl && (
          <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-full bg-white">
            <Image
              src={logoUrl}
              alt={name}
              width={64}
              height={64}
              className="h-full w-full object-cover"
              unoptimized
            />
          </div>
        )}

        <div>
          <div className="text-lg font-medium text-gray-900">{name}</div>
          <div className="text-sm font-medium text-gray-500">{location}</div>
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <span className="rounded-full bg-white px-3 py-1 text-xs text-gray-700">
          {industry}
        </span>
        <span className="rounded-full bg-white px-3 py-1 text-xs text-gray-700">
          {size}
        </span>
      </div>

      <div>
        <div className="relative">
          <div
            className="overflow-hidden transition-[max-height] duration-500 ease-in-out"
            style={{
              maxHeight: expanded ? `${contentHeight}px` : `${collapsedHeight}px`,
            }}
          >
            <div
              ref={contentRef}
              className="text-sm leading-relaxed text-gray-600 [&_p]:mb-3 [&_p:last-child]:mb-0"
            >
              <MarkdownHTML content={cleanDescription || "null"} />
            </div>
          </div>

          {!expanded && shouldShowToggle && (
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-b from-transparent via-[rgba(214,220,227,0.12)] to-[rgba(214,220,227,0.38)]" />
          )}
        </div>

        {shouldShowToggle && (
          <button
            type="button"
            onClick={() => setExpanded((prev) => !prev)}
            className="mt-3 inline-flex cursor-pointer items-center text-[15px] font-semibold text-[#2F5D9F] transition-colors duration-200 hover:text-[#1E4E8C] hover:underline hover:underline-offset-4"
          >
            {expanded ? "View less" : "View more"}
          </button>
        )}
      </div>

      <div className="text-sm font-semibold">
        <a
          href={website}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-sm font-semibold text-[#2F5D9F] transition-all duration-200 hover:translate-x-0.5 hover:text-[#1E4E8C] hover:underline hover:underline-offset-4"
        >
          Visit Website
          <span aria-hidden="true">↗</span>
        </a>
      </div>
    </div>
  );
}