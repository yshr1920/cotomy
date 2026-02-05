# Cotomy と主要フロントエンドFWの比較（詳細）

> 本比較はCotomyの実装（View/Form/API/Page）と一般的な各FWの特徴を軸にまとめたものです。
> 比較軸: 状態管理 / SSR / DX / 学習コスト。

## 比較表

| フレームワーク | 状態管理 | SSR | DX（開発体験） | 学習コスト | Cotomyとの差分・所感 |
|---|---|---|---|---|---|
| Cotomy | DOM直接操作が中心。`data-*`属性によるバインドとフォーム連携が主軸。専用の状態管理は持たない。 | なし（SSR機構は未提供）。既存HTMLに後付けで動的機能を付与する想定。 | 依存が軽く、既存DOMに段階導入しやすい。フォーム/API連携は標準で強い。 | 低〜中。HTML/DOMに慣れていれば取り組みやすい。 | コンポーネント/再描画/状態管理は外部設計が必要。フォーム中心のWebでは強い。 |
| React | `useState`/`useReducer`、外部ストア（Redux等）が主流。 | Next.jsなどで強力。 | エコシステムが広く、開発者数が多い。 | 中〜高（JSX/Hook/設計が必要）。 | Cotomyは構造を壊さず導入可能。Reactは設計自由度と規模対応に強い。 |
| Vue | `reactive`/`ref`、Pinia等。 | Nuxtで成熟。 | 単一ファイルコンポーネントが強力で学習しやすい。 | 中。テンプレ構文が独特。 | CotomyはDOM中心、Vueは宣言的UI構築が主軸。 |
| Svelte | コンパイル時に状態結線。ストアあり。 | SvelteKitで対応。 | 実行時が軽く直感的。 | 中。コンパイルモデルの理解が必要。 | CotomyはランタイムDOM操作、Svelteはビルド時最適化。 |
| Angular | RxJS中心、NgRx等。 | Angular Universalで対応。 | 大規模向けの公式スタックが揃う。 | 高。DI/メタデータ/CLIなど学習量が多い。 | Cotomyは軽量・局所用途向き。Angularはエンタープライズ指向。 |
| Alpine | DOM指向の軽量FW。`x-data`などで簡易状態管理。 | なし（SSR機構は未提供）。 | 既存HTMLに簡単に追加可能。 | 低。 | Cotomyと近い思想。Cotomyはフォーム/API/ビュー補助がより厚い。 |

## まとめ（要点）

- Cotomyは**既存DOMを活かす軽量設計**で、フォーム/API連携が強い。
- React/Vue/Svelte/Angularは**コンポーネントと状態管理が中心**で大規模UIに強い。
- Alpineは**Cotomyに近いDOM指向**だが、CotomyはフォームやAPIレスポンスのバインド機能が厚い。

## 採用判断フローチャート（テキスト版）

> 迷ったら以下の順で確認してください。

1. **既存HTMLを活かしたい / 段階導入したい？**
	 - はい → **Cotomy / Alpine**
	 - いいえ → 次へ
2. **SSRが必須？（SEO / 初期表示 / 大規模）**
	 - はい → **React(Next.js) / Vue(Nuxt) / Svelte(SvelteKit) / Angular(Universal)**
	 - いいえ → 次へ
3. **大規模チーム・厳格な設計が必要？**
	 - はい → **Angular**
	 - いいえ → 次へ
4. **学習コストを抑えたい？**
	 - はい → **Vue / Svelte / Alpine / Cotomy**
	 - いいえ → **React**

### 具体的な判断ポイント（FW別）

- **Cotomy**
	- 既存DOMのまま、フォーム/APIを強化したい。
	- 画面構造を大きく変えずに動的機能だけ足したい。
- **Alpine**
	- 小規模なUIインタラクションをHTML上で完結したい。
	- 学習コストを最小化して導入したい。
- **React**
	- 中〜大規模のUIを長期運用する。
	- エコシステムや人材の多さを重視。
- **Vue**
	- 宣言的UIと手軽さのバランスが欲しい。
	- テンプレート中心で実装したい。
- **Svelte**
	- ランタイムを軽くしたい／ビルド最適化したい。
	- 小〜中規模のプロダクトで効率よく作りたい。
- **Angular**
	- 企業向け、大規模、複数チームの標準化が必要。
	- 公式のフルスタック構成で固めたい。

## 用途別の選定ガイド（詳細）

### 1) 既存Webへの段階導入
- 推奨: **Cotomy / Alpine**
- 理由: DOM構造を維持したまま段階的に追加できる。
- 注意: SPA的な状態管理やルーティングは別途設計が必要。

