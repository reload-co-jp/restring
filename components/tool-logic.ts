export type DiffPart = {
  text: string
  type: "same" | "added" | "removed"
}

export type CompareUnit = "line" | "word" | "char"
export type CompareView = "inline" | "side"
export type LineEnding = "LF" | "CRLF" | "CR"
export type CaseMode =
  | "upper"
  | "lower"
  | "camel"
  | "pascal"
  | "snake"
  | "kebab"

export const normalizeForCompare = (
  value: string,
  options: {
    ignoreWhitespace: boolean
    ignoreLineBreaks: boolean
    ignoreTabs: boolean
    ignoreCase: boolean
  }
) => {
  let result = value

  if (options.ignoreTabs) result = result.replace(/\t/g, "")
  if (options.ignoreLineBreaks) result = result.replace(/\r?\n|\r/g, "")
  if (options.ignoreWhitespace) result = result.replace(/[ \f\v\u00a0]+/g, "")
  if (options.ignoreCase) result = result.toLowerCase()

  return result
}

export const tokenize = (value: string, unit: CompareUnit) => {
  if (unit === "line") return value.split(/\r?\n|\r/)
  if (unit === "word") return value.match(/\S+|\s+/g) ?? []
  return Array.from(value)
}

export const buildDiff = (left: string[], right: string[]): DiffPart[] => {
  const dp: number[][] = Array.from({ length: left.length + 1 }, () =>
    Array.from({ length: right.length + 1 }, () => 0)
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

export const formatPart = (part: DiffPart, unit: CompareUnit) =>
  unit === "line" ? `${part.text}\n` : part.text

export const parseJson = (value: string) => {
  try {
    return { data: JSON.parse(value), error: "" }
  } catch (error) {
    return {
      data: null,
      error: error instanceof Error ? error.message : "JSONが不正",
    }
  }
}

export const stableJson = (value: unknown): unknown => {
  if (Array.isArray(value)) return value.map(stableJson)
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([key, child]) => [key, stableJson(child)])
    )
  }
  return value
}

export const normalizeText = (value: string) =>
  value
    .normalize("NFC")
    .replace(/[^\S\r\n]+/g, " ")
    .replace(/\r\n|\r/g, "\n")
    .trim()

export const visibleText = (value: string) =>
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

export const convertLineEnding = (value: string, ending: LineEnding) => {
  const normalized = value.replace(/\r\n|\r/g, "\n")
  if (ending === "CRLF") return normalized.replace(/\n/g, "\r\n")
  if (ending === "CR") return normalized.replace(/\n/g, "\r")
  return normalized
}

export const words = (value: string) =>
  value
    .trim()
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .split(/[\s_-]+/)
    .filter(Boolean)
    .map((word) => word.toLowerCase())

export const toCase = (value: string, mode: CaseMode) => {
  const list = words(value)
  const capitalized = list.map(
    (word) => word.charAt(0).toUpperCase() + word.slice(1)
  )

  if (mode === "upper") return value.toUpperCase()
  if (mode === "lower") return value.toLowerCase()
  if (mode === "camel") return [list[0] ?? "", ...capitalized.slice(1)].join("")
  if (mode === "pascal") return capitalized.join("")
  if (mode === "snake") return list.join("_")
  return list.join("-")
}

export const escapeHtml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;")

export const unescapeHtml = (value: string) =>
  value
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, "&")

export const encodeUtf8 = (char: string) =>
  Array.from(new TextEncoder().encode(char))
    .map((byte) => byte.toString(16).toUpperCase().padStart(2, "0"))
    .join(" ")

export const encodeUtf16 = (char: string) =>
  Array.from({ length: char.length }, (_, index) =>
    char.charCodeAt(index).toString(16).toUpperCase().padStart(4, "0")
  ).join(" ")

export const unicodeBlock = (codePoint: number) => {
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
  return (
    blocks.find(
      ([start, end]) => codePoint >= start && codePoint <= end
    )?.[2] ?? "Unknown"
  )
}

export const unicodeName = (char: string, codePoint: number) => {
  const names: Record<string, string> = {
    " ": "SPACE",
    "\t": "CHARACTER TABULATION",
    "\n": "LINE FEED",
    "\r": "CARRIAGE RETURN",
    "\u00a0": "NO-BREAK SPACE",
    "\u200b": "ZERO WIDTH SPACE",
  }
  return (
    names[char] ?? `U+${codePoint.toString(16).toUpperCase().padStart(4, "0")}`
  )
}

export const copyText = async (value: string) => {
  await navigator.clipboard.writeText(value)
}

export const downloadText = (name: string, value: string) =>
  downloadBlob(name, new Blob([value], { type: "text/plain;charset=utf-8" }))

export const downloadBlob = (name: string, blob: Blob) => {
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = url
  link.download = name
  link.click()
  URL.revokeObjectURL(url)
}

export type SafeResult = { value: string; error: string }

const attempt = (run: () => string, fallback: string): SafeResult => {
  try {
    return { value: run(), error: "" }
  } catch (error) {
    return {
      value: "",
      error: error instanceof Error ? error.message : fallback,
    }
  }
}

export const safeEncodeURIComponent = (value: string) =>
  attempt(() => encodeURIComponent(value), "URLエンコード失敗")

export const safeDecodeURIComponent = (value: string) =>
  attempt(() => decodeURIComponent(value), "URLエンコードが不正")

export const safeBase64Encode = (value: string) =>
  attempt(() => {
    if (typeof Buffer !== "undefined") {
      return Buffer.from(value, "utf-8").toString("base64")
    }
    return btoa(String.fromCharCode(...new TextEncoder().encode(value)))
  }, "Base64エンコード失敗")

export const safeBase64Decode = (value: string) =>
  attempt(() => {
    if (typeof Buffer !== "undefined") {
      return Buffer.from(value, "base64").toString("utf-8")
    }
    const bytes = Uint8Array.from(atob(value), (char) => char.charCodeAt(0))
    return new TextDecoder().decode(bytes)
  }, "Base64が不正")

export const decodeBase64Url = (value: string) => {
  const base64 = value.replace(/-/g, "+").replace(/_/g, "/")
  const padded = base64.padEnd(
    base64.length + ((4 - (base64.length % 4)) % 4),
    "="
  )

  if (typeof Buffer !== "undefined") {
    return Buffer.from(padded, "base64").toString("utf-8")
  }

  const bytes = Uint8Array.from(atob(padded), (char) => char.charCodeAt(0))
  return new TextDecoder().decode(bytes)
}

