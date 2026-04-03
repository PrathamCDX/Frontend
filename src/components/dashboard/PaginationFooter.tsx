"use client";
import {
  decrementJobPageCount,
  incrementJobPageCount,
} from "@/features/jobPageNumber/jobPageNumberSlice";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function PaginationFooter() {
  const currentPage = useAppSelector((state) => state.jobPageNumber.value);
  const totalPages = useAppSelector((state) => state.jobPageNumber.totalPages);

  const dispatch = useAppDispatch();
  return (
    <div className="w-[100%] sticky bottom-0 bg-white border-t shadow-sm">
      <div className="flex items-center justify-between px-4 py-2">
        <button
          className="flex items-center px-3 py-1 rounded-lg border disabled:opacity-50 hover:cursor-pointer disabled:cursor-not-allowed"
          disabled={currentPage === 1}
          onClick={() => {
            dispatch(decrementJobPageCount());
          }}
        >
          <ChevronLeft size={16} className="mr-1" />
          Prev
        </button>

        <span className="text-sm font-medium">
          Page {currentPage} of {totalPages == -1 ? "" : totalPages}
        </span>

        <button
          className="flex items-center px-3 py-1 rounded-lg border disabled:opacity-50 hover:cursor-pointer disabled:cursor-not-allowed"
          disabled={currentPage === totalPages}
          onClick={() => {
            dispatch(incrementJobPageCount());
          }}
        >
          Next
          <ChevronRight size={16} className="ml-1" />
        </button>
      </div>
    </div>
  );
}
