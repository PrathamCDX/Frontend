"use client";
import DashboardTopbar from "@/components/dashboard/DashboardTopbar";
import { IoIosArrowForward } from "react-icons/io";
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
import DashboardTopbarHamburgerMenu from "@/components/dashboard/DashboardTopbarHamburgerMenu";

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
    <div className="jobId-page  text-black bg-[#f1f2f4] h-full flex flex-col px-3">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="jobId-page grid grid-cols-[5fr_95fr]  items-center pl-3 md:pl-0">
        <div className="jobId-page hidden sm:block">
          <BackButton />
        </div>
        <div className="sm:hidden">
          <Suspense fallback={<div>...</div>}>
            <DashboardTopbarHamburgerMenu />
          </Suspense>
        </div>
        <div className=" w-full py-2 ">
          {/* <DashboardTopbar className="basis-[95%]" pageName="Job Details" /> */}
          <div className="grid grid-cols-[1fr_auto] h-full w-full items-center py-1">
            <div className="min-w-0 ml-3 pr-2 sm:ml-0 md:text-lg text-base text-gray-500 flex items-center gap-x-2 sm:gap-x-3 w-full font-semibold">
              <p>Jobs</p>
              <IoIosArrowForward className=" w-10" />
              <p>{data?.company.name}</p>
              <IoIosArrowForward className=" w-10" />
              <p className="text-black truncate ">{data?.jobTitle.title}</p>
            </div>
            <div className="components-dashboard-DashboardTopbar gap-2 flex items-center justify-end px-3 py-2 rounded-lg">
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

      <div className="jobId-page sm:flex flex-1 overflow-y-scroll  sm:overflow-hidden  bg- rounded-lg border-gray-200">
        {/* mobile  */}
        <div className="sticky top-0 px-4 py-2  bg-[#f1f2f4] z-10 sm:hidden">
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
        </div>
        <div className="jobId-page pt-0 sm:pt-4 sm:hidden overflow-y-auto p-4 min-h-0">
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

          <div className="bg-white p-2 rounded-lg shadow-[0_5px_15px_rgba(0,0,0,0.1)]">
            <JobDescription />
          </div>
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
        {/* <div className="jobId-page sm:basis-35/50 overflow-y-auto py-4 mr-2 shadow-[0_5px_15px_rgba(0,0,0,0.1)] bg-white rounded-lg px-2 min-h-0">
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
        </div> */}

        {/* desktop */}
        <div className="jobId-page hidden sm:flex sm:basis-35/50 mr-2 min-h-0 rounded-lg  shadow-[0_5px_15px_rgba(0,0,0,0.1)]  flex-col">
          <div className="shrink-0  pt-4 pb-3">
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
          </div>

          <div className="flex-1 min-h-0 overflow-y-auto px-2 bg-white rounded-lg shadow-[0_5px_15px_rgba(0,0,0,0.1)]">
            <JobDescription />
          </div>
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
