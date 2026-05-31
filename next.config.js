const isProd = process.env.NODE_ENV === "production";
const basePath = isProd ? "/portfolio_bpa" : "";

/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  basePath,
  assetPrefix: isProd ? "/portfolio_bpa/" : "",
  images: {
    unoptimized: true,
  },
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
  },
};