export const toBase64Url = (bytes: ArrayBuffer) => {
  const chars = Array.from(new Uint8Array(bytes), (byte) =>
    String.fromCharCode(byte)
  ).join("")
  return btoa(chars).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "")
}

export const parseJwt = (value: string) => {
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
      claims.push([
        "開始状態",
        payload.nbf > now ? "まだ有効化前" : "有効化済み",
      ])
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

export const verifyJwtSignature = async (token: string, secret: string) => {
  const parts = token.trim().split(".")

  if (parts.length !== 3) return "JWTは3部構成が必要"
  if (!secret) return "秘密鍵を入力すると署名検証できる"

  const header = JSON.parse(decodeBase64Url(parts[0]))
  const algorithmMap: Record<string, "SHA-256" | "SHA-384" | "SHA-512"> = {
    HS256: "SHA-256",
    HS384: "SHA-384",
    HS512: "SHA-512",
  }
  const hash = algorithmMap[header.alg]

  if (!hash) {
    return `${header.alg ?? "unknown"} は未対応。対応: HS256 / HS384 / HS512`
  }

  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash },
    false,
    ["sign"]
  )
  const signature = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(`${parts[0]}.${parts[1]}`)
  )

  return toBase64Url(signature) === parts[2] ? "署名一致" : "署名不一致"
}

export const parseFlexibleEpoch = (raw: string) => {
  const trimmed = raw.trim()
  if (trimmed === "") return null

  if (/^-?\d+$/.test(trimmed)) {
    const numeric = Number(trimmed)
    const ms = Math.abs(numeric) >= 1e12 ? numeric : numeric * 1000
    return Number.isNaN(ms) ? null : ms
  }

  const parsed = new Date(trimmed)
  return Number.isNaN(parsed.getTime()) ? null : parsed.getTime()
}

export const formatEpochResult = (ms: number) => ({
  iso: new Date(ms).toISOString(),
  utc: new Date(ms).toUTCString(),
  local: new Date(ms).toLocaleString("ja-JP", { timeZoneName: "short" }),
  seconds: Math.floor(ms / 1000).toString(),
  milliseconds: Math.round(ms).toString(),
})

export type RegexMatch = {
  match: string
  index: number
  groups: Array<string | undefined>
}

export type RegexResult = {
  valid: boolean
  error: string
  matches: RegexMatch[]
  replaced: string
}

export const testRegex = (
  pattern: string,
  flags: string,
  input: string,
  replacement: string
): RegexResult => {
  try {
    const execFlags = flags.includes("g") ? flags : `${flags}g`
    const execRegex = new RegExp(pattern, execFlags)
    const matches: RegexMatch[] = []
    let match: RegExpExecArray | null
    let guard = 0

    while ((match = execRegex.exec(input)) !== null && guard < 1000) {
      matches.push({
        match: match[0],
        index: match.index,
        groups: match.slice(1),
      })
      if (match[0] === "") execRegex.lastIndex += 1
      guard += 1
    }

    const replaceRegex = new RegExp(pattern, execFlags)
    const replaced = input.replace(replaceRegex, replacement)

    return { valid: true, error: "", matches, replaced }
  } catch (error) {
    return {
      valid: false,
      error: error instanceof Error ? error.message : "正規表現が不正",
      matches: [],
      replaced: "",
    }
  }
}

export const locateJsonError = (value: string, message: string) => {
  const positionMatch = message.match(/position (\d+)/)
  if (positionMatch) {
    const position = Number(positionMatch[1])
    const before = value.slice(0, position)
    const lastNewline = before.lastIndexOf("\n")
    return { line: before.split("\n").length, column: position - lastNewline }
  }

  const lineColumnMatch = message.match(/line (\d+) column (\d+)/)
  if (lineColumnMatch) {
    return {
      line: Number(lineColumnMatch[1]),
      column: Number(lineColumnMatch[2]),
    }
  }

  return null
}

export const validateJson = (value: string, indent: number | string = 2) => {
  if (value.trim() === "") {
    return {
      valid: false,
      error: "入力が空",
      formatted: "",
      location: null as ReturnType<typeof locateJsonError>,
    }
  }
  try {
    const data = JSON.parse(value)
    return {
      valid: true,
      error: "",
      formatted: JSON.stringify(data, null, indent),
      location: null as ReturnType<typeof locateJsonError>,
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : "JSONが不正"
    return {
      valid: false,
      error: message,
      formatted: "",
      location: locateJsonError(value, message),
    }
  }
}

export type SqlMode = "select" | "insert" | "update" | "create"

export const formatSqlValue = (raw: string) => {
  const trimmed = raw.trim()
  if (trimmed === "" || /^null$/i.test(trimmed)) return "NULL"
  if (/^-?\d+(\.\d+)?$/.test(trimmed)) return trimmed
  if (/^(true|false)$/i.test(trimmed)) return trimmed.toUpperCase()
  return `'${trimmed.replace(/'/g, "''")}'`
}

export const parseKeyValueLines = (raw: string) =>
  raw
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const index = line.indexOf(":")
      if (index === -1) return null
      return {
        key: line.slice(0, index).trim(),
        value: line.slice(index + 1).trim(),
      }
    })
    .filter((item): item is { key: string; value: string } => item !== null)

export const parseLines = (raw: string) =>
  raw
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)

export const buildSelectSql = (
  table: string,
  columns: string,
  where: string,
  orderBy: string
) => {
  const cols = columns.trim() || "*"
  const whereClauses = parseLines(where)
  const lines = [`SELECT ${cols}`, `FROM ${table.trim() || "table_name"}`]
  if (whereClauses.length > 0)
    lines.push(`WHERE ${whereClauses.join("\n  AND ")}`)
  if (orderBy.trim()) lines.push(`ORDER BY ${orderBy.trim()}`)
  return `${lines.join("\n")};`
}

export const buildInsertSql = (table: string, pairsRaw: string) => {
  const pairs = parseKeyValueLines(pairsRaw)
  const columns = pairs.map((pair) => pair.key).join(", ")
  const values = pairs.map((pair) => formatSqlValue(pair.value)).join(", ")
  return `INSERT INTO ${table.trim() || "table_name"} (${columns})\nVALUES (${values});`
}

export const buildUpdateSql = (
  table: string,
  pairsRaw: string,
  where: string
) => {
  const pairs = parseKeyValueLines(pairsRaw)
  const setClause = pairs
    .map((pair) => `${pair.key} = ${formatSqlValue(pair.value)}`)
    .join(",\n  ")
  const whereClauses = parseLines(where)
  const lines = [`UPDATE ${table.trim() || "table_name"}`, `SET ${setClause}`]
  if (whereClauses.length > 0)
    lines.push(`WHERE ${whereClauses.join("\n  AND ")}`)
  return `${lines.join("\n")};`
}

