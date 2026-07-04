"use client"

import { ChangeEvent, FC, ReactNode, useMemo, useState } from "react"

type DiffPart = {
  text: string
  type: "same" | "added" | "removed"
}

type CompareUnit = "line" | "word" | "char"
type CompareView = "inline" | "side"
type LineEnding = "LF" | "CRLF" | "CR"
type CaseMode =
  | "upper"
  | "lower"
  | "camel"
  | "pascal"
  | "snake"
  | "kebab"

const normalizeForCompare = (
  value: string,
  options: {
    ignoreWhitespace: boolean
    ignoreLineBreaks: boolean
    ignoreTabs: boolean
    ignoreCase: boolean
  },
) => {
  let result = value

  if (options.ignoreTabs) result = result.replace(/\t/g, "")
  if (options.ignoreLineBreaks) result = result.replace(/\r?\n|\r/g, "")
  if (options.ignoreWhitespace) result = result.replace(/[ \f\v\u00a0]+/g, "")
  if (options.ignoreCase) result = result.toLowerCase()

  return result
}

const tokenize = (value: string, unit: CompareUnit) => {
  if (unit === "line") return value.split(/\r?\n|\r/)
  if (unit === "word") return value.match(/\S+|\s+/g) ?? []
  return Array.from(value)
}

const buildDiff = (left: string[], right: string[]): DiffPart[] => {
  const dp: number[][] = Array.from({ length: left.length + 1 }, () =>
    Array.from({ length: right.length + 1 }, () => 0),
  )

  for (let i = left.length - 1; i >= 0; i -= 1) {
    for (let j = right.length - 1; j >= 0; j -= 1) {
      dp[i][j] =
        left[i] === right[j]
          ? dp[i + 1][j + 1] + 1
          : Math.max(dp[i + 1][j], dp[i][j + 1])
    }
  }

  const parts: DiffPart[] = []
  let i = 0
  let j = 0

  while (i < left.length && j < right.length) {
    if (left[i] === right[j]) {
      parts.push({ text: left[i], type: "same" })
      i += 1
      j += 1
    } else if (dp[i + 1][j] >= dp[i][j + 1]) {
      parts.push({ text: left[i], type: "removed" })
      i += 1
    } else {
      parts.push({ text: right[j], type: "added" })
      j += 1
    }
  }

  while (i < left.length) {
    parts.push({ text: left[i], type: "removed" })
    i += 1
  }

  while (j < right.length) {
    parts.push({ text: right[j], type: "added" })
    j += 1
  }

  return parts
}

const formatPart = (part: DiffPart, unit: CompareUnit) =>
  unit === "line" ? `${part.text}\n` : part.text

const parseJson = (value: string) => {
  try {
    return { data: JSON.parse(value), error: "" }
  } catch (error) {
    return {
      data: null,
      error: error instanceof Error ? error.message : "JSONが不正",
    }
  }
}

const stableJson = (value: unknown): unknown => {
  if (Array.isArray(value)) return value.map(stableJson)
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([key, child]) => [key, stableJson(child)]),
    )
  }
  return value
}

const normalizeText = (value: string) =>
  value
    .normalize("NFC")
    .replace(/[^\S\r\n]+/g, " ")
    .replace(/\r\n|\r/g, "\n")
    .trim()

const visibleText = (value: string) =>
  Array.from(value)
    .map((char) => {
      if (char === " ") return "スペース"
      if (char === "\t") return "Tab"
      if (char === "\r") return "CR"
      if (char === "\n") return "LF\n"
      if (char === "\u00a0") return "NBSP"
      if (char === "\u200b") return "ゼロ幅スペース"
      return char
    })
    .join(" ")

const convertLineEnding = (value: string, ending: LineEnding) => {
  const normalized = value.replace(/\r\n|\r/g, "\n")
  if (ending === "CRLF") return normalized.replace(/\n/g, "\r\n")
  if (ending === "CR") return normalized.replace(/\n/g, "\r")
  return normalized
}

const words = (value: string) =>
  value
    .trim()
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .split(/[\s_-]+/)
    .filter(Boolean)
    .map((word) => word.toLowerCase())

const toCase = (value: string, mode: CaseMode) => {
  const list = words(value)
  const capitalized = list.map((word) => word.charAt(0).toUpperCase() + word.slice(1))

  if (mode === "upper") return value.toUpperCase()
  if (mode === "lower") return value.toLowerCase()
  if (mode === "camel") return [list[0] ?? "", ...capitalized.slice(1)].join("")
  if (mode === "pascal") return capitalized.join("")
  if (mode === "snake") return list.join("_")
  return list.join("-")
}

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;")

