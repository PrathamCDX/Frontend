import { Bookmark, MoreHorizontal } from "lucide-react";

export default function DeadlineCard () {
  return (
    <div className="w-full sm:w-[40%] rounded-xl border border-gray-200 p-4 shadow-sm bg-white space-y-3 h-[220px]">
      <div className="flex items-center justify-between">
        <div className="relative w-fit">
          <p className="text-[10px] text-red-500 absolute -right-[4.3rem] -top-1">Coming Soon</p>
          <h2 className="font-semibold text-base">Deadline Today!</h2>
        </div>
        <MoreHorizontal className="w-5 h-5 text-gray-500" />
      </div>

      <div className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
            <span className="text-xl font-bold text-blue-600">W</span>
          </div>
          <div>
            <div className="font-semibold text-sm">Product Designer</div>
            <div className="text-xs text-gray-500">Design Studio Pro</div>
          </div>
        </div>
        <Bookmark className="w-5 h-5 text-blue-500" fill="#3B82F6" />
      </div>
      <p className="text-sm text-gray-500">
        One of your saved jobs has a deadline today, don’t miss out,&nbsp;
        <a href="#" className="text-blue-600 font-medium hover:underline pointer-events-none">
          apply now!
        </a>
      </p>
    </div>
  );
};