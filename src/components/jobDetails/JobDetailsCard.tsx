import { setAuthJwtToken } from "@/features/authJwtToken/authJwtTokenSlice";
import { setLoginRequiredDialogBox } from "@/features/loginRequiredDialogBox/loginRequiredDialogBoxSlice";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { timeAgo } from "@/utils/getTime";
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
    <div className="components-jobDetails-JobDetailsCard bg-white text-black pt-1 rounded-xl space-y-3 sm:grid grid-cols-[1fr_auto] items-center w-full px-3">
      <div className="grid grid-cols-[auto_1fr] w-full items-center h-full m-0">
        <div className=" m-0">
          <Image
            alt=""
            src={img}
            width={60}
            height={60}
            className="w-12 h-12 rounded-xl overflow-hidden"
          />
        </div>
        <div className="pl-4 tracking-">
          <div className="text-2xl font-semibold text-black mb-1">{title}</div>
          <div className="text-base text-black/90">
            {city}, {isRemote ? "Remote" : "Onsite"}
          </div>
        </div>
      </div>
      <div className="components-jobDetails-JobDetailsCard flex items-center gap-2 ">
        <button className="hidden components-jobDetails-JobDetailsCard bg-white/20 hover:bg-white/30 p-2 rounded-md">
          <Bookmark size={16} />
        </button>
        <button className="hidden components-jobDetails-JobDetailsCard bg-white/20 hover:bg-white/30 p-2 rounded-md">
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
              // router.replace('/login');
            }
          }}
          className="components-jobDetails-JobDetailsCard  hover:cursor-pointer hover:bg-[#cedcf1] ml-3 bg-[#2563EB] text-[#FFFFFF] px-4 py-1.5 rounded-md text-sm"
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
          className="components-jobDetails-JobDetailsCard  hover:cursor-pointer  ml-3 bg-white text-[#2563EB] border-2 border-[#D1D5DB] px-4 py-1.5 rounded-md text-sm"
        >
          Request Refferal
        </button>
      </div>
      <div className="w-full col-span-2 h-px bg-gray-300 mt-3"></div>
    </div>
  );
}
