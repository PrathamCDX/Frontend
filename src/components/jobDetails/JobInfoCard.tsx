import { cn } from "@/utils/cn";
import Image from "next/image";

export default function JobInfoCard({
  label,
  value,
  className,
  imgUrl,
  topElement = false,
}: {
  label: string;
  value: string;
  imgUrl: string;
  className?: string;
  topElement?: boolean;
}) {
  return (
    <div className={cn("rounded-xl flex text-start items-center ", className)}>
      <div className="flex items-center gap-x-3">
        <div className="flex flex-col items-center">
          {!topElement && <div className="h-5 w-[2.5px] bg-gray-200"></div>}
          <Image
            alt=""
            src={imgUrl}
            height={100}
            width={100}
            className="h-14 w-14"
          />
        </div>
        <div style={{ marginTop: !topElement ? 20 : 0 }}>
          <div className="text-[14px] font-medium leading-[1.2] text-[#98A2B3]">{label}</div>
          <div className="mt-1 text-[16px] font-semibold leading-[1.25] text-[#111827]">{value}</div>
        </div>
      </div>
    </div>
  );
}