import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/admin",
          "/admin/*",
          "/onboarding",
          "/onboarding/*",
          "/api/*",
        ],
      },
    ],
    sitemap: "https://www.aashrayinfotech.com/sitemap.xml",
    host: "https://www.aashrayinfotech.com",
  };
}
