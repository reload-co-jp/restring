"use client"

import {
  FC,
  Fragment,
  ReactNode,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
} from "react"
import { Icon, IconName } from "components/icons"
import {
  CaseMode,
  CompareUnit,
  HashAlgorithm,
  LineOptions,
  TextEncodingName,
  CompareView,
  DiffPart,
  LineEnding,
  SafeResult,
  SqlMode,
  buildCreateTableSql,
  buildDiff,
  buildInsertSql,
  buildSelectSql,
  buildUpdateSql,
  convertLineEnding,
  copyText,
  countText,
  decodeBytes,
  describeCron,
  diffJson,
  downloadText,
  encodeText,
  encodeUtf16,
  encodeUtf8,
  escapeHtml,
  formatXml,
  formatEpochResult,
  formatInTimeZone,
  getAllTimeZones,
  hashAlgorithms,
  hashText,
  locateXmlError,
  nextCronRuns,
  normalizeForCompare,
  normalizeText,
  parseFlexibleEpoch,
  parseJson,
  parseHexBytes,
  parseJwt,
  processLines,
  repairMojibake,
  safeBase64Decode,
  safeBase64Encode,
  safeDecodeURIComponent,
  safeEncodeURIComponent,
  stableJson,
  testRegex,
  textEncodings,
  toCase,
  toHex,
  tokenize,
  unescapeHtml,
  unicodeBlock,
  unicodeName,
  validateJson,
  verifyJwtSignature,
  visibleText,
  xmlDeclaration,
  PasswordCharset,
  Radix,
  WidthMode,
  convertWidth,
  generatePassword,
  parseRadix,
  parseUrl,
  parseWareki,
  radixes,
  toWareki,
} from "components/tool-logic"

export { copyText, downloadText } from "components/tool-logic"

/* ---------- 共通UI ---------- */

export const Panel: FC<{
  title: string
  description?: string
  actions?: ReactNode
  children: ReactNode
}> = ({ title, description, actions, children }) => (
  <section className="panel">
    <div className="panelHead">
      <div>
        <h2>{title}</h2>
        {description && <p className="muted">{description}</p>}
      </div>
      {actions && <div className="panelActions">{actions}</div>}
    </div>
    {children}
  </section>
)

export const ActionButton: FC<{
  children: ReactNode
  onClick: () => void
  title?: string
  icon?: IconName
  variant?: "primary" | "secondary"
  disabled?: boolean
}> = ({ children, onClick, title, icon, variant = "secondary", disabled }) => (
  <button
    className={`button ${variant}`}
    disabled={disabled}
    onClick={onClick}
    title={title}
    type="button"
  >
    {icon && <Icon name={icon} size={16} />}
    {children}
  </button>
)

export const CopyButton: FC<{
  value: string
  label?: string
  variant?: "primary" | "secondary" | "ghost"
  disabled?: boolean
}> = ({ value, label = "コピー", variant = "primary", disabled }) => {
  const [state, setState] = useState<"idle" | "done" | "error">("idle")
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined)

  const copy = async () => {
    clearTimeout(timer.current)
    try {
      await copyText(value)
      setState("done")
    } catch {
      setState("error")
    }
    timer.current = setTimeout(() => setState("idle"), 1600)
  }

  return (
    <button
      className={`button ${variant}`}
      disabled={disabled}
      onClick={copy}
      title={label}
      type="button"
    >
      <Icon name={state === "done" ? "check" : "copy"} size={16} />
      <span aria-live="polite">
        {state === "done"
          ? "コピーしました"
          : state === "error"
            ? "コピー失敗"
            : label}
      </span>
    </button>
  )
}

export const Status: FC<{
  tone: "ok" | "error" | "warn" | "neutral"
  children: ReactNode
}> = ({ tone, children }) => (
  <p className={`status ${tone}`} role="status">
    {tone === "ok" && <Icon name="check" size={16} />}
    {tone === "error" && <Icon name="close" size={16} />}
    <span>{children}</span>
  </p>
)

export const Result: FC<{
  name: string
  value: string
  label?: string
  error?: string
}> = ({ name, value, label = "出力", error }) => (
  <div className="result">
    <div className="resultHead">
      <span className="fieldLabel">{label}</span>
      <div className="resultActions">
        <CopyButton disabled={Boolean(error)} value={value} />
        <ActionButton
          disabled={Boolean(error)}
          icon="download"
          onClick={() => downloadText(name, value)}
          title="ファイルとして保存"
        >
          保存
        </ActionButton>
      </div>
    </div>
    {error ? (
      <p className="status error" role="alert">
        <Icon name="close" size={16} />
        <span>{error}</span>
      </p>
    ) : (
      <pre className="output">{value}</pre>
    )}
  </div>
)

const FieldHead: FC<{
  id: string
  label: string
  meta?: ReactNode
  children?: ReactNode
}> = ({ id, label, meta, children }) => (
  <div className="fieldHead">
    <label className="fieldLabel" htmlFor={id}>
      {label}
    </label>
    {meta && <span className="fieldMeta">{meta}</span>}
    {children && <div className="fieldActions">{children}</div>}
  </div>
)

export const TextArea: FC<{
  label: string
  value: string
  onChange: (value: string) => void
  rows?: number
  placeholder?: string
  sample?: string
  hint?: string
  error?: string
}> = ({
  label,
  value,
  onChange,
  rows = 8,
  placeholder,
  sample,
  hint,
  error,
}) => {
  const id = useId()
  const message = error || hint

  return (
    <div className="field">
      <FieldHead
        id={id}
        label={label}
        meta={`${value.length.toLocaleString()}文字`}
      >
        {sample !== undefined && (
          <button
            className="textButton"
            onClick={() => onChange(sample)}
            type="button"
          >
            サンプル
          </button>
        )}
        <button
          className="textButton"
          disabled={value === ""}
          onClick={() => onChange("")}
          type="button"
        >
          クリア
        </button>
      </FieldHead>
      <textarea
        aria-describedby={message ? `${id}-message` : undefined}
        aria-invalid={error ? true : undefined}
        id={id}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        rows={rows}
        spellCheck={false}
        value={value}
      />
      {message && (
        <p className={error ? "fieldError" : "hint"} id={`${id}-message`}>
          {message}
        </p>
      )}
    </div>
  )
}

const TextInput: FC<{
  label: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
  hint?: ReactNode
  error?: string
  mono?: boolean
}> = ({ label, value, onChange, placeholder, hint, error, mono = true }) => {
  const id = useId()
  const message = error || hint

  return (
    <div className="field">
      <FieldHead id={id} label={label} />
      <input
        aria-describedby={message ? `${id}-message` : undefined}
        aria-invalid={error ? true : undefined}
        autoCapitalize="off"
        autoComplete="off"
        className={mono ? "textInput mono" : "textInput"}
        id={id}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        spellCheck={false}
        type="text"
        value={value}
      />
      {message && (
        <p className={error ? "fieldError" : "hint"} id={`${id}-message`}>
          {message}
        </p>
      )}
    </div>
  )
}

export function Segmented<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string
  value: T
  options: Array<{ value: T; label: string }>
  onChange: (value: NoInfer<T>) => void
}) {
  const name = useId()
  return (
    <fieldset className="segmented">
      <legend>{label}</legend>
      <div className="segmentedOptions">
        {options.map((option) => (
          <label
            className={option.value === value ? "active" : undefined}
            key={option.value}
          >
            <input
              checked={option.value === value}
              name={name}
              onChange={() => onChange(option.value)}
              type="radio"
              value={option.value}
            />
            {option.label}
          </label>
        ))}
      </div>
    </fieldset>
  )
}

const Checkbox: FC<{
  label: string
  checked: boolean
  onChange: (checked: boolean) => void
}> = ({ label, checked, onChange }) => (
  <label className="check">
    <input
      checked={checked}
      onChange={(event) => onChange(event.target.checked)}
      type="checkbox"
    />
    {label}
  </label>
)

const noopSubscribe = () => () => {}

// 静的書き出しでは現在時刻がビルド時に固定されるため、時刻依存UIはクライアントでのみ描画
const useIsClient = () =>
  useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false
  )

/* ---------- 比較・差分 ---------- */

const sampleLeft = "hello\nworld"
const sampleRight = "hello\nRestring"

