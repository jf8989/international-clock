// src/app/layout.tsx
import type { Metadata, Viewport } from "next";
import {
  Inter,
  Poppins,
  Montserrat,
  Roboto,
  Open_Sans,
  Lato,
  Raleway,
} from "next/font/google";
import { GeistSans, GeistMono } from "geist/font";
import "./globals.css";
import { cn } from "../lib/utils";

// Main UI system font (Inter as per Tailwind config)
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

// Geist fonts (sans and mono)
const geistSans = GeistSans;
const geistMono = GeistMono;

// Additional fonts (based on your tailwind config)
const poppins = Poppins({
  variable: "--font-poppins",
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
  display: "swap",
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
  display: "swap",
});

const roboto = Roboto({
  variable: "--font-roboto",
  weight: ["300", "400", "500", "700"],
  subsets: ["latin"],
  display: "swap",
});

const openSans = Open_Sans({
  variable: "--font-open-sans",
  weight: ["300", "400", "600", "700"],
  subsets: ["latin"],
  display: "swap",
});

const lato = Lato({
  variable: "--font-lato",
  weight: ["300", "400", "700", "900"],
  subsets: ["latin"],
  display: "swap",
});

const raleway = Raleway({
  variable: "--font-raleway",
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "International Mechanical Timekeeper",
    template: "%s | Intl Timekeeper",
  },
  description:
    "An interactive mechanical clock displaying time across different timezones. Built with Next.js, React, and TypeScript.",
  keywords: [
    "Next.js",
    "React",
    "Tailwind CSS",
    "TypeScript",
    "Clock",
    "Timezone",
    "PWA",
    "SVG",
  ],
  authors: [
    { name: "Your Name/Username", url: "https://github.com/yourusername" },
  ], // PLEASE UPDATE
  creator: "Your Name/Username", // PLEASE UPDATE
  publisher: "Your Name/Username", // PLEASE UPDATE

  manifest: "/manifest.json", // Link to your PWA manifest

  // PWA and Favicon icons - Ensure these paths are correct and files exist
  icons: {
    icon: "/favicon.ico", // Your main favicon in public folder
    shortcut: "/icons/icon-192x192.png", // Example: A common PWA icon size
    apple: "/icons/apple-touch-icon.png", // For iOS home screen (e.g., public/icons/apple-touch-icon.png)
    // Add other icon sizes as needed, matching your manifest.json
    // other: [
    //   { rel: 'icon', url: '/icons/icon-32x32.png', sizes: '32x32' },
    //   { rel: 'icon', url: '/icons/icon-16x16.png', sizes: '16x16' },
    // ],
  },
  // Optional: Configure Open Graph and Twitter cards for social media sharing
  // openGraph: {
  //   title: "International Mechanical Timekeeper",
  //   description: "Explore timezones with an interactive mechanical clock.",
  //   url: "https://your-live-url.com", // PLEASE UPDATE with your live URL
  //   siteName: "Intl Timekeeper",
  //   images: [
  //     {
  //       url: "https://your-live-url.com/og-image.png", // Must be an absolute URL
  //       width: 1200,
  //       height: 630,
  //       alt: "International Mechanical Timekeeper Open Graph Image",
  //     },
  //   ],
  //   locale: "en_US",
  //   type: "website",
  // },
  // twitter: {
  //   card: "summary_large_image",
  //   title: "International Mechanical Timekeeper",
  //   description: "Explore timezones with an interactive mechanical clock.",
  //   creator: "@YourTwitterHandle", // PLEASE UPDATE
  //   images: ["https://your-live-url.com/twitter-image.png"], // Must be an absolute URL
  // },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1, // Common for PWAs to prevent zooming, but optional
  // This themeColor should match the 'theme_color' in your public/manifest.json
  // Example: If your manifest has "#1f2937" (dark gray), use that.
  themeColor: "#1f2937", // PLEASE UPDATE to match your manifest.json 'theme_color'
  // If you want the browser UI (status bar) to adapt to system light/dark mode, use:
  // themeColor: [
  //   { media: "(prefers-color-scheme: light)", color: "#ffffff" }, // Example light theme color
  //   { media: "(prefers-color-scheme: dark)", color: "#1f2937" },  // Example dark theme color
  // ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning // Recommended for Next.js with class-based dark mode
      className={cn(
        "scroll-smooth",
        // Apply all font variables
        inter.variable,
        geistSans.variable,
        geistMono.variable,
        poppins.variable,
        montserrat.variable,
        roboto.variable,
        openSans.variable,
        lato.variable,
        raleway.variable
      )}
    >
      {/*
        Next.js App Router manages the <head> tag content through `metadata` and `viewport` exports.
        No explicit <head> tag is needed here unless for very specific overrides not covered by Next.js.
      */}
      <body
        className={cn(
          "min-h-screen bg-background font-sans text-foreground antialiased",
          "transition-colors duration-300 ease-in-out" // Smooth transition for color changes
        )}
      >
        <div className="relative flex min-h-screen flex-col">
          <main className="flex-1">{children}</main>
        </div>
      </body>
    </html>
  );
}
