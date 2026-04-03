"use client";

import { setAuthJwtToken } from "@/features/authJwtToken/authJwtTokenSlice";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import useGetUser from "@/utils/useGetUser";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  useEffect(() => {
    const token = localStorage.getItem("AuthJwtToken");
    if (token) {
      dispatch(setAuthJwtToken(token));
    }
    router.replace("/dashboard");
  }, [dispatch, router]);

  const jwtToken = useAppSelector((state) => state.authJwtToken.value);
  const {} = useGetUser(jwtToken);

  // useEffect(() => {
  //   if (isLoading) return; // wait for query to finish

  //   if (isSuccess && data) {
  //     router.push("/dashboard");
  //   }

  //   if (isError) {
  //     router.push("/login"); // or redirect("/login") in App Router
  //   }
  // }, [isSuccess, isError, isLoading, data, router]);
}
