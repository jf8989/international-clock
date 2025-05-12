// next.config.ts
import type { NextConfig } from "next";
import withPWAImport from "next-pwa";

// Configure next-pwa
const withPWA = withPWAImport({
  dest: "public", // Destination directory for the PWA files
  register: true, // Register the PWA service worker
  skipWaiting: true, // Instructs the waiting service worker to activate immediately
  disable: process.env.NODE_ENV === "development", // Disable PWA in development mode
  // cacheOnFrontEndNav: true, // Optional: Caches pages navigated to on the client side
  // fallbacks: { // Optional: Specify fallbacks for offline
  //   document: '/offline', // Example: you would need to create an /offline page
  // },
});

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    domains: [], // You can add domains like 'images.unsplash.com' when needed
    loader: "default",
    remotePatterns: [
      // Example pattern (commented out) - uncomment and modify when needed
      // {
      //   protocol: 'https',
      //   hostname: 'example.com',
      //   port: '',
      //   pathname: '/images/**',
      // },
    ],
  },
  pageExtensions: ["js", "jsx", "ts", "tsx", "mdx"],
  // Useful when using npm packages that depend on Node.js modules
  transpilePackages: [], // Add packages that need transpilation
  // Enable experimental features if needed
  experimental: {
    // typedRoutes: true,
    // serverActions: true,
  },
};

export default withPWA(nextConfig); // Wrap your nextConfig with withPWA
