"use client";
import "katex/dist/katex.min.css";
import {
  CreateJobFormSchema,
  CreateJobFormData,
} from "@/schema/createJob.validator";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm, Controller } from "react-hook-form";
import { z } from "zod";
import InputField from "../InputField";
import { useEffect } from "react";
import useCreateJob from "@/utils/useCreateJob";
import useGetUser from "@/utils/useGetUser";
import useGetJobTitle from "@/utils/useGetJobTitle";
import useGetCity from "@/utils/useGetCity";
import useGetEmploymentType from "@/utils/useGetEmploymentType";
import useGetExperienceLevel from "@/utils/useGetExperienceLevel";
import useGetCompany from "@/utils/useGetCompany";
import useGetUserRoles from "@/utils/useGetUserRoles";
import { useRouter } from "next/navigation";
import { cn } from "@/utils/cn";
import { toogleShowJobCreateForm } from "@/features/showJobCreateForm/showJobCreateForm";
import { ChevronRight, DollarSign, Minus, X } from "lucide-react";
import DebouncedDropdown from "./DebouncedDropdown";

import Dropdown from "./Dropdown";
import SkillsDropdown from "./SkillsDropdown";
import { toast, ToastContainer } from "react-toastify";
// import MarkdownEditor from "./MarkdownEditor";
import { setAuthJwtToken } from "@/features/authJwtToken/authJwtTokenSlice";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import MarkdownEditor from "../MarkdownEditor";
import Image from "next/image";

type CreateJobFormValues = z.infer<typeof CreateJobFormSchema>;

export type OptionType = {
  id: number;
  name: string;
};

