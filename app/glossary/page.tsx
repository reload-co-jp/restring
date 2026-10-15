import Link from "next/link"
import { FC } from "react"
import { Icon } from "components/icons"
import { absoluteUrl, createPageMetadata } from "components/seo"
import { findTool, toolCategories, ToolCategoryId } from "components/tool-links"

export const metadata = createPageMetadata({
  title: "用語集",
  description:
    "Base64、URLエンコード、JWT、Unicode、UTF-8、正規化、改行コード、UNIX時間、正規表現など、文字列処理ツールで使われる用語をまとめて解説。",
  path: "/glossary/",
})

type Term = {
  id: string
  term: string
  category: ToolCategoryId
  description: string
  tool?: string
}

const terms: Term[] = [
  {
    id: "diff",
    term: "差分（diff）",
    category: "compare",
    description:
      "2つのテキストの違い。共通部分を基準に、追加・削除された部分を求める。比較の単位として行・単語・文字がある。",
    tool: "/text-compare/",
  },
  {
    id: "unified-diff",
    term: "unified形式",
    category: "compare",
    description:
      "差分の表記形式。削除行を「-」、追加行を「+」で示し、前後の変更されていない行も文脈として含める。git diffやdiff -uの出力形式。",
    tool: "/text-diff/",
  },
  {
    id: "normalize",
    term: "テキスト正規化",
    category: "text",
    description:
      "表記ゆれを揃える処理。全角・半角の統一、前後空白の除去、連続空白の圧縮、改行コードの統一など。比較や検索の前処理に使う。",
    tool: "/text-normalize/",
  },
  {
    id: "line-ending",
    term: "改行コード（LF / CRLF / CR）",
    category: "text",
    description:
      "行の終わりを表す制御文字。LF（\\n）はmacOS・Linux、CRLF（\\r\\n）はWindows、CR（\\r）は古いMac OSで使われる。混在すると差分やスクリプト実行で問題になる。",
    tool: "/line-ending-converter/",
  },
  {
    id: "case",
    term: "ケース（命名規則）",
    category: "text",
    description:
      "単語の区切り方と大文字小文字の使い方。camelCase、PascalCase、snake_case、kebab-case、CONSTANT_CASEなどがあり、言語や用途ごとに慣習が異なる。",
    tool: "/case-converter/",
  },
  {
    id: "unicode",
    term: "Unicode",
    category: "unicode",
    description:
      "世界中の文字に一意の番号を割り当てる文字集合の規格。各文字の番号をコードポイントと呼び、U+3042（あ）のように表記する。",
    tool: "/unicode-inspector/",
  },
  {
    id: "code-point",
    term: "コードポイント",
    category: "unicode",
    description:
      "Unicodeで文字に割り当てられた番号。U+0000からU+10FFFFまでの範囲。見た目上1文字でも複数のコードポイントで構成される場合がある。",
    tool: "/unicode-inspector/",
  },
  {
    id: "utf-8",
    term: "UTF-8",
    category: "unicode",
    description:
      "コードポイントを1〜4バイトで表す文字エンコーディング。ASCIIと互換性があり、Webで最も広く使われる。日本語のひらがな・漢字は多くが3バイト。",
    tool: "/unicode-inspector/",
  },
  {
    id: "surrogate-pair",
    term: "サロゲートペア",
    category: "unicode",
    description:
      "UTF-16でU+10000以上の文字を2つの16ビット値の組で表す仕組み。絵文字や一部の漢字が該当し、JavaScriptのlengthでは2文字として数えられる。",
    tool: "/unicode-inspector/",
  },
  {
    id: "unicode-normalization",
    term: "Unicode正規化（NFC / NFD / NFKC / NFKD）",
    category: "unicode",
    description:
      "見た目が同じでもコードポイントが異なる文字列を揃える処理。NFCは合成、NFDは分解。NFKC・NFKDは互換文字（全角英数字や①など）も標準的な形へ変換する。",
    tool: "/text-normalize/",
  },
  {
    id: "invisible-character",
    term: "不可視文字",
    category: "unicode",
    description:
      "画面に表示されない文字。ゼロ幅スペース（U+200B）、ノーブレークスペース（U+00A0）、BOM（U+FEFF）など。コピペで混入し、比較や構文解析の失敗原因になる。",
    tool: "/invisible-character-viewer/",
  },
  {
    id: "bom",
    term: "BOM（バイトオーダーマーク）",
    category: "unicode",
    description:
      "ファイル先頭に置かれるU+FEFF。UTF-8では不要だが、一部のエディタが付加する。シェルスクリプトやJSONの先頭にあるとエラーの原因になる。",
    tool: "/invisible-character-viewer/",
  },
  {
    id: "url-encode",
    term: "URLエンコード（パーセントエンコーディング）",
    category: "web",
    description:
      "URLで使えない文字や意味を持つ記号を「%」と16進数2桁で表す方式。日本語はUTF-8のバイト列に変換してから1バイトずつエンコードする。",
    tool: "/url-encode-decode/",
  },
  {
    id: "base64",
    term: "Base64",
    category: "web",
    description:
      "バイナリデータを英数字と「+」「/」の64種類の文字で表すエンコード方式。元データの約4/3倍の長さになる。暗号化ではないため誰でもデコードできる。",
    tool: "/base64/",
  },
  {
    id: "base64url",
    term: "Base64URL",
    category: "web",
    description:
      "URLやファイル名で安全に使えるBase64の変種。「+」を「-」、「/」を「_」に置き換え、末尾の「=」を省略することが多い。JWTで使われる。",
    tool: "/jwt-decoder/",
  },
  {
    id: "html-escape",
    term: "HTMLエスケープ",
    category: "web",
    description:
      "HTMLで特別な意味を持つ「<」「>」「&」「\"」「'」を文字参照へ置き換える処理。ユーザー入力をそのまま表示する際のXSS対策として必須。",
    tool: "/html-escape/",
  },
  {
    id: "character-reference",
    term: "文字参照（エンティティ）",
    category: "web",
    description:
      "HTMLで文字を間接的に表す記法。&amp;のような名前付き文字参照と、&#12354;や&#x3042;のような数値文字参照がある。",
    tool: "/html-special-characters/",
  },
  {
    id: "jwt",
    term: "JWT（JSON Web Token）",
    category: "web",
    description:
      "ヘッダー・ペイロード・署名をBase64URLでエンコードし「.」で連結したトークン。認証情報の受け渡しに使う。ペイロードは暗号化されておらず、誰でも内容を読める。",
    tool: "/jwt-decoder/",
  },
  {
    id: "jwt-claim",
    term: "クレーム（iss / sub / exp / iat）",
    category: "web",
    description:
      "JWTのペイロードに含まれる項目。issは発行者、subは対象者、expは有効期限、iatは発行日時。exp・iatはUNIX時間（秒）で表す。",
    tool: "/jwt-decoder/",
  },
  {
    id: "unix-time",
    term: "UNIX時間（エポック時間）",
    category: "time",
    description:
      "1970年1月1日00:00:00 UTCからの経過秒数。タイムゾーンに依存しない。JavaScriptのDate.now()はミリ秒単位のため、秒単位の値と桁数が3桁異なる。",
    tool: "/epoch-converter/",
  },
  {
    id: "utc",
    term: "UTC（協定世界時）",
    category: "time",
    description:
      "世界の時刻の基準。日本標準時（JST）はUTC+9。サーバーやログではUTCで記録し、表示時に各タイムゾーンへ変換するのが一般的。",
    tool: "/timezone-converter/",
  },
  {
    id: "iso-8601",
    term: "ISO 8601",
    category: "time",
    description:
      "日時の国際標準表記。2026-10-15T09:00:00+09:00のように日付と時刻を「T」で区切り、末尾にUTCからのオフセットまたは「Z」（UTC）を付ける。",
    tool: "/epoch-converter/",
  },
  {
    id: "timezone",
    term: "タイムゾーン（IANA）",
    category: "time",
    description:
      "地域ごとの標準時の定義。Asia/TokyoやAmerica/New_Yorkのような名前で識別する。夏時間の切り替えも含むため、固定オフセットより正確に変換できる。",
    tool: "/timezone-converter/",
  },
  {
    id: "json",
    term: "JSON",
    category: "dev",
    description:
      "オブジェクト・配列・文字列・数値・真偽値・nullで構成されるデータ形式。キーは必ずダブルクォートで囲み、末尾カンマやコメントは使えない。",
    tool: "/json-validator/",
  },
  {
    id: "regex",
    term: "正規表現",
    category: "dev",
    description:
      "文字列のパターンを記号で表す記法。検索・置換・入力チェックに使う。「.」は任意の1文字、「*」は0回以上の繰り返し、「^」「$」は行頭・行末を表す。",
    tool: "/regex-tester/",
  },
  {
    id: "regex-flag",
    term: "フラグ（g / i / m / s / u）",
    category: "dev",
    description:
      "正規表現の動作を変える指定。gは全件マッチ、iは大文字小文字を無視、mは複数行モード、sは「.」を改行にもマッチ、uはUnicodeモード。",
    tool: "/regex-tester/",
  },
  {
    id: "capture-group",
    term: "キャプチャグループ",
    category: "dev",
    description:
      "正規表現で丸括弧に囲まれた部分。マッチした部分文字列を取り出したり、置換時に$1のように参照したりできる。(?<name>...)で名前を付けられる。",
    tool: "/regex-tester/",
  },
  {
    id: "sql",
    term: "SQL",
    category: "dev",
    description:
      "リレーショナルデータベースを操作する言語。SELECTで取得、INSERTで追加、UPDATEで更新、DELETEで削除する。文字列値はシングルクォートで囲む。",
    tool: "/sql-builder/",
  },
  {
    id: "markdown",
    term: "Markdown",
    category: "editor",
    description:
      "記号で見出しやリストを表す軽量マークアップ言語。「#」で見出し、「-」でリスト、「**」で強調を表す。READMEやドキュメントで広く使われる。",
    tool: "/markdown-editor/",
  },
  {
    id: "tex",
    term: "TeX（LaTeX）数式",
    category: "editor",
    description:
      "数式を記述するための記法。\\frac{a}{b}で分数、x^2で上付き、\\sum で総和を表す。Markdown内では$...$や$$...$$で囲んで埋め込むことが多い。",
    tool: "/tex-helper/",
  },
]

