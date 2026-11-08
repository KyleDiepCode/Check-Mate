import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Lets a phone on the same Wi-Fi open the dev server (npm run dev).
  // Only affects development. If your Mac's IP changes, update it here
  // (find it with: ipconfig getifaddr en0).
  allowedDevOrigins: ["10.0.0.133"],
};

export default nextConfig;
