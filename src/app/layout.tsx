import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter, Poppins, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import QueryProvider from "@/components/QueryProvider";
// import ReduxProvider from "@/components/ReduxProvider";
import { ToastContainer } from "react-toastify";
import StoreProvider from "./StoreProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
});

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta",
});

export const metadata: Metadata = {
  title: "WorkR",
  description: "",
  icons: {
    icon: "/WorkR-Logo2.png",
  },
};

export const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["100", "200", "300", "400", "500", "600", "700"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full w-full ">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${poppins.variable} ${inter.variable} ${plusJakartaSans.variable} antialiased bg-[#F5F5F5] w-full h-full`}
      >
        <ToastContainer position="top-right" autoClose={3000} />
        <StoreProvider>
          <QueryProvider>{children}</QueryProvider>
        </StoreProvider>
      </body>
    </html>
  );
}
