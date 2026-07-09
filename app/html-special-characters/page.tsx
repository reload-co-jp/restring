import { createPageMetadata } from "components/seo"
import { ToolArticle } from "components/tool-article"

export const metadata = createPageMetadata({
  title: "HTML特殊文字一覧 - 文字参照・エンティティ対応表",
  description:
    "HTML特殊文字と文字参照の対応表。&、<、>、引用符、空白、記号などの名前付き文字参照・数値文字参照・用途を一覧で確認。",
  path: "/html-special-characters/",
})

const htmlSpecialCharacters = [
  {
    character: "&",
    name: "&amp;",
    decimal: "&#38;",
    hex: "&#x26;",
    usage: "文字参照の開始記号。通常文字として表示する場合に変換。",
  },
  {
    character: "<",
    name: "&lt;",
    decimal: "&#60;",
    hex: "&#x3C;",
    usage: "HTMLタグ開始と解釈されるため、コード例表示で必須。",
  },
  {
    character: ">",
    name: "&gt;",
    decimal: "&#62;",
    hex: "&#x3E;",
    usage: "HTMLタグ終了記号。コード例や比較演算子表示で使用。",
  },
  {
    character: '"',
    name: "&quot;",
    decimal: "&#34;",
    hex: "&#x22;",
    usage: "属性値や引用符を安全に表示したい場合に使用。",
  },
  {
    character: "'",
    name: "&apos;",
    decimal: "&#39;",
    hex: "&#x27;",
    usage: "シングルクォート。属性値や文字列例の表示に使用。",
  },
  {
    character: " ",
    name: "&nbsp;",
    decimal: "&#160;",
    hex: "&#xA0;",
    usage: "改行されない空白。単位や短い語句を離したくない場合に使用。",
  },
  {
    character: "©",
    name: "&copy;",
    decimal: "&#169;",
    hex: "&#xA9;",
    usage: "著作権表記。",
  },
  {
    character: "®",
    name: "&reg;",
    decimal: "&#174;",
    hex: "&#xAE;",
    usage: "登録商標表記。",
  },
  {
    character: "™",
    name: "&trade;",
    decimal: "&#8482;",
    hex: "&#x2122;",
    usage: "商標表記。",
  },
  {
    character: "¥",
    name: "&yen;",
    decimal: "&#165;",
    hex: "&#xA5;",
    usage: "円記号。",
  },
  {
    character: "€",
    name: "&euro;",
    decimal: "&#8364;",
    hex: "&#x20AC;",
    usage: "ユーロ記号。",
  },
  {
    character: "£",
    name: "&pound;",
    decimal: "&#163;",
    hex: "&#xA3;",
    usage: "ポンド記号。",
  },
  {
    character: "¢",
    name: "&cent;",
    decimal: "&#162;",
    hex: "&#xA2;",
    usage: "セント記号。",
  },
  {
    character: "±",
    name: "&plusmn;",
    decimal: "&#177;",
    hex: "&#xB1;",
    usage: "プラスマイナス記号。",
  },
  {
    character: "×",
    name: "&times;",
    decimal: "&#215;",
    hex: "&#xD7;",
    usage: "乗算記号。閉じるボタンの記号にも使われる。",
  },
  {
    character: "÷",
    name: "&divide;",
    decimal: "&#247;",
    hex: "&#xF7;",
    usage: "除算記号。",
  },
  {
    character: "…",
    name: "&hellip;",
    decimal: "&#8230;",
    hex: "&#x2026;",
    usage: "三点リーダー。",
  },
  {
    character: "—",
    name: "&mdash;",
    decimal: "&#8212;",
    hex: "&#x2014;",
    usage: "欧文の長いダッシュ。",
  },
  {
    character: "–",
    name: "&ndash;",
    decimal: "&#8211;",
    hex: "&#x2013;",
    usage: "範囲や補足に使う短いダッシュ。",
  },
  {
    character: "←",
    name: "&larr;",
    decimal: "&#8592;",
    hex: "&#x2190;",
    usage: "左矢印。",
  },
  {
    character: "↑",
    name: "&uarr;",
    decimal: "&#8593;",
    hex: "&#x2191;",
    usage: "上矢印。",
  },
  {
    character: "→",
    name: "&rarr;",
    decimal: "&#8594;",
    hex: "&#x2192;",
    usage: "右矢印。",
  },
  {
    character: "↓",
    name: "&darr;",
    decimal: "&#8595;",
    hex: "&#x2193;",
    usage: "下矢印。",
  },
]

const Page = () => (
  <ToolArticle href="/html-special-characters/">
    <section className="articleSection">
      <h2>HTML特殊文字変換 一覧表</h2>
      <div className="entityTableWrap">
        <table className="entityTable">
          <thead>
            <tr>
              <th>表示</th>
              <th>名前付き文字参照</th>
              <th>数値文字参照</th>
              <th>16進数</th>
              <th>用途</th>
            </tr>
          </thead>
          <tbody>
            {htmlSpecialCharacters.map((item) => (
              <tr key={item.name}>
                <td className="entityCharacter">{item.character}</td>
                <td>
                  <code>{item.name}</code>
                </td>
                <td>
                  <code>{item.decimal}</code>
                </td>
                <td>
                  <code>{item.hex}</code>
                </td>
                <td>{item.usage}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  </ToolArticle>
)

export default Page
