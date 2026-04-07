import { jobServiceApi } from "@/lib/axios.config";
import { CreateJobFormSchema } from "@/schema/createJob.validator";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import z from "zod";

type CreateJobFormValues = z.infer<typeof CreateJobFormSchema>;

const useCreateJob = () => {
  
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      createJobData,
      authJwtToken,
    }: {
      createJobData: CreateJobFormValues;
      authJwtToken: string | null;
    }) => {
      try {
        const response = await jobServiceApi.post("/jobs", createJobData, {
          headers: {
            Authorization: `${authJwtToken}`,
          },
        });
        return response.data;
      } catch (error) {
        throw error;
      }
    },
    onError: () => {
      toast.error("Error creating job");
    },
    onSuccess: () => {
      toast.success("Job posted successfully!");
      queryClient.invalidateQueries({ queryKey: ["jobList"] });
    },
  });
};

export default useCreateJob;
