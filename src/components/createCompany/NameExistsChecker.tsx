"use client";
import { useAppSelector } from "@/lib/hooks";
import { useDebounce } from "@/utils/useDebounce";
import { Check, LoaderCircle, X } from "lucide-react";
import React, { useEffect } from "react";
import {
  FieldError,
  FieldValues,
  Path,
  UseFormRegister,
} from "react-hook-form";

function NameExistsChecker<T extends FieldValues>({
  name,
  register,
  error,
  useQueryFn,
  watch,
  companyNameExists,
  setCompanyNameExists,
  placeholder,
}: {
  name: Path<T>;
  register: UseFormRegister<T>;
  error: FieldError | undefined;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  useQueryFn: any;
  watch: (field: Path<T>) => string;
  companyNameExists: boolean;
  setCompanyNameExists: React.Dispatch<React.SetStateAction<boolean>>;
  placeholder: string;
}) {
  const fieldValue = watch(name);
  const debouncedValue = useDebounce(fieldValue, 500);
  const jwtToken = useAppSelector((state) => state.authJwtToken.value);

  const { data, isFetching, isError } = useQueryFn(jwtToken, debouncedValue);

  useEffect(() => {
    if (data && data.id) {
      setCompanyNameExists(true);
    } else {
      setCompanyNameExists(false);
    }
  }, [data, setCompanyNameExists]);

  useEffect(() => {
    if (isError) {
      setCompanyNameExists(false);
    }
  }, [isError, setCompanyNameExists]);

  useEffect(() => {
    console.log(typeof fieldValue);
  }, [fieldValue]);

  return (
    <div className="">
      <div className="grid grid-cols-[1fr_auto] items-center gap-x-3">
        <input
          type="text"
          {...register(name)}
          placeholder={placeholder}
          className="w-full h-[42px] rounded-lg border  pl-4"
        />

        {fieldValue.length == 0 ? (
          <div className="text-sm text-red-500 mt-1 ml-1">
            <X width={20} height={30} />
          </div>
        ) : isFetching ? (
          <div>
            <LoaderCircle width={20} height={30} />
          </div>
        ) : companyNameExists ? (
          <div className="text-sm text-red-500 mt-1 ml-1">
            <X width={20} height={30} />
          </div>
        ) : error ? (
          <div className="text-sm text-red-500 mt-1 ml-1">
            <X width={20} height={30} />
          </div>
        ) : (
          <div className="text-green-400">
            <Check width={20} height={30} />
          </div>
        )}
      </div>
      {companyNameExists && (
        <p className="text-sm text-red-500 mt-1 ml-1">
          {"Company name already exists"}
        </p>
      )}
      {error && (
        <p className="text-sm text-red-500 mt-1 ml-1">
          {error.message || "This field is required"}
        </p>
      )}
    </div>
  );
}

export default NameExistsChecker;