const unescapeHtml = (value: string) =>
  value
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, "&")

const encodeUtf8 = (char: string) =>
  Array.from(new TextEncoder().encode(char))
    .map((byte) => byte.toString(16).toUpperCase().padStart(2, "0"))
    .join(" ")

const encodeUtf16 = (char: string) =>
  Array.from({ length: char.length }, (_, index) =>
    char.charCodeAt(index).toString(16).toUpperCase().padStart(4, "0"),
  ).join(" ")

const unicodeBlock = (codePoint: number) => {
  const blocks: Array<[number, number, string]> = [
    [0x0000, 0x007f, "Basic Latin"],
    [0x0080, 0x00ff, "Latin-1 Supplement"],
    [0x0100, 0x017f, "Latin Extended-A"],
    [0x3040, 0x309f, "Hiragana"],
    [0x30a0, 0x30ff, "Katakana"],
    [0x3400, 0x4dbf, "CJK Unified Ideographs Extension A"],
    [0x4e00, 0x9fff, "CJK Unified Ideographs"],
    [0xac00, 0xd7af, "Hangul Syllables"],
    [0x1f300, 0x1f5ff, "Miscellaneous Symbols and Pictographs"],
    [0x1f600, 0x1f64f, "Emoticons"],
  ]
  return blocks.find(([start, end]) => codePoint >= start && codePoint <= end)?.[2] ?? "Unknown"
}

const unicodeName = (char: string, codePoint: number) => {
  const names: Record<string, string> = {
    " ": "SPACE",
    "\t": "CHARACTER TABULATION",
    "\n": "LINE FEED",
    "\r": "CARRIAGE RETURN",
    "\u00a0": "NO-BREAK SPACE",
    "\u200b": "ZERO WIDTH SPACE",
  }
  return names[char] ?? `U+${codePoint.toString(16).toUpperCase().padStart(4, "0")}`
}

const copyText = async (value: string) => {
  await navigator.clipboard.writeText(value)
}

const downloadText = (name: string, value: string) => {
  const blob = new Blob([value], { type: "text/plain;charset=utf-8" })
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = url
  link.download = name
  link.click()
  URL.revokeObjectURL(url)
}

const safeDecodeURIComponent = (value: string) => {
  try {
    return decodeURIComponent(value)
  } catch (error) {
    return error instanceof Error ? error.message : "URLエンコードが不正"
  }
}

const safeBase64Encode = (value: string) => {
  try {
    if (typeof Buffer !== "undefined") {
      return Buffer.from(value, "utf-8").toString("base64")
    }
    return btoa(String.fromCharCode(...new TextEncoder().encode(value)))
  } catch (error) {
    return error instanceof Error ? error.message : "Base64エンコード失敗"
  }
}

const safeBase64Decode = (value: string) => {
  try {
    if (typeof Buffer !== "undefined") {
      return Buffer.from(value, "base64").toString("utf-8")
    }
    const bytes = Uint8Array.from(atob(value), (char) => char.charCodeAt(0))
    return new TextDecoder().decode(bytes)
  } catch (error) {
    return error instanceof Error ? error.message : "Base64が不正"
  }
}

const decodeBase64Url = (value: string) => {
  const base64 = value.replace(/-/g, "+").replace(/_/g, "/")
  const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), "=")

  if (typeof Buffer !== "undefined") {
    return Buffer.from(padded, "base64").toString("utf-8")
  }

  const bytes = Uint8Array.from(atob(padded), (char) => char.charCodeAt(0))
  return new TextDecoder().decode(bytes)
}

const parseJwt = (value: string) => {
  const parts = value.trim().split(".")

  if (parts.length !== 3) {
    return {
      error: "JWTはHeader.Payload.Signatureの3部構成が必要",
      header: "",
      payload: "",
      signature: "",
      claims: [] as Array<[string, string]>,
    }
  }

  try {
    const header = JSON.parse(decodeBase64Url(parts[0]))
    const payload = JSON.parse(decodeBase64Url(parts[1]))
    const now = Math.floor(Date.now() / 1000)
    const claims: Array<[string, string]> = []

    const pushTimeClaim = (key: "exp" | "nbf" | "iat", label: string) => {
      if (typeof payload[key] !== "number") return
      const date = new Date(payload[key] * 1000).toISOString()
      claims.push([label, `${payload[key]} (${date})`])
    }

    pushTimeClaim("exp", "有効期限 exp")
    pushTimeClaim("nbf", "有効開始 nbf")
    pushTimeClaim("iat", "発行時刻 iat")

    if (typeof payload.exp === "number") {
      claims.push(["期限状態", payload.exp < now ? "期限切れ" : "期限内"])
    }
    if (typeof payload.nbf === "number") {
      claims.push(["開始状態", payload.nbf > now ? "まだ有効化前" : "有効化済み"])
    }

    return {
      error: "",
      header: JSON.stringify(header, null, 2),
      payload: JSON.stringify(payload, null, 2),
      signature: parts[2],
      claims,
    }
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "JWT解析失敗",
      header: "",
      payload: "",
      signature: parts[2] ?? "",
      claims: [] as Array<[string, string]>,
    }
  }
}

