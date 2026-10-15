import { FC, ReactNode } from "react"
import Link from "next/link"
import { categoryLabel, toolLinks } from "components/tool-links"
import { Icon } from "components/icons"
import { absoluteUrl, siteName, siteUrl } from "components/seo"

type SeoText = {
  questions: {
    answer: string
    question: string
  }[]
  tips: string[]
  useCases: string[]
}

const relatedToolHrefs: Record<string, string[]> = {
  "/character-count/": [
    "/unicode-inspector/",
    "/invisible-character-viewer/",
    "/character-encoding/",
  ],
  "/character-encoding/": [
    "/unicode-inspector/",
    "/url-encode-decode/",
    "/character-count/",
  ],
  "/hash-generator/": ["/base64/", "/jwt-decoder/", "/uuid-generator/"],
  "/line-sort/": ["/text-normalize/", "/text-compare/", "/case-converter/"],
  "/cron-parser/": [
    "/epoch-converter/",
    "/timezone-converter/",
    "/regex-tester/",
  ],
  "/uuid-generator/": ["/hash-generator/", "/sql-builder/", "/json-validator/"],
  "/yaml-json-converter/": [
    "/json-validator/",
    "/json-compare/",
    "/text-diff/",
  ],
  "/text-compare/": [
    "/text-diff/",
    "/text-normalize/",
    "/invisible-character-viewer/",
  ],
  "/json-compare/": ["/json-validator/", "/jwt-decoder/", "/text-compare/"],
  "/jwt-decoder/": ["/base64/", "/json-validator/", "/url-encode-decode/"],
  "/text-diff/": [
    "/text-compare/",
    "/text-normalize/",
    "/line-ending-converter/",
  ],
  "/text-normalize/": [
    "/invisible-character-viewer/",
    "/line-ending-converter/",
    "/text-compare/",
  ],
  "/invisible-character-viewer/": [
    "/text-normalize/",
    "/unicode-inspector/",
    "/text-compare/",
  ],
  "/line-ending-converter/": [
    "/text-normalize/",
    "/text-diff/",
    "/text-compare/",
  ],
  "/case-converter/": [
    "/url-encode-decode/",
    "/text-normalize/",
    "/regex-tester/",
  ],
  "/url-encode-decode/": ["/base64/", "/html-escape/", "/jwt-decoder/"],
  "/base64/": ["/jwt-decoder/", "/url-encode-decode/", "/json-validator/"],
  "/html-escape/": [
    "/html-special-characters/",
    "/url-encode-decode/",
    "/unicode-inspector/",
  ],
  "/html-special-characters/": [
    "/html-escape/",
    "/unicode-inspector/",
    "/url-encode-decode/",
  ],
  "/unicode-inspector/": [
    "/invisible-character-viewer/",
    "/html-escape/",
    "/text-normalize/",
  ],
  "/epoch-converter/": [
    "/timezone-converter/",
    "/json-validator/",
    "/sql-builder/",
  ],
  "/timezone-converter/": [
    "/epoch-converter/",
    "/json-validator/",
    "/text-normalize/",
  ],
  "/sql-builder/": ["/json-validator/", "/regex-tester/", "/text-normalize/"],
  "/json-validator/": ["/json-compare/", "/jwt-decoder/", "/sql-builder/"],
  "/regex-tester/": ["/text-compare/", "/case-converter/", "/text-normalize/"],
  "/markdown-editor/": ["/tex-helper/", "/html-escape/", "/text-compare/"],
  "/tex-helper/": ["/markdown-editor/", "/html-escape/", "/text-compare/"],
}

