import Link from "next/link"
import { Metadata } from "next"
import { Title } from "components/elements/layout"
import { siteDescription, siteName, siteUrl } from "components/seo"
import { ToolTabs } from "components/tool-tabs"
import "./reset.css"

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  applicationName: siteName,
  title: {
    default: "restring | 開発者向け文字列処理・比較ツール",
    template: "%s | restring",
  },
  description: siteDescription,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "restring | 開発者向け文字列処理・比較ツール",
    description: siteDescription,
    url: "/",
    siteName,
    locale: "ja_JP",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  twitter: {
    card: "summary",
    title: "restring | 開発者向け文字列処理・比較ツール",
    description: siteDescription,
  },
}

const structuredData = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: siteName,
  url: siteUrl,
  description: siteDescription,
  inLanguage: "ja",
}

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="ja">
      <head>
        <script
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
          type="application/ld+json"
        />
      </head>
      <body>
        <header
          style={{
            backgroundColor: "#111827",
            borderBottom: "1px solid #334155",
            padding: ".75rem 1rem",
            position: "sticky",
            top: 0,
            zIndex: 1,
          }}
        >
          <Link className="brandLink" href="/">
            <Title>restring</Title>
          </Link>
          <ToolTabs />
        </header>
        <main
          style={{
            background: "#0f172a",
            minHeight: "calc(100dvh - 6.25rem)",
            padding: "1rem",
          }}
        >
          {children}
        </main>
        <footer
          style={{
            backgroundColor: "#111827",
            borderTop: "1px solid #334155",
            fontSize: ".75rem",
            padding: "1rem",
          }}
        >
          <p>&copy; restring</p>
        </footer>
      </body>
    </html>
  )
}
export default RootLayout
