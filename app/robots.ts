import { MetadataRoute } from "next"
import { siteUrl } from "components/seo"

export const dynamic = "force-static"

const robots = (): MetadataRoute.Robots => ({
  rules: {
    userAgent: "*",
    allow: "/",
  },
  sitemap: `${siteUrl}/sitemap.xml`,
})

export default robots
