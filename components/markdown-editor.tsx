"use client"

import { FC, useEffect, useRef, useState } from "react"
import { Crepe } from "@milkdown/crepe"
import "@milkdown/crepe/theme/common/style.css"
import "@milkdown/crepe/theme/frame.css"
import { ActionButton, Panel, copyText, downloadText } from "components/tools"

const defaultMarkdown = `# Markdown WYSIWYGエディタ

見たままMarkdown文書を編集できるエディタ。「/」でブロックメニューを呼び出せる。

- リスト、表、コードブロックに対応
- **太字**、*斜体*、\`インラインコード\`

## 数式

インライン数式は $E = mc^2$ のように書く。ブロック数式は次の形式。

$$
\\int_0^\\infty e^{-x^2}\\,dx = \\frac{\\sqrt{\\pi}}{2}
$$
`

export const MarkdownEditorTool: FC = () => {
  const rootRef = useRef<HTMLDivElement>(null)
  const [markdown, setMarkdown] = useState(defaultMarkdown)

  useEffect(() => {
    const root = rootRef.current
    if (!root) return

    let destroyed = false
    const crepe = new Crepe({
      root,
      defaultValue: defaultMarkdown,
      featureConfigs: {
        [Crepe.Feature.Placeholder]: {
          text: "「/」でメニューを開く、または本文を入力…",
        },
      },
    })

    crepe.on((listener) => {
      listener.markdownUpdated((_ctx, nextMarkdown) => {
        if (!destroyed) setMarkdown(nextMarkdown)
      })
    })

    void crepe.create()

    return () => {
      destroyed = true
      void crepe.destroy()
    }
  }, [])

  return (
    <Panel title="Markdownエディタ">
      <div className="markdownEditorRoot" ref={rootRef} />
      <div className="resultActions">
        <ActionButton onClick={() => copyText(markdown)} title="Markdownをコピー">
          コピー
        </ActionButton>
        <ActionButton
          onClick={() => downloadText("document.md", markdown)}
          title="Markdownを保存"
        >
          保存
        </ActionButton>
      </div>
      <pre>{markdown}</pre>
    </Panel>
  )
}
