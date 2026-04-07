"use client";

import { setShowCreateCompanyForm } from "@/features/showCreateCompanyForm/showCreateCompanyFormSlice";
import {
  CreateCompanySchema,
  CreateCompanyFormData,
} from "@/schema/createCompany.validator";
import { zodResolver } from "@hookform/resolvers/zod";
import { Building2, Link2, X } from "lucide-react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import InputField from "../InputField";
import useCreateCompany from "@/utils/useCreateCompany";
import { useEffect, useState } from "react";
// import MarkdownEditor from "../createJob/MarkdownEditor";
import TripleDotLoader from "../TripleDotLoader";
import Dropdown from "../createJob/Dropdown";
import useGetCompanySize from "@/utils/useGetCompanySize";
import DebouncedDropdown from "../createJob/DebouncedDropdown";
import { OptionType } from "../createJob/CreateJobForm";
import useGetIndustry from "@/utils/useGetIndustry";
import DragAndDropFileBlob from "./DragAndDropFileBlob";
import CustomMDEditor from "../createJob/CustomMDEditor";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import MarkdownEditor from "../MarkdownEditor";

export default function CreateCompanyForm() {
  const [showDescriptionError, setShowDescriptionError] = useState(false);

  const methods = useForm<CreateCompanyFormData>({
    mode: "onSubmit",
    reValidateMode: "onSubmit",
    resolver: zodResolver(CreateCompanySchema),
    defaultValues: {
      name: "",
      description: "",
      website: "",
      logoImage: undefined,
      company_size_id: undefined,
      industry_id: undefined,
    },
  });

  const {
    register,
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = methods;

  const dispatch = useAppDispatch();
  const jwtToken = useAppSelector((state) => state.authJwtToken.value);

  const { mutate: createCompany, isSuccess, isPending } = useCreateCompany();
  const { data: companySizeList } = useGetCompanySize(jwtToken);

  const onSubmit = (createData: CreateCompanyFormData) => {
    createCompany({
      authJwtToken: jwtToken,
      createData,
      file: createData.logoImage,
    });
  };

  useEffect(() => {
    if (isSuccess) {
      if (showDescriptionError) {
        setShowDescriptionError(false);
      }
      reset();
    }
  }, [isSuccess, reset, showDescriptionError]);

  if (!jwtToken) return null;

  return (
    <div className="components-createCompany-CreateCompanyForm text-black all-[unset] justify-center">
      <div
        className="components-createCompany-CreateCompanyForm absolute top-2 right-2 hover:cursor-pointer"
        onClick={() => dispatch(setShowCreateCompanyForm(false))}
      >
        <X width={20} />
      </div>

      {isPending && <TripleDotLoader className=" bg-white/50 fixed inset-0" />}

      <FormProvider {...methods}>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="components-createCompany-CreateCompanyForm text-black hide-scrollbar w-full flex flex-col space-y-2 py-4"
        >
          <div>
            <div>Upload company logo</div>

            <Controller
              name="logoImage"
              control={control}
              render={({ field, fieldState }) => (
                <DragAndDropFileBlob
                  file={field.value ?? null}
                  onFileChange={field.onChange}
                  error={fieldState.error}
                />
              )}
            />
          </div>

          <div className="components-createCompany-CreateCompanyForm text-xs"></div>

          <button className="hidden" type="button">
            Debug Values
          </button>

          <InputField
            fieldName="name"
            icon={<Building2 />}
            placeholder="Company Name"
            register={register}
            type="text"
            error={errors.name}
          />

          <div>Company Size</div>
          <Dropdown
            error={errors.company_size_id}
            fieldName="company_size_id"
            getOptionLabel={(option) => {
              if (option.max_employees > 2000000) {
                return `${option.min_employees}+ employees`;
              }
              return `${option.min_employees}-${option.max_employees} employees`;
            }}
            getOptionValue={(option) => option.id}
            optionArray={companySizeList}
            placeholder="Select company size"
            setValue={setValue}
            resetOn={isSuccess}
          />

          <div>Industry</div>
          <DebouncedDropdown
            error={errors.industry_id}
            fieldName="industry_id"
            getOptionLabel={(option: OptionType) => option.name}
            getOptionValue={(option: OptionType) => option.id}
            jwtToken={jwtToken}
            placeholder="Please select an industry"
            setValue={setValue}
            useQueryFn={useGetIndustry}
            useTextValue={false}
            resetOn={isSuccess}
          />

          <div>Website</div>
          <InputField
            fieldName="website"
            icon={<Link2 />}
            placeholder="Company Website"
            register={register}
            type="text"
            error={errors.website}
          />

          <div>Description</div>
          <Controller
            name="description"
            control={control}
            render={({ field, fieldState }) => (
              <MarkdownEditor
                value={field.value}
                onValueChange={field.onChange}
                error={fieldState.error}
                placeholder="Type or paste your company description..."
              />
            )}
          />

          {/* {errors.description && showDescriptionError && (
            <div className="text-red-400">Provide a valid description</div>
          )} */}

          <div className="flex items-center justify-around">
            <button
              onClick={() => {
                setShowDescriptionError(true);
              }}
              type="submit"
              className="hover:cursor-pointer rounded py-2 px-4 bg-blue-200 hover:bg-blue-400 font-semibold justify-center duration-200"
            >
              Create
            </button>
          </div>
        </form>
      </FormProvider>
    </div>
  );
}
