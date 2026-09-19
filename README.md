# 守成コネクト（札幌西）

守成クラブ札幌西の会員専用ビジネスマッチングWebアプリ。  
LINEログインで認証し、会員プロフィールを検索・閲覧して電話やLINEで即連絡できます。

## 機能

- LINEログイン（承認制：世話人が承認するまで利用不可）
- 会員一覧（キーワード検索・業種フィルター）
- 会員プロフィール（電話ボタン・LINE連絡可表示）
- マイプロフィール登録・編集
- 管理画面（承認/却下・会員CRUD）

## 技術スタック

| 分類 | 技術 |
|---|---|
| フロントエンド | Vite + React 18 + TypeScript + Tailwind CSS |
| 認証 | LINE LIFF + Firebase Custom Token |
| データベース | Firestore |
| バックエンド | Firebase Cloud Functions v2 |
| ホスティング | Firebase Hosting |

---

## セットアップ手順

### 前提条件

- Node.js 20+
- Firebase CLI（`npm install -g firebase-tools`）
- LINE Developers アカウント
- Firebase アカウント（Googleアカウント）

---

### 1. Firebase プロジェクト作成

```bash
# Firebase コンソール（https://console.firebase.google.com）で新規プロジェクトを作成
# 以下のサービスを有効化：
# - Authentication（カスタムトークン認証を使用）
# - Firestore Database（本番モードで作成）
# - Functions（Blaze プランへのアップグレードが必要）
# - Hosting

firebase login
firebase use --add  # 作成したプロジェクトを選択
```

---

### 2. LINE Developers Console 設定

