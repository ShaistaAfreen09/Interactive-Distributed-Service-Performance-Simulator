import type { Metadata } from "next";
import "./globals.css";



export const metadata: Metadata = {
  title: "Interactive Distributed Service Performance Simulator",
  description: "Realtime distributed service degradation and latency observability simulator built with a cloud-native dashboard experience.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en">
<body className="antialiased">    </html>
  );
}
