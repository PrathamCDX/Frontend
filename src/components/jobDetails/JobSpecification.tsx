import JobInfoCard from "./JobInfoCard";

type JobSpecificationProps = {
  experienceLevelName: string;
  experienceLevel: string;
  employmentType: string;
  salaryMin: string;
  salaryMax: string;
  location: string;
  img: string;
  city: string;
  companyName: string;
};

export default function JobSpecification({
  experienceLevelName,
  experienceLevel,
  employmentType,
  salaryMin,
  salaryMax,
  location,
}: JobSpecificationProps) {
  return (
    <div className="rounded-[24px] border border-[#E6EBF4] bg-[linear-gradient(180deg,#FFFFFF_0%,#FCFDFF_100%)] px-5 py-5 shadow-md">
      <div className="mb-5 text-[18px] font-semibold tracking-[-0.02em] text-[#111827]">
        Job Info
      </div>

      <div className="space-y-1">
        <JobInfoCard
          topElement={true}
          imgUrl="/level_icon.svg"
          label="Level"
          value={experienceLevelName}
        />

        <JobInfoCard
          imgUrl="/experience_icon.svg"
          label="Experience"
          value={experienceLevel}
        />

        <JobInfoCard
          imgUrl="/job_type_icon.svg"
          label="Job Type"
          value={employmentType}
        />

        <JobInfoCard
          imgUrl="/work_type_icon.svg"
          label="Work Type"
          value={location == "Remote" ? "Remote" : "On-site"}
        />

        <JobInfoCard
          imgUrl="/Rectangle 46.svg"
          label="Salary Range"
          value={
            employmentType === "Internship"
              ? `${Number(salaryMin)}K - ${Number(salaryMax)}K`
              : `${Number(salaryMin)} LPA - ${Number(salaryMax)} LPA`
          }
          className="hidden"
        />
      </div>
    </div>
  );
}