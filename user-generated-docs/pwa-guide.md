# 🚀 Next.js PWA Setup: The Direct Path (with `next-pwa`)

This guide details the steps to make your Next.js (App Router) project PWA-ready, focusing on the configurations that resolved common TypeScript compatibility issues with `next-pwa`.

---

## ⚠️ Understanding Potential Type Issues

When integrating `next-pwa` (a JavaScript library) with a TypeScript Next.js project (especially newer versions like Next.js 15+), you might encounter type errors. This is often because:
1.  The official `@types/next-pwa` package might not be perfectly aligned with your specific Next.js version's types.
2.  `next-pwa` itself might not have shipped its own up-to-date type declarations.

The solution we found effective involves **not using `@types/next-pwa`** and instead relying on a **custom type declaration file (`.d.ts`)** that aligns with your project's Next.js types.

---

## 🛠️ Step 1: Install Dependencies

1.  **Install `next-pwa`:**
    ```bash
    npm install next-pwa
    # or
    # yarn add next-pwa
    ```

2.  **Install `workbox-build` (for custom types):**
    Our custom type definition for `next-pwa` uses types from `workbox-build`.
    ```bash
    npm install --save-dev workbox-build
    # or
    # yarn add --dev workbox-build
    ```

3.  **DO NOT Install `@types/next-pwa`:**
    If you previously installed it, uninstall it to avoid type conflicts:
    ```bash
    npm uninstall @types/next-pwa
    # or
    # yarn remove @types/next-pwa
    ```

---

## 📄 Step 2: Create Custom Type Definition (`next-pwa.d.ts`)

Create a file named `next-pwa.d.ts` in the **root of your project**. Paste the following working code:

```typescript
// next-pwa.d.ts
/* eslint-disable @typescript-eslint/no-explicit-any */
declare module "next-pwa" {
  import { NextConfig } from "next"; // This imports NextConfig from YOUR project's Next.js version
  import { WorkboxOptions } from "workbox-build";

  interface FallbackEntry {
    url: string;
    revision?: string | null;
  }

  interface NextPWAConfig {
    dest?: string;
    sw?: string;
    register?: boolean;
    skipWaiting?: boolean;
    disable?: boolean;
    scope?: string;
    cacheOnFrontEndNav?: boolean;
    reloadOnOnline?: boolean;
    fallbacks?: {
      document?: string;
      image?: string;
      audio?: string;
      video?: string;
      font?: string;
      entries?: FallbackEntry[];
    };
    publicExcludes?: string[];
    buildExcludes?: (string | RegExp)[];
    runtimeCaching?: WorkboxOptions["runtimeCaching"];
    workboxOptions?: Omit<
      WorkboxOptions,
      "swDest" | "globDirectory" | "runtimeCaching"
    >;
    customWorkerDir?: string;
    extendDefaultRuntimeCaching?: boolean;
    dynamicStartUrl?: boolean;
    dynamicStartUrlRedirect?: string | boolean;
    cacheStartUrl?: boolean;
    additionalManifestEntries?: ReadonlyArray<any>;
    cleanupOutdatedCaches?: boolean;
    swSrc?: string;
  }

  type WithPWA = (config: NextConfig) => NextConfig;
  const withPWA: (pwaConfig: NextPWAConfig) => WithPWA;
  export default withPWA;
}
```
*This declaration file allows TypeScript to understand `next-pwa` using your project's specific `NextConfig` type.*

---

## ⚙️ Step 3: Configure `tsconfig.json`

Ensure your `tsconfig.json` includes the custom declaration file. The following is an example based on your provided configuration:

```json
// tsconfig.json
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": [
    "next-env.d.ts",
    "**/*.ts",
    "**/*.tsx",
    ".next/types/**/*.ts",
    "next-pwa.d.ts" // Ensure this line is present
  ],
  "exclude": ["node_modules"]
}
```
**Key:** Make sure `"next-pwa.d.ts"` is in the `"include"` array.