1. [LINE Developers Console](https://developers.line.biz/) にアクセス
2. 新規プロバイダーを作成（または既存を使用）
3. **LINE Login チャンネル**を作成
4. チャンネル設定 → LIFF タブ → 「追加」
   - タイプ: **Full**（フル画面）
   - エンドポイント URL: デプロイ後に Firebase Hosting の URL を入力
   - スコープ: `profile` `openid` にチェック
5. 以下をメモしておく:
   - **LIFF ID**（例: `1234567890-xxxxxxxx`）
   - **チャンネルID**（Channel ID）

---

### 3. 環境変数の設定

`.env.example` を参考に `.env` ファイルを作成：

```bash
cp .env.example .env
```

`.env` を編集：

```env
# Firebase（コンソール → プロジェクト設定 → マイアプリ → Webアプリのconfig）
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id

# LINE LIFF（LINE Developers Console → LIFF ID）
VITE_LIFF_ID=1234567890-xxxxxxxx

# Cloud Functions URL（デプロイ後に確認。開発時はエミュレータURLのまま）
VITE_FUNCTIONS_URL=https://asia-northeast1-your_project_id.cloudfunctions.net
```

Cloud Functions の環境変数を設定：

```bash
# LINE_CHANNEL_ID を Functions の設定に追加
firebase functions:config:set line.channel_id="your_line_channel_id"

# または Firebase Functions パラメータとして設定
echo "LINE_CHANNEL_ID=your_line_channel_id" >> functions/.env
```

---

### 4. ローカル開発

```bash
# フロントエンド依存インストール
npm install

# Functions 依存インストール
cd functions && npm install && cd ..

# Firebase エミュレータ起動（Auth / Firestore / Functions / Hosting）
firebase emulators:start

# 別ターミナルでフロントエンド起動
# .env の VITE_FUNCTIONS_URL を http://localhost:5001/your_project_id/asia-northeast1 に変更
npm run dev
```

エミュレータ UI: http://localhost:4000

---

### 5. 本番デプロイ

```bash
# フロントエンドをビルド
npm run build

# すべてデプロイ（Hosting + Firestore Rules + Functions）
firebase deploy

# 個別デプロイも可能
firebase deploy --only hosting
firebase deploy --only firestore:rules,firestore:indexes
firebase deploy --only functions
```

デプロイ後、Firebase Hosting の URL（例: `https://your_project_id.web.app`）を確認し、  
LINE Developers Console の LIFF エンドポイント URL に設定する。

---

### 6. GitHub Actions による自動デプロイ（任意）

`main` ブランチへの push で自動的に `firebase deploy` を実行するワークフローを用意している（`.github/workflows/firebase-deploy.yml`）。手動デプロイに慣れたら以下の設定で有効化できる。

#### 6-1. Firebase サービスアカウントキーを発行

```bash
# Firebase コンソール → プロジェクト設定 → サービスアカウント → 新しい秘密鍵を生成
# ダウンロードした JSON ファイルの中身をそのまま GitHub Secrets に登録する
```

#### 6-2. GitHub リポジトリに Secrets を登録

リポジトリ → Settings → Secrets and variables → Actions → New repository secret

| Secret 名 | 値 |
|---|---|
| `FIREBASE_SERVICE_ACCOUNT` | 6-1 でダウンロードした JSON ファイルの中身（全文）|
| `VITE_FIREBASE_API_KEY` | `.env` と同じ値 |
| `VITE_FIREBASE_AUTH_DOMAIN` | 同上 |
| `VITE_FIREBASE_PROJECT_ID` | 同上（Firebase プロジェクトID）|
| `VITE_FIREBASE_STORAGE_BUCKET` | 同上 |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | 同上 |
| `VITE_FIREBASE_APP_ID` | 同上 |
| `VITE_LIFF_ID` | 同上 |
| `VITE_FUNCTIONS_URL` | 本番の Cloud Functions URL |
| `LINE_CHANNEL_ID` | LINE Developers Console のチャンネルID |

登録後、`main` ブランチに push するたびに自動で `npm run build` → `firebase deploy`（Hosting + Firestore Rules/Indexes + Functions）が実行される。GitHub の Actions タブから手動実行（`workflow_dispatch`）も可能。

> **注意:** サービスアカウントキーは強い権限を持つ秘密情報。GitHub Secrets 以外の場所（コード・Issue・PRコメント等）に貼り付けないこと。

---

### 7. 初回 admin ユーザーの作成

アプリを一度開いてLINEログインし、自分の LINE UID を確認した後、以下のスクリプトを実行：

```bash
# LINE UID の確認方法：
# LINEログイン後、Firebase コンソール → Firestore → users コレクションに
# 自動作成されたドキュメントのIDが LINE UID

node scripts/create-admin.js <LINE_UID> <表示名>
# 例: node scripts/create-admin.js Uxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx 山田太郎
```

> **注意:** スクリプト実行前に `GOOGLE_APPLICATION_CREDENTIALS` 環境変数にサービスアカウントキーのパスを設定するか、Firebase CLI でログイン済みであることを確認してください。

---

## ディレクトリ構造

```
shuseinishi/
├── src/
│   ├── config/          # Firebase・LIFF 初期化
│   ├── contexts/        # AuthContext（リアルタイム認証状態）
│   ├── hooks/           # useMembers / useMyProfile / useAdmin 等
│   ├── lib/             # Firestore 型付き CRUD ヘルパー
│   ├── pages/           # Login / Pending / Members / MemberDetail / Profile / Admin
│   ├── components/      # auth / member / ui コンポーネント
│   └── types/           # UserDoc / MemberDoc 型定義
│
├── functions/
│   └── src/index.ts     # lineCustomToken Cloud Function
│
├── scripts/
│   └── create-admin.js  # 初回 admin 作成スクリプト
│
├── .github/workflows/
│   └── firebase-deploy.yml  # main push で自動デプロイ
│
├── firestore.rules      # セキュリティルール
├── firestore.indexes.json
└── firebase.json
```

---

## Firestore データ構造

### `users/{lineUserId}`
```
uid:         string   # LINE UID
displayName: string   # LINE 表示名
role:        "member" | "admin"
status:      "pending" | "approved" | "rejected"
branch:      "札幌西"
createdAt:   timestamp
```

### `members/{docId}`
```
userId:         string?  # 紐付いた LINE UID（自己登録時）
branch:         "札幌西"
companyName:    string
representative: string
industry:       string
strength:       string
services:       string
referralWanted: string
referralOffered:string
phone:          string
lineAvailable:  boolean
searchTokens:   string[] # 検索用トークン（自動生成）
createdAt:      timestamp
```

---

## セキュリティポリシー

| 操作 | 条件 |
|---|---|
| 会員一覧・詳細の閲覧 | `status == "approved"` のみ |
| 自分のプロフィール作成 | `status == "approved"` かつ `userId == 自分のUID` |
| 自分のプロフィール編集 | `status == "approved"` かつ `userId == 自分のUID` |
| 任意の会員データ編集・削除 | `role == "admin"` のみ |
| ユーザー承認/却下 | `role == "admin"` のみ |

---

## トラブルシューティング

**LINEログインができない**
- LIFF のエンドポイント URL が正しいか確認
- `VITE_LIFF_ID` が正しいか確認
- ブラウザの開発者ツールでネットワークエラーを確認

**プロフィールが保存できない**
- Firestore Rules が正しくデプロイされているか確認（`firebase deploy --only firestore:rules`）
- ユーザーの `status` が `approved` になっているか確認

**Cloud Function が 401 を返す**
- `LINE_CHANNEL_ID` が正しく設定されているか確認
- LINE のアクセストークンの有効期限を確認
