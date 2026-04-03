import JobInfoCard from "./JobInfoCard";

type JobSpecificationProps = {
  experienceLevelName: string;
  experienceLevel: string;
  employmentType: string;
  salaryMin: string;
  salaryMax: string;
  workType: boolean;
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
  workType,
}: JobSpecificationProps) {
  return (
    <div>
      <div className=" gap-2 mb-4 py-5 px-6  bg-white rounded-lg shadow-[0_5px_15px_rgba(0,0,0,0.1)]">
        <div className="text-lg font-bold mb-3">Job Info</div>
        <JobInfoCard
          topElement={true}
          imgUrl={"/level_icon.svg"}
          label="Level"
          value={experienceLevelName}
          className="w-full "
        />
        <JobInfoCard
          imgUrl={"/experience_icon.svg"}
          label="Experience"
          value={experienceLevel}
          className="w-full"
        />
        <JobInfoCard
          imgUrl={"/job_type_icon.svg"}
          label="Job Type"
          value={employmentType}
          className="w-full"
        />
        <JobInfoCard
          imgUrl={"/work_type_icon.svg"}
          label="Work Type"
          value={workType ? "Remote" : "On-site"}
          className="w-full"
        />
        {/* hidden */}
        <JobInfoCard
          imgUrl={"/Rectangle 46.svg"}
          label="Salary Range"
          value={
            employmentType === "Internship"
              ? `${Number(salaryMin)}K-${Number(salaryMax)}K`
              : `${Number(salaryMin)}LPA-${Number(salaryMax)}LPA`
          }
          className=" hidden w-full"
        />
      </div>
    </div>
  );
}
