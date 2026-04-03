"use client";

import DashboardTopbar from "@/components/dashboard/DashboardTopbar";
import UserDetailForm from "@/components/me/UserDetailForm";
import UserProfileForm from "@/components/me/UserProfileForm";
import UserSkillForm from "@/components/me/UserSkillForm";
import TripleDotLoader from "@/components/TripleDotLoader";
import { setAuthJwtToken } from "@/features/authJwtToken/authJwtTokenSlice";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import useGetUser from "@/utils/useGetUser";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Page() {
  const dispatch = useAppDispatch();
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const jwtToken = useAppSelector((state) => state.authJwtToken.value);
  useEffect(() => {
    const token = localStorage.getItem("AuthJwtToken");
    if (token) {
      dispatch(setAuthJwtToken(token));
    } else {
      router.replace("/login");
    }
  }, [dispatch, router]);

  const { isPending, isError, data } = useGetUser(jwtToken);
  useEffect(() => {
    setMounted(true);
  }, []);
  useEffect(() => {
    if (isError) {
      router.replace("/login");
    }
  }, [router, isError]);

  if (!mounted) {
    return null;
  }

  if (isPending) {
    return <TripleDotLoader />;
  }

  if (data) {
    return (
      <div className="me-page absolute top-0 p-6 pt-2 overflow-y-scroll h-[100%]">
        <DashboardTopbar pageName="About You" />
        <UserDetailForm />
        <UserProfileForm />
        {/* <EditSkills /> */}
        <UserSkillForm />
      </div>
    );
  }
}
