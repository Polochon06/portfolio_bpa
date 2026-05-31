const basePath = "";

/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  images: {
    unoptimized: true,
  },
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
  },
  sassOptions: {
    prependData: `$base-path: "${basePath}";`,
  },
};