**After this step, restart your TypeScript server / IDE (VS Code: Ctrl+Shift+P > "TypeScript: Restart TS server") to ensure changes are picked up.**

---

## 🔧 Step 4: Configure `next.config.ts`

Modify your `next.config.ts` to use `next-pwa`. Here is the working configuration:

```typescript
// next.config.ts
import type { NextConfig } from "next";
import withPWAImport from "next-pwa";

// Configure next-pwa
const withPWA = withPWAImport({
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === "development",
  // cacheOnFrontEndNav: true,
  // fallbacks: {
  //   document: '/offline',
  // },
});

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    domains: [],
    loader: "default",
    remotePatterns: [
      // {
      //   protocol: 'https',
      //   hostname: 'example.com',
      //   port: '',
      //   pathname: '/images/**',
      // },
    ],
  },
  pageExtensions: ["js", "jsx", "ts", "tsx", "mdx"],
  transpilePackages: [],
  experimental: {
    // typedRoutes: true,
    // serverActions: true,
  },
};

export default withPWA(nextConfig);
```

---

## 🌐 Step 5: Create Web App Manifest (`public/manifest.json`)

Create `public/manifest.json` with your app's PWA details:

```json
// public/manifest.json
{
  "name": "International Mechanical Timekeeper",
  "short_name": "Timekeeper",
  "description": "An interactive mechanical clock displaying time across different timezones. Built with Next.js, React, and TypeScript.",
  "start_url": "/",
  "display": "standalone",
  "orientation": "portrait-primary",
  "background_color": "#1f2937",
  "theme_color": "#1f2937", // UPDATE to match your desired browser UI theme color
  "icons": [
    { "src": "/icons/icon-72x72.png", "sizes": "72x72", "type": "image/png" },
    { "src": "/icons/icon-96x96.png", "sizes": "96x96", "type": "image/png" },
    { "src": "/icons/icon-128x128.png", "sizes": "128x128", "type": "image/png" },
    { "src": "/icons/icon-144x144.png", "sizes": "144x144", "type": "image/png" },
    { "src": "/icons/icon-152x152.png", "sizes": "152x152", "type": "image/png" },
    { "src": "/icons/icon-192x192.png", "sizes": "192x192", "type": "image/png", "purpose": "any" },
    { "src": "/icons/icon-384x384.png", "sizes": "384x384", "type": "image/png" },
    { "src": "/icons/icon-512x512.png", "sizes": "512x512", "type": "image/png" },
    { "src": "/icons/icon-maskable-192x192.png", "sizes": "192x192", "type": "image/png", "purpose": "maskable" },
    { "src": "/icons/icon-maskable-512x512.png", "sizes": "512x512", "type": "image/png", "purpose": "maskable" }
  ]
}
```
**✨ Important:**
*   Update `theme_color` in `manifest.json`. It should match the `themeColor` you will set in `src/app/layout.tsx`.
*   The example `background_color` and `theme_color` are `#1f2937` (a dark gray). Adjust to your app's branding. Your `layout.tsx` previously used `#3b82f6` for `theme_color`, ensure consistency or choose one. I've updated the manifest here to use `#1f2937` as per your layout's `viewport.themeColor` for the example.

---

## 🎨 Step 6: Create App Icons

1.  Create a `public/icons/` directory.
2.  Place all icons referenced in `manifest.json` (e.g., `icon-192x192.png`, `icon-maskable-192x192.png`) inside this folder.
3.  Also, include `public/favicon.ico` (your main browser tab icon) and `public/icons/apple-touch-icon.png` (for iOS).

---

##  LAYOUT Step 7: Update Root Layout (`src/app/layout.tsx`)

Modify your root layout to link the manifest and define PWA-related metadata and viewport settings:

