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
          <div className="text-sm text-gray-400">{label}</div>
          <div className="text-base font-semibold text-black">{value}</div>
        </div>
      </div>
    </div>
  );
}