export const buildCreateTableSql = (table: string, columnDefs: string) => {
  const lines = parseLines(columnDefs)
  const body = lines.map((line) => `  ${line}`).join(",\n")
  return `CREATE TABLE ${table.trim() || "table_name"} (\n${body}\n);`
}

export const fallbackTimeZones = [
  "UTC",
  "Asia/Tokyo",
  "Asia/Shanghai",
  "Asia/Seoul",
  "Asia/Singapore",
  "Asia/Kolkata",
  "Asia/Dubai",
  "Europe/London",
  "Europe/Paris",
  "Europe/Berlin",
  "Europe/Moscow",
  "America/New_York",
  "America/Chicago",
  "America/Denver",
  "America/Los_Angeles",
  "America/Sao_Paulo",
  "Australia/Sydney",
  "Pacific/Auckland",
]

export const getAllTimeZones = (): string[] => {
  if (typeof Intl.supportedValuesOf === "function") {
    try {
      return Intl.supportedValuesOf("timeZone")
    } catch {
      return fallbackTimeZones
    }
  }
  return fallbackTimeZones
}

export const formatInTimeZone = (date: Date, timeZone: string) => {
  try {
    return new Intl.DateTimeFormat("ja-JP", {
      timeZone,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
      timeZoneName: "shortOffset",
    }).format(date)
  } catch {
    return "不明なタイムゾーン"
  }
}

export type JsonDiff = {
  path: string
  type: "added" | "removed" | "changed"
  left?: unknown
  right?: unknown
}

const isObject = (value: unknown): value is Record<string, unknown> =>
  Boolean(value) && typeof value === "object" && !Array.isArray(value)

// キー順を無視した構造差分。配列は添字単位で比較。
export const diffJson = (
  left: unknown,
  right: unknown,
  path = "$"
): JsonDiff[] => {
  if (isObject(left) && isObject(right)) {
    const keys = Array.from(
      new Set([...Object.keys(left), ...Object.keys(right)])
    ).sort()
    return keys.flatMap((key) => {
      const childPath = /^[A-Za-z_$][\w$]*$/.test(key)
        ? `${path}.${key}`
        : `${path}[${JSON.stringify(key)}]`
      if (!(key in right))
        return [{ path: childPath, type: "removed" as const, left: left[key] }]
      if (!(key in left))
        return [{ path: childPath, type: "added" as const, right: right[key] }]
      return diffJson(left[key], right[key], childPath)
    })
  }
  if (Array.isArray(left) && Array.isArray(right)) {
    return Array.from(
      { length: Math.max(left.length, right.length) },
      (_, index) => {
        const childPath = `${path}[${index}]`
        if (index >= right.length)
          return [
            { path: childPath, type: "removed" as const, left: left[index] },
          ]
        if (index >= left.length)
          return [
            { path: childPath, type: "added" as const, right: right[index] },
          ]
        return diffJson(left[index], right[index], childPath)
      }
    ).flat()
  }
  return JSON.stringify(left) === JSON.stringify(right)
    ? []
    : [{ path, type: "changed", left, right }]
}

/* ---------- 文字数カウント ---------- */

const segment = (value: string, granularity: "grapheme" | "word") =>
  Array.from(new Intl.Segmenter("ja", { granularity }).segment(value))

export const countText = (value: string) => {
  const graphemes = segment(value, "grapheme")
  return {
    graphemes: graphemes.length,
    withoutSpaces: graphemes.filter((item) => !/^\s+$/.test(item.segment))
      .length,
    codePoints: Array.from(value).length,
    utf16: value.length,
    utf8Bytes: new TextEncoder().encode(value).length,
    shiftJisBytes: encodeText(value, "shift_jis").bytes.length,
    lines: value === "" ? 0 : value.split(/\r\n|\r|\n/).length,
    words: segment(value, "word").filter((item) => item.isWordLike).length,
  }
}

/* ---------- 文字コード ---------- */

export type TextEncodingName = "utf-8" | "shift_jis" | "euc-jp" | "windows-1252"

export const textEncodings: Array<{ value: TextEncodingName; label: string }> =
  [
    { value: "utf-8", label: "UTF-8" },
    { value: "shift_jis", label: "Shift_JIS" },
    { value: "euc-jp", label: "EUC-JP" },
    { value: "windows-1252", label: "Windows-1252" },
  ]

// ブラウザのTextDecoderで全バイト列を復号し、逆引き表を作る（TextEncoderはUTF-8専用のため）
const encodeTables = new Map<TextEncodingName, Map<string, number[]>>()

const byteRange = (from: number, to: number) =>
  Array.from({ length: to - from + 1 }, (_, index) => from + index)

const encodeTable = (encoding: Exclude<TextEncodingName, "utf-8">) => {
  const cached = encodeTables.get(encoding)
  if (cached) return cached
  const table = new Map<string, number[]>()
  const decoder = new TextDecoder(encoding, { fatal: true })
  const add = (bytes: number[]) => {
    try {
      const char = decoder.decode(new Uint8Array(bytes))
      if (!table.has(char)) table.set(char, bytes)
    } catch {
      // 未定義のバイト列
    }
  }
  if (encoding === "windows-1252") {
    byteRange(0x00, 0xff).forEach((byte) => add([byte]))
  } else {
    byteRange(0x00, 0x7f).forEach((byte) => add([byte]))
  }
  if (encoding === "shift_jis") {
    byteRange(0xa1, 0xdf).forEach((byte) => add([byte]))
    // 0xED・0xEEはIBM拡張文字（0xFA〜0xFC）と重複するため、WHATWGの符号化と同じく使わない
    const leads = [
      ...byteRange(0x81, 0x9f),
      ...byteRange(0xe0, 0xec),
      ...byteRange(0xef, 0xfc),
    ]
    const trails = [...byteRange(0x40, 0x7e), ...byteRange(0x80, 0xfc)]
    leads.forEach((lead) => trails.forEach((trail) => add([lead, trail])))
  }
  if (encoding === "euc-jp") {
    byteRange(0xa1, 0xdf).forEach((byte) => add([0x8e, byte]))
    byteRange(0xa1, 0xfe).forEach((lead) =>
      byteRange(0xa1, 0xfe).forEach((trail) => add([lead, trail]))
    )
  }
  encodeTables.set(encoding, table)
  return table
}

