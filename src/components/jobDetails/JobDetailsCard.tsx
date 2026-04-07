import { setAuthJwtToken } from "@/features/authJwtToken/authJwtTokenSlice";
import { setLoginRequiredDialogBox } from "@/features/loginRequiredDialogBox/loginRequiredDialogBoxSlice";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import useCreateApplication from "@/utils/useCreateApplication";
import useGetUser from "@/utils/useGetUser";
import Image from "next/image";
import { useEffect } from "react";
import { toast } from "sonner";

type JobDetailsCardProps = {
  jobId: number;
  img: string;
  title: string;
  companyName: string;
  city: string;
  created_at: Date;
  apply_link: string;
  isRemote: boolean;
};

export default function JobDetailsCard({
  jobId,
  img,
  title,
  companyName,
  city,
  created_at,
  isRemote,
  apply_link,
}: JobDetailsCardProps) {
  const dispatch = useAppDispatch();
  const jwtToken = useAppSelector((state) => state.authJwtToken.value);

  useEffect(() => {
    if (!jwtToken) {
      const jwt = localStorage.getItem("AuthJwtToken");
      if (jwt) {
        dispatch(setAuthJwtToken(jwt));
      }
    }
  }, [dispatch, jwtToken]);

  const { mutate } = useCreateApplication();
  const { isSuccess } = useGetUser(jwtToken);

  return (
    <div className="components-jobDetails-JobDetailsCard mb-0 w-full rounded-[24px] bg-transparent px-2 py-2 text-black sm:grid sm:grid-cols-[1fr_auto] sm:items-center sm:gap-x-6 md:px-4 md:py-3">
      <div className="grid w-full grid-cols-[74px_1fr] gap-x-4 items-center sm:grid-cols-[auto_1fr] sm:gap-x-6">
        <div className="flex h-[74px] w-[74px] shrink-0 items-center justify-center rounded-[22px] border border-[#EEF2F7] bg-[linear-gradient(180deg,#FFFFFF_0%,#F8FAFC_100%)] p-3 shadow-[0_8px_20px_rgba(15,23,42,0.06)] sm:mt-0 sm:h-[116px] sm:w-[116px] sm:rounded-[28px] sm:p-5 sm:shadow-[-14px_14px_34px_rgba(191,219,254,0.38),0_14px_32px_rgba(15,23,42,0.08),inset_0_1px_0_rgba(255,255,255,0.95)]">
          <Image
            alt={`${companyName} logo`}
            src={img}
            width={72}
            height={72}
            className="h-full w-full object-contain scale-125"
          />
        </div>

        <div className="min-w-0">
          <div className="text-[20px] font-semibold leading-[1.06] tracking-[-0.03em] text-[#111827] sm:text-[40px] sm:leading-[1.03] sm:tracking-[-0.035em]">
            {title}
          </div>

          <div className="mt-2 flex flex-wrap items-center gap-2 text-[14px] font-medium text-[#667085] sm:mt-3 sm:text-[15px]">
            <span className="font-semibold text-[#344054]">{companyName}</span>
            {city !== "Remote" && (
              <span className="h-1 w-1 rounded-full bg-[#C7D0DD]" />
            )}
            {city !== "Remote" && <span>{city}</span>}
            <span className="h-1 w-1 rounded-full bg-[#C7D0DD]" />
            <span>{city === "Remote" ? "Remote" : "On-site"}</span>
          </div>
        </div>
      </div>

      <div className="mt-4 flex items-center gap-2 sm:mt-0 sm:gap-3">
        <button
          onClick={() => {
            if (isSuccess) {
              mutate({ jobId, jwtToken });
              if (apply_link) {
                window.open(apply_link, "_blank");
              } else {
                toast.warning("Invalid apply link");
              }
            } else {
              dispatch(setLoginRequiredDialogBox(true));
            }
          }}
          className="
      group relative inline-flex flex-1 items-center justify-center overflow-hidden
      rounded-[14px] border border-[#2D6BFF]
      bg-[linear-gradient(135deg,#2E63F5_0%,#3478FF_55%,#285BEB_100%)]
      px-4 py-2.5 text-[14px] font-semibold text-white
      shadow-[0_10px_20px_rgba(46,99,245,0.20)]
      transition-all duration-300 ease-out
      hover:-translate-y-[1px] hover:shadow-[0_16px_30px_rgba(46,99,245,0.30)] hover:saturate-[1.08]
      focus:outline-none focus:ring-2 focus:ring-[#0A66C2]/30
      active:translate-y-0 active:scale-[0.985]
      cursor-pointer
      sm:ml-3 sm:flex-none sm:rounded-[16px] sm:px-7 sm:py-3.5 sm:text-[15px]
    "
        >
          <span className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.18)_0%,rgba(255,255,255,0)_45%)] opacity-80 transition-opacity duration-300 group-hover:opacity-100" />
          <span className="relative">Apply Now</span>
        </button>

        <button
          onClick={() => {
            if (isSuccess) {
              toast.success("Request is submitted successfully");
            } else {
              dispatch(setLoginRequiredDialogBox(true));
            }
          }}
          className="
      group relative inline-flex flex-1 items-center justify-center
      rounded-[14px] border border-[#D8E2F0]
      bg-[linear-gradient(180deg,#FFFFFF_0%,#FBFCFE_100%)]
      px-4 py-2.5 text-[14px] font-semibold text-[#1D4ED8]
      shadow-[0_6px_14px_rgba(15,23,42,0.05)]
      transition-all duration-300 ease-out
      hover:-translate-y-[1px] hover:border-[#C3D4EE] hover:bg-[linear-gradient(180deg,#FFFFFF_0%,#F6FAFF_100%)]
      hover:text-[#1746C9] hover:shadow-[0_12px_22px_rgba(29,78,216,0.08)]
      focus:outline-none focus:ring-2 focus:ring-[#0A66C2]/20
      active:translate-y-0 active:scale-[0.985]
      cursor-pointer
      sm:flex-none sm:rounded-[16px] sm:px-7 sm:py-3.5 sm:text-[15px]
    "
        >
          <span className="relative">Request Referral</span>
        </button>
      </div>
    </div>
  );
}