export const Panel: FC<{ title: string; children: ReactNode }> = ({
  title,
  children,
}) => (
  <section className="panel">
    <h2>{title}</h2>
    {children}
  </section>
)

const ActionButton: FC<{
  children: ReactNode
  onClick: () => void
  title?: string
}> = ({ children, onClick, title }) => (
  <button className="iconButton" onClick={onClick} title={title} type="button">
    {children}
  </button>
)

const Textarea: FC<{
  label: string
  value: string
  onChange: (value: string) => void
  rows?: number
}> = ({ label, value, onChange, rows = 8 }) => (
  <label className="field">
    <span>{label}</span>
    <textarea
      onChange={(event: ChangeEvent<HTMLTextAreaElement>) =>
        onChange(event.target.value)
      }
      rows={rows}
      spellCheck={false}
      value={value}
    />
  </label>
)

const Result: FC<{ name: string; value: string }> = ({ name, value }) => (
  <div className="result">
    <div className="resultActions">
      <ActionButton onClick={() => copyText(value)} title="コピー">
        コピー
      </ActionButton>
      <ActionButton onClick={() => downloadText(name, value)} title="ダウンロード">
        保存
      </ActionButton>
    </div>
    <pre>{value}</pre>
  </div>
)

const useTextDiff = () => {
  const [left, setLeft] = useState("hello\nworld")
  const [right, setRight] = useState("hello\nRestring")
  const [unit, setUnit] = useState<CompareUnit>("line")
  const [view, setView] = useState<CompareView>("inline")
  const [ignoreWhitespace, setIgnoreWhitespace] = useState(false)
  const [ignoreLineBreaks, setIgnoreLineBreaks] = useState(false)
  const [ignoreTabs, setIgnoreTabs] = useState(false)
  const [ignoreCase, setIgnoreCase] = useState(false)

  const normalizedLeft = normalizeForCompare(left, {
    ignoreWhitespace,
    ignoreLineBreaks,
    ignoreTabs,
    ignoreCase,
  })
  const normalizedRight = normalizeForCompare(right, {
    ignoreWhitespace,
    ignoreLineBreaks,
    ignoreTabs,
    ignoreCase,
  })
  const leftTokens = tokenize(normalizedLeft, unit)
  const rightTokens = tokenize(normalizedRight, unit)
  const diff = useMemo(
    () => buildDiff(leftTokens, rightTokens),
    [leftTokens, rightTokens],
  )

  return {
    diff,
    ignoreCase,
    ignoreLineBreaks,
    ignoreTabs,
    ignoreWhitespace,
    left,
    leftTokens,
    right,
    rightTokens,
    setIgnoreCase,
    setIgnoreLineBreaks,
    setIgnoreTabs,
    setIgnoreWhitespace,
    setLeft,
    setRight,
    setUnit,
    setView,
    unit,
    view,
  }
}

export const TextCompareTool: FC = () => {
  const state = useTextDiff()

  return (
    <Panel title="テキスト比較">
      <div className="twoColumn">
        <Textarea label="比較元" onChange={state.setLeft} value={state.left} />
        <Textarea label="比較先" onChange={state.setRight} value={state.right} />
      </div>
      <CompareControls state={state} />
      {state.view === "inline" ? (
        <pre className="diffOutput">
          {state.diff.map((part, index) => (
            <mark className={part.type} key={`${part.type}-${index}`}>
              {formatPart(part, state.unit)}
            </mark>
          ))}
        </pre>
      ) : (
        <div className="twoColumn">
          <pre>{state.leftTokens.join(state.unit === "line" ? "\n" : "")}</pre>
          <pre>{state.rightTokens.join(state.unit === "line" ? "\n" : "")}</pre>
        </div>
      )}
    </Panel>
  )
}

