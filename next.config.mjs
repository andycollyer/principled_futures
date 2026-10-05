/** @type {import('next').NextConfig} */
const nextConfig = {
  // Static export: `npm run build` emits a self-contained site in out/,
  // deployable to Netlify as-is (the numbered dist folders).
  output: "export",
  // The project sits in an iCloud-synced folder. iCloud leaves ".nosync" folders alone, which
  // stops it evicting and duplicating built files (the cause of stalled builds and stale copies).
  // With a static export this is also where the finished site lands: deploy from out.nosync.
  distDir: "out.nosync",
  trailingSlash: true,
};

export default nextConfig;
