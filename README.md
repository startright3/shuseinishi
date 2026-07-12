# START RIGHT Event Cloud

会員制団体・交流会向けの、会員管理・例会管理・QR受付・スタッフ管理を行うマルチテナントSaaSです。

## 開発方針

- Next.js App Router
- TypeScript strict
- Tailwind CSS
- Supabase Auth / PostgreSQL / RLS / Edge Functions
- Vercel
- Vitest / Playwright
- pnpm

## 既存バックエンド

- Supabase project ref: `fmihnxwsajszldzizzcn`
- 既存テーブル・RLS・Edge Functionsを破壊しない
- 秘密鍵・service role keyをクライアントへ置かない
- DB変更は必ず `supabase/migrations` に残す

## 開発開始

1. `.env.example` を `.env.local` にコピー
2. 公開可能なSupabase URL / publishable keyのみ設定
3. `pnpm install`
4. `pnpm dev`