```typescript
// src/app/layout.tsx
import type { Metadata, Viewport } from "next";
// ... your font imports (Inter, GeistSans, etc.) ...
import { Inter, Poppins, Montserrat, Roboto, Open_Sans, Lato, Raleway } from "next/font/google";
import { GeistSans, GeistMono } from "geist/font";
import "./globals.css";
import { cn } from "../lib/utils";

// --- Your Font Definitions (keep as they are) ---
const inter = Inter({ variable: "--font-inter", subsets: ["latin"], display: "swap", weight: ["300", "400", "500", "600", "700"], });
const geistSans = GeistSans;
const geistMono = GeistMono;
const poppins = Poppins({ variable: "--font-poppins", weight: ["300", "400", "500", "600", "700"], subsets: ["latin"], display: "swap", });
const montserrat = Montserrat({ variable: "--font-montserrat", weight: ["300", "400", "500", "600", "700"], subsets: ["latin"], display: "swap", });
const roboto = Roboto({ variable: "--font-roboto", weight: ["300", "400", "500", "700"], subsets: ["latin"], display: "swap", });
const openSans = Open_Sans({ variable: "--font-open-sans", weight: ["300", "400", "600", "700"], subsets: ["latin"], display: "swap", });
const lato = Lato({ variable: "--font-lato", weight: ["300", "400", "700", "900"], subsets: ["latin"], display: "swap", });
const raleway = Raleway({ variable: "--font-raleway", weight: ["300", "400", "500", "600", "700"], subsets: ["latin"], display: "swap", });
// --- End Font Definitions ---

export const metadata: Metadata = {
  title: {
    default: "International Mechanical Timekeeper",
    template: "%s | Intl Timekeeper",
  },
  description:
    "An interactive mechanical clock displaying time across different timezones. Built with Next.js, React, and TypeScript.",
  keywords: ["Next.js", "React", "Tailwind CSS", "TypeScript", "Clock", "Timezone", "PWA", "SVG"],
  authors: [{ name: "Your Name/Username", url: "https://github.com/yourusername" }], // <<< PLEASE UPDATE
  creator: "Your Name/Username", // <<< PLEASE UPDATE
  publisher: "Your Name/Username", // <<< PLEASE UPDATE

  manifest: "/manifest.json",

  icons: {
    icon: "/favicon.ico",
    shortcut: "/icons/icon-192x192.png",
    apple: "/icons/apple-touch-icon.png",
  },
  // ... (your OpenGraph/Twitter metadata if configured) ...
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#1f2937", // <<< UPDATE to match manifest.json 'theme_color'
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(
        "scroll-smooth",
        inter.variable, geistSans.variable, geistMono.variable, poppins.variable,
        montserrat.variable, roboto.variable, openSans.variable, lato.variable,
        raleway.variable
      )}
    >
      <body
        className={cn(
          "min-h-screen bg-background font-sans text-foreground antialiased",
          "transition-colors duration-300 ease-in-out"
        )}
      >
        <div className="relative flex min-h-screen flex-col">
          <main className="flex-1">{children}</main>
        </div>
      </body>
    </html>
  );
}
```
**✨ Important for Layout:**
*   **PLEASE UPDATE** the placeholder `authors`, `creator`, `publisher` fields.
*   Ensure `viewport.themeColor` matches the `theme_color` in your `manifest.json`. (I've used `#1f2937` here as an example to match the manifest provided; adjust if your preference is different, e.g., `#3b82f6`).

---

## 🧪 Step 8: Build and Test

1.  **Build for Production:**
    ```bash
    npm run build
    ```
2.  **Start Production Server:**
    ```bash
    npm run start
    ```
3.  **Test Thoroughly in Browser:**
    *   Open `http://localhost:3000`.
    *   Use Developer Tools (F12) > Application Tab (Manifest, Service Workers, Cache Storage).
    *   Run a Lighthouse PWA audit.
    *   Check for installability (install icon in address bar).
    *   Test offline functionality.

---

## 🌐 Step 9: Deploy

*   Deploy to a hosting provider with **HTTPS** (e.g., Vercel).