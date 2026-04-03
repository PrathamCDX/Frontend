import { CompanyCardProps } from "@/types/CompanyCardProps";
import Image from "next/image";
import MarkdownHTML from "./MarkdownRender";

export default function CompanyCard({
  logoUrl,
  name,
  location,
  industry,
  size,
  description,
  website,
}: CompanyCardProps) {
  return (
    <div className="rounded-xl border-gray-200 mt-3 p-5 bg-white/30 bg-radial from-black/10 to-white backdrop-blur-2xl  space-y-4 shadow-md mb-10">
      <h3 className="text-lg font-semibold text-gray-900">About Company</h3>

      <div className="flex items-center gap-4">
        {logoUrl && (
          <Image
            src={logoUrl}
            alt={name}
            width={40}
            height={40}
            className="rounded-md"
            unoptimized
          />
        )}

        <div>
          <div className="text-sm font-medium text-gray-900">{name}</div>
          <div className="text-sm text-gray-500">{location}</div>
        </div>
      </div>

      <div className="gap-3 flex flex-wrap">
        <span className="px-3 py-1 text-xs bg-gray-100 rounded-lg text-gray-700">
          {industry}
        </span>
        <span className="px-3 py-1 text-xs bg-gray-100 rounded-lg text-gray-700">
          {size}
        </span>
      </div>

      <div className="text-sm text-gray-600 leading-relaxed">
        <MarkdownHTML content={description ?? "null"} />
      </div>

      <div className="text-sm font-semibold">
        <a
          href={website}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 hover:underline"
        >
          Visit Website
        </a>
      </div>
    </div>
  );
}
