import { MetadataRoute } from "next"
import { toolLinks } from "components/tool-links"
import { absoluteUrl } from "components/seo"

export const dynamic = "force-static"

const sitemap = (): MetadataRoute.Sitemap => [
  {
    url: absoluteUrl("/"),
    changeFrequency: "weekly",
    priority: 1,
  },
  ...toolLinks.map((tool) => ({
    url: absoluteUrl(tool.href),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  })),
]

export default sitemap
