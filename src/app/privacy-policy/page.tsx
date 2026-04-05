import DashboardSidebar from "@/components/dashboard/DashboardSidebar";

export default function Page() {
    return (
        <div className="dashboard-layout bg-[#f1f2f4] flex h-full w-full gap-x-2">
            <div className="dashboard-layout hidden sm:block basis-1/5  overflow-y-scroll hide-scrollbar px-3">
                <DashboardSidebar />
            </div>

            <p className="text-black flex justify-center items-center w-full">
                Copyright©IVYLEAGUE CSFORALL ACADEMY PRIVATE LIMITED. All rights reserved.
            </p>
        </div>
    );
};