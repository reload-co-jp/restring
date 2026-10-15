"use client"

import { FC, useState } from "react"
import { encode } from "uqr"
import { downloadBlob, qrToSvg } from "components/tool-logic"
import {
  ActionButton,
  CopyButton,
  Panel,
  Segmented,
  Status,
  TextArea,
} from "components/tools"

type Ecc = "L" | "M" | "Q" | "H"

const sampleQr = "https://restring.reload.co.jp/"

const eccOptions: Array<{ value: Ecc; label: string }> = [
  { value: "L", label: "L（7%）" },
  { value: "M", label: "M（15%）" },
  { value: "Q", label: "Q（25%）" },
  { value: "H", label: "H（30%）" },
]

const svgDataUrl = (svg: string) =>
  `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`

// SVGをcanvasに描いてPNGにする。crispEdges指定のため拡大してもぼやけない
const downloadPng = (svg: string, pixels: number) => {
  const image = new Image()
  image.onload = () => {
    const canvas = document.createElement("canvas")
    canvas.width = pixels
    canvas.height = pixels
    canvas.getContext("2d")?.drawImage(image, 0, 0, pixels, pixels)
    canvas.toBlob(
      (blob) => blob && downloadBlob("qrcode.png", blob),
      "image/png"
    )
  }
  image.src = svgDataUrl(svg)
}

const encodeQr = (value: string, ecc: Ecc, border: number) => {
  try {
    const qr = encode(value, { ecc, border })
    return { qr, error: "" }
  } catch (error) {
    const message = error instanceof Error ? error.message : ""
    return {
      qr: null,
      error:
        message === "Data too long"
          ? "文字数が多すぎてQRコードに収まらない"
          : message || "生成失敗",
    }
  }
}

export const QrCodeTool: FC = () => {
  const [value, setValue] = useState(sampleQr)
  const [ecc, setEcc] = useState<Ecc>("M")
  const [border, setBorder] = useState<"4" | "2" | "0">("4")
  const [pixels, setPixels] = useState<"256" | "512" | "1024">("512")
  const [foreground, setForeground] = useState("#000000")
  const [background, setBackground] = useState("#ffffff")
  const [transparent, setTransparent] = useState(false)
  const { qr, error } = encodeQr(value, ecc, Number(border))
  const svg = qr
    ? qrToSvg(qr.data, foreground, transparent ? "" : background)
    : ""

  return (
    <Panel
      description="入力はUTF-8で符号化。生成はブラウザ内で完結する。"
      title="QRコード生成"
    >
      <TextArea
        label="内容（URL・テキスト）"
        onChange={setValue}
        rows={4}
        sample={sampleQr}
        value={value}
      />
      <div className="toolbar">
        <Segmented
          label="誤り訂正レベル"
          onChange={setEcc}
          options={eccOptions}
          value={ecc}
        />
        <Segmented
          label="余白（セル数）"
          onChange={setBorder}
          options={[
            { value: "4", label: "4（標準）" },
            { value: "2", label: "2" },
            { value: "0", label: "なし" },
          ]}
          value={border}
        />
        <Segmented
          label="PNGサイズ"
          onChange={setPixels}
          options={[
            { value: "256", label: "256px" },
            { value: "512", label: "512px" },
            { value: "1024", label: "1024px" },
          ]}
          value={pixels}
        />
        <fieldset className="checkGroup">
          <legend>色</legend>
          <label className="colorField">
            <input
              onChange={(event) => setForeground(event.target.value)}
              type="color"
              value={foreground}
            />
            前景
          </label>
          <label className="colorField">
            <input
              disabled={transparent}
              onChange={(event) => setBackground(event.target.value)}
              type="color"
              value={background}
            />
            背景
          </label>
          <label className="check">
            <input
              checked={transparent}
              onChange={(event) => setTransparent(event.target.checked)}
              type="checkbox"
            />
            背景を透明
          </label>
        </fieldset>
      </div>
      {error ? (
        <Status tone="error">{error}</Status>
      ) : (
        qr && (
          <div className="qrPreview">
            <img alt={`QRコード: ${value}`} src={svgDataUrl(svg)} />
            <div className="field">
              <p className="muted">
                バージョン{qr.version}（{qr.size - Number(border) * 2}×
                {qr.size - Number(border) * 2}
                セル）
              </p>
              <div className="toolbar">
                <ActionButton
                  icon="download"
                  onClick={() => downloadPng(svg, Number(pixels))}
                  variant="primary"
                >
                  PNG保存
                </ActionButton>
                <ActionButton
                  icon="download"
                  onClick={() =>
                    downloadBlob(
                      "qrcode.svg",
                      new Blob([svg], { type: "image/svg+xml" })
                    )
                  }
                >
                  SVG保存
                </ActionButton>
                <CopyButton
                  label="SVGをコピー"
                  value={svg}
                  variant="secondary"
                />
              </div>
            </div>
          </div>
        )
      )}
    </Panel>
  )
}
