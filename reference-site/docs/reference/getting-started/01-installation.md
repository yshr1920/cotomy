---
title: Installation
sidebar_position: 1
---

# Installation

This page covers the minimum setup for using Cotomy and the design model it assumes.
Cotomy installs fast, stays close to native HTML, and requires only a small entry script to get started.

Download source code: [Cotomy v1.0.1 ZIP](https://github.com/yshr1920/cotomy/archive/refs/tags/v1.0.1.zip) | [Cotomy v1.0.1 TAR.GZ](https://github.com/yshr1920/cotomy/archive/refs/tags/v1.0.1.tar.gz)

## Goals

- Add Cotomy to your project
- Define a page-level endpoint
- Understand the one-page, one-entry model
- Confirm a basic build or script load

## Environment Assumptions

Cotomy is a runtime layer and does not require a specific framework. It does
not require a build step, but TypeScript usage usually does. You can:

- Use a bundler (webpack, Vite, etc.)
- Or load prebuilt JS if your setup provides it

| Requirement | Notes |
| --- | --- |
| ES module support | Required for `import` syntax |
| TypeScript (optional) | Recommended for medium to large projects |
| Bundler (optional) | Helps organize per-page entry files |
| Modern browsers | Cotomy targets modern browser environments |

Each page HTML file should load only its corresponding entry bundle.
Avoid loading multiple page bundles into the same document.

## Related Classes

```mermaid
classDiagram
class CotomyWindow
class CotomyPageController
class CotomyElement
class CotomyForm
class CotomyApi

CotomyElement <|-- CotomyForm
CotomyForm ..> CotomyApi : submits
CotomyPageController o-- CotomyForm : manages
CotomyPageController ..> CotomyWindow : lifecycle
```

## Steps

### 1) Install with npm

```bash
npm install cotomy
```

### 2) Create a page entry

Cotomy works best when each page has its own entry file and endpoint.
This keeps behavior local, keeps page lifecycle boundaries **structural** (not convention-based), and avoids hidden cross-page coupling.

Example structure:

```text
src/
	pages/
		users/
			index.ts
			index.html
		settings/
			index.ts
			index.html
```

### 3) Configure per-page endpoints

Expose one endpoint per page and map it to the matching entry file.
How you do this depends on your stack, but the intent is the same:

- `/users` -> `src/pages/users/index.ts`
- `/settings` -> `src/pages/settings/index.ts`

In server-rendered apps, this typically means a route that renders the HTML
and loads the corresponding script bundle for that page.

### Why one entry per page?

This is a **structural** safety rule, not a technical limitation.

Cotomy assumes a document-oriented UI model:

| SPA Model | Cotomy Model |
| --- | --- |
| Global app root | Independent page modules |
| Virtual state | DOM = state |
| Long-lived app | Page lifecycle |

This keeps behavior isolated and avoids cross-page memory leaks.

### 4) Example webpack setup

If you bundle per page with webpack, define a multi-entry config and output
to a page-specific bundle name.

Bundling per page is recommended for larger apps, but not required.
Smaller setups can load Cotomy with a single script.

```js
// webpack.config.cjs
const path = require("path");

module.exports = {
	mode: "development",
	entry: {
		users: "./src/pages/users/index.ts",
		settings: "./src/pages/settings/index.ts",
	},
	output: {
		path: path.resolve(__dirname, "dist"),
		filename: "[name].bundle.js",
	},
	resolve: {
		extensions: [".ts", ".js"],
	},
	module: {
		rules: [
			{
				test: /\.ts$/,
				use: "ts-loader",
				exclude: /node_modules/,
			},
		],
	},
};
```

Then reference the page bundle in each HTML file:

```html
<script src="/dist/users.bundle.js"></script>
```

```html
<script src="/dist/settings.bundle.js"></script>
```

### 5) Example Vite setup (optional)

If you prefer Vite, use a multi-page build config:

```ts
// vite.config.ts
import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
	build: {
		rollupOptions: {
			input: {
				users: resolve(__dirname, "src/pages/users/index.html"),
				settings: resolve(__dirname, "src/pages/settings/index.html"),
			},
		},
	},
});
```

### 6) Import Cotomy

```ts
import { CotomyElement } from "cotomy";
```

### 7) Create your first Cotomy element

```ts
import { CotomyElement } from "cotomy";

new CotomyElement({
	html: `<div class="hello">Hello Cotomy</div>`,
	css: `[root].hello { color: green; font-weight: bold; }`,
}).appendTo(new CotomyElement(document.body));
```

### 8) Verify the page

Open the page and confirm there are no console errors.

- [ ] Add the Cotomy package dependency
- [ ] Import Cotomy in your entry file
- [ ] Render a minimal Cotomy element
- [ ] Verify the page loads without errors

## Next

Next: [First UI](./02-first-ui.md) to create your first DOM-backed element.
