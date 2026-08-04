import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { headers } from "next/headers";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host = requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host") ?? "localhost:3000";
  const protocol = requestHeaders.get("x-forwarded-proto") ?? (host.includes("localhost") ? "http" : "https");
  const baseUrl = new URL(`${protocol}://${host}`);

  return {
    metadataBase: baseUrl,
    title: {
      default: "CareReady Ontario | Physical Healthcare Training",
      template: "%s | CareReady Ontario",
    },
    description:
      "Accessible physical healthcare training for Ontario personal support workers and care teams.",
    openGraph: {
      title: "CareReady Ontario",
      description:
        "Practical physical healthcare training for Ontario care teams.",
      type: "website",
      url: baseUrl,
      images: [
        {
          url: new URL("/og.png", baseUrl),
          width: 1734,
          height: 907,
          alt: "CareReady Ontario — Notice earlier. Act with confidence.",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: "CareReady Ontario",
      description: "Practical physical healthcare training for Ontario care teams.",
      images: [new URL("/og.png", baseUrl)],
    },
  };
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full">{children}</body>
    </html>
  );
}
