"use client";
import DashboardTopbar from "@/components/dashboard/DashboardTopbar";
import BackButton from "@/components/BackButton";
import JobDetailsCard from "@/components/jobDetails/JobDetailsCard";
import JobDescription from "@/components/jobDetails/JobDescription";
import JobSpecification from "@/components/jobDetails/JobSpecification";
import { Suspense, use, useEffect } from "react";
import { setJobId } from "@/features/jobId/jobId";
import useGetJobDetails from "@/utils/useGetJobDetails";
import { ToastContainer } from "react-toastify";
import { setAuthJwtToken } from "@/features/authJwtToken/authJwtTokenSlice";
import TripleDotLoader from "@/components/TripleDotLoader";
import { setJobDetails } from "@/features/jobDetails/jobDetails";
import CompanyCard from "@/components/jobDetails/CompanyCard";
import JobSkills from "@/components/jobDetails/JobSkills";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { Calendar } from "lucide-react";
import { getFormattedDate } from "@/utils/getTime";
import DashboardTopbarLogoutButton from "@/components/dashboard/DashboardTopbarLogoutButton";

export default function Page({
  params,
}: {
  params: Promise<{ jobId: string }>;
}) {
  const { jobId } = use(params);
  const dispatch = useAppDispatch();

  const jwtToken = useAppSelector((state) => {
    return state.authJwtToken.value;
  });
  const jobDetails = useAppSelector((state) => {
    return state.jobDetails.value;
  });

  useEffect(() => {
    const token = localStorage.getItem("AuthJwtToken");
    if (token) {
      dispatch(setAuthJwtToken(token));
    }
  }, [dispatch]);

  const { data, isPending, isError } = useGetJobDetails(jwtToken, jobId);

  useEffect(() => {
    dispatch(setJobId(jobId));
  });

  useEffect(() => {
    if (data) {
      dispatch(setJobDetails(data));
    }
  }, [data, dispatch]);

  if (!jobDetails)
    return (
      <div>
        <TripleDotLoader />
      </div>
    );

  if (isPending) {
    return (
      <div>
        <TripleDotLoader />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="w-full h-full flex text-center items-center justify-center ">
        Not found
      </div>
    );
  }

  return (
    <div className="jobId-page font-inter text-black bg-white/40 h-full flex flex-col px-2">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="jobId-page grid grid-cols-[5fr_95fr] items-center ">
        <div className="jobId-page basis-[5%] ">
          <BackButton />
        </div>
        <div className=" w-full py-2">
          {/* <DashboardTopbar className="basis-[95%]" pageName="Job Details" /> */}
          <div className="grid grid-cols-[1fr_auto] h-full w-full items-center">
            <div className="text-lg text-gray-500 w-full font-semibold">
              <span className="pr-2"> Jobs </span> {">"}
              <span className="px-2"> {data?.company.name} </span> {">"}
              <span className="text-black pl-2"> {data?.jobTitle.title} </span>
            </div>
            <div className="components-dashboard-DashboardTopbar w-70 gap-2 flex items-center justify-end px-3 py-2 rounded-lg">
              <div className="hidden sm:block">
                <Calendar className="components-dashboard-DashboardTopbar w-5 h-5 hidden sm:block" />
              </div>
              <div className="components-dashboard-DashboardTopbar text-sm hidden sm:block">
                {getFormattedDate()}
              </div>
              <Suspense fallback={<div>...</div>}>
                <DashboardTopbarLogoutButton />
              </Suspense>
            </div>
          </div>
        </div>
        {/* custom top bar */}
      </div>

      <div className="jobId-page sm:flex flex-1 overflow-y-scroll sm:overflow-hidden bg- rounded-2xl border-gray-200">
        <div className="jobId-page sm:hidden overflow-y-auto p-4 min-h-0">
          <JobSpecification
            experienceLevelName={jobDetails.experienceLevel.name}
            experienceLevel={`${jobDetails.experienceLevel.min_years} - ${jobDetails.experienceLevel.max_years} years`}
            employmentType={jobDetails.employmentType.name}
            salaryMax={jobDetails.salary_max}
            salaryMin={jobDetails.salary_min}
            workType={jobDetails.is_remote}
            img={jobDetails.company.logo}
            city={jobDetails.city.name}
            companyName={jobDetails.company.name}
          />
          {/* hidden */}
          <JobSkills skills={jobDetails.skills} className="hidden" />
          <CompanyCard
            website={jobDetails.company.website ?? "https://example.com"}
            description={jobDetails.company.description ?? "Description"}
            industry={
              jobDetails.company.industry
                ? jobDetails.company.industry.name
                : "industry"
            }
            location={jobDetails.city.name}
            logoUrl={jobDetails.company.logo}
            name={jobDetails.company.name}
            size={
              jobDetails.company.companySize
                ? `${jobDetails.company.companySize.min_employees ?? "min"} ${
                    jobDetails.company.companySize.max_employees
                      ? jobDetails.company.companySize.max_employees > 100002
                        ? "+"
                        : `- ${jobDetails.company.companySize.max_employees}`
                      : "max"
                  } employees`
                : "Company Size"
            }
          />
        </div>
        <div className="jobId-page sm:basis-35/50 overflow-y-auto py-4 bg-white rounded-2xl px-2 min-h-0">
          <JobDetailsCard
            isRemote={jobDetails.is_remote}
            img={jobDetails?.company.logo}
            title={jobDetails.jobTitle.title}
            companyName={jobDetails?.company.name}
            city={jobDetails.city.name}
            jobId={Number(jobId)}
            created_at={jobDetails.created_at}
            apply_link={jobDetails.apply_link}
          />
          <JobDescription />
        </div>
        <div className="jobId-page hidden sm:block sm:basis-15/50 overflow-y-auto px-4 min-h-0">
          <JobSpecification
            experienceLevelName={jobDetails.experienceLevel.name}
            experienceLevel={`${jobDetails.experienceLevel.min_years} - ${jobDetails.experienceLevel.max_years} years`}
            employmentType={jobDetails.employmentType.name}
            salaryMax={jobDetails.salary_max}
            salaryMin={jobDetails.salary_min}
            workType={jobDetails.is_remote}
            img={jobDetails.company.logo}
            city={jobDetails.city.name}
            companyName={jobDetails.company.name}
          />
          <JobSkills skills={jobDetails.skills} />
          <CompanyCard
            website={jobDetails.company.website ?? "https://example.com"}
            description={jobDetails.company.description ?? "Description"}
            industry={
              jobDetails.company.industry
                ? jobDetails.company.industry.name
                : "industry"
            }
            location={jobDetails.city.name}
            logoUrl={jobDetails.company.logo}
            name={jobDetails.company.name}
            size={
              jobDetails.company.companySize
                ? `${jobDetails.company.companySize.min_employees ?? "min"} ${
                    jobDetails.company.companySize.max_employees
                      ? jobDetails.company.companySize.max_employees > 100002
                        ? "+"
                        : `- ${jobDetails.company.companySize.max_employees}`
                      : "max"
                  } employees`
                : "Company Size"
            }
          />
        </div>
      </div>
    </div>
  );
}