const seoTextByHref: Record<string, SeoText> = {
  "/text-compare/": {
    useCases: [
      "修正前後の文章、README、設定ファイルを見比べたいとき。",
      "レビュー前に追加・削除・表記ゆれを把握したいとき。",
      "スペースや大文字小文字の違いを無視して意味のある差分だけ見たいとき。",
    ],
    tips: [
      "コードや設定ファイルは行単位、短い文章は単語単位、細かい表記確認は文字単位が向く。",
      "改行コードや不可視文字が原因の差分は、関連ツールで正規化してから比較すると原因を絞りやすい。",
    ],
    questions: [
      {
        question: "テキスト比較はブラウザだけで使える？",
        answer:
          "入力と差分計算はブラウザ上で完結する。短い文書や設定ファイルの確認に使いやすい。",
      },
      {
        question: "行単位と文字単位の違いは？",
        answer:
          "行単位は変更行の把握に向く。文字単位は誤字、余分な記号、細かい表記差の確認に向く。",
      },
    ],
  },
  "/json-compare/": {
    useCases: [
      "APIレスポンスの変更前後を比較したいとき。",
      "設定JSONや翻訳JSONの差分を確認したいとき。",
      "キー順の違いを除外し、値や構造の違いだけ確認したいとき。",
    ],
    tips: [
      "まず構文エラーを解消してから比較すると、構造差分を正確に見られる。",
      "配列の順序は意味を持つため、並び替えがあるJSONは結果の読み方に注意が必要。",
    ],
    questions: [
      {
        question: "JSONのキー順が違う場合も差分になる？",
        answer:
          "オブジェクトのキー順は揃えて比較するため、キー順だけの違いは差分として扱わない。",
      },
      {
        question: "JSON構文エラーも確認できる？",
        answer:
          "JSON.parseで検証し、構文エラーがある場合は比較前にエラー内容を表示する。",
      },
    ],
  },
  "/jwt-decoder/": {
    useCases: [
      "認証トークンのHeader、Payload、Signatureを分解したいとき。",
      "exp、nbf、iatなどの時刻クレームを確認したいとき。",
      "HS256などHMAC署名が期待通りか検証したいとき。",
    ],
    tips: [
      "JWTのPayloadはデコードできても署名検証なしでは信頼できない。",
      "秘密情報を含む本番トークンは扱いに注意し、必要な範囲だけ確認する。",
    ],
    questions: [
      {
        question: "JWTをデコードすると署名検証も済む？",
        answer:
          "デコードだけでは署名検証にならない。HMAC系は秘密鍵を入力した場合に署名一致を確認できる。",
      },
      {
        question: "期限切れJWTを確認できる？",
        answer:
          "exp、nbf、iatなどの時刻クレームを読み取り、有効期限状態の確認に使える。",
      },
    ],
  },
  "/text-diff/": {
    useCases: [
      "長い比較結果から追加行・削除行だけ拾いたいとき。",
      "レビュー用に変更箇所だけ抜き出したいとき。",
      "文章校正や仕様変更の要点だけ確認したいとき。",
    ],
    tips: [
      "差分量が多い場合は先にテキスト正規化を使うとノイズを減らせる。",
      "削除と追加だけを見たい場合はテキスト比較より短く確認できる。",
    ],
    questions: [
      {
        question: "テキスト比較との違いは？",
        answer:
          "テキスト比較は同一部分も含めて差分を表示する。テキスト差分は追加・削除だけ抽出する。",
      },
      {
        question: "単語単位の差分も抽出できる？",
        answer:
          "比較粒度を選ぶことで、行単位だけでなく単語単位や文字単位の差分確認に使える。",
      },
    ],
  },
  "/text-normalize/": {
    useCases: [
      "前後空白や連続スペースを整えたいとき。",
      "CRLF、CR、LFが混在したテキストを統一したいとき。",
      "Unicode正規化で見た目が同じ文字の揺れを減らしたいとき。",
    ],
    tips: [
      "比較前に正規化すると、空白や改行だけの差分を減らせる。",
      "データ投入前の下処理として使う場合は、変換後の内容を必ず確認する。",
    ],
    questions: [
      {
        question: "Unicode正規化とは？",
        answer:
          "同じ見た目でも内部表現が異なる文字を、一定の形式へ揃える処理。",
      },
      {
        question: "改行コードも変換できる？",
        answer:
          "CRLFとCRをLFへ統一する。任意の改行コードへ変換したい場合は改行コード変換を使う。",
      },
    ],
  },
  "/invisible-character-viewer/": {
    useCases: [
      "ゼロ幅スペースやNBSPの混入を探したいとき。",
      "見た目が同じなのに比較結果が一致しない原因を調べたいとき。",
      "ログ、CSV、コピー文の空白や改行位置を確認したいとき。",
    ],
    tips: [
      "不可視文字を見つけたら、テキスト正規化や手動削除で取り除く。",
      "NBSPは通常スペースと見た目が似ているが、比較や検索では別文字として扱われる。",
    ],
    questions: [
      {
        question: "ゼロ幅スペースも表示できる？",
        answer:
          "ゼロ幅スペース、NBSP、タブ、CR、LF、通常スペースを読みやすい名前へ置換する。",
      },
      {
        question: "不可視文字はなぜ問題になる？",
        answer:
          "見た目では分からないが、検索、比較、認証、CSV処理で別文字として扱われるため。",
      },
    ],
  },
  "/line-ending-converter/": {
    useCases: [
      "WindowsとmacOS/Linux間で改行コードを揃えたいとき。",
      "Git差分に大量の改行変更が出た原因を確認したいとき。",
      "CSV、ログ、設定ファイルの改行形式を変換したいとき。",
    ],
    tips: [
      "WebやLinux系ではLF、Windows向けテキストではCRLFが使われることが多い。",
      "変換前に元ファイルの扱いを確認し、必要ならバックアップを残す。",
    ],
    questions: [
      {
        question: "LFとCRLFの違いは？",
        answer: "LFは改行1文字、CRLFは復帰と改行の2文字で改行を表す形式。",
      },
      {
        question: "Git差分が全部変更になる原因は？",
        answer:
          "内容ではなく改行コードだけ変わった場合、全行差分として表示されることがある。",
      },
    ],
  },
  "/case-converter/": {
    useCases: [
      "変数名をcamelCase、PascalCase、snake_caseへ変換したいとき。",
      "URLスラッグやファイル名をkebab-caseで作りたいとき。",
      "APIフィールド名やDBカラム名の命名規則を揃えたいとき。",
    ],
    tips: [
      "英数字、空白、ハイフン、アンダースコア混在の文字列を単語として分割する。",
      "略語を含む文字列は、変換後に期待する大文字小文字になっているか確認する。",
    ],
    questions: [
      {
        question: "camelCaseとPascalCaseの違いは？",
        answer:
          "camelCaseは先頭小文字、PascalCaseは各単語の先頭を大文字にする。",
      },
      {
        question: "snake_caseとkebab-caseはどこで使う？",
        answer:
          "snake_caseはDBカラムやPython変数、kebab-caseはURLやCSSクラス名でよく使う。",
      },
    ],
  },
  "/url-encode-decode/": {
    useCases: [
      "日本語や記号をURLクエリに入れたいとき。",
      "ログやAPIレスポンス内のパーセントエンコードを読める形へ戻したいとき。",
      "リンク作成前にURLコンポーネントを安全な形式へ変換したいとき。",
    ],
    tips: [
      "URL全体ではなく、クエリ値やパスの一部などコンポーネント単位で変換する。",
      "デコード失敗時は%の後ろが16進数2桁になっているか確認する。",
    ],
    questions: [
      {
        question: "URLエンコードは何のため？",
        answer:
          "URLで特別な意味を持つ文字や日本語を、安全に送れる表現へ変換するため。",
      },
      {
        question: "スペースはどう変換される？",
        answer:
          "encodeURIComponentではスペースは%20になる。フォーム形式では+が使われることもある。",
      },
    ],
  },
  "/base64/": {
    useCases: [
      "Basic認証の値を作る、または確認したいとき。",
      "設定値や短いデータをBase64表現で確認したいとき。",
      "APIレスポンスやJWTの一部に含まれるBase64文字列を調査したいとき。",
    ],
    tips: [
      "Base64は暗号化ではないため、秘密情報の保護には使えない。",
      "URL向けBase64URLとは記号やパディングの扱いが違う場合がある。",
    ],
    questions: [
      {
        question: "Base64は暗号化？",
        answer:
          "暗号化ではなくエンコード。誰でも元のデータへ戻せるため秘密保持には使えない。",
      },
      {
        question: "日本語も変換できる？",
        answer:
          "UTF-8としてバイト列へ変換してからBase64化するため、日本語文字列にも対応する。",
      },
    ],
  },
  "/html-escape/": {
    useCases: [
      "HTML上で<や>をタグではなく文字として表示したいとき。",
      "記事やドキュメントへコード例を安全に載せたいとき。",
      "テンプレート内の表示崩れや意図しないタグ解釈を避けたいとき。",
    ],
    tips: [
      "HTML本文では&、<、>を優先して変換する。属性値では引用符も変換する。",
      "変換後の文字参照を確認したい場合はHTML特殊文字一覧を使う。",
    ],
    questions: [
      {
        question: "HTMLエスケープが必要な文字は？",
        answer:
          "&、<、>、ダブルクォート、シングルクォートは文脈によりエスケープが必要。",
      },
      {
        question: "エスケープすると表示は変わる？",
        answer:
          "ブラウザ表示では元の文字として見えるが、HTMLソース上は文字参照として安全に扱われる。",
      },
    ],
  },
  "/html-special-characters/": {
    useCases: [
      "HTML文字参照の書き方を一覧で確認したいとき。",
      "名前付き文字参照と数値文字参照の対応を調べたいとき。",
      "記事、CMS、テンプレートで記号を安全に表示したいとき。",
    ],
    tips: [
      "よく使う基本文字は&amp;、&lt;、&gt;、&quot;、&apos;、&nbsp;。",
      "名前付き文字参照が分からない文字は数値文字参照でも表せる。",
    ],
    questions: [
      {
        question: "名前付き文字参照と数値文字参照の違いは？",
        answer:
          "名前付きは読みやすい名前で表す。数値はUnicodeコードポイントを10進数または16進数で表す。",
      },
      {
        question: "すべての記号をエスケープする必要は？",
        answer:
          "通常はHTML構文と衝突する文字だけでよい。可読性や文脈に応じて必要な文字を選ぶ。",
      },
    ],
  },
  "/unicode-inspector/": {
    useCases: [
      "文字化け、異体字、絵文字の正体を調べたいとき。",
      "同じ見た目の文字が同一コードポイントか確認したいとき。",
      "UTF-8、UTF-16、UTF-32の表現を見たいとき。",
    ],
    tips: [
      "見た目が同じでもコードポイントが違う文字は検索や比較で一致しないことがある。",
      "不可視文字の混入調査は不可視文字ビューアと併用すると見つけやすい。",
    ],
    questions: [
      {
        question: "コードポイントとは？",
        answer: "Unicodeが各文字へ割り当てた番号。U+3042のような形式で表す。",
      },
      {
        question: "UTF-8とUTF-16は何が違う？",
        answer:
          "同じUnicode文字を保存・通信するための符号化方式が違う。必要なバイト数も変わる。",
      },
    ],
  },
  "/epoch-converter/": {
    useCases: [
      "ログのUnixタイムスタンプを日時へ変換したいとき。",
      "APIに渡すエポック秒・ミリ秒を作りたいとき。",
      "UTCとローカル時刻の見え方を確認したいとき。",
    ],
    tips: [
      "10桁程度は秒、13桁程度はミリ秒として扱われることが多い。",
      "時刻比較ではタイムゾーンも合わせて確認すると誤読を避けられる。",
    ],
    questions: [
      {
        question: "エポック秒とミリ秒の違いは？",
        answer:
          "エポック秒は1970-01-01T00:00:00Zからの秒数。ミリ秒はその1000倍の単位。",
      },
      {
        question: "UTCとローカル時刻を確認できる？",
        answer:
          "ISO 8601、UTC、ローカル時刻、秒、ミリ秒の変換結果をまとめて確認できる。",
      },
    ],
  },
  "/timezone-converter/": {
    useCases: [
      "海外拠点との会議時刻を確認したいとき。",
      "サーバーログのUTC時刻を現地時刻へ変換したいとき。",
      "IANAタイムゾーン名やUTCオフセットを調べたいとき。",
    ],
    tips: [
      "夏時間のある地域は日付によりUTCオフセットが変わる。",
      "Asia/TokyoのようなIANAタイムゾーン名を使うと地域ルールを反映しやすい。",
    ],
    questions: [
      {
        question: "UTCオフセットだけで十分？",
        answer:
          "固定オフセットでは夏時間や地域ルールを扱いにくい。IANAタイムゾーン名の利用が安全。",
      },
      {
        question: "複数タイムゾーンを同時に見られる？",
        answer:
          "変換先タイムゾーンを複数指定し、同じ基準日時の各地現地時刻を一覧確認できる。",
      },
    ],
  },
  "/sql-builder/": {
    useCases: [
      "SELECT、INSERT、UPDATE、CREATE TABLEの下書きを作りたいとき。",
      "検証用SQLを短時間で組み立てたいとき。",
      "値のクォートやNULL、数値、真偽値の扱いを確認したいとき。",
    ],
    tips: [
      "生成SQLは下書きとして使い、実行前に対象DBの方言や権限を確認する。",
      "本番DBへ実行するSQLはWHERE条件と対象件数を必ず確認する。",
    ],
    questions: [
      {
        question: "生成したSQLをそのまま本番で使える？",
        answer:
          "下書き用途。DB方言、テーブル定義、WHERE条件、権限を確認してから使う。",
      },
      {
        question: "文字列値のクォートは付く？",
        answer:
          "入力値の型を判定し、文字列はシングルクォートで囲み、クォート文字をエスケープする。",
      },
    ],
  },
  "/json-validator/": {
    useCases: [
      "設定ファイルやAPIレスポンスのJSON構文を確認したいとき。",
      "エラー位置の行番号・列番号を見て修正したいとき。",
      "有効なJSONを整形して読みやすくしたいとき。",
      "JSONを1行に圧縮して、ログや環境変数に貼り付けたいとき。",
    ],
    tips: [
      "末尾カンマ、引用符不足、コメント混入はJSONエラーの原因になりやすい。",
      "構文検証後にJSON比較へ進むと、差分確認がしやすい。",
    ],
    questions: [
      {
        question: "JSONにコメントは書ける？",
        answer:
          "標準JSONではコメントは使えない。コメント付き設定はJSONCなど別形式として扱う。",
      },
      {
        question: "エラー位置は分かる？",
        answer:
          "構文エラーのposition情報から行番号・列番号を算出して表示する。",
      },
    ],
  },
  "/regex-tester/": {
    useCases: [
      "正規表現のマッチ結果をすぐ確認したいとき。",
      "キャプチャグループの中身や位置を調べたいとき。",
      "置換パターンの結果を実行前に検証したいとき。",
    ],
    tips: [
      "g、i、m、sなどのフラグでマッチ結果が変わる。",
      "想定外の広いマッチを避けるには、境界や量指定子を小さく確認する。",
    ],
    questions: [
      {
        question: "キャプチャグループも確認できる？",
        answer: "マッチごとの位置とキャプチャグループを一覧で確認できる。",
      },
      {
        question: "置換結果も見られる？",
        answer:
          "同じ正規表現パターンでreplaceを実行し、置換後の文字列を確認できる。",
      },
    ],
  },
  "/markdown-editor/": {
    useCases: [
      "README、仕様書、ブログ記事をMarkdown記法を覚えずに書きたいとき。",
      "数式を含むノートやレポートをMarkdownで残したいとき。",
      "表やコードブロックを含む文書を素早く組み立てたいとき。",
    ],
    tips: [
      "Markdown記法（#、-、```など）をそのまま入力しても自動的に対応する要素へ変換される。",
      "数式はインライン$…$とブロック$$…$$の2種類があり、複雑な数式はブロックで書くと見やすい。",
    ],
    questions: [
      {
        question: "書いた内容をMarkdownファイルとして保存できる？",
        answer:
          "編集結果は常にMarkdownソースへ変換され、コピーまたは.mdファイルとして保存できる。",
      },
      {
        question: "数式はどう書けば表示される？",
        answer:
          "TeX記法をインラインなら$で、ブロックなら$$で囲むとKaTeXによって数式として表示される。",
      },
    ],
  },
  "/tex-helper/": {
    useCases: [
      "TeXコマンドを覚えていない数式をMarkdown記事やノートへ入れたいとき。",
      "分数、累乗、総和、積分などの構文をすぐ組み立てたいとき。",
      "数式が正しく表示されるか、書く前にプレビューで確認したいとき。",
    ],
    tips: [
      "分数や括弧のボタンは、テキストを選択してから押すと選択範囲を囲める。",
      "複雑な数式は改行しやすいブロック数式（$$…$$）、文中の短い数式はインライン（$…$）が向く。",
    ],
    questions: [
      {
        question: "TeXコマンドを覚えていなくても使える？",
        answer:
          "ギリシャ文字、演算子、分数、総和、積分などのボタンから挿入できるため、コマンドを覚えていなくても数式を組み立てられる。",
      },
      {
        question: "出力先はMarkdownエディタにそのまま貼れる？",
        answer:
          "出力はインライン$…$またはブロック$$…$$のMarkdown形式のため、Markdownエディタなど数式対応のMarkdown文書へそのまま貼り付けられる。",
      },
    ],
  },
  "/character-count/": {
    useCases: [
      "原稿やSNS投稿、メタディスクリプションの文字数制限を確認したいとき。",
      "データベースのカラム長（VARCHARのバイト数・文字数）に収まるか調べたいとき。",
      "絵文字を含む文字列で、JavaScriptのlengthと見た目の文字数が違う原因を知りたいとき。",
    ],
    tips: [
      "家族の絵文字や国旗のように、見た目は1文字でも複数のコードポイントで構成される文字がある。",
      "MySQLのutf8mb4は文字数、Shift_JIS前提の古いシステムはバイト数で制限することが多い。",
      "Shift_JISで表せない文字（絵文字など）は「?」の1バイトとして数える。",
    ],
    questions: [
      {
        question: "見た目の文字数とコードポイント数はなぜ違う？",
        answer:
          "結合文字や絵文字のZWJシーケンスは複数のコードポイントを組み合わせて1文字に見せるため。見た目の文字数はIntl.Segmenterで書記素クラスタ単位に数えている。",
      },
      {
        question: "日本語1文字は何バイト？",
        answer:
          "UTF-8ではひらがな・漢字の多くが3バイト、Shift_JISでは2バイト。半角カタカナはShift_JISで1バイト、UTF-8で3バイトになる。",
      },
    ],
  },
  "/character-encoding/": {
    useCases: [
      "CSVやメール、古いWebページの文字化け原因を調べたいとき。",
      "Shift_JISやEUC-JPのシステムへ送るバイト列を確認したいとき。",
      "ログやパケットに出ている16進数のバイト列を文字列に戻したいとき。",
    ],
    tips: [
      "「縺薙ｓ縺ｫ縺｡縺ｯ」のような漢字の羅列は、UTF-8をShift_JISとして読んだ典型的な文字化け。",
      "「ã“ã‚“」のような記号混じりは、UTF-8をWindows-1252（Latin-1）として読んだ文字化け。",
      "文字化けした時点で失われたバイトがあると、完全には復元できない。",
    ],
    questions: [
      {
        question: "文字化けはどうやって復元する？",
        answer:
          "文字化けした文字列を、誤って解釈された文字コードでバイト列へ戻し、本来の文字コードで読み直す。組み合わせごとに試し、復元できた候補を表示する。",
      },
      {
        question: "Shift_JISとCP932（Windows-31J）の違いは？",
        answer:
          "ブラウザのShift_JISはWHATWG Encoding Standardに従い、①や髙などのNEC・IBM拡張文字を含むCP932相当で扱う。",
      },
    ],
  },
  "/hash-generator/": {
    useCases: [
      "配布ファイルや設定値のチェックサムを照合したいとき。",
      "キャッシュキーやETag、重複判定用のハッシュ値を確認したいとき。",
      "API署名やWebhook検証のデバッグで、途中のハッシュ値を確かめたいとき。",
    ],
    tips: [
      "ハッシュ値は改行の有無で変わる。シェルのechoは末尾に改行を付けるため、printfと結果が異なる。",
      "MD5とSHA-1は衝突攻撃が知られており、改ざん検知や署名にはSHA-256以上を使う。",
      "パスワードの保存には単純なハッシュではなく、bcryptやArgon2などの専用関数を使う。",
    ],
    questions: [
      {
        question: "ハッシュ値から元の文字列に戻せる？",
        answer:
          "戻せない。ハッシュは一方向の関数で、同じ入力から常に同じ値を得られるが、値から入力を逆算できない。",
      },
      {
        question: "日本語のハッシュ値が他のツールと違う",
        answer:
          "入力をUTF-8バイト列としてハッシュ化している。Shift_JISなど別の文字コードで計算したツールとは値が異なる。",
      },
    ],
  },
  "/line-sort/": {
    useCases: [
      "メールアドレスやIDのリストから重複を除きたいとき。",
      "設定値やimport文、単語リストを並べ替えたいとき。",
      "ログの行を逆順にして新しい順に読みたいとき。",
    ],
    tips: [
      "数値順を有効にすると、file2がfile10より前に並ぶ自然順ソートになる。",
      "前後の空白削除を有効にすると、インデントの違いだけの行も重複とみなす。",
      "大文字小文字を無視した重複削除では、最初に出現した行を残す。",
    ],
    questions: [
      {
        question: "日本語はどの順で並ぶ？",
        answer:
          "Intl.Collatorによる日本語の照合順序で、記号・数字・英字・かな・漢字の順に並ぶ。ひらがなとカタカナは同じ音なら隣り合う。漢字は読み（ふりがな）順にはならない。",
      },
      {
        question: "並び順を変えずに重複だけ削除できる？",
        answer: "並び順を「そのまま」にして重複削除を有効にする。",
      },
    ],
  },
  "/cron-parser/": {
    useCases: [
      "crontabやGitHub Actionsのscheduleに書くcron式を確認したいとき。",
      "既存のcron式がいつ実行されるか調べたいとき。",
      "平日のみ、月初のみなどの指定が意図どおりか確かめたいとき。",
    ],
    tips: [
      "日と曜日の両方を指定すると、どちらかに一致した日に実行される（AND条件ではない）。",
      "GitHub ActionsやAWSなど多くのサービスはUTCで実行するため、日本時間との9時間差に注意。",
      "曜日の0と7はどちらも日曜日を表す。",
    ],
    questions: [
      {
        question: "秒単位の指定（6フィールド）に対応している？",
        answer:
          "標準的な5フィールド（分 時 日 月 曜日）のみ対応。Quartzなど秒を含む形式は先頭の秒フィールドを除いて入力する。",
      },
      {
        question: "実行日時はどのタイムゾーン？",
        answer:
          "ブラウザのタイムゾーンで計算する。サーバーがUTCで動く場合はタイムゾーン変換ツールで時差を確認する。",
      },
    ],
  },
  "/uuid-generator/": {
    useCases: [
      "データベースの主キーやテストデータ用のIDを用意したいとき。",
      "一意なファイル名や相関IDを作りたいとき。",
      "複数のUUIDをまとめて生成したいとき。",
    ],
    tips: [
      "UUID v4は122ビットの乱数で、実用上は重複を気にしなくてよい。",
      "データベースのインデックス効率を重視する場合は、時刻順に並ぶUUID v7も検討する。",
    ],
    questions: [
      {
        question: "生成したUUIDは安全？",
        answer:
          "crypto.randomUUID()は暗号論的に安全な乱数を使う。生成はブラウザ内で完結し、サーバーへ送信しない。",
      },
      {
        question: "UUIDとGUIDの違いは？",
        answer:
          "GUIDはMicrosoftでの呼び名で、形式は同じ。GUIDは大文字や波括弧付きで表記されることが多い。",
      },
    ],
  },
  "/yaml-json-converter/": {
    useCases: [
      "KubernetesマニフェストやGitHub Actionsのワークフローの構造をJSONで確認したいとき。",
      "APIレスポンスのJSONを設定ファイル用のYAMLに書き換えたいとき。",
      "YAMLのインデントや記法の誤りを確認したいとき。",
    ],
    tips: [
      "YAMLはJSONの上位互換で、JSONはそのままYAMLとしても読める。",
      "YAMLのコメントやアンカー（&・*）はJSONへ変換すると失われる。",
      "YAML 1.2ではyes・noは真偽値ではなく文字列として扱う。",
    ],
    questions: [
      {
        question: "複数ドキュメント（---区切り）に対応している？",
        answer:
          "1ドキュメントのみ対応。複数ある場合はエラーになるため、ドキュメントごとに分けて変換する。",
      },
      {
        question: "タブでインデントしたYAMLはエラーになる？",
        answer:
          "YAMLの仕様でインデントにタブは使えないため、スペースに置き換える。",
      },
    ],
  },
}

