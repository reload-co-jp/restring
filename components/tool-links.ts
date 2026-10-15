export const toolCategories = [
  { id: "compare", label: "比較・差分" },
  { id: "text", label: "文字列変換" },
  { id: "unicode", label: "文字・Unicode" },
  { id: "web", label: "Web・エンコード" },
  { id: "time", label: "日時・タイムゾーン" },
  { id: "dev", label: "開発補助" },
  { id: "editor", label: "エディタ・数式" },
] as const

export type ToolCategoryId = (typeof toolCategories)[number]["id"]

export const toolLinks = [
  {
    href: "/text-compare/",
    category: "compare" as ToolCategoryId,
    title: "テキスト比較",
    description:
      "2つの文字列を行・単語・文字単位で比較。インライン表示と左右表示に対応。",
    introduction:
      "2つのテキストを貼り付けるだけで差分を確認できる比較ツール。コード、設定ファイル、原稿などの変更点を行・単語・文字単位で素早く見つけられる。",
    usage: [
      "比較元と比較先へ文字列を貼り付ける。",
      "行単位、単語単位、文字単位から比較粒度を選ぶ。",
      "必要に応じてスペース、改行、タブ、大文字小文字を無視する。",
    ],
    mechanism: [
      "入力を指定粒度で分割し、共通部分と追加・削除部分を計算。",
      "インライン表示では差分箇所を色分けし、左右表示では正規化後の内容を並べる。",
    ],
    shell: [
      {
        label: "行単位で比較",
        environment: "diff（macOS/Linux標準搭載が多い）",
        command: "diff -u before.txt after.txt",
      },
    ],
  },
  {
    href: "/json-compare/",
    category: "compare" as ToolCategoryId,
    title: "JSON比較",
    description: "JSONを検証し、整形表示。キー順を無視して構造比較。",
    introduction:
      "2つのJSONを整形しながら構造差分を確認できるツール。APIレスポンス、設定ファイル、ログの比較でキー順に惑わされず中身の違いを確認できる。",
    usage: [
      "JSON AとJSON Bへ比較対象を貼り付ける。",
      "構文エラーがある場合はエラーメッセージを確認する。",
      "整形済みJSONと構造一致・不一致を確認する。",
    ],
    mechanism: [
      "JSON.parseで構文検証し、成功した値をインデント付きで表示。",
      "オブジェクトのキーを再帰的にソートしてから比較するため、キー順だけの違いは無視。",
    ],
    shell: [
      {
        label: "キー順を揃えて比較",
        environment: "jq、diff、bash/zshなどプロセス置換に対応したシェル",
        command: "diff -u <(jq -S . a.json) <(jq -S . b.json)",
      },
    ],
  },
  {
    href: "/jwt-decoder/",
    category: "web" as ToolCategoryId,
    title: "JWTデコード・解析",
    description:
      "JWT（JSON Web Token）をオンラインでデコードし、Header・Payload・署名を分解表示。exp・iatなど有効期限確認とHS256/HS384/HS512のHMAC署名検証に対応。",
    introduction:
      "JWTをブラウザ上で分解し、Header・Payload・署名を確認できる解析ツール。認証トークンのクレーム確認、有効期限調査、HMAC署名検証に使える。",
    usage: [
      "JWT文字列を入力する。",
      "HeaderとPayloadのJSONを確認する。",
      "exp、nbf、iatなどの時刻クレームと有効期限状態を確認する。",
      "HS256、HS384、HS512の場合はHMAC秘密鍵を入力して署名一致を確認する。",
    ],
    mechanism: [
      "JWTをドット区切りでHeader、Payload、Signatureへ分割。",
      "HeaderとPayloadをBase64URLデコードし、JSONとして整形表示。",
      "HMAC系アルゴリズムはWeb Crypto APIで署名を再計算し、JWT内の署名と比較。",
      "RS256やES256など公開鍵方式の署名検証は未対応。",
    ],
    shell: [
      {
        label: "HeaderとPayloadをデコード",
        environment: "Python 3",
        command:
          'python3 -c \'import base64,json,sys; t=sys.stdin.read().strip().split("."); dec=lambda s: json.dumps(json.loads(base64.urlsafe_b64decode(s+"="*((4-len(s)%4)%4))),ensure_ascii=False,indent=2); print("Header:\\n"+dec(t[0])+"\\nPayload:\\n"+dec(t[1]))\'',
      },
      {
        label: "HS256署名を検証",
        environment: "Python 3、HMAC秘密鍵",
        command:
          'python3 -c \'import base64,hmac,hashlib,sys; token=sys.stdin.read().strip(); secret=b"secret"; h,p,s=token.split("."); sig=base64.urlsafe_b64encode(hmac.new(secret,f"{h}.{p}".encode(),hashlib.sha256).digest()).decode().rstrip("="); print("署名一致" if sig==s else "署名不一致")\'',
      },
    ],
  },
  {
    href: "/text-diff/",
    category: "compare" as ToolCategoryId,
    title: "テキスト差分",
    description:
      "2つのテキストから追加・削除された差分だけをオンラインで抽出。diffの追加行・削除行のみ確認したい変更点洗い出しに。",
    introduction:
      "比較結果から追加・削除部分だけを抜き出す差分抽出ツール。レビュー前の変更点整理や、長い文章から変更箇所だけ確認したい場面に向く。",
    usage: [
      "比較元と比較先を入力する。",
      "比較粒度と無視オプションを選ぶ。",
      "追加・削除された要素だけ確認する。",
    ],
    mechanism: [
      "テキスト比較と同じ差分計算を使い、同一部分を除外。",
      "差分結果を追加・削除ラベル付きで抽出表示。",
    ],
    shell: [
      {
        label: "追加・削除行だけ表示",
        environment: "diff、sed（macOS/Linux標準搭載が多い）",
        command: "diff -u before.txt after.txt | sed -n '/^[+-][^+-]/p'",
      },
    ],
  },
  {
    href: "/text-normalize/",
    category: "text" as ToolCategoryId,
    title: "テキスト正規化",
    description: "前後空白削除、連続スペース圧縮、Unicode正規化、改行統一。",
    introduction:
      "余分な空白、改行コード、Unicode表現をまとめて整えるテキスト正規化ツール。コピペ由来の揺れやデータ投入前の表記ぶれを減らせる。",
    usage: [
      "入力欄へ整えたい文字列を貼り付ける。",
      "出力欄で正規化結果を確認する。",
      "コピーまたは保存で再利用する。",
    ],
    mechanism: [
      "UnicodeをNFCへ正規化。",
      "連続する空白を1文字に圧縮し、CRLF/CRをLFへ統一して前後空白を削除。",
    ],
    shell: [
      {
        label: "空白・改行・Unicodeを正規化",
        environment: "Python 3",
        command:
          'python3 -c \'import re,sys,unicodedata; s=sys.stdin.read().replace("\\r\\n","\\n").replace("\\r","\\n"); s=unicodedata.normalize("NFC",s); print(re.sub(r"[^\\S\\r\\n]+"," ",s).strip())\' < input.txt',
      },
    ],
  },
  {
    href: "/invisible-character-viewer/",
    category: "unicode" as ToolCategoryId,
    title: "不可視文字ビューア",
    description: "スペース、タブ、CR、LF、NBSP、ゼロ幅スペースを可視化。",
    introduction:
      "見た目では判別しにくい空白、タブ、改行、ゼロ幅スペースを可視化する調査ツール。差分不一致や文字列比較エラーの原因探しに使える。",
    usage: [
      "不可視文字を含む文字列を入力する。",
      "出力欄でスペース、タブ、改行などの位置を確認する。",
      "コピーして調査メモやレビューに使う。",
    ],
    mechanism: [
      "文字列を1文字ずつ走査し、不可視文字を読みやすい名前へ置換。",
      "通常文字はそのまま残すため、混入箇所を文脈付きで確認可能。",
    ],
    shell: [
      {
        label: "不可視文字を名前へ置換",
        environment: "Python 3",
        command:
          'python3 -c \'import sys; m={" ":"<Space>","\\t":"<Tab>","\\r":"<CR>","\\n":"<LF>\\n","\\u00a0":"<NBSP>","\\u200b":"<ZWSP>"}; print("".join(m.get(c,c) for c in sys.stdin.read()))\' < input.txt',
      },
    ],
  },
  {
    href: "/line-ending-converter/",
    category: "text" as ToolCategoryId,
    title: "改行コード変換",
    description:
      "改行コード（LF・CRLF・CR）をオンラインで相互変換。WindowsとmacOS/Linux間の改行トラブル、Gitの差分崩れ解消に。",
    introduction:
      "LF、CRLF、CRの改行コードを相互変換するツール。OS間のファイル受け渡し、Git差分のノイズ削減、CSVやログの整形に役立つ。",
    usage: [
      "変換したいテキストを入力する。",
      "LF、CRLF、CRから出力形式を選ぶ。",
      "結果をコピーまたは保存する。",
    ],
    mechanism: [
      "入力中のCRLF/CRを一度LFへ統一。",
      "選択された改行コードへLFを置換して出力。",
    ],
    shell: [
      {
        label: "CRLFへ変換",
        environment: "Python 3",
        command:
          'python3 -c \'import sys; s=sys.stdin.read().replace("\\r\\n","\\n").replace("\\r","\\n"); sys.stdout.write(s.replace("\\n","\\r\\n"))\' < input.txt > output.txt',
      },
    ],
  },
  {
    href: "/case-converter/",
    category: "text" as ToolCategoryId,
    title: "ケース変換",
    description:
      "UPPERCASE、lowercase、camelCase、PascalCase、snake_case、kebab-caseへ変換。",
    introduction:
      "文字列を複数の命名規則へ一括変換するケース変換ツール。変数名、ファイル名、URLスラッグ、APIフィールド名の作成を短時間で済ませられる。",
    usage: [
      "変換したい文字列を入力する。",
      "出力したいケース形式を選ぶ。",
      "変数名、ファイル名、URL slug作成に使う。",
    ],
    mechanism: [
      "空白、ハイフン、アンダースコア、camelCase境界で単語へ分割。",
      "単語を小文字化し、選択形式に応じて連結・大文字化。",
    ],
    shell: [
      {
        label: "snake_caseへ変換",
        environment: "Python 3",
        command:
          'python3 -c \'import re,sys; s=sys.stdin.read().strip(); s=re.sub(r"([a-z0-9])([A-Z])",r"\\1 \\2",s); print("_".join(w.lower() for w in re.split(r"[\\s_-]+",s) if w))\'',
      },
    ],
  },
  {
    href: "/url-encode-decode/",
    category: "web" as ToolCategoryId,
    title: "URLエンコード・デコード",
    description:
      "URLやクエリパラメータをオンラインでエンコード・デコード。パーセントエンコーディングと日本語変換に対応。",
    introduction:
      "URLコンポーネントを安全な表現へ変換し、エンコード済み文字列を元に戻すツール。日本語URL、クエリ文字列、ログ内URLの確認に使える。",
    usage: [
      "URLパラメータや日本語文字列を入力する。",
      "エンコード結果とデコード結果を確認する。",
      "API検証やクエリ文字列作成に使う。",
    ],
    mechanism: [
      "encodeURIComponentでURLに安全な表現へ変換。",
      "decodeURIComponentでパーセントエンコード文字列を復元。",
    ],
    shell: [
      {
        label: "URLエンコード",
        environment: "Python 3",
        command:
          "python3 -c 'import sys,urllib.parse; print(urllib.parse.quote(sys.stdin.read().strip(), safe=\"\"))'",
      },
      {
        label: "URLデコード",
        environment: "Python 3",
        command:
          "python3 -c 'import sys,urllib.parse; print(urllib.parse.unquote(sys.stdin.read().strip()))'",
      },
    ],
  },
  {
    href: "/base64/",
    category: "web" as ToolCategoryId,
    title: "Base64",
    description:
      "Base64文字列をオンラインでエンコード・デコード。UTF-8対応で日本語も文字化けなし。Basic認証やデータURIの確認に。",
    introduction:
      "文字列とBase64表現を相互変換するツール。Basic認証値、設定値、軽量データ、APIレスポンス内のBase64文字列を素早く確認できる。",
    usage: [
      "文字列またはBase64文字列を入力する。",
      "エンコード結果とデコード結果を確認する。",
      "設定値や軽量データの確認に使う。",
    ],
    mechanism: [
      "UTF-8バイト列をBase64へ変換。",
      "Base64入力はバイト列へ戻し、UTF-8文字列として復元。",
    ],
    shell: [
      {
        label: "Base64エンコード",
        environment: "Python 3",
        command:
          "python3 -c 'import base64,sys; print(base64.b64encode(sys.stdin.buffer.read()).decode())'",
      },
      {
        label: "Base64デコード",
        environment: "Python 3",
        command:
          "python3 -c 'import base64,sys; sys.stdout.buffer.write(base64.b64decode(sys.stdin.read()))'",
      },
    ],
  },
  {
    href: "/qr-code-generator/",
    category: "web" as ToolCategoryId,
    title: "QRコード生成",
    description:
      "URLやテキストからQRコードを作成。誤り訂正レベル・余白・色を指定し、PNGまたはSVGで保存。",
    introduction:
      "URLやテキストをQRコードに変換するツール。印刷物やスライドへのURL掲載、イベントの受付、Wi-Fi接続情報の共有などに使える。",
    usage: [
      "QRコードにしたいURLやテキストを入力する。",
      "誤り訂正レベル、余白、色を選ぶ。",
      "プレビューを確認し、PNGまたはSVGで保存する。",
    ],
    mechanism: [
      "入力をUTF-8のバイト列にし、誤り訂正レベルに応じて最小のバージョン（サイズ）を自動で選んで符号化。",
      "セルをSVGのパスとして描画し、PNGはSVGをcanvasに描いて書き出す。",
    ],
    shell: [
      {
        label: "PNGで生成",
        environment: "qrencode（要インストール）",
        command: "qrencode -o qrcode.png -s 10 'https://example.com/'",
      },
      {
        label: "ターミナルに表示",
        environment: "qrencode",
        command: "qrencode -t ansiutf8 'https://example.com/'",
      },
    ],
  },
  {
    href: "/html-escape/",
    category: "web" as ToolCategoryId,
    title: "HTMLエスケープ",
    description:
      "HTML特殊文字（&・<・>・引用符）をオンラインでエスケープ・アンエスケープ。コード例やテンプレート作成、表示崩れ調査に。",
    introduction:
      "HTML特殊文字をエンティティへ変換し、エスケープ済み文字列を復元するツール。コード例の掲載、テンプレート作成、表示崩れ調査に使える。",
    usage: [
      "HTMLとして扱いたい文字列を入力する。",
      "エスケープ結果とアンエスケープ結果を確認する。",
      "記事、テンプレート、コード例の表示前確認に使う。",
    ],
    mechanism: [
      "&、<、>、ダブルクォート、シングルクォートをHTMLエンティティへ置換。",
      "既知のHTMLエンティティは対応する文字へ戻す。",
    ],
    shell: [
      {
        label: "HTMLエスケープ",
        environment: "Python 3",
        command:
          "python3 -c 'import html,sys; print(html.escape(sys.stdin.read(), quote=True))'",
      },
      {
        label: "HTMLアンエスケープ",
        environment: "Python 3",
        command:
          "python3 -c 'import html,sys; print(html.unescape(sys.stdin.read()))'",
      },
    ],
  },
  {
    href: "/html-special-characters/",
    category: "unicode" as ToolCategoryId,
    title: "HTML特殊文字一覧",
    description:
      "HTML特殊文字と文字参照の対応表。表示文字、名前付き文字参照、数値文字参照、用途を確認。",
    introduction:
      "HTMLでそのまま書くと解釈が変わる文字や、記号としてよく使う文字参照を一覧で確認できるページ。エスケープ前後の対応確認、記事やテンプレートの修正に使える。",
    usage: [
      "変換したい文字を一覧表から探す。",
      "HTMLに書く場合は名前付き文字参照または数値文字参照を使う。",
      "文章中でコードや記号を安全に表示したい箇所へ貼り付ける。",
    ],
    mechanism: [
      "HTMLでは&、<、>、引用符などが構文として解釈されるため、文字参照で表す。",
      "名前付き文字参照と数値文字参照はどちらもブラウザで対応する文字として表示される。",
    ],
    shell: [],
  },
  {
    href: "/unicode-inspector/",
    category: "unicode" as ToolCategoryId,
    title: "Unicodeインスペクタ",
    description:
      "文字のUnicodeコードポイント、UTF-8・UTF-16・UTF-32表現、文字名をオンラインで確認。文字化けや異体字、絵文字の調査に。",
    introduction:
      "入力文字をUnicodeコードポイント単位で解析するインスペクタ。文字化け、異体字、絵文字、不可視文字の正体をコード表現から確認できる。",
    usage: [
      "調べたい文字列を入力する。",
      "各文字のコードポイント、UTF-8、UTF-16、UTF-32を確認する。",
      "文字化け、異体字、不可視文字の調査に使う。",
    ],
    mechanism: [
      "入力をUnicodeコードポイント単位で分解。",
      "各文字をUTF表現へ変換し、代表的なUnicodeブロック名と併せて表示。",
    ],
    shell: [
      {
        label: "コードポイントと文字名を表示",
        environment: "Python 3",
        command:
          'python3 -c \'import sys,unicodedata; [print(f"{c}\\tU+{ord(c):04X}\\t{unicodedata.name(c, "UNKNOWN")}") for c in sys.stdin.read()]\'',
      },
    ],
  },
  {
    href: "/epoch-converter/",
    category: "time" as ToolCategoryId,
    title: "エポック時間変換",
    description:
      "Unixエポック秒・ミリ秒と日時をオンラインで相互変換。ISO 8601、UTC、ローカル時刻表示に対応。ログのタイムスタンプ調査やAPIレスポンス確認に。",
    introduction:
      "Unixエポック秒・ミリ秒と日時表現を相互変換するツール。ログ、DB、APIレスポンスに含まれるタイムスタンプを人間が読める時刻へ変換できる。",
    usage: [
      "エポック秒・ミリ秒、または日時文字列を入力する。",
      "現在時刻ボタンで今の時刻を秒・ミリ秒表記でセットする。",
      "秒、ミリ秒、ISO 8601、UTC、ローカル時刻の変換結果を確認する。",
    ],
    mechanism: [
      "入力が整数のみの場合はエポック値とみなし、桁数からミリ秒・秒を判定して日時へ変換。",
      "整数以外の場合は日時文字列としてDate解析し、エポック秒・ミリ秒へ変換。",
    ],
    shell: [
      {
        label: "エポック秒を日時へ変換",
        environment: "Python 3",
        command:
          "python3 -c 'import sys,datetime; print(datetime.datetime.fromtimestamp(int(sys.argv[1]), datetime.timezone.utc).isoformat())' 1700000000",
      },
      {
        label: "日時をエポック秒へ変換",
        environment: "Python 3",
        command:
          "python3 -c 'import sys,datetime; print(int(datetime.datetime.fromisoformat(sys.argv[1]).timestamp()))' 2024-01-01T00:00:00+00:00",
      },
    ],
  },
  {
    href: "/timezone-converter/",
    category: "time" as ToolCategoryId,
    title: "タイムゾーン検索・変換",
    description:
      "IANAタイムゾーン名をオンラインで検索し、基準日時を複数タイムゾーンの現地時刻へ一括変換。UTCオフセット確認や海外拠点との会議調整、サーバーログの時刻確認に。",
    introduction:
      "IANAタイムゾーンを検索し、同じ日時を複数地域の現地時刻へ変換するツール。UTCオフセット確認、海外チームとの調整、ログ調査に使える。",
    usage: [
      "都市名や地域名（例: Tokyo、America）でタイムゾーンを検索する。",
      "基準日時（ISO 8601形式）を入力する。",
      "変換先タイムゾーンをカンマ区切りで入力し、各地の現地時刻を確認する。",
    ],
    mechanism: [
      "Intl.supportedValuesOfでブラウザ搭載のIANAタイムゾーン一覧を取得し、入力語で部分一致検索。",
      "Intl.DateTimeFormatで基準日時を各タイムゾーンの現地時刻とUTCオフセットへ変換。",
    ],
    shell: [
      {
        label: "タイムゾーン名を検索",
        environment: "Python 3",
        command:
          "python3 -c 'import zoneinfo,sys; [print(z) for z in sorted(zoneinfo.available_timezones()) if sys.argv[1].lower() in z.lower()]' Tokyo",
      },
      {
        label: "指定タイムゾーンの現在時刻を表示",
        environment: "date（macOS/Linux標準搭載）",
        command: "TZ=Asia/Tokyo date",
      },
    ],
  },
  {
    href: "/sql-builder/",
    category: "dev" as ToolCategoryId,
    title: "SQL文簡易作成",
    description:
      "SELECT・INSERT・UPDATE・CREATE TABLE文をオンラインで組み立て。テーブル名、カラム、WHERE条件を入力するだけでSQLクエリを自動生成。値のクォート付与にも対応。",
    introduction:
      "入力項目からSELECT、INSERT、UPDATE、CREATE TABLE文を組み立てるSQL作成ツール。定型クエリの下書きや検証用SQLの作成時間を短縮できる。",
    usage: [
      "SELECT、INSERT、UPDATE、CREATE TABLEから作成するSQL文を選ぶ。",
      "テーブル名、カラム、WHERE条件など必要項目を入力する。",
      "生成されたSQL文をコピーまたは保存する。",
    ],
    mechanism: [
      "入力値の型（数値・真偽値・NULL・文字列）を判定し、文字列のみシングルクォートで囲みエスケープ。",
      "選択したSQL文の種類に応じてSELECT・INSERT・UPDATE・CREATE TABLE構文を組み立て。",
    ],
    shell: [
      {
        label: "INSERT文をPythonで組み立て",
        environment: "Python 3",
        command:
          "python3 -c \"cols=['name','email']; vals=['Restring','hello@example.com']; print(f\\\"INSERT INTO users ({', '.join(cols)}) VALUES ({', '.join(repr(v) for v in vals)});\\\")\"",
      },
    ],
  },
  {
    href: "/json-validator/",
    category: "dev" as ToolCategoryId,
    title: "JSON構文チェック",
    description:
      "JSONをオンラインで構文検証。構文エラー時はエラー箇所の行番号・列番号を表示し、有効な場合は整形済みJSONを出力。設定ファイルやAPIレスポンスの構文確認に。",
    introduction:
      "JSONの構文エラーを検出し、正常なJSONは読みやすく整形する検証ツール。設定ファイル、APIレスポンス、ログ断片の確認に使える。",
    usage: [
      "検証したいJSONを入力する。",
      "構文エラーがある場合はエラーメッセージと該当行・列を確認する。",
      "有効な場合は整形済みJSONをコピーまたは保存する。",
    ],
    mechanism: [
      "JSON.parseで構文検証し、失敗時はエラーメッセージ中のposition情報から行番号・列番号を算出。",
      "成功時はインデント付きで整形して表示。",
    ],
    shell: [
      {
        label: "JSON構文を検証",
        environment: "jq、Python 3（jqが無い場合）",
        command: "jq empty input.json && echo valid || echo invalid",
      },
    ],
  },
  {
    href: "/markdown-editor/",
    category: "editor" as ToolCategoryId,
    title: "Markdownエディタ",
    description:
      "Markdown文書をオンラインで見たまま編集。見出し・リスト・表・コードブロックに加え、KaTeXによるインライン数式・ブロック数式に対応。",
    introduction:
      "Markdown記法を意識せず見たまま編集できるWYSIWYGエディタ。見出し、リスト、表、コードブロックのほか、KaTeXによる数式表示に対応し、編集結果は常にMarkdownとして取得できる。",
    usage: [
      "編集エリアへ直接入力するか、「/」でブロックメニューを開いて要素を挿入する。",
      "数式はインラインなら$で、ブロックなら$$で囲んで入力する。",
      "編集結果はMarkdownソースとして表示され、コピーまたは保存で再利用できる。",
    ],
    mechanism: [
      "ProseMirrorベースのMilkdownエディタで、見たまま編集とMarkdown構文を相互変換。",
      "数式部分はKaTeXでレンダリングし、TeX記法をそのままMarkdown内に保持。",
    ],
    shell: [],
  },
  {
    href: "/tex-helper/",
    category: "editor" as ToolCategoryId,
    title: "TeX数式入力補助",
    description:
      "ギリシャ文字・演算子・分数・累乗・総和・積分などのTeX記法をボタンで入力。KaTeXでリアルタイムプレビューし、Markdown形式の数式として出力。",
    introduction:
      "TeXコマンドを覚えていなくても、記号パレットのボタンから数式を組み立てられる入力補助ツール。KaTeXによるプレビューを確認しながら、インライン数式$…$またはブロック数式$$…$$のMarkdown形式で結果を取得できる。",
    usage: [
      "ギリシャ文字、演算子、分数、累乗、総和、積分などのボタンをクリックしてTeXコードへ挿入する。",
      "テキストを選択した状態でボタンを押すと、選択範囲を分数の分子や括弧の中などへ囲める。",
      "インライン数式・ブロック数式を切り替え、プレビューを確認しながらMarkdown形式でコピーまたは保存する。",
    ],
    mechanism: [
      "各ボタンはTeXコード入力欄のカーソル位置または選択範囲の前後へ、対応するTeXコマンドを挿入する。",
      "入力されたTeXコードはKaTeXでリアルタイムに数式へレンダリングし、構文エラー時はエラー内容を表示する。",
      "出力はインラインなら$…$、ブロックなら$$…$$で囲んだMarkdown形式に変換される。",
    ],
    shell: [],
  },
  {
    href: "/regex-tester/",
    category: "dev" as ToolCategoryId,
    title: "正規表現チェック",
    description:
      "正規表現パターンをオンラインでテスト。マッチ箇所・位置・キャプチャグループを一覧表示し、置換結果も確認。バリデーション作成やログ抽出パターンの検証に。",
    introduction:
      "正規表現パターンをテスト文字列に当て、マッチ位置、キャプチャ、置換結果を確認できるツール。バリデーションやログ抽出条件の調整に向く。",
    usage: [
      "正規表現パターンとフラグ（g、i、m、sなど）を入力する。",
      "テスト文字列を入力し、マッチ箇所・位置・キャプチャグループを確認する。",
      "置換文字列を入力し、置換結果を確認する。",
    ],
    mechanism: [
      "RegExpオブジェクトを生成し、execを繰り返してマッチ箇所・位置・キャプチャグループを収集。",
      "同じパターンでreplaceを実行し、置換結果を生成。",
    ],
    shell: [
      {
        label: "正規表現でマッチ抽出",
        environment: "Python 3",
        command:
          "python3 -c \"import re,sys; print(re.findall(r'\\d+', sys.stdin.read()))\" <<< 'order 12345 qty 6'",
      },
    ],
  },
  {
    href: "/character-count/",
    category: "unicode" as ToolCategoryId,
    title: "文字数カウント",
    description:
      "文字数・バイト数・行数・単語数をカウント。絵文字や結合文字も見た目どおり1文字として数え、UTF-8とShift_JISのバイト数も表示。",
    introduction:
      "入力した文字列の文字数を複数の基準で数えるツール。原稿の文字数制限、データベースのカラム長、SNSの投稿文字数の確認に使える。",
    usage: [
      "数えたい文字列を入力する。",
      "見た目の文字数、空白・改行を除いた文字数を確認する。",
      "システムの制限に合わせてコードポイント数、UTF-16単位数、バイト数を確認する。",
    ],
    mechanism: [
      "Intl.Segmenterで書記素クラスタ（見た目の1文字）と単語に分割して数える。",
      "UTF-8はTextEncoder、Shift_JISはブラウザのTextDecoderから作った変換表でバイト数を算出。",
    ],
    shell: [
      {
        label: "文字数・行数・バイト数",
        environment: "wc（macOS/Linux標準搭載）",
        command: "wc -m -l -c input.txt",
      },
    ],
  },
  {
    href: "/character-encoding/",
    category: "unicode" as ToolCategoryId,
    title: "文字コード変換・文字化け復元",
    description:
      "文字列とUTF-8・Shift_JIS・EUC-JPのバイト列を相互変換。文字化けした文字列から元の文字列を復元する候補を表示。",
    introduction:
      "日本語の文字コードを確認・変換するツール。CSVやメールの文字化け原因の調査、レガシーシステムとの連携時のバイト列確認に使える。",
    usage: [
      "文字列を入力し、文字コードを選んでバイト列を確認する。",
      "16進数のバイト列を入力し、各文字コードで復号した結果を比べる。",
      "文字化けした文字列を入力し、復元候補から正しいものを選ぶ。",
    ],
    mechanism: [
      "復号はブラウザのTextDecoder（WHATWG Encoding Standard）を使用。",
      "符号化は全バイト列をTextDecoderで復号して逆引き表を作り、文字ごとに置き換える。",
      "文字化け復元は、誤って解釈された文字コードでバイト列へ戻し、別の文字コードで読み直す。",
    ],
    shell: [
      {
        label: "Shift_JISからUTF-8へ変換",
        environment: "iconv（macOS/Linux標準搭載が多い）",
        command: "iconv -f SHIFT_JIS -t UTF-8 input.txt > output.txt",
      },
      {
        label: "バイト列を16進数で表示",
        environment: "xxd（macOS/Linux標準搭載が多い）",
        command: "printf 'あ' | iconv -t SHIFT_JIS | xxd",
      },
    ],
  },
  {
    href: "/hash-generator/",
    category: "web" as ToolCategoryId,
    title: "ハッシュ生成",
    description:
      "文字列からMD5・SHA-1・SHA-256・SHA-384・SHA-512のハッシュ値を同時に生成。UTF-8対応。",
    introduction:
      "文字列のハッシュ値を計算するツール。チェックサムの照合、キャッシュキーやETagの確認、APIの署名検証のデバッグに使える。",
    usage: [
      "ハッシュ化したい文字列を入力する。",
      "各アルゴリズムのハッシュ値を確認し、必要なものをコピーする。",
    ],
    mechanism: [
      "入力をUTF-8バイト列に変換してからハッシュ化。",
      "SHA系はWeb Crypto API、MD5はWeb Crypto APIが非対応のためRFC 1321に沿った実装で計算。",
    ],
    shell: [
      {
        label: "SHA-256",
        environment: "shasum（macOS）、sha256sum（Linux）",
        command: "printf '%s' 'hello' | shasum -a 256",
      },
      {
        label: "MD5",
        environment: "md5（macOS）、md5sum（Linux）",
        command: "printf '%s' 'hello' | md5",
      },
    ],
  },
  {
    href: "/line-sort/",
    category: "text" as ToolCategoryId,
    title: "行の並べ替え・重複削除",
    description:
      "テキストを行単位で並べ替え、重複行・空行を削除。数値順ソートと大文字小文字の無視に対応。",
    introduction:
      "行単位でテキストを整理するツール。メールアドレスやIDのリスト、ログ、設定値の重複確認や並べ替えに使える。",
    usage: [
      "整理したいテキストを1行1項目で入力する。",
      "並び順と、重複削除・空行削除などのオプションを選ぶ。",
      "出力の行数を確認してコピーまたは保存する。",
    ],
    mechanism: [
      "前後の空白削除、空行削除、重複削除、並べ替えの順に処理。",
      "並べ替えはIntl.Collatorによる日本語の照合順序で、数値順を選ぶとitem2がitem10より前になる。",
    ],
    shell: [
      {
        label: "並べ替えて重複削除",
        environment: "sort（macOS/Linux標準搭載）",
        command: "sort -u input.txt",
      },
      {
        label: "数値順で並べ替え",
        environment: "GNU sort、macOS sort",
        command: "sort -V input.txt",
      },
    ],
  },
  {
    href: "/cron-parser/",
    category: "time" as ToolCategoryId,
    title: "cron式の解説",
    description:
      "cron式を分・時・日・月・曜日に分解して実行条件を表示し、次回以降の実行日時を一覧表示。",
    introduction:
      "crontabやジョブスケジューラのcron式を確認するツール。設定した式が意図どおりの日時に実行されるかを事前に確認できる。",
    usage: [
      "cron式を入力するか、プリセットから選ぶ。",
      "フィールドごとの実行される値を確認する。",
      "次回以降の実行日時が意図どおりか確認する。",
    ],
    mechanism: [
      "*、範囲（1-5）、間隔（*/15）、列挙（1,15）、月・曜日の英語名、@dailyなどのマクロを解析。",
      "日と曜日の両方を指定した場合は、Vixie cronと同じくどちらかに一致すれば実行とみなす。",
      "実行日時はブラウザのタイムゾーンで計算。",
    ],
    shell: [
      {
        label: "現在のcrontabを表示",
        environment: "cron（macOS/Linux）",
        command: "crontab -l",
      },
    ],
  },
  {
    href: "/uuid-generator/",
    category: "dev" as ToolCategoryId,
    title: "UUID生成",
    description: "UUID v4を一括生成。大文字・ハイフンなしの形式に対応。",
    introduction:
      "ランダムなUUID v4を生成するツール。データベースの主キー、テストデータ、一意なファイル名の作成に使える。",
    usage: [
      "生成数を選ぶ。",
      "必要に応じて大文字やハイフンなしの形式に切り替える。",
      "結果をコピーまたは保存する。",
    ],
    mechanism: [
      "crypto.randomUUID()で暗号論的に安全な乱数からUUID v4を生成。",
      "生成はブラウザ内で完結し、サーバーへ送信しない。",
    ],
    shell: [
      {
        label: "UUIDを生成",
        environment: "uuidgen（macOS/Linux標準搭載が多い）",
        command: "uuidgen | tr 'A-Z' 'a-z'",
      },
    ],
  },
  {
    href: "/data-converter/",
    category: "dev" as ToolCategoryId,
    title: "データ形式変換",
    description:
      "JSON・YAML・XML・CSV・TSVを相互変換。XMLの属性、CSVの見出し行と引用符に対応。",
    introduction:
      "構造化データの形式を相互に変換するツール。APIレスポンスのJSONをCSVにして表計算ソフトで開いたり、XMLをJSONやYAMLで確認したりできる。",
    usage: [
      "入力形式と出力形式を選び、データを入力する。",
      "変換結果をコピーまたは保存する。",
      "「入れ替え」で入力形式と出力形式を入れ替え、変換結果を次の入力にする。",
    ],
    mechanism: [
      "入力をいったんJavaScriptの値に変換し、出力形式で書き出す。",
      "XMLは属性を「@名前」、テキストを「#text」のキーに対応させ、同名の子要素は配列にする。",
      "CSV・TSVはRFC 4180に沿って引用符と改行を扱い、1行目を見出しとしてオブジェクトの配列にする。",
    ],
    shell: [
      {
        label: "JSONをCSVへ変換",
        environment: "jq",
        command:
          "jq -r '(.[0] | keys_unsorted) as $k | $k, (.[] | [.[$k[]]]) | @csv' input.json",
      },
      {
        label: "XMLをJSONへ変換",
        environment: "yq（要インストール）",
        command: "yq -p=xml -o=json input.xml",
      },
    ],
  },
  {
    href: "/yaml-json-converter/",
    category: "dev" as ToolCategoryId,
    title: "YAML・JSON変換",
    description: "YAMLとJSONを相互変換。構文エラー時はエラーメッセージを表示。",
    introduction:
      "YAMLとJSONを相互に変換するツール。Kubernetesマニフェスト、GitHub Actions、docker-composeなどの設定ファイルの確認や書き換えに使える。",
    usage: [
      "変換方向を選び、YAMLまたはJSONを入力する。",
      "変換結果をコピーまたは保存する。",
      "変換方向を切り替えると、変換結果が次の入力になる。",
    ],
    mechanism: [
      "YAML 1.2に対応したyamlライブラリで解析・出力。",
      "JSONはJSON.parseで解析し、YAMLからの変換結果はインデント2で整形。",
    ],
    shell: [
      {
        label: "YAMLをJSONへ変換",
        environment: "yq（要インストール）",
        command: "yq -o=json input.yaml",
      },
    ],
  },
  {
    href: "/xml-parser/",
    category: "dev" as ToolCategoryId,
    title: "XML解析",
    description:
      "XMLの構文チェックと整形・圧縮。エラー位置の行番号・列番号を表示し、XPathで要素や属性を抽出。",
    introduction:
      "XMLの構文を検証し、読みやすく整形するツール。XPathで必要な要素だけを取り出せるため、RSSフィード、SOAPレスポンス、Androidやsitemapの設定ファイルの確認に使える。",
    usage: [
      "解析したいXMLを入力する。",
      "構文エラーがある場合はエラーメッセージと該当行・列を確認する。",
      "整形結果のインデントを選び、コピーまたは保存する。",
      "XPathを入力し、該当する要素・属性・テキストを確認する。",
    ],
    mechanism: [
      "ブラウザ標準のDOMParserでXMLを解析し、parsererror要素からエラー位置を取得。",
      "解析結果のDOMを再帰的にたどり、指定したインデントで出力。空白のみのテキストは除去。",
      "XPathはブラウザ標準のdocument.evaluateで評価。",
    ],
    shell: [
      {
        label: "XMLを検証して整形",
        environment: "xmllint（macOS標準搭載、Linuxはlibxml2-utils）",
        command: "xmllint --format input.xml",
      },
      {
        label: "XPathで抽出",
        environment: "xmllint",
        command: "xmllint --xpath '//book/title/text()' input.xml",
      },
    ],
  },
  {
    href: "/width-converter/",
    category: "text" as ToolCategoryId,
    title: "全角・半角・かな変換",
    description:
      "全角英数字・記号と半角を相互変換。半角カナの全角化、ひらがな・カタカナ変換に対応。",
    introduction:
      "全角・半角とひらがな・カタカナを変換するツール。フォーム入力値、CSV、住所データの表記揺れの統一に使える。",
    usage: [
      "変換したい文字列を入力する。",
      "変換形式を選ぶ。",
      "結果をコピーまたは保存する。",
    ],
    mechanism: [
      "全角英数字・記号（U+FF01〜FF5E）と半角（U+0021〜007E）の文字コード差0xFEE0を利用して変換。全角スペースは半角スペースに対応させる。",
      "半角カナはUnicode NFKC正規化で濁点・半濁点ごと全角カタカナへ変換。",
      "ひらがなとカタカナは文字コード差0x60を利用して変換。長音符「ー」はそのまま残す。",
    ],
    shell: [
      {
        label: "全角英数字を半角へ変換",
        environment: "Python 3",
        command:
          "python3 -c 'import sys; print(sys.stdin.read().translate({c: c - 0xFEE0 for c in range(0xFF01, 0xFF5F)}), end=\"\")'",
      },
      {
        label: "半角カナ・全角英数字を正規化",
        environment: "nkf（要インストール）",
        command: "nkf -w -Z1 -X input.txt",
      },
    ],
  },
  {
    href: "/wareki-converter/",
    category: "time" as ToolCategoryId,
    title: "和暦・西暦変換",
    description:
      "西暦と和暦（令和・平成・昭和・大正・明治）を相互変換。元年表記やR8.10.15形式に対応。",
    introduction:
      "西暦と和暦を相互に変換するツール。改元をまたぐ日付も日単位で判定するため、書類作成や生年月日の確認に使える。",
    usage: [
      "西暦の日付を選ぶと和暦を表示する。",
      "和暦を入力すると西暦を表示する。",
      "結果をコピーする。",
    ],
    mechanism: [
      "各元号の開始日（令和2019年5月1日、平成1989年1月8日、昭和1926年12月25日、大正1912年7月30日、明治1868年1月25日）と比較して元号を判定。",
      "和暦の入力は全角数字や「R」「H」などの略記をNFKC正規化してから解析し、元号の範囲外の日付はエラーにする。",
      "明治5年以前の旧暦期間もグレゴリオ暦の日付として扱う。",
    ],
    shell: [
      {
        label: "今日の日付を令和で表示",
        environment: "Python 3",
        command:
          "python3 -c 'import datetime as d; t=d.date.today(); print(f\"令和{t.year-2018}年{t.month}月{t.day}日\")'",
      },
    ],
  },
  {
    href: "/radix-converter/",
    category: "dev" as ToolCategoryId,
    title: "進数変換",
    description:
      "2進数・8進数・10進数・16進数を相互変換。桁数の上限なし、負数と0x・0b接頭辞に対応。",
    introduction:
      "数値を2進数・8進数・10進数・16進数で同時に表示するツール。ビットフラグ、パーミッション、カラーコード、メモリアドレスの確認に使える。",
    usage: [
      "入力の進数を選ぶ。",
      "値を入力する。",
      "各進数の結果をコピーする。",
    ],
    mechanism: [
      "BigIntで解析するため、Number.MAX_SAFE_INTEGERを超える桁数でも誤差なく変換。",
      "空白・アンダースコアの区切り、0x・0b・0oの接頭辞、先頭の「-」を解釈。",
    ],
    shell: [
      {
        label: "16進数を10進数へ変換",
        environment: "bash / zsh",
        command: "echo $((16#ff))",
      },
      {
        label: "10進数を2進数へ変換",
        environment: "bc",
        command: "echo 'obase=2; 255' | bc",
      },
    ],
  },
  {
    href: "/password-generator/",
    category: "dev" as ToolCategoryId,
    title: "パスワード生成",
    description:
      "安全なランダムパスワードを生成。文字数、文字種、紛らわしい文字の除外を指定可能。",
    introduction:
      "ランダムなパスワードを生成するツール。アカウント作成、APIキーの仮値、テスト用の認証情報の作成に使える。",
    usage: [
      "文字数と文字種を選ぶ。",
      "必要に応じて紛らわしい文字を除外する。",
      "結果をコピーまたは保存する。",
    ],
    mechanism: [
      "crypto.getRandomValues()で暗号論的に安全な乱数を取得。剰余による偏りを避けるため、範囲外の乱数は引き直す。",
      "選択した文字種を最低1文字ずつ含むまで生成し直す。",
      "生成はブラウザ内で完結し、サーバーへ送信しない。",
    ],
    shell: [
      {
        label: "ランダムなパスワードを生成",
        environment: "OpenSSL",
        command: "openssl rand -base64 24",
      },
    ],
  },
  {
    href: "/url-parser/",
    category: "web" as ToolCategoryId,
    title: "URL解析",
    description:
      "URLをプロトコル、ホスト、パス、クエリ、フラグメントに分解。クエリパラメータをデコードして一覧表示。",
    introduction:
      "URLを構成要素に分解するツール。長いトラッキングURL、APIのリクエストURL、リダイレクト先の確認に使える。",
    usage: [
      "解析したいURLを入力する。",
      "各構成要素とクエリパラメータを確認する。",
      "必要な値をコピーする。",
    ],
    mechanism: [
      "ブラウザ標準のURL APIで解析。ホスト名の国際化ドメインはPunycodeで表示される。",
      "クエリはURLSearchParamsでデコードし、同じキーが複数あればすべて表示。",
    ],
    shell: [
      {
        label: "URLを分解",
        environment: "Python 3",
        command:
          "python3 -c 'import sys,urllib.parse as u; p=u.urlsplit(sys.argv[1]); print(p); print(u.parse_qsl(p.query))' 'https://example.com/?q=1'",
      },
    ],
  },
]

export type ToolLink = (typeof toolLinks)[number]

export const popularToolHrefs = [
  "/text-compare/",
  "/json-validator/",
  "/jwt-decoder/",
  "/base64/",
  "/regex-tester/",
  "/epoch-converter/",
]

export const findTool = (href: string) =>
  toolLinks.find((tool) => tool.href === href)

export const categoryLabel = (id: ToolCategoryId) =>
  toolCategories.find((category) => category.id === id)?.label ?? ""

// ツール名・説明・URLスラッグの部分一致。空白区切りはAND検索。
export const searchTools = (query: string, category?: ToolCategoryId) => {
  const terms = query.trim().toLowerCase().split(/\s+/).filter(Boolean)
  return toolLinks.filter(
    (tool) =>
      (!category || tool.category === category) &&
      terms.every((term) =>
        `${tool.title} ${tool.description} ${tool.href}`
          .toLowerCase()
          .includes(term)
      )
  )
}
