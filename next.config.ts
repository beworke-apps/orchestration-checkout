import bundleAnalyzer from '@next/bundle-analyzer';

import type { NextConfig } from 'next';

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

const nextConfig: NextConfig = {
  devIndicators: {
    position: 'bottom-right',
  },
  images: {
    remotePatterns: [
      {
        hostname: 'heroui-assets.nyc3.cdn.digitaloceanspaces.com',
        protocol: 'https',
      },
      {
        hostname: 'img.heroui.chat',
        protocol: 'https',
      },
    ],
  },
};

export default withBundleAnalyzer(nextConfig);