export const ToolArticle: FC<{ children: ReactNode; href: string }> = ({
  children,
  href,
}) => {
  const tool = toolLinks.find((item) => item.href === href)

  if (!tool) return <>{children}</>

  const relatedTools = (relatedToolHrefs[tool.href] ?? [])
    .map((relatedHref) => toolLinks.find((item) => item.href === relatedHref))
    .filter((item): item is (typeof toolLinks)[number] => Boolean(item))
  const seoText = seoTextByHref[tool.href]

  const structuredData = [
    {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      name: `${siteName} ${tool.title}`,
      url: absoluteUrl(tool.href),
      applicationCategory: "DeveloperApplication",
      operatingSystem: "Web",
      inLanguage: "ja",
      isAccessibleForFree: true,
      description: tool.description,
      featureList: [
        ...tool.usage,
        ...tool.mechanism,
        ...(seoText?.useCases ?? []),
        ...(seoText?.tips ?? []),
      ],
      isPartOf: {
        "@type": "WebSite",
        name: siteName,
        url: siteUrl,
      },
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "JPY",
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: siteName,
          item: siteUrl,
        },
        {
          "@type": "ListItem",
          position: 2,
          name: tool.title,
          item: absoluteUrl(tool.href),
        },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: `${tool.title}の使い方は？`,
          acceptedAnswer: {
            "@type": "Answer",
            text: tool.usage.join(" "),
          },
        },
        {
          "@type": "Question",
          name: `${tool.title}の仕組みは？`,
          acceptedAnswer: {
            "@type": "Answer",
            text: tool.mechanism.join(" "),
          },
        },
        ...(seoText?.questions.map((item) => ({
          "@type": "Question",
          name: item.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: item.answer,
          },
        })) ?? []),
      ],
    },
  ]

  return (
    <div className="toolPage">
      <script
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        type="application/ld+json"
      />
      <header className="toolHeader">
        <nav aria-label="パンくず" className="breadcrumb">
          <ol>
            <li>
              <Link href="/">Restring</Link>
            </li>
            <li>
              <Link href={`/#${tool.category}`}>
                {categoryLabel(tool.category)}
              </Link>
            </li>
            <li aria-current="page">{tool.title}</li>
          </ol>
        </nav>
        <h1>
          <span className="toolHeaderIcon">
            <Icon name={tool.category} size={22} />
          </span>
          {tool.title}
        </h1>
        <p className="lead">{tool.introduction}</p>
      </header>
      <div className="toolBody">{children}</div>
      <div className="articleGrid">
        <section className="articleSection">
          <h2>使い方</h2>
          <ol>
            {tool.usage.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ol>
        </section>
        {seoText && (
          <section className="articleSection">
            <h2>こんな用途に</h2>
            <ul>
              {seoText.useCases.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>
        )}
        <section className="articleSection">
          <h2>仕組み</h2>
          <ul>
            {tool.mechanism.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>
        {seoText && (
          <section className="articleSection">
            <h2>確認ポイント</h2>
            <ul>
              {seoText.tips.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>
        )}
      </div>
      {tool.shell.length > 0 && (
        <section className="articleSection">
          <h2>手元でやるには</h2>
          <div className="shellList">
            {tool.shell.map((item) => (
              <div className="shellItem" key={item.command}>
                <p>{item.label}</p>
                <span>必要環境: {item.environment}</span>
                <pre>
                  <code>{item.command}</code>
                </pre>
              </div>
            ))}
          </div>
        </section>
      )}
      {seoText && (
        <section className="articleSection">
          <h2>よくある質問</h2>
          <div className="faqList">
            {seoText.questions.map((item) => (
              <section className="faqItem" key={item.question}>
                <h3>{item.question}</h3>
                <p>{item.answer}</p>
              </section>
            ))}
          </div>
        </section>
      )}
      {relatedTools.length > 0 && (
        <section className="relatedSection">
          <h2>関連ツール</h2>
          <ul className="toolGrid">
            {relatedTools.map((relatedTool) => (
              <li key={relatedTool.href}>
                <Link className="toolCard" href={relatedTool.href}>
                  <span className="toolCardIcon">
                    <Icon name={relatedTool.category} />
                  </span>
                  <span className="toolCardBody">
                    <strong>{relatedTool.title}</strong>
                    <span>{relatedTool.description}</span>
                  </span>
                  <Icon name="arrow" size={16} />
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  )
}
