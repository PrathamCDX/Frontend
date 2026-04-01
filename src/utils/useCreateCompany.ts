import { jobServiceApi } from "@/lib/axios.config";
import { CreateCompanySchema } from "@/schema/createCompany.validator";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "react-toastify";
import z from "zod";

type CreateCompanyFormType = z.infer<typeof CreateCompanySchema>;

function useCreateCompany() {
  return useMutation({
    mutationFn: async ({
      authJwtToken,
      createData,
      file,
    }: {
      authJwtToken: string;
      createData: CreateCompanyFormType;
      file: File | null;
    }) => {
      try {
        if (!file) return toast.error("Company logo is required");
        const formData = new FormData();
        formData.append("file", file);
        const fileUploadUrl = await jobServiceApi.post(
          "/companies/upload-logo",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `${authJwtToken}`,
            },
          },
        );
        const logoUrl = fileUploadUrl.data.data.fileUrl;

        if(!logoUrl) return toast.error("Failed to upload logo. Please try again.");

        const response = await jobServiceApi.post(
          "/companies",
          { ...createData, logo: logoUrl},
          {
            headers: {
              Authorization: authJwtToken,
            },
          },
        );
        return response.data;
      } catch (error) {
        throw error;
      }
    },
    onError: (error) => {
      if (axios.isAxiosError(error)) {
        toast.error(
          error.response?.data?.message ||
            "Error occured while creating company",
        );
      } else {
        toast.error("Error occured while creating company ");
      }
    },

    onSuccess: () => {
      toast.success("Company created successfully");
    },
  });
}

export default useCreateCompany;
