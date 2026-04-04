import { setAuthJwtToken } from "@/features/authJwtToken/authJwtTokenSlice";
import { setLoginRequiredDialogBox } from "@/features/loginRequiredDialogBox/loginRequiredDialogBoxSlice";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import useCreateApplication from "@/utils/useCreateApplication";
import useGetUser from "@/utils/useGetUser";
import { Bookmark, MoreHorizontal } from "lucide-react";
import Image from "next/image";
import { useEffect } from "react";
import { toast } from "react-toastify";

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
    <div className="components-jobDetails-JobDetailsCard bg-[#fefefe] text-black pt-1 rounded-xl mb-0 space-y-3 sm:grid grid-cols-[1fr_auto] items-center w-full px-3">
      <div className="grid grid-cols-[auto_1fr] gap-x-2 w-full items-center h-full m-0">
        <div className="mt-2 sm:mt-0 sm:m-0 flex h-16 w-16 items-center justify-center overflow-hidden rounded-full bg-white">
          <Image
            alt=""
            src={img}
            width={64}
            height={64}
            className="h-full w-full object-cover "
          />
        </div>

        <div className="pl-1 h-full flex flex-col justify-center gap-1">
          <div className="text-2xl sm:text-3xl font-bold text-black ">
            {title}
          </div>
          <div className="text-sm sm:text-base font-medium text-black/90">
            {city}, {isRemote ? "Remote" : "Onsite"}
          </div>
        </div>
      </div>

      <div className="components-jobDetails-JobDetailsCard mt-2 sm:mt-0 flex items-center justify-around sm:justify-start gap-3">
        <button className="hidden bg-white/20 hover:bg-white/30 p-2 rounded-md">
          <Bookmark size={16} />
        </button>

        <button className="hidden bg-white/20 hover:bg-white/30 p-2 rounded-md">
          <MoreHorizontal size={16} />
        </button>

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
          className="sm:ml-3  rounded-md cursor-pointer flex-1 sm:flex-none w-full sm:w-auto bg-[#0A66C2] px-5 py-2 text-sm font-medium text-white shadow-[0_4px_12px_rgba(10,102,194,0.28)] transition-all duration-200 hover:translate-y-[-1px] hover:bg-[#0858A8] hover:shadow-[0_8px_18px_rgba(10,102,194,0.34)] focus:outline-none focus:ring-2 focus:ring-[#0A66C2]/30 active:translate-y-0"
        >
          Apply Now
        </button>

        <button
          onClick={() => {
            if (isSuccess) {
              toast.success("Request is submitted successfully");
            } else {
              dispatch(setLoginRequiredDialogBox(true));
            }
          }}
          className="ml-1 cursor-pointer flex-1 sm:flex-none w-full sm:w-auto rounded-md border border-[#0A66C2] bg-white px-5 py-2 text-sm font-medium text-[#0A66C2] shadow-[0_2px_8px_rgba(10,102,194,0.08)] transition-all duration-200 hover:translate-y-[-1px] hover:bg-[#EFF6FF] hover:border-[#0858A8] hover:text-[#0858A8] hover:shadow-[0_6px_16px_rgba(10,102,194,0.12)] focus:outline-none focus:ring-2 focus:ring-[#0A66C2]/20 active:translate-y-0"
        >
          Request Referral
        </button>
      </div>

      <div className="w-full col-span-2 h-px bg-gray-300 mt-3"></div>
    </div>
  );
}
