import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin/", "/account/", "/auth/", "/api/", "/checkout/"],
      },
    ],
    sitemap: "https://hustlersgym.pk/sitemap.xml",
  };
}