// 変換できない文字は「?」（0x3F）に置き換え、unmappableに集める
export const encodeText = (value: string, encoding: TextEncodingName) => {
  if (encoding === "utf-8") {
    return {
      bytes: Array.from(new TextEncoder().encode(value)),
      unmappable: [] as string[],
    }
  }
  const table = encodeTable(encoding)
  const bytes: number[] = []
  const unmappable: string[] = []
  for (const char of value) {
    const encoded = table.get(char)
    if (encoded) {
      bytes.push(...encoded)
    } else {
      bytes.push(0x3f)
      unmappable.push(char)
    }
  }
  return { bytes, unmappable }
}

export const decodeBytes = (
  bytes: number[],
  encoding: TextEncodingName,
  fatal = false
) => new TextDecoder(encoding, { fatal }).decode(new Uint8Array(bytes))

export const toHex = (bytes: ArrayLike<number> | ArrayBuffer) =>
  Array.from(
    bytes instanceof ArrayBuffer ? new Uint8Array(bytes) : bytes,
    (byte) => byte.toString(16).padStart(2, "0")
  ).join("")

// 「e3 81 82」「%E3%81%82」「0xe3,0x81」「\xe3\x81」などの16進表記を受け付ける
export const parseHexBytes = (raw: string) => {
  const hex = raw.replace(/0x|\\x|%|[\s,:]/gi, "")
  if (!/^[0-9a-f]*$/i.test(hex))
    throw new Error("16進数以外の文字が含まれている")
  if (hex.length % 2 !== 0) throw new Error("16進数の桁数が奇数")
  return Array.from({ length: hex.length / 2 }, (_, index) =>
    parseInt(hex.slice(index * 2, index * 2 + 2), 16)
  )
}

// 文字化けした文字列を「誤って解釈された文字コード」で符号化し直し、「本来の文字コード」で復号する
export const repairMojibake = (value: string) =>
  textEncodings.flatMap((wrong) =>
    textEncodings.flatMap((right) => {
      if (wrong.value === right.value) return []
      const { bytes, unmappable } = encodeText(value, wrong.value)
      if (unmappable.length > 0) return []
      try {
        const repaired = decodeBytes(bytes, right.value, true)
        // C1制御文字や置換文字を含む結果は復元失敗とみなす
        return repaired === value || /[\u0080-\u009f\ufffd]/.test(repaired)
          ? []
          : [{ wrong: wrong.label, right: right.label, value: repaired }]
      } catch {
        return []
      }
    })
  )

/* ---------- ハッシュ ---------- */

export type HashAlgorithm = "MD5" | "SHA-1" | "SHA-256" | "SHA-384" | "SHA-512"

export const hashAlgorithms: HashAlgorithm[] = [
  "MD5",
  "SHA-1",
  "SHA-256",
  "SHA-384",
  "SHA-512",
]

const md5Shifts = [7, 12, 17, 22, 5, 9, 14, 20, 4, 11, 16, 23, 6, 10, 15, 21]
const md5Constants = Array.from(
  { length: 64 },
  (_, index) => Math.floor(Math.abs(Math.sin(index + 1)) * 2 ** 32) >>> 0
)

// Web Crypto APIはMD5に非対応のため、RFC 1321に沿って実装
export const md5 = (data: Uint8Array) => {
  const padded = new Uint8Array((((data.length + 8) >> 6) + 1) * 64)
  padded.set(data)
  padded[data.length] = 0x80
  const view = new DataView(padded.buffer)
  view.setUint32(padded.length - 8, (data.length * 8) >>> 0, true)
  view.setUint32(padded.length - 4, Math.floor(data.length / 2 ** 29), true)
  const state = [0x67452301, 0xefcdab89, 0x98badcfe, 0x10325476]
  for (let offset = 0; offset < padded.length; offset += 64) {
    let [a, b, c, d] = state
    for (let index = 0; index < 64; index++) {
      const round = index >> 4
      const f = [
        (b & c) | (~b & d),
        (d & b) | (~d & c),
        b ^ c ^ d,
        c ^ (b | ~d),
      ][round]
      const word = [
        index,
        (5 * index + 1) % 16,
        (3 * index + 5) % 16,
        (7 * index) % 16,
      ][round]
      const sum =
        (a +
          f +
          md5Constants[index] +
          view.getUint32(offset + word * 4, true)) |
        0
      const shift = md5Shifts[round * 4 + (index % 4)]
      ;[a, d, c] = [d, c, b]
      b = (b + ((sum << shift) | (sum >>> (32 - shift)))) | 0
    }
    state[0] = (state[0] + a) | 0
    state[1] = (state[1] + b) | 0
    state[2] = (state[2] + c) | 0
    state[3] = (state[3] + d) | 0
  }
  const output = new DataView(new ArrayBuffer(16))
  state.forEach((value, index) => output.setUint32(index * 4, value, true))
  return toHex(output.buffer)
}

export const hashText = async (value: string, algorithm: HashAlgorithm) => {
  const data = new TextEncoder().encode(value)
  return algorithm === "MD5"
    ? md5(data)
    : toHex(await crypto.subtle.digest(algorithm, data))
}

/* ---------- 行の並べ替え ---------- */

export type LineOrder = "none" | "asc" | "desc" | "reverse"

export type LineOptions = {
  order: LineOrder
  unique: boolean
  removeEmpty: boolean
  trim: boolean
  ignoreCase: boolean
  natural: boolean
}

export const processLines = (value: string, options: LineOptions) => {
  let lines = value === "" ? [] : value.split(/\r\n|\r|\n/)
  if (options.trim) lines = lines.map((line) => line.trim())
  if (options.removeEmpty) lines = lines.filter((line) => line.trim() !== "")
  if (options.unique) {
    const seen = new Set<string>()
    lines = lines.filter((line) => {
      const key = options.ignoreCase ? line.toLowerCase() : line
      if (seen.has(key)) return false
      seen.add(key)
      return true
    })
  }
  const collator = new Intl.Collator("ja", {
    numeric: options.natural,
    sensitivity: options.ignoreCase ? "accent" : "variant",
  })
  if (options.order === "asc") lines.sort(collator.compare)
  if (options.order === "desc") lines.sort((a, b) => collator.compare(b, a))
  if (options.order === "reverse") lines.reverse()
  return lines
}

/* ---------- cron ---------- */

type CronField = { label: string; min: number; max: number; names?: string[] }

