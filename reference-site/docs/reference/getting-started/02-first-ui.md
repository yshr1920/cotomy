---
title: First UI
sidebar_position: 2
---

# First UI

Create and attach your first `CotomyElement`.

This step shows the smallest meaningful unit in Cotomy: a DOM-backed UI element
with scoped styling.

## Goals

- Create a UI element from HTML
- Apply scoped CSS
- Attach it to an existing DOM node
- Understand that the DOM element is the UI state

## Steps

### 1) Create a `CotomyElement`

```ts
import { CotomyElement } from "cotomy";

const card = new CotomyElement({
	html: `<div class="card">Hello Cotomy</div>`,
	css: `
		.card {
			padding: 16px;
			background: #e8f5e9;
			border-radius: 6px;
		}
	`,
});
```

The HTML must have a single root element. Multiple roots will throw an error.  
`CotomyElement` creates a real DOM element. There is no virtual layer between
your code and the browser.  
Cotomy automatically scopes the CSS to this element so styles do not leak to
the rest of the page. This keeps styles local to each UI unit, matching
Cotomy's page-scoped design.  
Selectors are treated as relative to the root element. To target the root
element itself, use the `[root]` selector.

### 2) Attach it to the page

```ts
const body = new CotomyElement(document.body);
card.appendTo(body);
```

This moves the element into the document. From this point, it participates in
layout and events like any normal DOM node.

### 3) Modify the UI directly

```ts
card.text = "Updated text";
card.style("color", "green");
```

You update the UI by updating the DOM directly. There is no separate state
object to synchronize.

### 4) Add another element

```ts
card.append({
	html: `<button class="btn">Click</button>`,
	css: `[root].btn { margin-top: 8px; }`,
});
```

## Important Concept: DOM = UI State

Cotomy does not mirror state in JavaScript objects. The DOM element itself is
the source of truth. When you change text, attributes, styles, or children, you
are updating the UI state directly.

## What just happened?

You:

1. Created a DOM element
2. Applied scoped styles
3. Attached it to the page
4. Updated it directly

This is the core Cotomy workflow.

### Cotomy is not doing:

- Virtual DOM diffing
- Component re-render cycles
- Global state synchronization

Everything you see is the real DOM.

## Next

Next: [Events and State](./03-events-and-state.md) to wire up interactions.
