---
title: CotomyScrollOptions
sidebar_position: 1
---

# CotomyScrollOptions

Options for scrolling methods.

**Constructor**
- `new CotomyScrollOptions(init?: Partial<CotomyScrollOptions>)`
  Initializes scroll options with defaults.

**Properties**

| Property | Type | Description |
| --- | --- | --- |
| `behavior` | `ScrollBehavior` | Scrolling behavior (default: `smooth`). |
| `onlyIfNeeded` | `boolean` | Scroll only when the element is out of view. |
| `block` | `ScrollLogicalPosition` | Vertical alignment when scrolling. |
| `inline` | `ScrollLogicalPosition` | Horizontal alignment when scrolling. |
| `resolveBehavior` | `ScrollBehavior` | Resolved behavior. |

**Static Methods**

| Method | Description |
| --- | --- |
| `from(options?)` | Normalizes input into a `CotomyScrollOptions` instance. |
