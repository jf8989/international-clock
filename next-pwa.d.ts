/* eslint-disable @typescript-eslint/no-explicit-any */
// next-pwa.d.ts
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
      document?: string; // Fallback for document (page)
      image?: string; // Fallback for images
      audio?: string; // Fallback for audio
      video?: string; // Fallback for video
      font?: string; // Fallback for fonts
      // More specific fallbacks if needed, matching Workbox's precache routing
      entries?: FallbackEntry[];
    };
    publicExcludes?: string[];
    buildExcludes?: (string | RegExp)[]; // Corrected to allow RegExp
    runtimeCaching?: WorkboxOptions["runtimeCaching"];
    workboxOptions?: Omit<
      WorkboxOptions,
      "swDest" | "globDirectory" | "runtimeCaching"
    >; // Omit keys managed by next-pwa
    customWorkerDir?: string;
    extendDefaultRuntimeCaching?: boolean;
    dynamicStartUrl?: boolean;
    dynamicStartUrlRedirect?: string | boolean;
    cacheStartUrl?: boolean;
    additionalManifestEntries?: ReadonlyArray<any>; // Consider defining a more specific type if known
    cleanupOutdatedCaches?: boolean;
    swSrc?: string; // For using a custom service worker as a source
    // Add any other options you use from next-pwa documentation
  }

  // This ensures that withPWA takes your project's NextConfig and returns it.
  type WithPWA = (config: NextConfig) => NextConfig;

  const withPWA: (pwaConfig: NextPWAConfig) => WithPWA;
  export default withPWA;
}