const useTextDiff = () => {
  const [left, setLeft] = useState(sampleLeft)
  const [right, setRight] = useState(sampleRight)
  const [unit, setUnit] = useState<CompareUnit>("line")
  const [view, setView] = useState<CompareView>("inline")
  const [ignoreWhitespace, setIgnoreWhitespace] = useState(false)
  const [ignoreLineBreaks, setIgnoreLineBreaks] = useState(false)
  const [ignoreTabs, setIgnoreTabs] = useState(false)
  const [ignoreCase, setIgnoreCase] = useState(false)

  const diff = useMemo(() => {
    const options = {
      ignoreWhitespace,
      ignoreLineBreaks,
      ignoreTabs,
      ignoreCase,
    }
    return buildDiff(
      tokenize(normalizeForCompare(left, options), unit),
      tokenize(normalizeForCompare(right, options), unit)
    )
  }, [
    left,
    right,
    unit,
    ignoreWhitespace,
    ignoreLineBreaks,
    ignoreTabs,
    ignoreCase,
  ])

  return {
    diff,
    ignoreCase,
    ignoreLineBreaks,
    ignoreTabs,
    ignoreWhitespace,
    left,
    right,
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

type TextDiffState = ReturnType<typeof useTextDiff>

const CompareInputs: FC<{ state: TextDiffState }> = ({ state }) => (
  <div className="twoColumn">
    <TextArea
      label="比較元"
      onChange={state.setLeft}
      placeholder="変更前のテキスト"
      sample={sampleLeft}
      value={state.left}
    />
    <TextArea
      label="比較先"
      onChange={state.setRight}
      placeholder="変更後のテキスト"
      sample={sampleRight}
      value={state.right}
    />
  </div>
)

const CompareControls: FC<{ state: TextDiffState; showView?: boolean }> = ({
  state,
  showView = true,
}) => (
  <div className="toolbar">
    <Segmented
      label="比較単位"
      onChange={state.setUnit}
      options={[
        { value: "line", label: "行" },
        { value: "word", label: "単語" },
        { value: "char", label: "文字" },
      ]}
      value={state.unit}
    />
    {showView && (
      <Segmented
        label="表示"
        onChange={state.setView}
        options={[
          { value: "inline", label: "インライン" },
          { value: "side", label: "左右" },
        ]}
        value={state.view}
      />
    )}
    <fieldset className="checkGroup">
      <legend>無視する項目</legend>
      <Checkbox
        checked={state.ignoreWhitespace}
        label="スペース"
        onChange={state.setIgnoreWhitespace}
      />
      <Checkbox
        checked={state.ignoreLineBreaks}
        label="改行"
        onChange={state.setIgnoreLineBreaks}
      />
      <Checkbox
        checked={state.ignoreTabs}
        label="タブ"
        onChange={state.setIgnoreTabs}
      />
      <Checkbox
        checked={state.ignoreCase}
        label="大文字小文字"
        onChange={state.setIgnoreCase}
      />
    </fieldset>
  </div>
)

const diffSign = { same: " ", added: "+", removed: "−" } as const
const diffSrLabel = { same: "", added: "追加: ", removed: "削除: " } as const

const DiffSummary: FC<{ diff: DiffPart[] }> = ({ diff }) => {
  const added = diff.filter((part) => part.type === "added").length
  const removed = diff.filter((part) => part.type === "removed").length
  return (
    <p className="diffSummary" role="status">
      {added === 0 && removed === 0 ? (
        <span className="badge ok">差分なし</span>
      ) : (
        <>
          <span className="badge added">+{added} 追加</span>
          <span className="badge removed">−{removed} 削除</span>
        </>
      )}
    </p>
  )
}

const DiffView: FC<{
  parts: DiffPart[]
  unit: CompareUnit
  numbered?: boolean
}> = ({ parts, unit, numbered }) => {
  if (unit !== "line") {
    return (
      <pre className="output diffInline">
        {parts.map((part, index) =>
          part.type === "added" ? (
            <ins key={index}>
              <span className="srOnly">{diffSrLabel.added}</span>
              {part.text}
            </ins>
          ) : part.type === "removed" ? (
            <del key={index}>
              <span className="srOnly">{diffSrLabel.removed}</span>
              {part.text}
            </del>
          ) : (
            <span key={index}>{part.text}</span>
          )
        )}
      </pre>
    )
  }

  return (
    <div className="output diffLines">
      {parts.map((part, index) => (
        <div className={`diffLine ${part.type}`} key={index}>
          {numbered && <span className="diffNo">{index + 1}</span>}
          <span aria-hidden="true" className="diffSign">
            {diffSign[part.type]}
          </span>
          <code>
            <span className="srOnly">{diffSrLabel[part.type]}</span>
            {part.text || " "}
          </code>
        </div>
      ))}
    </div>
  )
}

export const TextCompareTool: FC = () => {
  const state = useTextDiff()
  const leftParts = state.diff.filter((part) => part.type !== "added")
  const rightParts = state.diff.filter((part) => part.type !== "removed")

  return (
    <>
      <Panel title="入力">
        <CompareInputs state={state} />
        <CompareControls state={state} />
      </Panel>
      <Panel actions={<DiffSummary diff={state.diff} />} title="比較結果">
        {state.view === "inline" ? (
          <DiffView parts={state.diff} unit={state.unit} />
        ) : (
          <div className="twoColumn">
            <div className="field">
              <span className="fieldLabel">比較元</span>
              <DiffView numbered parts={leftParts} unit={state.unit} />
            </div>
            <div className="field">
              <span className="fieldLabel">比較先</span>
              <DiffView numbered parts={rightParts} unit={state.unit} />
            </div>
          </div>
        )}
      </Panel>
    </>
  )
}

export const TextDiffTool: FC = () => {
  const state = useTextDiff()
  const changedOnly = state.diff.filter((part) => part.type !== "same")
  const text = changedOnly
    .map((part) => `${part.type === "added" ? "追加" : "削除"}: ${part.text}`)
    .join("\n")

  return (
    <>
      <Panel title="入力">
        <CompareInputs state={state} />
        <CompareControls showView={false} state={state} />
      </Panel>
      <Panel
        actions={
          <>
            <DiffSummary diff={state.diff} />
            <CopyButton disabled={changedOnly.length === 0} value={text} />
          </>
        }
        title="追加・削除された差分"
      >
        {changedOnly.length === 0 ? (
          <p className="muted">差分なし</p>
        ) : (
          <div className="output diffLines">
            {changedOnly.map((part, index) => (
              <div className={`diffLine ${part.type}`} key={index}>
                <span aria-hidden="true" className="diffSign">
                  {diffSign[part.type]}
                </span>
                <code>
                  <span className="srOnly">{diffSrLabel[part.type]}</span>
                  {part.text || " "}
                </code>
              </div>
            ))}
          </div>
        )}
      </Panel>
    </>
  )
}

const sampleJsonA = '{"name":"Restring","tools":["diff"]}'
const sampleJsonB = '{"tools":["diff"],"name":"Restring"}'

const previewValue = (value: unknown) =>
  value === undefined ? "—" : JSON.stringify(value)

export const JsonCompareTool: FC = () => {
  const [left, setLeft] = useState(sampleJsonA)
  const [right, setRight] = useState(sampleJsonB)
  const leftJson = parseJson(left)
  const rightJson = parseJson(right)
  const invalid = Boolean(leftJson.error || rightJson.error)
  const diffs = invalid ? [] : diffJson(leftJson.data, rightJson.data)
  const jsonEqual =
    !invalid &&
    JSON.stringify(stableJson(leftJson.data)) ===
      JSON.stringify(stableJson(rightJson.data))

  return (
    <>
      <Panel title="入力">
        <div className="twoColumn">
          <TextArea
            error={leftJson.error && `構文エラー: ${leftJson.error}`}
            label="JSON A"
            onChange={setLeft}
            sample={sampleJsonA}
            value={left}
          />
          <TextArea
            error={rightJson.error && `構文エラー: ${rightJson.error}`}
            label="JSON B"
            onChange={setRight}
            sample={sampleJsonB}
            value={right}
          />
        </div>
        <Status tone={invalid ? "error" : jsonEqual ? "ok" : "warn"}>
          {invalid
            ? "JSONが不正"
            : jsonEqual
              ? "構造一致（キー順の違いは無視）"
              : `構造不一致: ${diffs.length}箇所`}
        </Status>
      </Panel>
      {diffs.length > 0 && (
        <Panel title="構造差分">
          <div className="tableWrap">
            <table className="dataTable">
              <thead>
                <tr>
                  <th scope="col">パス</th>
                  <th scope="col">種類</th>
                  <th scope="col">JSON A</th>
                  <th scope="col">JSON B</th>
                </tr>
              </thead>
              <tbody>
                {diffs.slice(0, 500).map((item) => (
                  <tr key={item.path}>
                    <td>
                      <code>{item.path}</code>
                    </td>
                    <td>
                      <span className={`badge ${item.type}`}>
                        {item.type === "added"
                          ? "Bのみ"
                          : item.type === "removed"
                            ? "Aのみ"
                            : "値が異なる"}
                      </span>
                    </td>
                    <td>
                      <code>{previewValue(item.left)}</code>
                    </td>
                    <td>
                      <code>{previewValue(item.right)}</code>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {diffs.length > 500 && <p className="hint">先頭500件を表示</p>}
        </Panel>
      )}
      <Panel title="整形結果">
        <div className="twoColumn">
          <Result
            error={leftJson.error}
            label="JSON A"
            name="a.json"
            value={leftJson.error ? "" : JSON.stringify(leftJson.data, null, 2)}
          />
          <Result
            error={rightJson.error}
            label="JSON B"
            name="b.json"
            value={
              rightJson.error ? "" : JSON.stringify(rightJson.data, null, 2)
            }
          />
        </div>
      </Panel>
    </>
  )
}

/* ---------- JWT ---------- */

const sampleJwt =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IlJlc3RyaW5nIiwiaWF0IjoxNTE2MjM5MDIyLCJleHAiOjQxMDI0NDQ4MDB9.lSacD8mcneUOosKS6cU2e_oVWy5cNGp4d6eYWNyLbQw"

const claimTone = (value: string) =>
  value === "期限切れ" || value === "まだ有効化前" ? "error" : "ok"

export const JwtDecoderTool: FC = () => {
  const [value, setValue] = useState(sampleJwt)
  const [secret, setSecret] = useState("secret")
  const [verification, setVerification] = useState("検証待ち")
  const result = parseJwt(value)
  const header = result.header ? JSON.parse(result.header) : null

  useEffect(() => {
    let canceled = false

    verifyJwtSignature(value, secret)
      .then((message) => {
        if (!canceled) setVerification(message)
      })
      .catch((error: unknown) => {
        if (!canceled) {
          setVerification(
            error instanceof Error ? error.message : "署名検証失敗"
          )
        }
      })

    return () => {
      canceled = true
    }
  }, [secret, value])

  return (
    <>
      <Panel title="JWT">
        <TextArea
          error={result.error}
          label="JWT文字列"
          onChange={setValue}
          placeholder="eyJhbGciOi..."
          rows={5}
          sample={sampleJwt}
          value={value}
        />
      </Panel>
      {!result.error && (
        <Panel
          description="署名を検証せずにBase64URLデコードした内容。改ざんされていないことは保証されない。"
          title="デコード結果（署名未検証）"
        >
          <div className="tagList">
            <span className="tag">alg: {String(header?.alg ?? "—")}</span>
            <span className="tag">typ: {String(header?.typ ?? "—")}</span>
          </div>
          {result.claims.length > 0 && (
            <dl className="kvList">
              {result.claims.map(([label, text]) => {
                const time = text.match(/^(-?\d+) \(/)
                return (
                  <div key={label}>
                    <dt>{label}</dt>
                    <dd>
                      {label.endsWith("状態") ? (
                        <span className={`badge ${claimTone(text)}`}>
                          {text}
                        </span>
                      ) : (
                        <>
                          <code>{text}</code>
                          {time && (
                            <span className="hint">
                              ローカル:{" "}
                              {new Date(Number(time[1]) * 1000).toLocaleString(
                                "ja-JP",
                                {
                                  timeZoneName: "short",
                                }
                              )}
                            </span>
                          )}
                        </>
                      )}
                    </dd>
                  </div>
                )
              })}
            </dl>
          )}
          <div className="twoColumn">
            <Result
              label="Header"
              name="jwt-header.json"
              value={result.header}
            />
            <Result
              label="Payload"
              name="jwt-payload.json"
              value={result.payload}
            />
          </div>
          <Result
            label="Signature"
            name="jwt-signature.txt"
            value={result.signature}
          />
        </Panel>
      )}
      <Panel
        description="HS256 / HS384 / HS512に対応。秘密鍵はブラウザ内でのみ使用し、送信・保存しない。"
        title="署名検証（HMAC）"
      >
        <TextInput label="HMAC秘密鍵" onChange={setSecret} value={secret} />
        <Status
          tone={
            verification === "署名一致"
              ? "ok"
              : verification === "署名不一致"
                ? "error"
                : "neutral"
          }
        >
          署名検証: {verification}
        </Status>
      </Panel>
    </>
  )
}

/* ---------- 文字列変換 ---------- */

const sampleNormalize = "  Hello   Restring\r\n"

export const TextNormalizeTool: FC = () => {
  const [value, setValue] = useState(sampleNormalize)
  const output = normalizeText(value)

  return (
    <Panel title="テキスト正規化">
      <div className="stepList">
        <span className="fieldLabel">適用する変換（順番に実行）</span>
        <ol>
          <li>Unicode正規化（NFC）</li>
          <li>改行以外の連続空白を半角スペース1つへ圧縮</li>
          <li>改行コードをLFへ統一</li>
          <li>前後の空白・改行を削除</li>
        </ol>
      </div>
      <div className="twoColumn">
        <TextArea
          label="入力"
          onChange={setValue}
          sample={sampleNormalize}
          value={value}
        />
        <Result
          label={`出力（${value.length}文字 → ${output.length}文字）`}
          name="normalized.txt"
          value={output}
        />
      </div>
    </Panel>
  )
}

const invisibleChars: Record<string, { symbol: string; label: string }> = {
  " ": { symbol: "·", label: "スペース" },
  "\t": { symbol: "→", label: "Tab" },
  "\r": { symbol: "␍", label: "CR" },
  "\n": { symbol: "↵", label: "LF" },
  " ": { symbol: "⍽", label: "NBSP" },
  "​": { symbol: "ZW", label: "ゼロ幅スペース" },
  "　": { symbol: "□", label: "全角スペース" },
  "﻿": { symbol: "BOM", label: "BOM" },
}

const sampleInvisible = "Hello\t world ​\n"

export const InvisibleCharacterViewerTool: FC = () => {
  const [value, setValue] = useState(sampleInvisible)
  const chars = Array.from(value)
  const counts = Object.entries(invisibleChars)
    .map(([char, info]) => ({
      ...info,
      count: chars.filter((c) => c === char).length,
    }))
    .filter((item) => item.count > 0)

  return (
    <Panel title="不可視文字ビューア">
      <TextArea
        label="入力"
        onChange={setValue}
        sample={sampleInvisible}
        value={value}
      />
      <div className="field">
        <span className="fieldLabel">可視化表示</span>
        <pre className="output visibleOutput">
          {chars.map((char, index) => {
            const info = invisibleChars[char]
            if (!info) return char
            return (
              <Fragment key={index}>
                <span className="ws" title={info.label}>
                  {info.symbol}
                </span>
                {char === "\n" && "\n"}
              </Fragment>
            )
          })}
        </pre>
        <div className="tagList">
          {counts.length === 0 ? (
            <span className="muted">不可視文字なし</span>
          ) : (
            counts.map((item) => (
              <span className="tag" key={item.label}>
                <span className="ws">{item.symbol}</span>
                {item.label} × {item.count}
              </span>
            ))
          )}
        </div>
      </div>
      <Result
        label="名前置換テキスト"
        name="visible.txt"
        value={visibleText(value)}
      />
    </Panel>
  )
}

const sampleLineEnding = "Hello\r\nRestring\r\n"

export const LineEndingConverterTool: FC = () => {
  const [value, setValue] = useState(sampleLineEnding)
  const [lineEnding, setLineEnding] = useState<LineEnding>("LF")
  const crlf = value.match(/\r\n/g)?.length ?? 0
  const cr = (value.match(/\r/g)?.length ?? 0) - crlf
  const lf = (value.match(/\n/g)?.length ?? 0) - crlf

  return (
    <Panel title="改行コード変換">
      <TextArea
        label="入力"
        onChange={setValue}
        sample={sampleLineEnding}
        value={value}
      />
      <div className="tagList">
        <span className="fieldLabel">入力の改行コード</span>
        <span className="tag">CRLF × {crlf}</span>
        <span className="tag">LF × {lf}</span>
        <span className="tag">CR × {cr}</span>
      </div>
      <Segmented
        label="変換先"
        onChange={setLineEnding}
        options={[
          { value: "LF", label: "LF（macOS/Linux）" },
          { value: "CRLF", label: "CRLF（Windows）" },
          { value: "CR", label: "CR（旧Mac）" },
        ]}
        value={lineEnding}
      />
      <Result
        label={`出力（${lineEnding}）`}
        name="line-ending.txt"
        value={convertLineEnding(value, lineEnding)}
      />
    </Panel>
  )
}

const sampleCase = "hello Restring tool"

export const CaseConverterTool: FC = () => {
  const [value, setValue] = useState(sampleCase)
  const [caseMode, setCaseMode] = useState<CaseMode>("camel")

  return (
    <Panel title="ケース変換">
      <TextArea
        label="入力"
        onChange={setValue}
        rows={4}
        sample={sampleCase}
        value={value}
      />
      <Segmented
        label="変換形式"
        onChange={setCaseMode}
        options={[
          { value: "upper", label: "UPPERCASE" },
          { value: "lower", label: "lowercase" },
          { value: "camel", label: "camelCase" },
          { value: "pascal", label: "PascalCase" },
          { value: "snake", label: "snake_case" },
          { value: "kebab", label: "kebab-case" },
        ]}
        value={caseMode}
      />
      <Result name="case.txt" value={toCase(value, caseMode)} />
    </Panel>
  )
}

/* ---------- Web・エンコード ---------- */

const EncodeDecode: FC<{
  title: string
  sample: string
  encodeLabel: string
  decodeLabel: string
  fileName: string
  encode: (value: string) => SafeResult
  decode: (value: string) => SafeResult
}> = ({
  title,
  sample,
  encodeLabel,
  decodeLabel,
  fileName,
  encode,
  decode,
}) => {
  const [value, setValue] = useState(sample)
  const encoded = encode(value)
  const decoded = decode(value)

  return (
    <Panel
      description="入力をエンコードした結果とデコードした結果を同時に表示。"
      title={title}
    >
      <TextArea
        label="入力"
        onChange={setValue}
        rows={5}
        sample={sample}
        value={value}
      />
      <div className="twoColumn">
        <Result
          error={encoded.error}
          label={encodeLabel}
          name={`${fileName}-encoded.txt`}
          value={encoded.value}
        />
        <Result
          error={decoded.error}
          label={decodeLabel}
          name={`${fileName}-decoded.txt`}
          value={decoded.value}
        />
      </div>
    </Panel>
  )
}

export const UrlEncodeDecodeTool: FC = () => (
  <EncodeDecode
    decode={safeDecodeURIComponent}
    decodeLabel="デコード結果（%XX → 文字列）"
    encode={safeEncodeURIComponent}
    encodeLabel="エンコード結果（文字列 → %XX）"
    fileName="url"
    sample="hello Restring?x=1&y=2"
    title="URLエンコード・デコード"
  />
)

export const Base64Tool: FC = () => (
  <EncodeDecode
    decode={safeBase64Decode}
    decodeLabel="デコード結果（Base64 → UTF-8文字列）"
    encode={safeBase64Encode}
    encodeLabel="エンコード結果（UTF-8文字列 → Base64）"
    fileName="base64"
    sample="hello Restring"
    title="Base64"
  />
)

export const HtmlEscapeTool: FC = () => (
  <EncodeDecode
    decode={(value) => ({ value: unescapeHtml(value), error: "" })}
    decodeLabel="アンエスケープ結果（&amp;lt; → <）"
    encode={(value) => ({ value: escapeHtml(value), error: "" })}
    encodeLabel="エスケープ結果（< → &amp;lt;）"
    fileName="html"
    sample='<a href="/Restring">hello</a>'
    title="HTMLエスケープ"
  />
)

/* ---------- 文字・Unicode ---------- */

const sampleUnicode = "Aあ😀"

export const UnicodeInspectorTool: FC = () => {
  const [value, setValue] = useState(sampleUnicode)
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
      <TextArea
        label="入力"
        onChange={setValue}
        rows={3}
        sample={sampleUnicode}
        value={value}
      />
      <p className="muted">{rows.length}コードポイント</p>
      <div className="tableWrap">
        <table className="dataTable">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">文字</th>
              <th scope="col">コードポイント</th>
              <th scope="col">名前</th>
              <th scope="col">UTF-8</th>
              <th scope="col">UTF-16</th>
              <th scope="col">UTF-32</th>
              <th scope="col">ブロック</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={`${row.index}-${row.codePoint}`}>
                <td className="muted">{row.index + 1}</td>
                <td className="charCell">
                  {invisibleChars[row.char] ? (
                    <span className="ws">
                      {invisibleChars[row.char].symbol}
                    </span>
                  ) : (
                    row.char
                  )}
                </td>
                <td>
                  <code>{row.codePoint}</code>
                </td>
                <td>
                  <code>{row.name}</code>
                </td>
                <td>
                  <code>{row.utf8}</code>
                </td>
                <td>
                  <code>{row.utf16}</code>
                </td>
                <td>
                  <code>{row.utf32}</code>
                </td>
                <td>{row.block}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Panel>
  )
}

/* ---------- 日時・タイムゾーン ---------- */

const ClientOnly: FC<{ children: ReactNode }> = ({ children }) =>
  useIsClient() ? <>{children}</> : <p className="muted">読み込み中…</p>

const epochInterpretation = (value: string) => {
  const trimmed = value.trim()
  if (!/^-?\d+$/.test(trimmed)) return "日時文字列として解釈"
  return Math.abs(Number(trimmed)) >= 1e12
    ? "13桁以上: ミリ秒として解釈"
    : "秒として解釈"
}

const EpochConverter: FC = () => {
  const [value, setValue] = useState(() =>
    Math.floor(Date.now() / 1000).toString()
  )
  const ms = parseFlexibleEpoch(value)
  const result = ms === null ? null : formatEpochResult(ms)
  const rows = result
    ? [
        ["秒（Unix time）", result.seconds],
        ["ミリ秒", result.milliseconds],
        ["ISO 8601（UTC）", result.iso],
        ["UTC", result.utc],
        ["ローカル時刻", result.local],
      ]
    : []

  return (
    <>
      <div className="toolbar">
        <ActionButton
          onClick={() => setValue(Math.floor(Date.now() / 1000).toString())}
        >
          現在時刻（秒）
        </ActionButton>
        <ActionButton onClick={() => setValue(Date.now().toString())}>
          現在時刻（ミリ秒）
        </ActionButton>
      </div>
      <TextInput
        error={
          value.trim() !== "" && !result
            ? "数値（エポック秒・ミリ秒）または日時文字列（例: 2024-01-01T00:00:00Z）を入力"
            : undefined
        }
        hint={
          value.trim() === ""
            ? "例: 1700000000、1700000000000、2024-01-01T00:00:00Z"
            : epochInterpretation(value)
        }
        label="Unixエポック秒・ミリ秒 または 日時文字列"
        onChange={setValue}
        value={value}
      />
      {result && (
        <dl className="kvList">
          {rows.map(([label, text]) => (
            <div key={label}>
              <dt>{label}</dt>
              <dd>
                <code>{text}</code>
                <CopyButton label="コピー" value={text} variant="ghost" />
              </dd>
            </div>
          ))}
        </dl>
      )}
    </>
  )
}

export const EpochConverterTool: FC = () => (
  <Panel title="エポック時間変換">
    <ClientOnly>
      <EpochConverter />
    </ClientOnly>
  </Panel>
)

const utcNowIso = () => `${new Date().toISOString().slice(0, 19)}Z`

const TimezoneConverter: FC = () => {
  const allTimeZones = useMemo(() => getAllTimeZones(), [])
  const [now] = useState(() => new Date())
  const [query, setQuery] = useState("Tokyo")
  const [dateTimeValue, setDateTimeValue] = useState(utcNowIso)
  const [zonesValue, setZonesValue] = useState(
    "Asia/Tokyo, America/New_York, Europe/London, UTC"
  )

  const matchedZones = useMemo(() => {
    const trimmed = query.trim().toLowerCase()
    const zones = trimmed
      ? allTimeZones.filter((zone) => zone.toLowerCase().includes(trimmed))
      : allTimeZones
    return zones.slice(0, 20)
  }, [allTimeZones, query])

  const baseDate = new Date(dateTimeValue.trim())
  const baseDateValid = !Number.isNaN(baseDate.getTime())
  const targetZones = zonesValue
    .split(",")
    .map((zone) => zone.trim())
    .filter(Boolean)

  return (
    <>
      <Panel title="タイムゾーン変換">
        <div className="toolbar">
          <ActionButton onClick={() => setDateTimeValue(utcNowIso())}>
            現在時刻（UTC）
          </ActionButton>
        </div>
        <div className="twoColumn">
          <TextInput
            error={baseDateValid ? undefined : "日時が不正"}
            hint="ISO 8601形式。末尾Zまたは+09:00でタイムゾーンを指定。省略時はブラウザのローカル時刻"
            label="基準日時"
            onChange={setDateTimeValue}
            placeholder="2024-01-01T12:00:00Z"
            value={dateTimeValue}
          />
          <TextInput
            hint="IANAタイムゾーン名をカンマ区切り"
            label="変換先タイムゾーン"
            onChange={setZonesValue}
            value={zonesValue}
          />
        </div>
        {baseDateValid &&
          (targetZones.length === 0 ? (
            <p className="muted">変換先タイムゾーンを入力</p>
          ) : (
            <dl className="kvList">
              {targetZones.map((zone) => (
                <div key={zone}>
                  <dt>{zone}</dt>
                  <dd>
                    <code>{formatInTimeZone(baseDate, zone)}</code>
                  </dd>
                </div>
              ))}
            </dl>
          ))}
      </Panel>
      <Panel
        title="タイムゾーン検索"
        description="現在時刻を各タイムゾーンで表示。"
      >
        <TextInput
          label="タイムゾーン名検索"
          mono={false}
          onChange={setQuery}
          placeholder="例: Tokyo, America, Europe"
          value={query}
        />
        {matchedZones.length === 0 ? (
          <p className="muted">該当タイムゾーンなし</p>
        ) : (
          <ul className="zoneList">
            {matchedZones.map((zone) => (
              <li key={zone}>
                <div>
                  <strong>{zone}</strong>
                  <code>{formatInTimeZone(now, zone)}</code>
                </div>
                <button
                  className="textButton"
                  disabled={targetZones.includes(zone)}
                  onClick={() =>
                    setZonesValue([...targetZones, zone].join(", "))
                  }
                  type="button"
                >
                  変換先に追加
                </button>
              </li>
            ))}
          </ul>
        )}
      </Panel>
    </>
  )
}

export const TimezoneConverterTool: FC = () => (
  <ClientOnly>
    <TimezoneConverter />
  </ClientOnly>
)

/* ---------- 開発補助 ---------- */

export const SqlBuilderTool: FC = () => {
  const [mode, setMode] = useState<SqlMode>("select")
  const [table, setTable] = useState("users")
  const [columns, setColumns] = useState("id, name, email")
  const [where, setWhere] = useState("status = 'active'")
  const [orderBy, setOrderBy] = useState("created_at DESC")
  const [insertPairs, setInsertPairs] = useState(
    "name: Restring\nemail: hello@example.com"
  )
  const [updatePairs, setUpdatePairs] = useState("name: Restring")
  const [updateWhere, setUpdateWhere] = useState("id = 1")
  const [columnDefs, setColumnDefs] = useState(
    "id INT PRIMARY KEY\nname VARCHAR(255) NOT NULL\ncreated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP"
  )

  const sql =
    mode === "select"
      ? buildSelectSql(table, columns, where, orderBy)
      : mode === "insert"
        ? buildInsertSql(table, insertPairs)
        : mode === "update"
          ? buildUpdateSql(table, updatePairs, updateWhere)
          : buildCreateTableSql(table, columnDefs)

  return (
    <div className="splitLayout">
      <Panel title="入力">
        <Segmented
          label="SQL文の種類"
          onChange={setMode}
          options={[
            { value: "select", label: "SELECT" },
            { value: "insert", label: "INSERT" },
            { value: "update", label: "UPDATE" },
            { value: "create", label: "CREATE TABLE" },
          ]}
          value={mode}
        />
        <TextInput label="テーブル名" onChange={setTable} value={table} />
        {mode === "select" && (
          <>
            <TextInput
              hint="カンマ区切り。空なら *"
              label="カラム"
              onChange={setColumns}
              value={columns}
            />
            <TextArea
              hint="1行1条件。ANDで連結"
              label="WHERE条件"
              onChange={setWhere}
              rows={3}
              value={where}
            />
            <TextInput label="ORDER BY" onChange={setOrderBy} value={orderBy} />
          </>
        )}
        {mode === "insert" && (
          <TextArea
            hint="1行1ペア。数値・true/false・NULL以外はクォートを付与"
            label="カラム: 値"
            onChange={setInsertPairs}
            rows={5}
            value={insertPairs}
          />
        )}
        {mode === "update" && (
          <>
            <TextArea
              hint="1行1ペア。数値・true/false・NULL以外はクォートを付与"
              label="カラム: 値"
              onChange={setUpdatePairs}
              rows={5}
              value={updatePairs}
            />
            <TextArea
              hint="1行1条件。ANDで連結"
              label="WHERE条件"
              onChange={setUpdateWhere}
              rows={3}
              value={updateWhere}
            />
          </>
        )}
        {mode === "create" && (
          <TextArea
            hint="1行1カラム"
            label="カラム定義"
            onChange={setColumnDefs}
            rows={6}
            value={columnDefs}
          />
        )}
      </Panel>
      <Panel title="生成されたSQL">
        <Result label="SQL" name="query.sql" value={sql} />
      </Panel>
    </div>
  )
}

const sampleJson = '{"name": "Restring", "tools": ["diff", "compare"]}'

const jsonIndents = { "2": 2, "4": 4, tab: "\t", minify: 0 } as const

export const JsonValidatorTool: FC = () => {
  const [value, setValue] = useState(sampleJson)
  const [indent, setIndent] = useState<keyof typeof jsonIndents>("2")
  const result = validateJson(value, jsonIndents[indent])
  const location = result.location
  const errorLine = location ? value.split("\n")[location.line - 1] : undefined
  const gutter = location ? `${location.line} | ` : ""

  return (
    <>
      <Panel title="JSON">
        <TextArea
          label="検証するJSON"
          onChange={setValue}
          rows={12}
          sample={sampleJson}
          value={value}
        />
        <Status tone={result.valid ? "ok" : "error"}>
          {result.valid ? "有効なJSON" : `構文エラー: ${result.error}`}
        </Status>
        {!result.valid && location && (
          <div className="errorLocation">
            <p>
              <strong>
                {location.line}行目 {location.column}列目
              </strong>
              付近を確認
            </p>
            {errorLine !== undefined && (
              <pre className="output">
                {`${gutter}${errorLine}\n${" ".repeat(gutter.length + Math.max(location.column - 1, 0))}^`}
              </pre>
            )}
          </div>
        )}
      </Panel>
      {result.valid && (
        <Panel title="整形結果">
          <Segmented
            label="インデント"
            onChange={setIndent}
            options={[
              { value: "2", label: "スペース2" },
              { value: "4", label: "スペース4" },
              { value: "tab", label: "タブ" },
              { value: "minify", label: "圧縮（1行）" },
            ]}
            value={indent}
          />
          <Result
            label={indent === "minify" ? "圧縮JSON" : "整形済みJSON"}
            name="formatted.json"
            value={result.formatted}
          />
        </Panel>
      )}
    </>
  )
}

export const RegexTesterTool: FC = () => {
  const [pattern, setPattern] = useState("\\d+")
  const [flags, setFlags] = useState("g")
  const [input, setInput] = useState("注文番号: 12345, 数量: 6")
  const [replacement, setReplacement] = useState("#")

  const result = testRegex(pattern, flags, input, replacement)

  const highlighted: ReactNode[] = []
  let cursor = 0
  result.matches.forEach((item, index) => {
    if (item.index < cursor) return
    highlighted.push(input.slice(cursor, item.index))
    highlighted.push(
      <mark key={index} title={`#${index + 1}`}>
        {item.match}
      </mark>
    )
    cursor = item.index + item.match.length
  })
  highlighted.push(input.slice(cursor))

  return (
    <>
      <Panel title="パターン">
        <div className="regexRow">
          <TextInput
            error={result.valid ? undefined : `正規表現エラー: ${result.error}`}
            label="正規表現"
            onChange={setPattern}
            value={pattern}
          />
          <TextInput
            hint="g, i, m, s, u, y"
            label="フラグ"
            onChange={setFlags}
            value={flags}
          />
        </div>
        <p className="regexPreview">
          <code>
            /{pattern}/{flags}
          </code>
        </p>
        <TextArea
          label="テスト文字列"
          onChange={setInput}
          rows={5}
          value={input}
        />
      </Panel>
      {result.valid && (
        <Panel
          actions={
            <span
              className={`badge ${result.matches.length > 0 ? "ok" : "neutral"}`}
            >
              {result.matches.length}件マッチ
            </span>
          }
          title="マッチ結果"
        >
          <pre className="output regexHighlight">{highlighted}</pre>
          {result.matches.length > 0 && (
            <div className="tableWrap">
              <table className="dataTable">
                <thead>
                  <tr>
                    <th scope="col">#</th>
                    <th scope="col">マッチ</th>
                    <th scope="col">位置</th>
                    <th scope="col">キャプチャグループ</th>
                  </tr>
                </thead>
                <tbody>
                  {result.matches.map((item, matchIndex) => (
                    <tr key={`${item.index}-${matchIndex}`}>
                      <td className="muted">{matchIndex + 1}</td>
                      <td>
                        <code>&quot;{item.match}&quot;</code>
                      </td>
                      <td>
                        <code>
                          {item.index}–{item.index + item.match.length}
                        </code>
                      </td>
                      <td>
                        {item.groups.length > 0 ? (
                          <code>
                            {item.groups
                              .map(
                                (group, groupIndex) =>
                                  `$${groupIndex + 1}=${group ?? "undefined"}`
                              )
                              .join(", ")}
                          </code>
                        ) : (
                          <span className="muted">なし</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {result.matches.length >= 1000 && (
            <p className="hint">先頭1000件を表示</p>
          )}
        </Panel>
      )}
      <Panel title="置換">
        <TextInput
          hint="$1, $2でグループ参照、$&でマッチ全体"
          label="置換文字列"
          onChange={setReplacement}
          value={replacement}
        />
        {result.valid && (
          <Result
            label="置換結果"
            name="replaced.txt"
            value={result.replaced}
          />
        )}
      </Panel>
    </>
  )
}

/* ---------- 追加ツール ---------- */

const sampleCount = "Restring 文字数カウント👨‍👩‍👧\n2行目"

export const CharacterCountTool: FC = () => {
  const [value, setValue] = useState(sampleCount)
  const count = countText(value)
  const rows = [
    ["文字数（見た目の文字）", count.graphemes],
    ["文字数（空白・改行を除く）", count.withoutSpaces],
    ["コードポイント数", count.codePoints],
    ["UTF-16単位数（JavaScriptのlength）", count.utf16],
    ["バイト数（UTF-8）", count.utf8Bytes],
    ["バイト数（Shift_JIS）", count.shiftJisBytes],
    ["行数", count.lines],
    ["単語数", count.words],
  ] as const

  return (
    <Panel title="文字数カウント">
      <TextArea
        label="入力"
        onChange={setValue}
        rows={8}
        sample={sampleCount}
        value={value}
      />
      <div className="tableWrap">
        <table className="dataTable">
          <tbody>
            {rows.map(([label, number]) => (
              <tr key={label}>
                <th scope="row">{label}</th>
                <td>{number.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Panel>
  )
}

export const HashGeneratorTool: FC = () => {
  const [value, setValue] = useState("hello Restring")
  const [hashes, setHashes] = useState<Partial<Record<HashAlgorithm, string>>>(
    {}
  )

  useEffect(() => {
    let active = true
    Promise.all(
      hashAlgorithms.map((algorithm) => hashText(value, algorithm))
    ).then((results) => {
      if (active)
        setHashes(
          Object.fromEntries(
            hashAlgorithms.map((algorithm, index) => [
              algorithm,
              results[index],
            ])
          )
        )
    })
    return () => {
      active = false
    }
  }, [value])

  return (
    <Panel
      description="入力をUTF-8バイト列としてハッシュ化。"
      title="ハッシュ生成"
    >
      <TextArea
        label="入力"
        onChange={setValue}
        rows={5}
        sample="hello Restring"
        value={value}
      />
      <div className="tableWrap">
        <table className="dataTable">
          <tbody>
            {hashAlgorithms.map((algorithm) => (
              <tr key={algorithm}>
                <th scope="row">{algorithm}</th>
                <td>
                  <code>{hashes[algorithm] ?? ""}</code>
                </td>
                <td>
                  <CopyButton
                    disabled={!hashes[algorithm]}
                    label="コピー"
                    value={hashes[algorithm] ?? ""}
                    variant="ghost"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Panel>
  )
}

const UuidGenerator: FC = () => {
  const [count, setCount] = useState<"1" | "5" | "10" | "50">("5")
  const [upper, setUpper] = useState(false)
  const [hyphen, setHyphen] = useState(true)
  const [seed, setSeed] = useState(0)
  // seedを変えると再生成
  const uuids = useMemo(
    () => Array.from({ length: Number(count) }, () => crypto.randomUUID()),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [count, seed]
  )
  const output = uuids
    .map((uuid) => (hyphen ? uuid : uuid.replaceAll("-", "")))
    .map((uuid) => (upper ? uuid.toUpperCase() : uuid))
    .join("\n")

  return (
    <>
      <div className="toolbar">
        <Segmented
          label="生成数"
          onChange={setCount}
          options={["1", "5", "10", "50"].map((item) => ({
            value: item as typeof count,
            label: `${item}件`,
          }))}
          value={count}
        />
        <fieldset className="checkGroup">
          <legend>形式</legend>
          <Checkbox checked={upper} label="大文字" onChange={setUpper} />
          <Checkbox checked={hyphen} label="ハイフン" onChange={setHyphen} />
        </fieldset>
        <ActionButton onClick={() => setSeed(seed + 1)} variant="primary">
          再生成
        </ActionButton>
      </div>
      <Result label="UUID v4" name="uuid.txt" value={output} />
    </>
  )
}

export const UuidGeneratorTool: FC = () => (
  <Panel
    description="crypto.randomUUID()で暗号論的に安全な乱数からUUID v4を生成。"
    title="UUID生成"
  >
    <ClientOnly>
      <UuidGenerator />
    </ClientOnly>
  </Panel>
)

const formatBytes = (bytes: number[], format: "hex" | "percent") =>
  format === "hex"
    ? (toHex(bytes).match(/../g) ?? []).join(" ")
    : (toHex(bytes).match(/../g) ?? [])
        .map((byte) => `%${byte.toUpperCase()}`)
        .join("")

export const CharacterEncodingTool: FC = () => {
  const [text, setText] = useState("あいう ABC")
  const [encoding, setEncoding] = useState<TextEncodingName>("shift_jis")
  const [hex, setHex] = useState("82 a0 82 a2 82 a4")
  const [garbled, setGarbled] = useState("縺薙ｓ縺ｫ縺｡縺ｯ")
  const encoded = encodeText(text, encoding)
  let decoded: Array<{ label: string; value: string }> = []
  let hexError = ""
  try {
    const bytes = parseHexBytes(hex)
    decoded = textEncodings.map((item) => ({
      label: item.label,
      value: decodeBytes(bytes, item.value),
    }))
  } catch (error) {
    hexError = error instanceof Error ? error.message : "バイト列が不正"
  }
  const repaired = repairMojibake(garbled)

  return (
    <>
      <Panel title="文字列 → バイト列">
        <TextArea label="入力" onChange={setText} rows={3} value={text} />
        <Segmented
          label="文字コード"
          onChange={setEncoding}
          options={textEncodings}
          value={encoding}
        />
        {encoded.unmappable.length > 0 && (
          <Status tone="warn">
            {encoding}で表せない文字を「?」に置換:{" "}
            {Array.from(new Set(encoded.unmappable)).join(" ")}
          </Status>
        )}
        <div className="twoColumn">
          <Result
            label={`16進数（${encoded.bytes.length}バイト）`}
            name="bytes.txt"
            value={formatBytes(encoded.bytes, "hex")}
          />
          <Result
            label="パーセントエンコード"
            name="percent.txt"
            value={formatBytes(encoded.bytes, "percent")}
          />
        </div>
      </Panel>
      <Panel
        description="「82 a0」「%82%A0」「0x82,0xa0」「\\x82\\xa0」形式に対応。"
        title="バイト列 → 文字列"
      >
        <TextArea
          error={hexError}
          label="16進数のバイト列"
          onChange={setHex}
          rows={3}
          value={hex}
        />
        {!hexError && (
          <div className="tableWrap">
            <table className="dataTable">
              <tbody>
                {decoded.map((item) => (
                  <tr key={item.label}>
                    <th scope="row">{item.label}</th>
                    <td>{item.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Panel>
      <Panel
        description="文字化けした文字列を誤って解釈された文字コードでバイト列へ戻し、別の文字コードで読み直した候補を表示。"
        title="文字化け復元"
      >
        <TextArea
          label="文字化けした文字列"
          onChange={setGarbled}
          rows={3}
          value={garbled}
        />
        {repaired.length === 0 ? (
          <Status tone="neutral">復元候補なし</Status>
        ) : (
          <div className="tableWrap">
            <table className="dataTable">
              <thead>
                <tr>
                  <th scope="col">誤って読んだ文字コード</th>
                  <th scope="col">本来の文字コード</th>
                  <th scope="col">復元結果</th>
                </tr>
              </thead>
              <tbody>
                {repaired.map((item) => (
                  <tr key={`${item.wrong}-${item.right}`}>
                    <td>{item.wrong}</td>
                    <td>{item.right}</td>
                    <td>{item.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Panel>
    </>
  )
}

const sampleLines = "banana\napple\nitem10\napple\n\nitem2"

export const LineSortTool: FC = () => {
  const [value, setValue] = useState(sampleLines)
  const [options, setOptions] = useState<LineOptions>({
    order: "asc",
    unique: true,
    removeEmpty: true,
    trim: false,
    ignoreCase: false,
    natural: true,
  })
  const set =
    <K extends keyof LineOptions>(key: K) =>
    (next: LineOptions[K]) =>
      setOptions({ ...options, [key]: next })
  const inputCount = value === "" ? 0 : value.split(/\r\n|\r|\n/).length
  const lines = processLines(value, options)

  return (
    <Panel title="行の並べ替え・重複削除">
      <div className="toolbar">
        <Segmented
          label="並び順"
          onChange={set("order")}
          options={[
            { value: "none", label: "そのまま" },
            { value: "asc", label: "昇順" },
            { value: "desc", label: "降順" },
            { value: "reverse", label: "逆順" },
          ]}
          value={options.order}
        />
        <fieldset className="checkGroup">
          <legend>オプション</legend>
          <Checkbox
            checked={options.unique}
            label="重複削除"
            onChange={set("unique")}
          />
          <Checkbox
            checked={options.removeEmpty}
            label="空行削除"
            onChange={set("removeEmpty")}
          />
          <Checkbox
            checked={options.trim}
            label="前後の空白削除"
            onChange={set("trim")}
          />
          <Checkbox
            checked={options.ignoreCase}
            label="大文字小文字を無視"
            onChange={set("ignoreCase")}
          />
          <Checkbox
            checked={options.natural}
            label="数値順（item2 < item10）"
            onChange={set("natural")}
          />
        </fieldset>
      </div>
      <div className="twoColumn">
        <TextArea
          label="入力"
          onChange={setValue}
          sample={sampleLines}
          value={value}
        />
        <Result
          label={`出力（${inputCount}行 → ${lines.length}行）`}
          name="lines.txt"
          value={lines.join("\n")}
        />
      </div>
    </Panel>
  )
}

const cronPresets = [
  { value: "*/5 * * * *", label: "5分ごと" },
  { value: "0 * * * *", label: "毎時0分" },
  { value: "0 9 * * 1-5", label: "平日9時" },
  { value: "0 0 1 * *", label: "毎月1日0時" },
]

const CronNextRuns: FC<{ expression: string }> = ({ expression }) => {
  const runs = nextCronRuns(expression, new Date(), 10)
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone
  return runs.length === 0 ? (
    <Status tone="warn">5年以内に実行される日時なし</Status>
  ) : (
    <Result
      label={`次回以降の実行日時（${timeZone}）`}
      name="cron-runs.txt"
      value={runs
        .map((date) =>
          date.toLocaleString("ja-JP", {
            dateStyle: "medium",
            timeStyle: "short",
            weekday: "short",
          } as Intl.DateTimeFormatOptions)
        )
        .join("\n")}
    />
  )
}

export const CronParserTool: FC = () => {
  const [expression, setExpression] = useState("0 9 * * 1-5")
  let fields: ReturnType<typeof describeCron> = []
  let error = ""
  try {
    fields = describeCron(expression)
  } catch (caught) {
    error = caught instanceof Error ? caught.message : "cron式が不正"
  }

  return (
    <Panel title="cron式">
      <TextInput
        error={error}
        hint="分 時 日 月 曜日 の5フィールド。@daily などのマクロにも対応。"
        label="cron式"
        onChange={setExpression}
        value={expression}
      />
      <div className="toolbar">
        {cronPresets.map((preset) => (
          <ActionButton
            key={preset.value}
            onClick={() => setExpression(preset.value)}
          >
            {preset.label}
          </ActionButton>
        ))}
      </div>
      {!error && (
        <>
          <div className="tableWrap">
            <table className="dataTable">
              <thead>
                <tr>
                  <th scope="col">フィールド</th>
                  <th scope="col">指定</th>
                  <th scope="col">実行される値</th>
                </tr>
              </thead>
              <tbody>
                {fields.map((field) => (
                  <tr key={field.label}>
                    <th scope="row">{field.label}</th>
                    <td>
                      <code>{field.raw}</code>
                    </td>
                    <td>{field.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <ClientOnly>
            <CronNextRuns expression={expression} />
          </ClientOnly>
        </>
      )}
    </Panel>
  )
}

const sampleXml = `<?xml version="1.0" encoding="UTF-8"?>
<catalog><book id="1"><title>XML入門</title><price>2800</price></book><book id="2"><title>XPath実践</title><price>3200</price></book></catalog>`

const xmlIndents = { "2": "  ", "4": "    ", tab: "\t", minify: "" } as const

export const parseXml = (value: string) => {
  const doc = new DOMParser().parseFromString(value, "application/xml")
  const errorNode = doc.querySelector("parsererror")
  if (!errorNode) return { doc, error: "", location: null }
  // Chrome・Safariはdiv内、Firefoxは先頭のテキストノードにメッセージがある
  const message = (
    errorNode.querySelector("div")?.textContent ??
    errorNode.firstChild?.textContent ??
    "XMLが不正"
  ).trim()
  return { doc: null, error: message, location: locateXmlError(message) }
}

const evaluateXPath = (doc: Document, expression: string) => {
  const result = doc.evaluate(
    expression,
    doc,
    (prefix) => doc.documentElement.lookupNamespaceURI(prefix),
    XPathResult.ANY_TYPE,
    null
  )
  if (result.resultType === XPathResult.NUMBER_TYPE)
    return [String(result.numberValue)]
  if (result.resultType === XPathResult.STRING_TYPE) return [result.stringValue]
  if (result.resultType === XPathResult.BOOLEAN_TYPE)
    return [String(result.booleanValue)]
  const nodes: string[] = []
  for (let node = result.iterateNext(); node; node = result.iterateNext()) {
    nodes.push(formatXml(node, "  "))
  }
  return nodes
}

const XmlParser: FC = () => {
  const [value, setValue] = useState(sampleXml)
  const [indent, setIndent] = useState<keyof typeof xmlIndents>("2")
  const [xpath, setXpath] = useState("//book[price > 3000]/title")
  const parsed = useMemo(() => parseXml(value), [value])
  const location = parsed.location
  const errorLine = location ? value.split("\n")[location.line - 1] : undefined
  const gutter = location ? `${location.line} | ` : ""

  let matches: string[] = []
  let xpathError = ""
  if (parsed.doc && xpath.trim() !== "") {
    try {
      matches = evaluateXPath(parsed.doc, xpath)
    } catch (error) {
      xpathError = error instanceof Error ? error.message : "XPathが不正"
    }
  }

  return (
    <>
      <Panel title="XML">
        <TextArea
          label="解析するXML"
          onChange={setValue}
          rows={12}
          sample={sampleXml}
          value={value}
        />
        <Status tone={parsed.doc ? "ok" : "error"}>
          {parsed.doc
            ? `整形式のXML（要素数 ${parsed.doc.getElementsByTagName("*").length}）`
            : `構文エラー: ${parsed.error}`}
        </Status>
        {location && (
          <div className="errorLocation">
            <p>
              <strong>
                {location.line}行目 {location.column}列目
              </strong>
              付近を確認
            </p>
            {errorLine !== undefined && (
              <pre className="output">
                {`${gutter}${errorLine}\n${" ".repeat(gutter.length + Math.max(location.column - 1, 0))}^`}
              </pre>
            )}
          </div>
        )}
      </Panel>
      {parsed.doc && (
        <>
          <Panel title="整形結果">
            <Segmented
              label="インデント"
              onChange={setIndent}
              options={[
                { value: "2", label: "スペース2" },
                { value: "4", label: "スペース4" },
                { value: "tab", label: "タブ" },
                { value: "minify", label: "圧縮（1行）" },
              ]}
              value={indent}
            />
            <Result
              label={indent === "minify" ? "圧縮XML" : "整形済みXML"}
              name="formatted.xml"
              value={formatXml(
                parsed.doc,
                xmlIndents[indent],
                xmlDeclaration(value)
              )}
            />
          </Panel>
          <Panel
            description="名前空間の接頭辞はルート要素の宣言から解決。デフォルト名前空間の要素は *[local-name()='name'] で指定。"
            title="XPath検索"
          >
            <TextInput
              error={xpathError}
              label="XPath"
              onChange={setXpath}
              value={xpath}
            />
            {!xpathError && xpath.trim() !== "" && (
              <Result
                label={`結果（${matches.length}件）`}
                name="xpath-result.txt"
                value={matches.join("\n")}
              />
            )}
          </Panel>
        </>
      )}
    </>
  )
}

// DOMParserはブラウザ専用のため、静的書き出し時は描画しない
export const XmlParserTool: FC = () => (
  <ClientOnly>
    <XmlParser />
  </ClientOnly>
)

/* ---------- 全角・半角・かな変換 ---------- */

const sampleWidth = "Ｒｅｓｔｒｉｎｇ　２０２６！ ﾃｷｽﾄ へんかん"

export const WidthConverterTool: FC = () => {
  const [value, setValue] = useState(sampleWidth)
  const [mode, setMode] = useState<WidthMode>("half")

  return (
    <Panel title="全角・半角・かな変換">
      <TextArea
        label="入力"
        onChange={setValue}
        rows={4}
        sample={sampleWidth}
        value={value}
      />
      <Segmented
        label="変換形式"
        onChange={setMode}
        options={[
          { value: "half", label: "英数記号を半角" },
          { value: "full", label: "全角（半角カナ含む）" },
          { value: "katakana", label: "ひらがな→カタカナ" },
          { value: "hiragana", label: "カタカナ→ひらがな" },
        ]}
        value={mode}
      />
      <Result name="converted.txt" value={convertWidth(value, mode)} />
    </Panel>
  )
}

/* ---------- 和暦・西暦変換 ---------- */

const KvRows: FC<{ rows: string[][] }> = ({ rows }) => (
  <dl className="kvList">
    {rows.map(([label, text]) => (
      <div key={label}>
        <dt>{label}</dt>
        <dd>
          <code>{text}</code>
          <CopyButton label="コピー" value={text} variant="ghost" />
        </dd>
      </div>
    ))}
  </dl>
)

const todayIso = () => {
  const now = new Date()
  return new Date(now.getTime() - now.getTimezoneOffset() * 60000)
    .toISOString()
    .slice(0, 10)
}

const WarekiConverter: FC = () => {
  const [western, setWestern] = useState(todayIso)
  const [wareki, setWareki] = useState(() => toWareki(todayIso())?.text ?? "")
  const westernId = useId()
  const toResult = /^\d{4}-\d{2}-\d{2}$/.test(western)
    ? toWareki(western)
    : null
  const fromResult = parseWareki(wareki)

  return (
    <>
      <div className="field">
        <FieldHead id={westernId} label="西暦 → 和暦" />
        <input
          className="textInput mono"
          id={westernId}
          max="9999-12-31"
          min="1868-01-25"
          onChange={(event) => setWestern(event.target.value)}
          type="date"
          value={western}
        />
      </div>
      {toResult ? (
        <KvRows
          rows={[
            ["和暦", toResult.text],
            ["元号・年", `${toResult.era}${toResult.year}年`],
          ]}
        />
      ) : (
        <Status tone="warn">明治（1868年1月25日）以降の日付を入力</Status>
      )}
      <TextInput
        error={
          wareki.trim() !== "" && !fromResult
            ? "元号の範囲外、または形式が不正"
            : undefined
        }
        hint="例: 令和8年10月15日、平成元年1月8日、R8.10.15、H31/4/30"
        label="和暦 → 西暦"
        mono={false}
        onChange={setWareki}
        value={wareki}
      />
      {fromResult && (
        <KvRows
          rows={[
            ["西暦", fromResult],
            [
              "日本語表記",
              fromResult.replace(/^(\d+)-0?(\d+)-0?(\d+)$/, "$1年$2月$3日"),
            ],
          ]}
        />
      )}
    </>
  )
}

export const WarekiConverterTool: FC = () => (
  <Panel title="和暦・西暦変換">
    <ClientOnly>
      <WarekiConverter />
    </ClientOnly>
  </Panel>
)

/* ---------- 進数変換 ---------- */

const radixLabels: Record<Radix, string> = {
  2: "2進数",
  8: "8進数",
  10: "10進数",
  16: "16進数",
}

export const RadixConverterTool: FC = () => {
  const [value, setValue] = useState("255")
  const [radix, setRadix] = useState<`${Radix}`>("10")
  const parsed = parseRadix(value, Number(radix) as Radix)

  return (
    <Panel title="進数変換">
      <Segmented
        label="入力の進数"
        onChange={setRadix}
        options={radixes.map((item) => ({
          value: `${item}` as const,
          label: radixLabels[item],
        }))}
        value={radix}
      />
      <TextInput
        error={
          value.trim() !== "" && parsed === null
            ? `${radixLabels[Number(radix) as Radix]}として解釈できない文字を含む`
            : undefined
        }
        hint="桁数の上限なし。空白・アンダースコア区切り、0x・0b・0o接頭辞、負数に対応。"
        label="値"
        onChange={setValue}
        value={value}
      />
      {parsed !== null && (
        <KvRows
          rows={radixes.map((item) => [
            radixLabels[item],
            parsed.toString(item).toUpperCase(),
          ])}
        />
      )}
    </Panel>
  )
}

/* ---------- パスワード生成 ---------- */

const charsetLabels: Record<PasswordCharset, string> = {
  upper: "大文字",
  lower: "小文字",
  digit: "数字",
  symbol: "記号",
}

const PasswordGenerator: FC = () => {
  const [length, setLength] = useState<"8" | "12" | "16" | "24" | "32" | "64">(
    "16"
  )
  const [sets, setSets] = useState<PasswordCharset[]>([
    "upper",
    "lower",
    "digit",
  ])
  const [excludeAmbiguous, setExcludeAmbiguous] = useState(false)
  const [seed, setSeed] = useState(0)
  // seedを変えると再生成
  const passwords = useMemo(
    () =>
      Array.from({ length: 5 }, () =>
        generatePassword(Number(length), sets, excludeAmbiguous)
      ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [length, sets, excludeAmbiguous, seed]
  )
  const toggle = (set: PasswordCharset, checked: boolean) =>
    setSets(
      (Object.keys(charsetLabels) as PasswordCharset[]).filter((item) =>
        item === set ? checked : sets.includes(item)
      )
    )

  return (
    <>
      <div className="toolbar">
        <Segmented
          label="文字数"
          onChange={setLength}
          options={(["8", "12", "16", "24", "32", "64"] as const).map(
            (item) => ({ value: item, label: item })
          )}
          value={length}
        />
        <fieldset className="checkGroup">
          <legend>文字種</legend>
          {(Object.keys(charsetLabels) as PasswordCharset[]).map((set) => (
            <Checkbox
              checked={sets.includes(set)}
              key={set}
              label={charsetLabels[set]}
              onChange={(checked) => toggle(set, checked)}
            />
          ))}
          <Checkbox
            checked={excludeAmbiguous}
            label="紛らわしい文字（Il1O0o）を除外"
            onChange={setExcludeAmbiguous}
          />
        </fieldset>
        <ActionButton onClick={() => setSeed(seed + 1)} variant="primary">
          再生成
        </ActionButton>
      </div>
      {sets.length === 0 ? (
        <Status tone="warn">文字種を1つ以上選択</Status>
      ) : (
        <Result
          label="パスワード"
          name="passwords.txt"
          value={passwords.join("\n")}
        />
      )}
    </>
  )
}

export const PasswordGeneratorTool: FC = () => (
  <Panel
    description="crypto.getRandomValues()で暗号論的に安全な乱数から生成。"
    title="パスワード生成"
  >
    <ClientOnly>
      <PasswordGenerator />
    </ClientOnly>
  </Panel>
)

/* ---------- URL解析 ---------- */

const sampleUrl =
  "https://user@example.com:8080/search/result?q=%E6%97%A5%E6%9C%AC&page=2&tag=a&tag=b#top"

export const UrlParserTool: FC = () => {
  const [value, setValue] = useState(sampleUrl)
  const parsed = parseUrl(value)
  const url = parsed?.url

  return (
    <Panel title="URL解析">
      <TextInput
        error={
          value.trim() !== "" && !parsed
            ? "URLとして解釈できない（https://などのスキームから入力）"
            : undefined
        }
        label="URL"
        onChange={setValue}
        value={value}
      />
      {url && (
        <KvRows
          rows={[
            ["プロトコル", url.protocol],
            ["ユーザー名", url.username],
            ["ホスト名", url.hostname],
            ["ポート", url.port],
            ["オリジン", url.origin],
            ["パス", url.pathname],
            ["パス（デコード）", safeDecodeURIComponent(url.pathname).value],
            ["クエリ", url.search],
            ["フラグメント", url.hash],
          ].filter(([, text]) => text && text !== "null")}
        />
      )}
      {parsed && parsed.params.length > 0 && (
        <div className="tableWrap">
          <table className="dataTable">
            <thead>
              <tr>
                <th scope="col">キー</th>
                <th scope="col">値（デコード済み）</th>
              </tr>
            </thead>
            <tbody>
              {parsed.params.map(([key, param], index) => (
                <tr key={index}>
                  <td>
                    <code>{key}</code>
                  </td>
                  <td>
                    <code>{param}</code>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Panel>
  )
}
