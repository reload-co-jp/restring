"use client"

import { FC, useMemo, useRef, useState } from "react"
import katex from "katex"
import "katex/dist/katex.min.css"
import { ActionButton, Panel, copyText, downloadText } from "components/tools"

type MathMode = "inline" | "block"

type Snippet = {
  label: string
  before: string
  after: string
  title?: string
}

type SnippetGroup = {
  title: string
  snippets: Snippet[]
}

const snippetGroups: SnippetGroup[] = [
  {
    title: "ギリシャ文字",
    snippets: [
      { label: "α", before: "\\alpha", after: "" },
      { label: "β", before: "\\beta", after: "" },
      { label: "γ", before: "\\gamma", after: "" },
      { label: "δ", before: "\\delta", after: "" },
      { label: "ε", before: "\\epsilon", after: "" },
      { label: "θ", before: "\\theta", after: "" },
      { label: "λ", before: "\\lambda", after: "" },
      { label: "μ", before: "\\mu", after: "" },
      { label: "π", before: "\\pi", after: "" },
      { label: "σ", before: "\\sigma", after: "" },
      { label: "φ", before: "\\phi", after: "" },
      { label: "ω", before: "\\omega", after: "" },
      { label: "Γ", before: "\\Gamma", after: "" },
      { label: "Δ", before: "\\Delta", after: "" },
      { label: "Σ", before: "\\Sigma", after: "" },
      { label: "Ω", before: "\\Omega", after: "" },
    ],
  },
  {
    title: "演算子・関係",
    snippets: [
      { label: "±", before: "\\pm", after: "" },
      { label: "×", before: "\\times", after: "" },
      { label: "÷", before: "\\div", after: "" },
      { label: "·", before: "\\cdot", after: "" },
      { label: "≤", before: "\\leq", after: "" },
      { label: "≥", before: "\\geq", after: "" },
      { label: "≠", before: "\\neq", after: "" },
      { label: "≈", before: "\\approx", after: "" },
      { label: "∞", before: "\\infty", after: "" },
    ],
  },
  {
    title: "構造",
    snippets: [
      { label: "分数", before: "\\frac{", after: "}{}", title: "\\frac{分子}{分母}" },
      { label: "累乗", before: "^{", after: "}", title: "x^{n}" },
      { label: "下付き", before: "_{", after: "}", title: "x_{i}" },
      { label: "平方根", before: "\\sqrt{", after: "}", title: "\\sqrt{x}" },
      { label: "n乗根", before: "\\sqrt[n]{", after: "}", title: "\\sqrt[n]{x}" },
    ],
  },
  {
    title: "微積分",
    snippets: [
      { label: "総和", before: "\\sum_{", after: "}^{}", title: "\\sum_{i=1}^{n}" },
      { label: "総積", before: "\\prod_{", after: "}^{}", title: "\\prod_{i=1}^{n}" },
      { label: "積分", before: "\\int_{", after: "}^{}", title: "\\int_{a}^{b}" },
      { label: "極限", before: "\\lim_{", after: " \\to }", title: "\\lim_{x \\to a}" },
      { label: "偏微分", before: "\\partial", after: "", title: "\\partial" },
      { label: "微分", before: "\\frac{d}{d", after: "}", title: "\\frac{d}{dx}" },
    ],
  },
  {
    title: "矢印・論理",
    snippets: [
      { label: "→", before: "\\to", after: "" },
      { label: "⇒", before: "\\Rightarrow", after: "" },
      { label: "∀", before: "\\forall", after: "" },
      { label: "∃", before: "\\exists", after: "" },
      { label: "∈", before: "\\in", after: "" },
      { label: "⊂", before: "\\subset", after: "" },
    ],
  },
  {
    title: "括弧・行列",
    snippets: [
      { label: "( )", before: "\\left(", after: "\\right)", title: "可変サイズ丸括弧" },
      { label: "[ ]", before: "\\left[", after: "\\right]", title: "可変サイズ角括弧" },
      { label: "{ }", before: "\\left\\{", after: "\\right\\}", title: "可変サイズ波括弧" },
      {
        label: "行列",
        before: "\\begin{pmatrix}\n",
        after: "\n\\end{pmatrix}",
        title: "\\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix}",
      },
    ],
  },
]

const defaultTex = "E = mc^2"

export const TexHelperTool: FC = () => {
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const [tex, setTex] = useState(defaultTex)
  const [mode, setMode] = useState<MathMode>("inline")

  const { html, error } = useMemo(() => {
    try {
      return {
        html: katex.renderToString(tex, {
          throwOnError: true,
          displayMode: mode === "block",
        }),
        error: "",
      }
    } catch (err) {
      return { html: "", error: err instanceof Error ? err.message : "数式が不正" }
    }
  }, [tex, mode])

  const insertSnippet = (snippet: Snippet) => {
    const el = textareaRef.current
    const start = el?.selectionStart ?? tex.length
    const end = el?.selectionEnd ?? tex.length
    const selected = tex.slice(start, end)
    const next =
      tex.slice(0, start) + snippet.before + selected + snippet.after + tex.slice(end)
    setTex(next)

    requestAnimationFrame(() => {
      if (!el) return
      el.focus()
      const cursor = start + snippet.before.length + selected.length
      el.setSelectionRange(cursor, cursor)
    })
  }

  const markdown = mode === "inline" ? `$${tex}$` : `$$\n${tex}\n$$`

  return (
    <Panel title="TeX数式入力補助">
      <div className="toolbar">
        <select
          onChange={(event) => setMode(event.target.value as MathMode)}
          value={mode}
        >
          <option value="inline">インライン数式（$…$）</option>
          <option value="block">ブロック数式（$$…$$）</option>
        </select>
      </div>
      <div className="texSnippetGroups">
        {snippetGroups.map((group) => (
          <div className="texSnippetGroup" key={group.title}>
            <span className="texSnippetGroupTitle">{group.title}</span>
            <div className="texSnippetButtons">
              {group.snippets.map((snippet) => (
                <button
                  className="texSnippetButton"
                  key={snippet.label}
                  onClick={() => insertSnippet(snippet)}
                  title={snippet.title ?? `${snippet.before}${snippet.after}`}
                  type="button"
                >
                  {snippet.label}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
      <label className="field">
        <span>TeXコード</span>
        <textarea
          onChange={(event) => setTex(event.target.value)}
          ref={textareaRef}
          rows={4}
          spellCheck={false}
          value={tex}
        />
      </label>
      <div className="texPreview">
        <span className="texPreviewLabel">プレビュー</span>
        <div
          className={mode === "block" ? "texPreviewBlock" : "texPreviewInline"}
          dangerouslySetInnerHTML={{ __html: html }}
        />
        {error && <p className="warn">数式エラー: {error}</p>}
      </div>
      <div className="resultActions">
        <ActionButton onClick={() => copyText(markdown)} title="Markdownをコピー">
          コピー
        </ActionButton>
        <ActionButton
          onClick={() => downloadText("formula.md", markdown)}
          title="Markdownを保存"
        >
          保存
        </ActionButton>
      </div>
      <pre>{markdown}</pre>
    </Panel>
  )
}
