import type { MetadataRoute } from "next";
import { homeContent } from "@/content/home";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://www.aashrayinfotech.com";
  const lastModified = new Date();

  // Core static pages
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/`,
      lastModified,
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/about`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/learning`,
      lastModified,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/faq`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/book-a-demo`,
      lastModified,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/niyamsaathi-partner`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/privacy-policy`,
      lastModified,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${baseUrl}/cookie-policy`,
      lastModified,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified,
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];

  // Dynamic product & platform routes
  const productRoutes: MetadataRoute.Sitemap = homeContent.ourPlatforms.items.map(
    (item) => ({
      url: `${baseUrl}/${item.category}/${item.slug}`,
      lastModified,
      changeFrequency: "weekly",
      priority: 0.9,
    })
  );

  return [...staticRoutes, ...productRoutes];
}
