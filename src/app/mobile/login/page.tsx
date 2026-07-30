"use client";

import { useRouter } from "next/navigation";
import { MobileLogin } from "@/components/MobileLogin";
import { setPreferDesktop } from "@/lib/device";

export default function MobileLoginPage() {
  const router = useRouter();
  return (
    <MobileLogin
      onAuth={() => router.push("/mobile")}
      onDesktop={() => {
        // Remember the choice so /login doesn't bounce them back to mobile.
        setPreferDesktop(true);
        router.push("/login");
      }}
    />
  );
}
