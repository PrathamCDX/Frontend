// 'use client' ;

// import z from "zod";
// import { OptionType } from "./createJobForm";
// import { CreateJobFormSchema } from "@/schema/createJob.validator";
// import { FieldError, Path, UseFormSetValue } from "react-hook-form";
// import { useState } from "react";
// import { ChevronDown } from "lucide-react";

// type CreateJobFormValues = z.infer<typeof CreateJobFormSchema>;

// export default function Dropdown({
//   optionArray,
//   fieldName,
//   setValue,
//   error,
//   placeholder,
// }: {
//   optionArray: OptionType[];
//   fieldName: Path<CreateJobFormValues>;
//   setValue: UseFormSetValue<CreateJobFormValues>;
//   error: FieldError | undefined;
//   placeholder: string;
// }) {
//   const [toogle, setToogle] = useState(false);
//   const [isEmpty, setIsEmpty] = useState<string | null>(null);
//   return (
//     <div className="relative">
//       <div
//         className="flex justify-between w-full pl-10 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//         onClick={() => {
//           setToogle((prev) => {
//             return !prev;
//           });
//         }}
//       >
//         <div>{isEmpty ? isEmpty : placeholder ?? ""}</div>
//         <div>
//           {" "}
//           <ChevronDown />{" "}
//         </div>
//       </div>
//       {toogle ? (
//         <div className="h-[20vh] border w-full absolute overflow-y-scroll bg-[#F5F5F5] z-10 ">
//           {optionArray &&
//             optionArray.map((option) => {
//               return (
//                 <div
//                   onClick={() => {
//                     setValue(fieldName, option.id);
//                     setIsEmpty(option.name);
//                     setToogle((prev) => {
//                       return !prev;
//                     });
//                   }}
//                   className="px-2 py-1"
//                   key={option.id}
//                 >
//                   {option.name}
//                 </div>
//               );
//             })}
//         </div>
//       ) : (
//         <></>
//       )}
//       {error && (
//         <p className="text-sm text-red-500 mt-1 ml-1">
//           {error.message || "This field is required"}
//         </p>
//       )}
//     </div>
//   );
// }

"use client";

import { useState, useRef, useEffect } from "react";
import {
  FieldError,
  FieldValues,
  Path,
  UseFormSetValue,
  PathValue,
} from "react-hook-form";
import { ChevronDown } from "lucide-react";
import Image from "next/image";

export interface DropdownProps<TFormValues extends FieldValues, TOption> {
  optionArray: TOption[] | undefined;
  fieldName: Path<TFormValues>;
  setValue: UseFormSetValue<TFormValues>;
  error: FieldError | undefined;
  placeholder: string;
  getOptionLabel: (option: TOption) => string;
  getOptionValue: (
    option: TOption,
  ) => PathValue<TFormValues, Path<TFormValues>>;
  iconUrl?: string;
  fieldValue?: string;
  resetOn?: boolean;
  inputClassName?: string;
}

export default function Dropdown<TFormValues extends FieldValues, TOption>({
  optionArray,
  fieldName,
  setValue,
  error,
  placeholder,
  getOptionLabel,
  getOptionValue,
  fieldValue,
  iconUrl,
  resetOn = false,
  inputClassName = "",
}: DropdownProps<TFormValues, TOption>) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedLabel, setSelectedLabel] = useState<string | null>(
    fieldValue || null,
  );
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (resetOn) {
      setSelectedLabel(null);
    }
  }, [resetOn]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSelectOption = (option: TOption) => {
    const value = getOptionValue(option);
    const label = getOptionLabel(option);
    setValue(fieldName, value, { shouldValidate: true, shouldDirty: true });
    setSelectedLabel(label);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <div
        className={
          "flex items-center h-[42px] justify-start pr-3 w-full border border-gray-300 rounded-md cursor-pointer " +
          inputClassName
        }
        onClick={() => setIsOpen((prev) => !prev)}
      >
        {iconUrl && (
          <Image
            alt=""
            src={iconUrl}
            width={20}
            height={20}
            className="h-8 w-8 ml-2 "
          />
        )}
        <div className="w-full flex items-center justify-between pl-2">
          <div className={selectedLabel ? "text-black" : "text-[#7c7d7d]"}>
            {selectedLabel || placeholder}
          </div>
          <ChevronDown
            width={20}
            className={`transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
          />
        </div>
      </div>
      {isOpen && (
        <div className="absolute z-10 mt-2 w-full max-h-60 overflow-y-auto rounded-xl border border-gray-200 bg-white shadow-lg">
          {optionArray && optionArray.length === 0 && (
            <div className="px-4 py-3 text-sm text-gray-500">
              No results found
            </div>
          )}

          {optionArray &&
            optionArray.map((option, index) => {
              const label = getOptionLabel(option);

              return (
                <div
                  key={index}
                  onClick={() => handleSelectOption(option)}
                  className="mx-2 my-1 rounded-lg px-3 py-2 text-sm text-gray-700 cursor-pointer transition-colors duration-150 hover:bg-gray-100 active:bg-gray-200"
                >
                  {label}
                </div>
              );
            })}
        </div>
      )}

      {error && (
        <p className="text-sm text-red-500 mt-1 ml-1">{error.message}</p>
      )}
    </div>
  );
}