export default function CreateJobForm({ className }: { className?: string }) {
  const router = useRouter();

  const dispatch = useAppDispatch();

  const jwtToken = useAppSelector((state) => {
    return state.authJwtToken.value;
  });

  const showjobCreateForm = useAppSelector(
    (state) => state.showJobCreateForm.value,
  );

  // const [isAuthorized, setIsAuthorized] = useState(false);
  useEffect(() => {
    const token = localStorage.getItem("AuthJwtToken");
    if (token) {
      dispatch(setAuthJwtToken(token));
    }
  }, [dispatch]);

  const { data } = useGetUser(jwtToken);
  const { data: employmentType } = useGetEmploymentType(jwtToken);
  const { data: experienceLevel } = useGetExperienceLevel(jwtToken);
  const { data: userRoles } = useGetUserRoles(jwtToken, data?.id);

  useEffect(() => {
    if (userRoles && !userRoles?.includes("admin")) {
      router.replace("/dashboard");
    }
  }, [userRoles, router]);

  const useFormMethods = useForm<CreateJobFormData>({
    mode: "onChange",
    reValidateMode: "onChange",
    resolver: zodResolver(CreateJobFormSchema),
    defaultValues: {
      title_id: 0,
      employment_type_id: 0,
      experience_level_id: 0,
      company_id: 0,
      location_id: 0,
      is_remote: false,
      apply_link: "",
      salary_min: 0,
      salary_max: 0,
      skillIds: [],
      recruiter_id: 0,
      description: "",
    },
  });

  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    control,
    trigger,
    formState: { errors },
  } = useFormMethods;

  const onSubmit = (createData: CreateJobFormValues) => {
    mutate({
      createJobData: { ...createData, recruiter_id: Number(data?.id) },
      authJwtToken: jwtToken,
    });
  };

  const onError = () => {
    toast.error("Fill all the required fields to continue");
  };

  setValue("recruiter_id", Number(data?.id));
  const { mutate, isPending } = useCreateJob();

  // if (!isAuthorized || !userRoles || !userRoles.includes("admin")) {
  //   return <div className="flex justify-center w-full">Authorizing...</div>;
  // }

  if (!showjobCreateForm) return null;

  return (
    <div className="fixed w-full h-full flex items-center justify-center z-50 bg-black/10 backdrop-blur-md">
      <div
        className={cn(
          `components-createJob-CreateJobForm font-inter sm:flex flex-col items-center relative bg-white rounded-2xl w-full sm:w-9/10 h-full sm:h-9/10 overflow-y-scroll hide-scrollbar`,
        )}
      >
        <ToastContainer
          position="top-right"
          autoClose={3000}
          className="z-20"
        />
        {/* {!isPending && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-white/50 pointer-events-none">
          <div className="loader"></div>
        </div>
      )} */}

        {isPending && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/50">
            <div className="loader"></div>
          </div>
        )}

        <div className="components-createJob-CreateJobForm bg-[#F5F5F5] w-full sticky top-0 left-0 z-10 py-2 text-black text-center grid grid-cols-[1fr_auto] font-semibold text-xl items-center justify-between">
          <div className="flex items-center px-4">
            <Image
              alt=""
              src={"/create-job-header-icon.svg"}
              height={1000}
              width={1000}
              className="h-14 w-14 border"
            />
            <div className="text-start ml-4 ">
              <div className="font-semibold text-xl">Create Job</div>
              <div className="text-sm text-gray-400 tracking-wide font-light">
                Fill out the details below to post a new job listing
              </div>
            </div>
          </div>
          <div
            className="components-createJob-CreateJobForm mr-6 hover:cursor-pointer "
            onClick={() => {
              dispatch(toogleShowJobCreateForm());
            }}
          >
            <X width={24} />
          </div>
        </div>

        <FormProvider {...useFormMethods}>
          <div className="w-full">
            <form
              onSubmit={handleSubmit(onSubmit, onError)}
              className="components-createJob-CreateJobForm  text-gray-400 hide-scrollbar justify-center flex flex-col space-y-2 w-full  h-fit"
            >
              {/* <div className="absolute z-100 bottom-0 h-20 w-full bg-green-300"></div> */}

              <div className="border rounded-2xl border-gray-300 p-4 m-4">
                <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-x-5  gap-y-3">
                  <div>
                    <div className="text-black font-semibold text-base mb-0.5">
                      <div>Company *</div>
                    </div>
                    <DebouncedDropdown<CreateJobFormValues, OptionType>
                      inputClassName=" bg-gray-50 placeholder:text-[#7c7d7d] text-black "
                      iconUrl="/company-icon.svg"
                      placeholder="Select a company"
                      setValue={setValue}
                      fieldName="company_id"
                      error={errors.company_id}
                      jwtToken={jwtToken}
                      useQueryFn={useGetCompany}
                      getOptionLabel={(company) => company.name}
                      getOptionValue={(company) => company.id}
                    />
                  </div>
                  <div>
                    <div className="text-black font-semibold text-base mb-0.5">
                      <div>Employment Type *</div>
                    </div>
                    <Dropdown<CreateJobFormValues, OptionType>
                      inputClassName=" bg-gray-50 placeholder:text-[#7c7d7d] text-black"
                      iconUrl="/employment-type-icon.svg"
                      fieldName="employment_type_id"
                      setValue={setValue}
                      error={errors.employment_type_id}
                      optionArray={employmentType}
                      placeholder="Select Employment Type"
                      getOptionLabel={(option) => option.name}
                      getOptionValue={(option) => option.id}
                    />
                  </div>
                  <div>
                    <div className="text-black font-semibold text-base mb-0.5">
                      <div>Job title *</div>
                    </div>
                    <DebouncedDropdown<CreateJobFormValues, OptionType>
                      inputClassName=" bg-gray-50 placeholder:text-[#7c7d7d] text-black "
                      iconUrl="/job-title-icon.svg"
                      placeholder="Select a Job title"
                      fieldName="title_id"
                      error={errors.title_id}
                      setValue={setValue}
                      jwtToken={jwtToken}
                      useQueryFn={useGetJobTitle}
                      getOptionLabel={(jobTitle) => jobTitle.name}
                      getOptionValue={(jobTitle) => jobTitle.id}
                    />
                  </div>
                  <div>
                    <div className="text-black gap-x-1 flex items-center font-semibold text-base mb-0.5">
                      <div>Experience *</div>
                    </div>
                    <Dropdown<CreateJobFormValues, OptionType>
                      inputClassName=" bg-gray-50 placeholder:text-gray-300 "
                      iconUrl="/experience-icon.svg"
                      setValue={setValue}
                      fieldName="experience_level_id"
                      error={errors.experience_level_id}
                      optionArray={experienceLevel}
                      placeholder="Select Experience Level"
                      getOptionLabel={(option) => option.name}
                      getOptionValue={(option) => option.id}
                    />
                  </div>
                  <div>
                    <div className="text-black font-semibold text-base mb-0.5">
                      <div>Job Location *</div>
                    </div>
                    <DebouncedDropdown<CreateJobFormValues, OptionType>
                      inputClassName=" bg-gray-50 placeholder:text-gray-300 "
                      iconUrl="/job-location-icon.svg"
                      placeholder="Select a city"
                      jwtToken={jwtToken}
                      error={errors.location_id}
                      fieldName="location_id"
                      setValue={setValue}
                      useQueryFn={useGetCity}
                      getOptionLabel={(city) => `${city.name}`}
                      getOptionValue={(city) => city.id}
                    />
                  </div>
                  <div>
                    <div className="text-black font-semibold text-base  mb-0.5">
                      Apply Link *
                    </div>
                    <InputField
                      iconUrl="/apply-link-icon.svg"
                      register={register}
                      fieldName="apply_link"
                      placeholder={"Apply link"}
                      type={"text"}
                      error={errors.apply_link}
                      inputClassName=" bg-gray-50 border-gray-300 placeholder:text-[#7c7d7d] text-black "
                    />
                  </div>
                  <div>
                    <div className="text-black font-semibold text-base mb-0.5">
                      Minimum Salary *
                    </div>
                    <InputField
                      register={register}
                      inputClassName=" bg-gray-50 placeholder:text-[#7c7d7d] text-black "
                      fieldName="salary_min"
                      placeholder={
                        employmentType?.find(
                          (type: OptionType) =>
                            type.id === getValues("employment_type_id"),
                        )?.name === "Internship"
                          ? "In thousands"
                          : "In LPA"
                      }
                      type={"text"}
                      error={errors.salary_min}
                      icon={<DollarSign className="border-r pr-1" />}
                      setValueFn={(v) => (v === "" ? undefined : Number(v))}
                    />
                  </div>
                  <div>
                    <div className="text-black font-semibold text-base mb-0.5">
                      Maximum salary *
                    </div>
                    <InputField
                      inputClassName=" bg-gray-50 placeholder:text-[#7c7d7d] text-black "
                      register={register}
                      fieldName="salary_max"
                      placeholder={
                        employmentType?.find(
                          (type: OptionType) =>
                            type.id === getValues("employment_type_id"),
                        )?.name === "Internship"
                          ? "In thousands "
                          : "In LPA"
                      }
                      type={"text"}
                      error={errors.salary_max}
                      icon={<DollarSign className="border-r pr-1" />}
                      setValueFn={(v) => (v === "" ? undefined : Number(v))}
                    />
                  </div>
                </div>

                <div className="components-createJob-CreateJobForm font-bold text-base mt-2 text-black">
                  <div className="flex items-center gap-x-2">
                    <Image
                      alt=""
                      src={"/add-skills-icon.svg"}
                      height={1000}
                      width={1000}
                      className="h-8 w-8"
                    />
                    <div>Add Skills *</div>
                  </div>
                </div>
                <SkillsDropdown
                  trigger={trigger}
                  setValue={setValue}
                  error={errors.skillIds}
                  jwtToken={jwtToken}
                  fieldName="skillIds"
                />

                <div className="components-createJob-CreateJobForm font-bold text-base mt-2 text-black">
                  <div className="flex items-center gap-x-2">
                    <Image
                      alt=""
                      src={"/job-description-icon.svg"}
                      height={1000}
                      width={1000}
                      className="h-8 w-8"
                    />
                    <div>Job Description *</div>
                  </div>
                </div>
                {/* <MarkdownEditor fieldName={"description"} /> */}
                <Controller
                  control={control}
                  name="description"
                  render={({ field, fieldState }) => (
                    <MarkdownEditor
                      onValueChange={field.onChange}
                      value={field.value}
                      error={fieldState.error}
                      height={300}
                      placeholder="Type or paste your job description..."
                    />
                  )}
                />
              </div>

              {/* <button
            type="submit"
            className="components-createJob-CreateJobForm bg-blue-600 hover:cursor-pointer text-white px-4 py-2 rounded"
          >
            Create
          </button> */}
              {/* bottom bar */}
              <div className="w-full flex items-center justify-end py-3 px-4 sticky bottom-0 left-0 bg-[#F5F5F5] ">
                <div className="flex items-center gap-x-4">
                  <button className="hover:cursor-pointer hover:scale-102 rounded-full border px-4 py-3">
                    Cancel
                  </button>
                  <button
                    className="rounded-full hover:scale-102 hover:cursor-pointer border px-6 py-3 bg-blue-600 text-white flex items-center gap-x-2"
                    type="submit"
                  >
                    <div>Create Job</div>

                    <ChevronRight />
                  </button>
                </div>
              </div>
            </form>
          </div>
        </FormProvider>
      </div>
    </div>
  );
}