### 2) フォーム中心（管理画面 / CRUD）
- 推奨: **Cotomy**
- 理由: フォーム送信、API連携、バインドが標準機能に含まれる。
- 注意: UIのコンポーネント化は自前で設計する必要がある。

### 3) 高いSEO/初期表示が必須
- 推奨: **React(Next.js) / Vue(Nuxt) / Svelte(SvelteKit) / Angular(Universal)**
- 理由: SSR/SSG対応が成熟している。
- 注意: 環境構築や運用がやや重くなる。

### 4) 大規模アプリ / 多人数開発
- 推奨: **Angular / React**
- 理由: 大規模運用に必要な設計パターンやツールが充実。
- 注意: 学習コストと初期設計が重い。

### 5) 小〜中規模で開発速度重視
- 推奨: **Vue / Svelte**
- 理由: 学習コストが比較的低く、開発体験が良い。
- 注意: 大規模化した際の設計統一は意識が必要。

### 6) UIインタラクションのみ最小追加
- 推奨: **Alpine / Cotomy**
- 理由: HTMLと近い距離で書けるため、導入障壁が低い。
- 注意: 高度な状態管理は別途設計。

## JSX/TSX vs 生HTML（Cotomy）の対比

### React（JSX/TSX）のアプローチ

```tsx
// React: UI構造とロジックが一体化
function UserProfile({ user }: { user: User }) {
  const [editing, setEditing] = useState(false);
  
  return (
    <div className="profile">
      <h2>{user.name}</h2>
      {editing ? (
        <input value={user.email} onChange={handleChange} />
      ) : (
        <p>{user.email}</p>
      )}
      <button onClick={() => setEditing(!editing)}>
        {editing ? "保存" : "編集"}
      </button>
    </div>
  );
}
```

**特徴:**
- UI構造をJSX/TSXで表現（TypeScript内にマークアップ）
- 型安全性が高い（props, state, イベントすべて型付け）
- 条件分岐・ループがJSで自然に書ける
- コンポーネント再利用が強力

**デメリット:**
- デザイナがHTMLを直接触れない
- ビルド必須（JSX→JSへのトランスパイル）
- 既存HTMLの流用が難しい

### Cotomy（生HTML + TypeScript）のアプローチ

```html
<!-- HTML: デザイナが触れる静的マークアップ -->
<div class="profile">
  <h2 data-cotomy-bind="user.name"></h2>
  <p data-cotomy-bind="user.email"></p>
  <button id="editButton">編集</button>
</div>
```

```typescript
// TypeScript: DOM操作と機能補強のみ
import { CotomyElement, CotomyViewRenderer } from "cotomy";

const profile = new CotomyElement(document.querySelector(".profile")!);
const renderer = new CotomyViewRenderer(profile, bindNameGenerator);

// APIレスポンスをバインド
await renderer.applyAsync(apiResponse);

// イベント追加
profile.first("#editButton")?.click(() => {
  // 編集処理
});
```

**特徴:**
- HTMLとTypeScriptが分離（役割が明確）
- デザイナが静的HTMLを直接編集可能
- 既存HTMLをそのまま活かせる
- ビルドなしでも動作（scriptタグでも可）

**デメリット:**
- UI構造の型安全性が弱い（data属性は文字列）
- 複雑な条件分岐・ループはDOM操作が増える
- コンポーネント再利用は自前設計が必要

### 対比まとめ

| 観点 | React（JSX/TSX） | Cotomy（生HTML） |
|---|---|---|
| UI構造の管理 | JSX/TSXでTypeScript内に記述 | HTMLファイルとして分離 |
| 型安全性 | 高い（props, state, イベント） | 低い（data属性は文字列） |
| デザイナ連携 | 困難（JSXを学ぶ必要） | 容易（静的HTML触れる） |
| 既存HTML活用 | 難しい（JSXに移植） | 容易（そのまま使える） |
| ビルド | 必須 | 任意（CDN利用可） |
| 条件分岐・ループ | JSで自然 | DOM操作が必要 |
| コンポーネント化 | 標準機能 | 自前設計 |
| 適用規模 | 中〜大規模UI | 小〜中規模・画面単位 |

### 実務での使い分け指針

- **JSX/TSXが向く**: 複雑なUI階層、状態管理、コンポーネント再利用が必要な場合
- **生HTML（Cotomy）が向く**: デザイナとの分業、既存資産活用、画面単位の独立性が高い場合

## まとめ（再掲）

- **Cotomy**は既存DOMを活かしたフォーム/API強化に強い。
- **React/Vue/Svelte/Angular**はコンポーネント指向で大規模UIに強い。
- **Alpine**は軽量DOM指向で、最小限のインタラクション向き。
- **JSX/TSX vs 生HTML**の選択は、デザイナ連携・既存資産・UI複雑度で判断。
