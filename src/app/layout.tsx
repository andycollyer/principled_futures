import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Principled Futures",
  description:
    "Board-level oversight of ESG performance and Ethical AI — a Salveus Labs product.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en-GB">
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
