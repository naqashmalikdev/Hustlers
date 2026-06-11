import type { MetadataRoute } from "next";

const BASE_URL = "https://hustlersgym.pk";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/shop`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/privacy`,
      lastModified: new Date("2026-06-07"),
      changeFrequency: "yearly",
      priority: 0.2,
    },
    {
      url: `${BASE_URL}/terms`,
      lastModified: new Date("2026-06-07"),
      changeFrequency: "yearly",
      priority: 0.2,
    },
  ];
}
