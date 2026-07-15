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
    <div
      style={{
        alignItems: "center",
        background: "#f6f5f0",
        border: "24px solid #202124",
        display: "flex",
        flexDirection: "column",
        height: "100%",
        justifyContent: "center",
        width: "100%",
      }}
    >
      <div
        style={{
          color: "#202124",
          display: "flex",
          fontSize: 144,
          fontWeight: 700,
          letterSpacing: "0",
        }}
      >
        Restring
      </div>
      <div
        style={{
          color: "#4b4b46",
          display: "flex",
          fontSize: 42,
          marginTop: 24,
        }}
      >
        String tools for developers
      </div>
      <div
        style={{
          color: "#202124",
          display: "flex",
          fontFamily: "monospace",
          fontSize: 30,
          marginTop: 56,
        }}
      >
        diff / json / base64 / url / unicode / case
      </div>
    </div>,
    { ...size }
  )

export default Image
