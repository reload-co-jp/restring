import Link from "next/link"
import { Metadata } from "next"
import Script from "next/script"
import { Title } from "components/elements/layout"
import {
  defaultOgImage,
  siteDescription,
  siteKeywords,
  siteName,
  siteUrl,
} from "components/seo"
import { ToolTabs } from "components/tool-tabs"
import "./reset.css"

const googleAnalyticsId = "G-2M289CH9TQ"
const isProduction = process.env.NODE_ENV === "production"

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  applicationName: siteName,
  title: {
    default: "Restring | 開発者向け文字列処理・比較ツール",
    template: "%s | Restring",
  },
  description: siteDescription,
  keywords: siteKeywords,
  category: "developer tools",
  creator: siteName,
  publisher: siteName,
  alternates: {
    canonical: "/",
    languages: {
      ja: "/",
    },
  },
  openGraph: {
    title: "Restring | 開発者向け文字列処理・比較ツール",
    description: siteDescription,
    url: "/",
    siteName,
    locale: "ja_JP",
    type: "website",
    images: [defaultOgImage],
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
    card: "summary_large_image",
    title: "Restring | 開発者向け文字列処理・比較ツール",
    description: siteDescription,
    images: [defaultOgImage],
  },
}

const structuredData = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: siteName,
  url: siteUrl,
  description: siteDescription,
  inLanguage: "ja",
  publisher: {
    "@type": "Organization",
    name: siteName,
    url: siteUrl,
  },
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
        {isProduction && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${googleAnalyticsId}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${googleAnalyticsId}');
              `}
            </Script>
          </>
        )}
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
            <Title>Restring</Title>
          </Link>
          <ToolTabs />
        </header>
        <main
          style={{
            background: "#0f172a",
            margin: "0 auto",
            maxWidth: "1180px",
            minHeight: "calc(100dvh - 6.25rem)",
            padding: "1rem",
            width: "100%",
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
          <p>&copy; Restring</p>
        </footer>
      </body>
    </html>
  )
}
export default RootLayout