const CompareControls: FC<{ state: ReturnType<typeof useTextDiff> }> = ({
  state,
}) => (
  <div className="toolbar">
    <select onChange={(event) => state.setUnit(event.target.value as CompareUnit)} value={state.unit}>
      <option value="line">行単位</option>
      <option value="word">単語単位</option>
      <option value="char">文字単位</option>
    </select>
    <select onChange={(event) => state.setView(event.target.value as CompareView)} value={state.view}>
      <option value="inline">インライン表示</option>
      <option value="side">左右表示</option>
    </select>
    <label><input checked={state.ignoreWhitespace} onChange={(event) => state.setIgnoreWhitespace(event.target.checked)} type="checkbox" />スペース無視</label>
    <label><input checked={state.ignoreLineBreaks} onChange={(event) => state.setIgnoreLineBreaks(event.target.checked)} type="checkbox" />改行無視</label>
    <label><input checked={state.ignoreTabs} onChange={(event) => state.setIgnoreTabs(event.target.checked)} type="checkbox" />タブ無視</label>
    <label><input checked={state.ignoreCase} onChange={(event) => state.setIgnoreCase(event.target.checked)} type="checkbox" />大文字小文字無視</label>
  </div>
)

export const JsonCompareTool: FC = () => {
  const [left, setLeft] = useState('{"name":"Restring","tools":["diff"]}')
  const [right, setRight] = useState('{"tools":["diff"],"name":"Restring"}')
  const leftJson = parseJson(left)
  const rightJson = parseJson(right)
  const prettyLeft = leftJson.error ? leftJson.error : JSON.stringify(leftJson.data, null, 2)
  const prettyRight = rightJson.error ? rightJson.error : JSON.stringify(rightJson.data, null, 2)
  const jsonEqual =
    !leftJson.error &&
    !rightJson.error &&
    JSON.stringify(stableJson(leftJson.data)) ===
      JSON.stringify(stableJson(rightJson.data))

  return (
    <Panel title="JSON比較">
      <div className="twoColumn">
        <Textarea label="JSON A" onChange={setLeft} value={left} />
        <Textarea label="JSON B" onChange={setRight} value={right} />
      </div>
      <p className={jsonEqual ? "ok" : "warn"}>
        {leftJson.error || rightJson.error
          ? "JSONが不正"
          : jsonEqual
            ? "構造一致"
            : "構造不一致"}
      </p>
      <div className="twoColumn">
        <pre>{prettyLeft}</pre>
        <pre>{prettyRight}</pre>
      </div>
    </Panel>
  )
}

export const JwtDecoderTool: FC = () => {
  const [value, setValue] = useState(
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IlJlc3RyaW5nIiwiaWF0IjoxNTE2MjM5MDIyLCJleHAiOjQxMDI0NDQ4MDB9.signature",
  )
  const result = parseJwt(value)

  return (
    <Panel title="JWT解析">
      <Textarea label="JWT" onChange={setValue} value={value} />
      <p className="warn">署名検証は行わない。HeaderとPayloadのデコード専用。</p>
      {result.error ? (
        <pre>{result.error}</pre>
      ) : (
        <>
          {result.claims.length > 0 && (
            <div className="claimList">
              {result.claims.map(([label, text]) => (
                <div className="claimItem" key={label}>
                  <strong>{label}</strong>
                  <span>{text}</span>
                </div>
              ))}
            </div>
          )}
          <div className="twoColumn">
            <Result name="jwt-header.json" value={result.header} />
            <Result name="jwt-payload.json" value={result.payload} />
          </div>
          <Result name="jwt-signature.txt" value={result.signature} />
        </>
      )}
    </Panel>
  )
}

export const TextDiffTool: FC = () => {
  const state = useTextDiff()
  const changedOnly = state.diff.filter((part) => part.type !== "same")

  return (
    <Panel title="テキスト差分">
      <div className="twoColumn">
        <Textarea label="比較元" onChange={state.setLeft} value={state.left} />
        <Textarea label="比較先" onChange={state.setRight} value={state.right} />
      </div>
      <CompareControls state={state} />
      <pre>
        {changedOnly.length === 0
          ? "差分なし"
          : changedOnly.map((part) => `${part.type === "added" ? "追加" : "削除"}: ${part.text}`).join("\n")}
      </pre>
    </Panel>
  )
}

export const TextNormalizeTool: FC = () => {
  const [value, setValue] = useState("  Hello   Restring\r\n")
  return (
    <Panel title="テキスト正規化">
      <Textarea label="入力" onChange={setValue} value={value} />
      <Result name="normalized.txt" value={normalizeText(value)} />
    </Panel>
  )
}

