/** @type {import('next').NextConfig} */
const nextConfig = {
  // Static export: `npm run build` emits a self-contained site in out/,
  // deployable to Netlify as-is (the numbered dist folders).
  output: "export",
  trailingSlash: true,
};

export default nextConfig;