const Page: FC = () => (
  <div className="toolPage">
    <script
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "DefinedTermSet",
          name: "Restring 用語集",
          url: absoluteUrl("/glossary/"),
          hasDefinedTerm: terms.map((item) => ({
            "@type": "DefinedTerm",
            name: item.term,
            description: item.description,
            url: absoluteUrl(`/glossary/#${item.id}`),
          })),
        }),
      }}
      type="application/ld+json"
    />
    <header className="toolHeader">
      <nav aria-label="パンくず" className="breadcrumb">
        <ol>
          <li>
            <Link href="/">Restring</Link>
          </li>
          <li aria-current="page">用語集</li>
        </ol>
      </nav>
      <h1>用語集</h1>
      <p className="lead">
        各ツールで使われる文字コード、エンコード、日時、開発関連の用語をまとめて解説。
      </p>
    </header>
    {toolCategories.map((category) => {
      const items = terms.filter((item) => item.category === category.id)
      if (items.length === 0) return null
      return (
        <section className="articleSection" id={category.id} key={category.id}>
          <h2>
            <Icon name={category.id} size={16} /> {category.label}
          </h2>
          <div className="faqList">
            {items.map((item) => {
              const tool = item.tool ? findTool(item.tool) : undefined
              return (
                <section className="faqItem" id={item.id} key={item.id}>
                  <h3>{item.term}</h3>
                  <p>{item.description}</p>
                  {tool && (
                    <p>
                      <Link href={tool.href}>{tool.title}で試す</Link>
                    </p>
                  )}
                </section>
              )
            })}
          </div>
        </section>
      )
    })}
  </div>
)

export default Page