// <div className="components-createJob-CreateJobForm sm:flex gap-2">
//             <div className="components-createJob-CreateJobForm basis-1/2 ">
//               <div className="components-createJob-CreateJobForm font-bold text-md mt-2 text-black">
//                 Company *
//               </div>
//               {/* <DebouncedDropdown
//               placeholder="Select a company"
//               setValue={setValue}
//               fieldName="company_id"
//               error={errors.company_id}
//               jwtToken={jwtToken}
//               useQueryFn={useGetCompany}
//             /> */}

//               <DebouncedDropdown<CreateJobFormValues, OptionType>
//                 placeholder="Select a company"
//                 setValue={setValue}
//                 fieldName="company_id"
//                 error={errors.company_id}
//                 jwtToken={jwtToken}
//                 useQueryFn={useGetCompany}
//                 getOptionLabel={(company) => company.name}
//                 getOptionValue={(company) => company.id}
//               />

//               <div className="components-createJob-CreateJobForm font-bold text-md mt-2 text-black">
//                 Job Title *
//               </div>
//               <DebouncedDropdown<CreateJobFormValues, OptionType>
//                 placeholder="Select a Job title"
//                 fieldName="title_id"
//                 error={errors.title_id}
//                 setValue={setValue}
//                 jwtToken={jwtToken}
//                 useQueryFn={useGetJobTitle}
//                 getOptionLabel={(jobTitle) => jobTitle.name}
//                 getOptionValue={(jobTitle) => jobTitle.id}
//               />

