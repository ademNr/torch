// app/page.tsx
"use client";

import LoadingPage from "@/components/LoadingPage";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (user) {
        router.push("/recognition");
      } else {
        router.push("/landing");
      }
    }
  }, [user, loading, router]);

  return (
    <LoadingPage
      message="Loading..."

    />
  );
}