"use client";

import InputField from "../InputField";
import { FormProvider, useForm } from "react-hook-form";
import {
  Eye,
  EyeOff,
  User,
  Mail,
  Lock,
  Phone,
  Calendar,
  Building2,
  School,
  IndianRupee,
  CodeXml,
} from "lucide-react";
import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { SignUpFormSchema } from "@/schema/signUp.validator";
import useSignup from "@/utils/useSignup";
import {
  ctcOptions,
  domainOptions,
  fresherOptions,
} from "@/utils/signup.utils";
import Dropdown from "../createJob/Dropdown";

type FormValues = z.infer<typeof SignUpFormSchema>;

export default function SignUpForm() {
  const router = useRouter();
  return (
    <div className="relative w-full h-full ">
      <div className=" top-0 left-0 p-6 pt-3">
        <Image
          src="/WorkR-Full-Logo2.png"
          alt="photo"
          width={80}
          height={80}
          objectFit="cover"
          priority
        />
      </div>
      <div className="flex items-center justify-center mt-[2vh]">
        <div className=" w-[100%] sm:w-[60%] text-center mt-[4vh]">
          <div className="text-lg font-semibold">Create Your Account</div>
          <div className="text-sm px-4">
            Welcome to Workr! Let’s get started by creating your Account
          </div>
          <Form />
        </div>
      </div>
      <div className=" bottom-0 flex items-center justify-center text-sm">
        <div>Already have an account? </div>
        <button
          className="text-[#467FA3] hover:cursor-pointer"
          onClick={() => {
            router.push("/login");
          }}
        >
          Log in
        </button>
      </div>

      <div className="h-[140px] bg-transparent"></div>
    </div>
  );
}

function Form() {
  const methods = useForm<FormValues>({
    mode: "onChange",
    reValidateMode: "onChange",
    resolver: zodResolver(SignUpFormSchema),
  });

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = methods;

  const searchParams = useSearchParams();
  const returnUrl = searchParams.get("returnUrl");
  const router = useRouter();
  const password = watch("password");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const { mutate, isPending, isSuccess } = useSignup();

  useEffect(() => {
    if (isSuccess) {
      router.push(returnUrl || "/dashboard");
    }
  }, [isSuccess, router, returnUrl]);

  const onSubmit = (formData: FormValues) => {
    mutate(formData, {
      onSuccess: () => {
        router.push(returnUrl || "/dashboard");
      },
    });
  };

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="max-w-md mx-auto space-y-2 py-6 rounded-lg font-poppins text-sm px-8"
      >
        {/* {isError ? (<ErrorPopup message="Error while Siging up" />):(<></>)} */}

        <InputField
          register={register}
          fieldName="fullName"
          placeholder="Full Name"
          type="text"
          icon={<User size={20} />}
          error={errors.fullName}
        />

        <InputField
          register={register}
          fieldName="phoneNo"
          placeholder="Phone No."
          type="text"
          icon={<Phone size={20} />}
          error={errors.phoneNo}
        />

        <InputField
          register={register}
          fieldName="email"
          placeholder="Email Address"
          type="email"
          icon={<Mail size={20} />}
          error={errors.email}
        />

        <InputField
          register={register}
          fieldName="graduationYear"
          placeholder="Graduation Year"
          type="number"
          icon={<Calendar size={20} />}
          error={errors.graduationYear}
        />

        {/* Fresher options */}
        {/* <DropDownField
          name="details"
          options={fresherOptions}
          defaultValue="Select Student or Working Professional"
        /> */}

        <Dropdown
          error={errors.details}
          fieldName="details"
          optionArray={fresherOptions}
          getOptionLabel={(option) => option}
          getOptionValue={(option) => option}
          placeholder="Student or Professional"
          setValue={setValue}
          fieldValue=""
          icon={<School size={20} />}
        />
        {/* {errors.details?.message && (
          <p className="text-[#E04B40] text-xs">{errors.details.message}</p>
        )} */}

        {watch("details") === "Working Professional" && (
          <>
            {/* Current Company */}
            <InputField
              register={register}
              fieldName="currentCompany"
              placeholder="Current Company"
              type="text"
              icon={<Building2 size={20} />}
              error={errors.currentCompany}
            />

            <Dropdown
              error={errors.currentCtc}
              fieldName="currentCtc"
              optionArray={ctcOptions}
              getOptionLabel={(option) => option}
              getOptionValue={(option) => option}
              placeholder="Select Current CTC Range"
              setValue={setValue}
              fieldValue=""
              icon={<IndianRupee size={20} />}
            />
          </>
        )}

        {/* Domain Dropdown options */}
        {/* <DropDownField
          name="domain"
          options={domainOptions}
          defaultValue="Select Domain"
        /> */}

        <Dropdown
          error={errors.domain}
          fieldName="domain"
          optionArray={domainOptions}
          getOptionLabel={(option) => option}
          getOptionValue={(option) => option}
          placeholder="Select Domain"
          setValue={setValue}
          fieldValue=""
          icon={<CodeXml size={20} />}
        />

        <InputField
          register={register}
          fieldName="password"
          placeholder="Password"
          type={showPassword ? "text" : "password"}
          icon={<Lock size={20} />}
          error={errors.password}
          other={
            <span
              className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </span>
          }
        />

        <InputField
          register={register}
          fieldName="confirmPassword"
          placeholder="Confirm Password"
          type={showConfirm ? "text" : "password"}
          icon={<Lock size={20} />}
          error={errors.confirmPassword}
          other={
            <span
              className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer "
              onClick={() => setShowConfirm(!showConfirm)}
            >
              {showConfirm ? <EyeOff size={20} /> : <Eye size={20} />}
            </span>
          }
          validate={(value) => value === password}
        />

        <button
          type="submit"
          disabled={
            !!errors.confirmPassword ||
            !!errors.password ||
            !!errors.email ||
            !!errors.fullName ||
            !!errors.phoneNo
          }
          className={` border border-[#F0F0F0] w-full py-1.5 rounded-md font-bold ${
            errors.confirmPassword ||
            errors.password ||
            errors.email ||
            errors.fullName ||
            errors.phoneNo
              ? "cursor-not-allowed text-[#DDDDDD] bg-[#F0F0F0]"
              : "bg-[#3177a7] cursor-pointer hover:bg-[#7ba1d0]"
          }`}
        >
          {isPending || isSuccess ? "Signing Up" : "Sign up"}
        </button>
      </form>
    </FormProvider>
  );
}