const cronFields: CronField[] = [
  { label: "分", min: 0, max: 59 },
  { label: "時", min: 0, max: 23 },
  { label: "日", min: 1, max: 31 },
  {
    label: "月",
    min: 1,
    max: 12,
    names: [
      "JAN",
      "FEB",
      "MAR",
      "APR",
      "MAY",
      "JUN",
      "JUL",
      "AUG",
      "SEP",
      "OCT",
      "NOV",
      "DEC",
    ],
  },
  {
    label: "曜日",
    min: 0,
    max: 7,
    names: ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"],
  },
]

const cronMacros: Record<string, string> = {
  "@yearly": "0 0 1 1 *",
  "@annually": "0 0 1 1 *",
  "@monthly": "0 0 1 * *",
  "@weekly": "0 0 * * 0",
  "@daily": "0 0 * * *",
  "@midnight": "0 0 * * *",
  "@hourly": "0 * * * *",
}

const weekdayLabels = ["日", "月", "火", "水", "木", "金", "土"]

const parseCronField = (raw: string, field: CronField) => {
  const values = new Set<number>()
  const toNumber = (token: string) => {
    const nameIndex = field.names?.indexOf(token.toUpperCase()) ?? -1
    const value =
      nameIndex >= 0
        ? nameIndex + field.min
        : /^\d+$/.test(token)
          ? Number(token)
          : NaN
    if (!(value >= field.min && value <= field.max)) {
      throw new Error(
        `${field.label}の値「${token}」は${field.min}〜${field.max}の範囲外`
      )
    }
    return value
  }
  for (const part of raw.split(",")) {
    const match = part.match(/^(\*|\w+(?:-\w+)?)(?:\/(\d+))?$/)
    if (!match) throw new Error(`${field.label}の指定「${part}」が不正`)
    const step = match[2] ? Number(match[2]) : 1
    const [start, end = match[2] ? field.max : start] =
      match[1] === "*"
        ? [field.min, field.max]
        : match[1].split("-").map(toNumber)
    if (step < 1 || start > end)
      throw new Error(`${field.label}の指定「${part}」が不正`)
    for (let value = start; value <= end; value += step) values.add(value)
  }
  return values
}

export const parseCron = (expression: string) => {
  const trimmed = expression.trim()
  const parts = (cronMacros[trimmed.toLowerCase()] ?? trimmed).split(/\s+/)
  if (parts.length !== 5)
    throw new Error("5つのフィールド（分 時 日 月 曜日）を空白区切りで指定")
  const [minute, hour, day, month, weekday] = parts.map((part, index) =>
    parseCronField(part, cronFields[index])
  )
  if (weekday.has(7)) weekday.add(0)
  weekday.delete(7)
  // 日と曜日の両方を指定した場合はどちらかに一致すれば実行（Vixie cronの挙動）
  const dayStar = parts[2].startsWith("*")
  const weekdayStar = parts[4].startsWith("*")
  const matchesDay = (date: Date) => {
    const dayMatch = day.has(date.getDate())
    const weekdayMatch = weekday.has(date.getDay())
    if (dayStar || weekdayStar) return dayMatch && weekdayMatch
    return dayMatch || weekdayMatch
  }
  return { parts, minute, hour, day, month, weekday, matchesDay }
}

export const describeCron = (expression: string) => {
  const cron = parseCron(expression)
  const sets = [cron.minute, cron.hour, cron.day, cron.month, cron.weekday]
  return cronFields.map((field, index) => {
    const values = Array.from(sets[index]).sort((a, b) => a - b)
    const isAll =
      values.length === (index === 4 ? 7 : field.max - field.min + 1)
    return {
      label: field.label,
      raw: cron.parts[index],
      value: isAll
        ? "すべて"
        : values
            .map((value) =>
              index === 4 ? weekdayLabels[value] : String(value)
            )
            .join(", "),
    }
  })
}

// ブラウザのローカルタイムゾーンで計算。一致しない式でも終わるよう探索は5年先まで
export const nextCronRuns = (expression: string, from: Date, count: number) => {
  const cron = parseCron(expression)
  const date = new Date(from)
  date.setSeconds(0, 0)
  date.setMinutes(date.getMinutes() + 1)
  const limit = new Date(from)
  limit.setFullYear(limit.getFullYear() + 5)
  const runs: Date[] = []
  while (runs.length < count && date < limit) {
    if (!cron.month.has(date.getMonth() + 1)) {
      date.setMonth(date.getMonth() + 1, 1)
      date.setHours(0, 0, 0, 0)
    } else if (!cron.matchesDay(date)) {
      date.setDate(date.getDate() + 1)
      date.setHours(0, 0, 0, 0)
    } else if (!cron.hour.has(date.getHours())) {
      date.setHours(date.getHours() + 1, 0, 0, 0)
    } else if (!cron.minute.has(date.getMinutes())) {
      date.setMinutes(date.getMinutes() + 1, 0, 0)
    } else {
      runs.push(new Date(date))
      date.setMinutes(date.getMinutes() + 1)
    }
  }
  return runs
}

/* ---------- XML ---------- */

// DOMのNodeと互換。テストではプレーンなオブジェクトを渡す
export type XmlNodeLike = {
  nodeType: number
  nodeName: string
  nodeValue: string | null
  childNodes: ArrayLike<XmlNodeLike>
  attributes?: ArrayLike<{ name: string; value: string }> | null
  publicId?: string
  systemId?: string
}

const escapeXmlText = (value: string) =>
  value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")

