"use client";

import { useRouter } from "next/navigation";
import { Landing } from "@/components/Landing";

export default function LandingPage() {
  const router = useRouter();
  return <Landing onEnter={() => router.push("/login")} />;
}
