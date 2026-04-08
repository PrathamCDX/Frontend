"use client";

import { FieldError, FieldValues, Path, UseFormRegister } from "react-hook-form";
import { LucideIcon } from "lucide-react";

interface SignUpTextInputProps<T extends FieldValues> {
  register: UseFormRegister<T>;
  fieldName: Path<T>;
  placeholder: string;
  type?: "text" | "email" | "number";
  icon?: LucideIcon;
  error?: FieldError;
  disabled?: boolean;
  inputClassName?: string;
}

export default function SignUpTextInput<T extends FieldValues>({
  register,
  fieldName,
  placeholder,
  type = "text",
  icon: Icon,
  error,
  disabled = false,
  inputClassName = "",
}: SignUpTextInputProps<T>) {
  return (
    <div>
      <div className="relative">
        {Icon && (
          <span className="absolute left-4 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-[14px] bg-[#EEF5FF] text-[#1681D8]">
            <Icon size={20} strokeWidth={2.1} />
          </span>
        )}

        <input
          {...register(fieldName)}
          type={type}
          placeholder={placeholder}
          disabled={disabled}
          className={`h-[64px] w-full rounded-[18px] border border-[#D7E4F0] bg-white pl-[72px] pr-4 text-[16px] font-medium text-[#334155] shadow-[0_2px_8px_rgba(15,56,101,0.04)] outline-none transition placeholder:font-normal placeholder:text-[#9AA8B7] focus:border-[#8CC2EE] focus:ring-4 focus:ring-[#DDEEFF] ${
            error ? "border-red-400" : ""
          } ${inputClassName}`}
        />
      </div>

      {error?.message && (
        <p className="mt-2 text-left text-xs text-[#E04B40]">
          {error.message}
        </p>
      )}
    </div>
  );
}
