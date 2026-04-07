import { jobServiceApi } from "@/lib/axios.config";
import { useQuery } from "@tanstack/react-query";

const useFindCompanyName = (
  authJwtToken: string | null,
  companyName: string | null,
) => {
  return useQuery({
    queryKey: ["company", companyName ?? ""],
    queryFn: () => {
      return findCompanyName(authJwtToken, companyName);
    },
    enabled: !!authJwtToken && !!companyName, 
    refetchOnWindowFocus: false,
    retry: false,
    staleTime: 0,
    gcTime: 0,
  });
};

const findCompanyName = async (
  authJwtToken: string | null,
  companyName: string | null,
) => {
  try {
    if (!companyName) {
      return [];
    }
    const response = await jobServiceApi.get(
      "/companies/find-companies?name=" + companyName,
      {
        headers: {
          Authorization: authJwtToken,
        },
      },
    );

    return response.data?.data;
  } catch (error) {
    throw error;
  }
};

export default useFindCompanyName;
