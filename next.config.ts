import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack: (config, { isServer }) => {
    config.resolve.fallback = {
      fs: false,
      path: false,
      os: false,
    };
    
    // Ignore optional dependencies warnings
    config.ignoreWarnings = [
      { module: /pino-pretty/ },
      { module: /pino\/lib/ },
    ];
    
    // Mark pino-pretty as external (it's an optional dependency)
    if (!isServer) {
      config.externals = config.externals || [];
      config.externals.push("pino-pretty", "lokijs", "encoding");
    }
    
    return config;
  },
};

export default nextConfig;

