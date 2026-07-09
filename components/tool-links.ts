export const toolLinks = [
  {
    href: "/text-compare/",
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
    href: "/html-escape/",
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
    href: "/regex-tester/",
    title: "正規表現確認",
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
]
