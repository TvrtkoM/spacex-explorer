import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    staleTimes: {
      // Cache dynamic pages (like /launches with searchParams) for 120s in the
      // client router cache, matching the pre-v15 default. Without this, every
      // navbar click triggers a server round-trip and shows the skeleton even
      // when the data hasn't changed.
      dynamic: 120,
    },
  },
  images: {
    remotePatterns: [
      new URL('https://images2.imgbox.com/**'),
      new URL('https://live.staticflickr.com/**')
    ]
  }
};

export default nextConfig;
