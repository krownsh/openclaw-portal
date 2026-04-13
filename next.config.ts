import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Reduce noisy prefetch/RSC requests on CF Pages (keeps Network clean).
  experimental: {
    staleTimes: {
      dynamic: 0,
    },
  },
};

export default nextConfig;