export const InvisibleCharacterViewerTool: FC = () => {
  const [value, setValue] = useState("Hello\t world\u00a0\u200b\n")
  return (
    <Panel title="不可視文字ビューア">
      <Textarea label="入力" onChange={setValue} value={value} />
      <Result name="visible.txt" value={visibleText(value)} />
    </Panel>
  )
}

export const LineEndingConverterTool: FC = () => {
  const [value, setValue] = useState("Hello\r\nRestring\r\n")
  const [lineEnding, setLineEnding] = useState<LineEnding>("LF")
  return (
    <Panel title="改行コード変換">
      <Textarea label="入力" onChange={setValue} value={value} />
      <div className="toolbar">
        <select onChange={(event) => setLineEnding(event.target.value as LineEnding)} value={lineEnding}>
          <option value="LF">LF</option>
          <option value="CRLF">CRLF</option>
          <option value="CR">CR</option>
        </select>
      </div>
      <Result name="line-ending.txt" value={convertLineEnding(value, lineEnding)} />
    </Panel>
  )
}

export const CaseConverterTool: FC = () => {
  const [value, setValue] = useState("hello Restring tool")
  const [caseMode, setCaseMode] = useState<CaseMode>("camel")
  return (
    <Panel title="ケース変換">
      <Textarea label="入力" onChange={setValue} value={value} />
      <div className="toolbar">
        <select onChange={(event) => setCaseMode(event.target.value as CaseMode)} value={caseMode}>
          <option value="upper">UPPERCASE</option>
          <option value="lower">lowercase</option>
          <option value="camel">camelCase</option>
          <option value="pascal">PascalCase</option>
          <option value="snake">snake_case</option>
          <option value="kebab">kebab-case</option>
        </select>
      </div>
      <Result name="case.txt" value={toCase(value, caseMode)} />
    </Panel>
  )
}

export const UrlEncodeDecodeTool: FC = () => {
  const [value, setValue] = useState("hello Restring?x=1&y=2")
  return (
    <Panel title="URLエンコード・デコード">
      <Textarea label="入力" onChange={setValue} value={value} />
      <Result name="url-encoded.txt" value={encodeURIComponent(value)} />
      <Result name="url-decoded.txt" value={safeDecodeURIComponent(value)} />
    </Panel>
  )
}

export const Base64Tool: FC = () => {
  const [value, setValue] = useState("hello Restring")
  return (
    <Panel title="Base64">
      <Textarea label="入力" onChange={setValue} value={value} />
      <Result name="base64-encoded.txt" value={safeBase64Encode(value)} />
      <Result name="base64-decoded.txt" value={safeBase64Decode(value)} />
    </Panel>
  )
}

export const HtmlEscapeTool: FC = () => {
  const [value, setValue] = useState('<a href="/Restring">hello</a>')
  return (
    <Panel title="HTMLエスケープ">
      <Textarea label="入力" onChange={setValue} value={value} />
      <Result name="html-escaped.txt" value={escapeHtml(value)} />
      <Result name="html-unescaped.txt" value={unescapeHtml(value)} />
    </Panel>
  )
}

export const UnicodeInspectorTool: FC = () => {
  const [value, setValue] = useState("Aあ😀")
  const rows = Array.from(value).map((char, index) => {
    const codePoint = char.codePointAt(0) ?? 0
    return {
      block: unicodeBlock(codePoint),
      codePoint: `U+${codePoint.toString(16).toUpperCase().padStart(4, "0")}`,
      char,
      index,
      name: unicodeName(char, codePoint),
      utf8: encodeUtf8(char),
      utf16: encodeUtf16(char),
      utf32: codePoint.toString(16).toUpperCase().padStart(8, "0"),
    }
  })

  return (
    <Panel title="Unicodeインスペクタ">
      <Textarea label="入力" onChange={setValue} value={value} />
      <div className="unicodeList">
        {rows.map((row) => (
          <div className="unicodeRow" key={`${row.index}-${row.codePoint}`}>
            <strong>{row.char === "\n" ? "LF" : row.char === " " ? "スペース" : row.char}</strong>
            <span>{row.codePoint}</span>
            <span>{row.name}</span>
            <span>UTF-8 {row.utf8}</span>
            <span>UTF-16 {row.utf16}</span>
            <span>UTF-32 {row.utf32}</span>
            <span>{row.block}</span>
          </div>
        ))}
      </div>
    </Panel>
  )
}
