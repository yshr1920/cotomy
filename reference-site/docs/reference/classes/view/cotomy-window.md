---
title: CotomyWindow
sidebar_position: 4
---

# CotomyWindow

Global window wrapper for lifecycle and layout events.

**Static Properties**

| Property | Type | Description |
| --- | --- | --- |
| `instance` | `CotomyWindow` | Singleton instance. |

**Properties**

| Property | Type | Description |
| --- | --- | --- |
| `initialized` | `boolean` | `true` after the body is initialized. |
| `reloading` | `boolean` | `true` if a reload is in progress. |
| `body` | `CotomyElement` | Wrapped document body. |
| `scrollTop` | `number` | Current vertical scroll position. |
| `scrollLeft` | `number` | Current horizontal scroll position. |
| `width` | `number` | Window inner width. |
| `height` | `number` | Window inner height. |
| `documentWidth` | `number` | Document scroll width. |
| `documentHeight` | `number` | Document scroll height. |

**Methods**

| Method | Description |
| --- | --- |
| `initialize()` | Initializes body, layout events, and mutation observer. |
| `reload()` | Reloads the page and marks as reloading. |
| `append(element)` | Appends content to the body. |
| `moveNext(focused, shift?)` | Moves focus to the next focusable element. |
| `trigger(event, e?)` | Dispatches a window event. |
| `on(event, handle)` | Registers a window event handler. |
| `off(event, handle?)` | Removes a window event handler. |
| `load(handle)` | Shortcut for `window` load event. |
| `ready(handle)` | Handles the `cotomy:ready` event. |
| `resize(handle?)` | Registers or triggers `resize`. |
| `scroll(handle?)` | Registers or triggers `scroll`. |
| `scrollTo(target, options?)` | Scrolls to a selector or element. |
| `changeLayout(handle?)` | Registers or triggers layout change. |
| `pageshow(handle?)` | Registers or triggers `pageshow`. |