const escapeXmlAttribute = (value: string) =>
  escapeXmlText(value).replace(/"/g, "&quot;")

// ponytail: 空白のみのテキストを捨て、テキストの前後空白を削るため、混在内容（<p>a <b>b</b></p>）の空白は保持しない
export const formatXml = (
  node: XmlNodeLike,
  indent: string,
  declaration = ""
) => {
  const lines: string[] = []
  const walk = (current: XmlNodeLike, depth: number) => {
    const pad = indent.repeat(depth)
    const children = Array.from(current.childNodes).filter(
      (child) =>
        !(child.nodeType === 3 && (child.nodeValue ?? "").trim() === "")
    )
    switch (current.nodeType) {
      case 2:
        lines.push(
          `${pad}${current.nodeName}="${escapeXmlAttribute(current.nodeValue ?? "")}"`
        )
        return
      case 3:
        lines.push(pad + escapeXmlText((current.nodeValue ?? "").trim()))
        return
      case 4:
        lines.push(`${pad}<![CDATA[${current.nodeValue}]]>`)
        return
      case 7:
        lines.push(`${pad}<?${current.nodeName} ${current.nodeValue}?>`)
        return
      case 8:
        lines.push(`${pad}<!--${current.nodeValue}-->`)
        return
      case 9:
        children.forEach((child) => walk(child, depth))
        return
      case 10: {
        const external = current.publicId
          ? ` PUBLIC "${current.publicId}" "${current.systemId}"`
          : current.systemId
            ? ` SYSTEM "${current.systemId}"`
            : ""
        lines.push(`${pad}<!DOCTYPE ${current.nodeName}${external}>`)
        return
      }
    }
    const attributes = Array.from(
      current.attributes ?? [],
      (attribute) =>
        ` ${attribute.name}="${escapeXmlAttribute(attribute.value)}"`
    ).join("")
    const open = `${pad}<${current.nodeName}${attributes}`
    if (children.length === 0) {
      lines.push(`${open}/>`)
    } else if (children.length === 1 && children[0].nodeType === 3) {
      lines.push(
        `${open}>${escapeXmlText((children[0].nodeValue ?? "").trim())}</${current.nodeName}>`
      )
    } else {
      lines.push(`${open}>`)
      children.forEach((child) => walk(child, depth + 1))
      lines.push(`${pad}</${current.nodeName}>`)
    }
  }
  walk(node, 0)
  return [declaration, ...lines].filter(Boolean).join(indent === "" ? "" : "\n")
}

// DOMParserはXML宣言をノードとして残さないため、入力から取り出して整形結果に付け直す
export const xmlDeclaration = (value: string) =>
  value.trimStart().match(/^<\?xml\s[^?]*\?>/)?.[0] ?? ""

// エラーメッセージの形式はブラウザごとに異なる
// Chrome・Safari: "error on line 3 at column 5: ..."
// Firefox: "Line Number 3, Column 5:" / 日本語版 "行番号: 3, 列: 5:"
export const locateXmlError = (message: string) => {
  const match =
    message.match(/line(?: number)?\s*(\d+)\D+?(\d+)/i) ??
    message.match(/行番号[:：]?\s*(\d+)\D+?(\d+)/)
  return match ? { line: Number(match[1]), column: Number(match[2]) } : null
}

/* ---------- データ形式変換 ---------- */

// XMLとオブジェクトの対応は xml2js などと同じ慣習:
// 属性は "@名前"、テキストは "#text"、同名の子要素は配列、テキストのみの要素は文字列
// ponytail: 値はすべて文字列のまま（"1"を数値にしない）。コメント・処理命令は捨てる
const xmlElementToValue = (element: XmlNodeLike): unknown => {
  const result: Record<string, unknown> = {}
  for (const attribute of Array.from(element.attributes ?? [])) {
    result[`@${attribute.name}`] = attribute.value
  }
  let text = ""
  for (const child of Array.from(element.childNodes)) {
    if (child.nodeType === 1) {
      const value = xmlElementToValue(child)
      const existing = result[child.nodeName]
      if (existing === undefined) result[child.nodeName] = value
      else if (Array.isArray(existing)) existing.push(value)
      else result[child.nodeName] = [existing, value]
    } else if (child.nodeType === 3 || child.nodeType === 4) {
      text += child.nodeValue ?? ""
    }
  }
  text = text.trim()
  if (Object.keys(result).length === 0) return text
  if (text !== "") result["#text"] = text
  return result
}

export const xmlToValue = (doc: XmlNodeLike) => {
  const root = Array.from(doc.childNodes).find((node) => node.nodeType === 1)
  if (!root) throw new Error("ルート要素がない")
  return { [root.nodeName]: xmlElementToValue(root) }
}

const isPlainObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value)

const assertXmlName = (name: string) => {
  if (!/^[A-Za-z_][\w.-]*(:[A-Za-z_][\w.-]*)?$/.test(name)) {
    throw new Error(`「${name}」はXMLの名前に使えない`)
  }
  return name
}

export const valueToXml = (value: unknown, indent = "  ") => {
  const lines = ['<?xml version="1.0" encoding="UTF-8"?>']
  const write = (name: string, current: unknown, depth: number) => {
    if (Array.isArray(current)) {
      current.forEach((item) => write(name, item, depth))
      return
    }
    const pad = indent.repeat(depth)
    assertXmlName(name)
    if (current === null || current === undefined || current === "") {
      lines.push(`${pad}<${name}/>`)
      return
    }
    if (!isPlainObject(current)) {
      lines.push(`${pad}<${name}>${escapeXmlText(String(current))}</${name}>`)
      return
    }
    const entries = Object.entries(current)
    const attributes = entries
      .filter(([key]) => key.startsWith("@"))
      .map(
        ([key, item]) =>
          ` ${assertXmlName(key.slice(1))}="${escapeXmlAttribute(String(item))}"`
      )
      .join("")
    const children = entries.filter(
      ([key]) => !key.startsWith("@") && key !== "#text"
    )
    const text =
      "#text" in current ? escapeXmlText(String(current["#text"])) : ""
    if (children.length === 0) {
      lines.push(
        text === ""
          ? `${pad}<${name}${attributes}/>`
          : `${pad}<${name}${attributes}>${text}</${name}>`
      )
      return
    }
    lines.push(`${pad}<${name}${attributes}>`)
    if (text !== "") lines.push(indent.repeat(depth + 1) + text)
    children.forEach(([key, item]) => write(key, item, depth + 1))
    lines.push(`${pad}</${name}>`)
  }
  // ルート要素は1つに限られるため、キーが1つのオブジェクト以外は<root>で包む
  const keys = isPlainObject(value) ? Object.keys(value) : []
  if (
    isPlainObject(value) &&
    keys.length === 1 &&
    !keys[0].startsWith("@") &&
    keys[0] !== "#text" &&
    !Array.isArray(value[keys[0]])
  ) {
    write(keys[0], value[keys[0]], 0)
  } else {
    write("root", Array.isArray(value) ? { item: value } : value, 0)
  }
  return lines.join("\n")
}

