import { ImageResponse } from "next/og"

export const dynamic = "force-static"

export const alt = "Restring | 開発者向け文字列処理・比較ツール"

export const size = {
  width: 1200,
  height: 630,
}

export const contentType = "image/png"

const Image = () =>
  new ImageResponse(
    (
      <div
        style={{
          alignItems: "center",
          background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
          display: "flex",
          flexDirection: "column",
          height: "100%",
          justifyContent: "center",
          width: "100%",
        }}
      >
        <div
          style={{
            color: "#f8fafc",
            display: "flex",
            fontSize: 144,
            fontWeight: 700,
            letterSpacing: "-0.02em",
          }}
        >
          Restring
        </div>
        <div
          style={{
            color: "#94a3b8",
            display: "flex",
            fontSize: 42,
            marginTop: 24,
          }}
        >
          String tools for developers
        </div>
        <div
          style={{
            color: "#38bdf8",
            display: "flex",
            fontFamily: "monospace",
            fontSize: 30,
            marginTop: 56,
          }}
        >
          diff / json / base64 / url / unicode / case
        </div>
      </div>
    ),
    { ...size }
  )

export default Image
