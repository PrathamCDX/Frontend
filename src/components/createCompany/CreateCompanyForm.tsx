"use client";

import { setShowCreateCompanyForm } from "@/features/showCreateCompanyForm/showCreateCompanyFormSlice";
import { RootState } from "@/lib/store.config";
import { CreateCompanySchema } from "@/schema/createCompany.validator";
import { zodResolver } from "@hookform/resolvers/zod";
import { Building2, Link2, X } from "lucide-react";
import { FormProvider, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import z from "zod";
import InputField from "../InputField";
import useCreateCompany from "@/utils/useCreateCompany";
import DragAndDropFile from "./DragAndDropFile";
import useUploadLogo from "@/utils/useUploadLogo";
import { useEffect } from "react";
import MarkdownEditor from "../createJob/MarkdownEditor";
import TripleDotLoader from "../TripleDotLoader";
import Dropdown from "../createJob/Dropdown";
import useGetCompanySize from "@/utils/useGetCompanySize";
import DebouncedDropdown from "../createJob/DebouncedDropdown";
import { OptionType } from "../createJob/CreateJobForm";
import useGetIndustry from "@/utils/useGetIndustry";

export type CreateCompanyFormType = z.infer<typeof CreateCompanySchema>;

export default function CreateCompanyForm() {
  const methods = useForm<CreateCompanyFormType>({
    mode: "onChange",
    reValidateMode: "onBlur",
    resolver: zodResolver(CreateCompanySchema),
    defaultValues: {
      name: "",
      description: "",
      website: "",
      logo: "",
      company_size_id: null,
      industry_id: null,
    },
  });

  const {
    register,
    handleSubmit,
    watch,
    reset,
    setValue,
    formState: { errors },
  } = methods;

  const logo = watch("logo");
  const dispatch = useDispatch();
  const jwtToken = useSelector((state: RootState) => state.authJwtToken.value);

  const { mutate: createCompany, isSuccess, isPending } = useCreateCompany();
  const { data: companySizeList } = useGetCompanySize(jwtToken);
  const onSubmit = (createData: CreateCompanyFormType) => {
    createCompany({ authJwtToken: jwtToken, createData });
  };

  useEffect(() => {
    if (isSuccess) {
      reset();
    }
  }, [isSuccess, reset]);

  if(!jwtToken) return null ;

  return (
    <div className="components-createCompany-CreateCompanyForm text-black all-[unset] justify-center">
      <div
        className="components-createCompany-CreateCompanyForm absolute top-2 right-2 hover:cursor-pointer "
        onClick={() => dispatch(setShowCreateCompanyForm(false))}
      >
        <X width={20} />
      </div>
      {isPending && <TripleDotLoader />}

      <FormProvider {...methods}>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="components-createCompany-CreateCompanyForm text-black hide-scrollbar w-full flex flex-col space-y-2 py-4"
        >
          <div>
            <div>Upload company logo</div>

            <DragAndDropFile
              fieldName="logo"
              useMutationFn={useUploadLogo}
              jwtToken={jwtToken}
              fileExtension={[".png"]}
              maxFileSize={3}
            />
          </div>

          <div className="components-createCompany-CreateCompanyForm text-xs">
            Current logo: {logo}
          </div>
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
          {/* <InputField
            fieldName="description"
            icon={<Text />}
            placeholder="Short Description"
            register={register}
            type="text"
            error={errors.description}
          /> */}
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
            getOptionLabel={(option: OptionType) => {
              return option.name;
            }}
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
          <MarkdownEditor
            fieldName="description"
            showFormatOptions={false}
            isSuccess={isSuccess}
          />
          {errors.description && (
            <div className="text-red-400">Provide a valid description</div>
          )}
          <div className="flex items-center justify-around">
            <button
              type="submit"
              className="rounded py-2 px-4 bg-blue-200 hover:bg-blue-400 font-semibold justify-center duration-200 "
            >
              Create
            </button>
          </div>
        </form>
      </FormProvider>
    </div>
  );
}