// RFC 4180準拠。1行目を見出しとしてオブジェクトの配列にする
export const parseDelimited = (text: string, delimiter: string) => {
  const rows: string[][] = []
  let row: string[] = []
  let field = ""
  let quoted = false
  const source = text.charCodeAt(0) === 0xfeff ? text.slice(1) : text
  for (let index = 0; index < source.length; index++) {
    const char = source[index]
    if (quoted) {
      if (char !== '"') field += char
      else if (source[index + 1] === '"') {
        field += '"'
        index++
      } else quoted = false
    } else if (char === '"' && field === "") {
      quoted = true
    } else if (char === delimiter) {
      row.push(field)
      field = ""
    } else if (char === "\n" || char === "\r") {
      if (char === "\r" && source[index + 1] === "\n") index++
      row.push(field)
      rows.push(row)
      row = []
      field = ""
    } else {
      field += char
    }
  }
  if (quoted) throw new Error('引用符（"）が閉じていない')
  if (field !== "" || row.length > 0) {
    row.push(field)
    rows.push(row)
  }
  const [header, ...body] = rows
  if (!header) return []
  return body.map((cells) =>
    Object.fromEntries(header.map((key, index) => [key, cells[index] ?? ""]))
  )
}

// 入れ子の値はJSON文字列としてセルに入れる
// XMLの<catalog><book>…のような包みを外すため、キーが1つのオブジェクトは中身へ降りて表を探す
export const stringifyDelimited = (value: unknown, delimiter: string) => {
  let table = value
  while (isPlainObject(table) && Object.keys(table).length === 1) {
    const inner = Object.values(table)[0]
    if (typeof inner !== "object" || inner === null) break
    table = inner
  }
  const rows = Array.isArray(table) ? table : [table]
  if (!rows.every(isPlainObject)) {
    throw new Error(
      "CSV・TSVへ変換できるのはオブジェクト、またはオブジェクトの配列"
    )
  }
  const header = Array.from(new Set(rows.flatMap((item) => Object.keys(item))))
  const cell = (item: unknown) => {
    const text =
      item === null || item === undefined
        ? ""
        : typeof item === "object"
          ? JSON.stringify(item)
          : String(item)
    // CSVはRFC 4180どおり「"」を含めば囲む。TSVは慣習に合わせ、解析に必要な場合だけ囲む
    const quote =
      text.includes(delimiter) ||
      /[\r\n]/.test(text) ||
      (delimiter === "," ? text.includes('"') : text.startsWith('"'))
    return quote ? `"${text.replace(/"/g, '""')}"` : text
  }
  return [header, ...rows.map((item) => header.map((key) => item[key]))]
    .map((cells) => cells.map(cell).join(delimiter))
    .join("\n")
}

/* ---------- QRコード ---------- */

// 暗いモジュールを行ごとに連続した横長の矩形へまとめ、パスを短くする
// background が空なら背景は透明
export const qrToSvg = (
  modules: boolean[][],
  foreground: string,
  background: string
) => {
  const size = modules.length
  const path = modules
    .flatMap((row, y) => {
      const runs: string[] = []
      for (let x = 0; x < row.length; x++) {
        if (!row[x]) continue
        const start = x
        while (row[x + 1]) x++
        const width = x - start + 1
        runs.push(`M${start} ${y}h${width}v1h-${width}z`)
      }
      return runs
    })
    .join("")
  const rect = background
    ? `<rect width="${size}" height="${size}" fill="${background}"/>`
    : ""
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" shape-rendering="crispEdges">${rect}<path d="${path}" fill="${foreground}"/></svg>`
}

/* ---------- 全角・半角・かな変換 ---------- */

export type WidthMode = "half" | "full" | "katakana" | "hiragana"

// 英数記号（U+FF01〜FF5E）と全角スペースは半角と0xFEE0差。半角カナはNFKCで濁点ごと全角へ
export const convertWidth = (value: string, mode: WidthMode) => {
  if (mode === "half")
    return value
      .replace(/[！-～]/g, (char) =>
        String.fromCharCode(char.charCodeAt(0) - 0xfee0)
      )
      .replace(/\u3000/g, " ")
  if (mode === "full")
    return value
      .replace(/[!-~]/g, (char) =>
        String.fromCharCode(char.charCodeAt(0) + 0xfee0)
      )
      .replace(/ /g, "　")
      .replace(/[｡-ﾟ]+/g, (kana) => kana.normalize("NFKC"))
  // ひらがな（U+3041〜3096）とカタカナは0x60差
  if (mode === "katakana")
    return value.replace(/[ぁ-ゖ]/g, (char) =>
      String.fromCharCode(char.charCodeAt(0) + 0x60)
    )
  return value.replace(/[ァ-ヶ]/g, (char) =>
    String.fromCharCode(char.charCodeAt(0) - 0x60)
  )
}

/* ---------- 和暦 ---------- */

// 明治は改暦前（1872年以前）も便宜上グレゴリオ暦で扱う
export const eras = [
  { name: "令和", start: "2019-05-01" },
  { name: "平成", start: "1989-01-08" },
  { name: "昭和", start: "1926-12-25" },
  { name: "大正", start: "1912-07-30" },
  { name: "明治", start: "1868-01-25" },
] as const

export type EraName = (typeof eras)[number]["name"]

// date: YYYY-MM-DD
export const toWareki = (date: string) => {
  const era = eras.find((item) => date >= item.start)
  if (!era) return null
  const [year, month, day] = date.split("-").map(Number)
  const eraYear = year - Number(era.start.slice(0, 4)) + 1
  return {
    era: era.name,
    year: eraYear,
    text: `${era.name}${eraYear === 1 ? "元" : eraYear}年${month}月${day}日`,
  }
}

// 元号の範囲外ならnull
export const fromWareki = (
  era: EraName,
  eraYear: number,
  month: number,
  day: number
) => {
  const start = eras.find((item) => item.name === era)!.start
  const year = Number(start.slice(0, 4)) + eraYear - 1
  const date = new Date(Date.UTC(year, month - 1, day))
  if (date.getUTCMonth() !== month - 1 || eraYear < 1) return null
  const iso = date.toISOString().slice(0, 10)
  return toWareki(iso)?.era === era ? iso : null
}

const eraInitials: Record<string, EraName> = {
  M: "明治",
  T: "大正",
  S: "昭和",
  H: "平成",
  R: "令和",
}

// 「令和8年10月15日」「R8.10.15」「H31/4/30」形式
export const parseWareki = (value: string) => {
  const match = value
    .normalize("NFKC")
    .trim()
    .match(
      /^(明治|大正|昭和|平成|令和|[MTSHR])\s*(元|\d+)\s*[年./-]\s*(\d+)\s*[月./-]\s*(\d+)\s*日?$/i
    )
  if (!match) return null
  const era = eraInitials[match[1].toUpperCase()] ?? (match[1] as EraName)
  const eraYear = match[2] === "元" ? 1 : Number(match[2])
  return fromWareki(era, eraYear, Number(match[3]), Number(match[4]))
}

