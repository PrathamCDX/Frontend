"use client";
import { JobCardParams } from "@/types/JobCard";
import { cn } from "@/utils/cn";
import { timeAgo } from "@/utils/getTime";
import {
  BadgeDollarSign,
  Bookmark,
  Clock,
  MapPin,
  ChevronRight,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Inter } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  weight: ["600"],
});

export default function JobCard({
  id,
  img,
  title,
  company,
  employmentType,
  city,
  country,
  minPay,
  maxPay,
  className = "sm:w-[45%]",
  created_at,
}: JobCardParams) {
  const router = useRouter();

  return (
    <div
      className={cn(
        "group w-full rounded-2xl border border-[#E5E7EB] bg-white px-5 py-4",
        "flex flex-col justify-between space-y-3",
        "shadow-[0_2px_8px_rgba(0,0,0,0.05),0_10px_24px_rgba(0,0,0,0.06)]",
        "transition-all duration-300 hover:-translate-y-1 hover:border-[#D7DEE8]",
        "hover:shadow-[0_8px_20px_rgba(0,0,0,0.08),0_18px_40px_rgba(0,0,0,0.10)]",
        "hover:cursor-pointer",
        className,
      )}
      onClick={() => {
        router.push("/dashboard/jobs/" + id);
      }}
    >
      <div className="h-fit">
        <div className="flex items-center justify-end text-sm">
          <span className="hidden rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-600">
            Suit You Best!
          </span>
          <div className="text-end text-[#98A2B3] text-xs">
            {created_at ? timeAgo(String(created_at)) : "3 days ago"}
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-[#E9EEF5] bg-white shadow-[0_2px_8px_rgba(0,0,0,0.05)]">
            <Image
              className="h-10 w-10 rounded-full object-cover"
              src={img ? img : "/google-icon-logo-svgrepo-com.svg"}
              alt="photo"
              width={110}
              height={110}
              priority
              unoptimized
            />
          </div>

          <div className="min-w-0">
            <div
              className={cn(
                "truncate text-[21px] font-semibold text-[#111827]",
                inter.className,
              )}
            >
              {title}
            </div>
            <div className="text-base font-medium text-[#667085]">
              {company}
            </div>
          </div>
        </div>

        <div className="mt-3 flex flex-wrap gap-2 text-xs text-gray-600">
          <div className="flex items-center gap-1 rounded-full bg-[#F2F4F7] px-2.5 py-1.5">
            <MapPin className="h-3.5 w-3.5 text-[#667085]" />
            <span className="text-[#344054]">{city + ", " + country}</span>
          </div>

          <div className="flex items-center gap-1 rounded-full bg-[#F2F4F7] px-2.5 py-1.5">
            <Clock className="h-3.5 w-3.5 text-[#667085]" />
            <span className="text-[#344054]">{employmentType}</span>
          </div>

          <div className="hidden items-center gap-1 rounded-full bg-[#F2F4F7] px-2.5 py-1.5">
            <BadgeDollarSign className="hidden h-3.5 w-3.5 text-[#667085]" />
            <span className="text-[#344054]">
              {`${minPay} - ${maxPay} ${employmentType === "Internship" ? "K" : "LPA"}`}
            </span>
          </div>

          <div className="rounded-full bg-[#F2F4F7] px-2.5 py-1.5 text-[#667085]">
            +2
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <button
          className="w-full cursor-pointer rounded-xl bg-[linear-gradient(90deg,#4A70BE_0%,#567CC3_50%,#658BC6_100%)] py-2.5 text-white text-sm font-medium shadow-[0_4px_14px_rgba(74,112,190,0.28)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_8px_20px_rgba(74,112,190,0.34)] active:translate-y-0"
          onClick={() => {
            router.push("/dashboard/jobs/" + id);
          }}
        >
          <div className="flex items-center justify-center">
            <h4 className="mr-1 text-sm font-medium">Apply</h4>
            <ChevronRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
          </div>
        </button>

        <Bookmark className="hidden w-5 h-5 basis-1/10 text-gray-400" />
      </div>
    </div>
  );
}
