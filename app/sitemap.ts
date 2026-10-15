import { MetadataRoute } from "next"
import { toolLinks } from "components/tool-links"
import { absoluteUrl } from "components/seo"

export const dynamic = "force-static"

const lastModified = new Date(
  process.env.NEXT_PUBLIC_SITE_UPDATED_AT ?? "2026-10-15"
)

const sitemap = (): MetadataRoute.Sitemap => [
  {
    url: absoluteUrl("/"),
    changeFrequency: "weekly",
    priority: 1,
    lastModified,
  },
  ...toolLinks.map((tool) => ({
    url: absoluteUrl(tool.href),
    changeFrequency: "monthly" as const,
    priority: 0.8,
    lastModified,
  })),
  {
    url: absoluteUrl("/glossary/"),
    changeFrequency: "monthly",
    priority: 0.6,
    lastModified,
  },
]

export default sitemap