/* ---------- 進数変換 ---------- */

export const radixes = [2, 8, 10, 16] as const
export type Radix = (typeof radixes)[number]

const radixPrefix: Record<Radix, string> = {
  2: "0b",
  8: "0o",
  10: "",
  16: "0x",
}
const radixDigits: Record<Radix, RegExp> = {
  2: /^[01]+$/,
  8: /^[0-7]+$/,
  10: /^\d+$/,
  16: /^[\da-f]+$/i,
}

// 任意桁数に対応するためBigIntで解析。区切りの空白・アンダースコアと0x等の接頭辞は無視
export const parseRadix = (value: string, radix: Radix) => {
  const trimmed = value.replace(/[\s_]/g, "")
  const negative = trimmed.startsWith("-")
  const digits = trimmed
    .replace(/^-/, "")
    .replace(new RegExp(`^${radixPrefix[radix]}`, "i"), "")
  if (!radixDigits[radix].test(digits)) return null
  const parsed = BigInt(`${radixPrefix[radix]}${digits}`)
  return negative ? -parsed : parsed
}

/* ---------- パスワード生成 ---------- */

export const passwordCharsets = {
  upper: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  lower: "abcdefghijklmnopqrstuvwxyz",
  digit: "0123456789",
  symbol: "!#$%&()*+,-./:;<=>?@[]^_{|}~",
} as const

export type PasswordCharset = keyof typeof passwordCharsets

const ambiguousChars = /[Il1O0o]/g

// 剰余の偏りを避けるため、範囲外の乱数は捨てて引き直す
const randomIndex = (size: number) => {
  const limit = Math.floor(0x100000000 / size) * size
  const buffer = new Uint32Array(1)
  do crypto.getRandomValues(buffer)
  while (buffer[0] >= limit)
  return buffer[0] % size
}

// 選んだ文字種を最低1文字ずつ含める
export const generatePassword = (
  length: number,
  sets: PasswordCharset[],
  excludeAmbiguous: boolean
) => {
  const groups = sets.map((set) =>
    excludeAmbiguous
      ? passwordCharsets[set].replace(ambiguousChars, "")
      : passwordCharsets[set]
  )
  const all = groups.join("")
  if (!all || length < groups.length) return ""
  for (;;) {
    const password = Array.from(
      { length },
      () => all[randomIndex(all.length)]
    ).join("")
    if (groups.every((group) => [...password].some((c) => group.includes(c))))
      return password
  }
}

/* ---------- URL解析 ---------- */

export const parseUrl = (value: string) => {
  try {
    const url = new URL(value.trim())
    return {
      url,
      params: [...url.searchParams.entries()],
    }
  } catch {
    return null
  }
}

/* ---------- curlコマンド生成 ---------- */

export const curlMethods = [
  "GET",
  "POST",
  "PUT",
  "PATCH",
  "DELETE",
  "HEAD",
] as const
export type CurlMethod = (typeof curlMethods)[number]

export type CurlOptions = {
  follow: boolean
  insecure: boolean
  verbose: boolean
  compressed: boolean
  multiline: boolean
}

export const shellQuote = (value: string) =>
  /^[\w@%+=:,./-]+$/.test(value) ? value : `'${value.replaceAll("'", `'\\''`)}'`

export const buildCurl = (
  method: CurlMethod,
  url: string,
  headers: string,
  body: string,
  options: CurlOptions
) => {
  const args: string[] = []
  if (method === "HEAD") args.push("-I")
  else if (method !== "GET") args.push(`-X ${method}`)
  if (options.follow) args.push("-L")
  if (options.insecure) args.push("-k")
  if (options.verbose) args.push("-v")
  if (options.compressed) args.push("--compressed")
  for (const line of headers.split("\n")) {
    if (line.trim()) args.push(`-H ${shellQuote(line.trim())}`)
  }
  if (body && method !== "GET" && method !== "HEAD")
    args.push(`--data-raw ${shellQuote(body)}`)
  args.push(shellQuote(url.trim()))
  return ["curl", ...args].join(options.multiline ? " \\\n  " : " ")
}

/* ---------- JSONからTypeScript型生成 ---------- */

const toPascalCase = (value: string) =>
  value
    .replace(/[^A-Za-z0-9]+(.)?/g, (_, c: string | undefined) =>
      c ? c.toUpperCase() : ""
    )
    .replace(/^[a-z]/, (c) => c.toUpperCase())
    .replace(/^(\d|$)/, "T$1")

export const jsonToTypeScript = (value: unknown, rootName = "Root") => {
  const interfaces: string[] = []
  const usedNames = new Set<string>()
  const uniqueName = (base: string) => {
    let name = toPascalCase(base)
    for (let i = 2; usedNames.has(name); i++) name = `${toPascalCase(base)}${i}`
    usedNames.add(name)
    return name
  }

  // 同じ位置にある複数の値（配列要素など）を1つの型にまとめる
  const typeFor = (values: unknown[], name: string): string => {
    const objects = values.filter(isPlainObject)
    const arrays = values.filter(Array.isArray)
    const types = new Set<string>(
      values
        .filter((v) => !isPlainObject(v) && !Array.isArray(v))
        .map((v) => (v === null ? "null" : typeof v))
    )
    if (objects.length > 0) types.add(interfaceFor(objects, name))
    if (arrays.length > 0) {
      const items = arrays.flat()
      const item = items.length > 0 ? typeFor(items, `${name}Item`) : "unknown"
      types.add(item.includes(" | ") ? `(${item})[]` : `${item}[]`)
    }
    return [...types].join(" | ") || "unknown"
  }

  const interfaceFor = (objects: Record<string, unknown>[], base: string) => {
    const name = uniqueName(base)
    const keys = [...new Set(objects.flatMap(Object.keys))]
    const fields = keys.map((key) => {
      const present = objects.filter((o) => key in o).map((o) => o[key])
      const optional = present.length < objects.length ? "?" : ""
      const prop = /^[A-Za-z_$][\w$]*$/.test(key) ? key : JSON.stringify(key)
      return `  ${prop}${optional}: ${typeFor(present, key)}`
    })
    interfaces.push(`export interface ${name} {\n${fields.join("\n")}\n}`)
    return name
  }

  if (isPlainObject(value)) {
    interfaceFor([value], rootName)
  } else {
    const root = uniqueName(rootName)
    interfaces.push(`export type ${root} = ${typeFor([value], `${root}Item`)}`)
  }
  // 子が先に登録されるため逆順でルートを先頭にする
  return interfaces.reverse().join("\n\n")
}