//               <div className="components-createJob-CreateJobForm font-bold text-md  mt-2 text-black">
//                 Job City *
//               </div>
//               <DebouncedDropdown<CreateJobFormValues, OptionType>
//                 placeholder="Select a city"
//                 jwtToken={jwtToken}
//                 error={errors.city_id}
//                 fieldName="city_id"
//                 setValue={setValue}
//                 useQueryFn={useGetCity}
//                 getOptionLabel={(city) => `${city.name}`}
//                 getOptionValue={(city) => city.id}
//               />
//             </div>

//             <div className="components-createJob-CreateJobForm basis-1/2">
//               <div className="components-createJob-CreateJobForm font-bold text-md mt-2 text-black">
//                 Employment Type *
//               </div>
//               <Dropdown<CreateJobFormValues, OptionType>
//                 fieldName="employment_type_id"
//                 setValue={setValue}
//                 error={errors.employment_type_id}
//                 optionArray={employmentType}
//                 placeholder="Select Employment Type"
//                 getOptionLabel={(option) => option.name}
//                 getOptionValue={(option) => option.id}
//               />

//               <div className="components-createJob-CreateJobForm font-bold text-md mt-2 text-black">
//                 Experience *
//               </div>
//               <Dropdown<CreateJobFormValues, OptionType>
//                 setValue={setValue}
//                 fieldName="experience_level_id"
//                 error={errors.experience_level_id}
//                 optionArray={experienceLevel}
//                 placeholder="Select Experience Level"
//                 getOptionLabel={(option) => option.name}
//                 getOptionValue={(option) => option.id}
//               />

//               <div className="components-createJob-CreateJobForm flex h-[42px] items-center mt-[24px]">
//                 <div className="components-createJob-CreateJobForm font-bold text-md text-center text-black basis-1/3">
//                   Is Remote *
//                 </div>
//                 <InputField
//                   register={register}
//                   fieldName="is_remote"
//                   placeholder={"is remote"}
//                   type={"checkbox"}
//                   error={errors.is_remote}
//                   icon={<></>}
//                   className="basis-2/3 justify-start outline-none"
//                 />
//               </div>
//             </div>
//           </div>
