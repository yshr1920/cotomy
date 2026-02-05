---
title: CotomyUrl
sidebar_position: 1
---

# CotomyUrl

Utility wrapper around the current URL.

**Constructor**
- `new CotomyUrl(url?: string | null)`
  Creates a URL wrapper (defaults to the current location).

**Static Methods**

| Method | Description |
| --- | --- |
| `location()` | Returns a wrapper for the current location. |

**Properties**

| Property | Type | Description |
| --- | --- | --- |
| `url` | `string` | Path + query string. |
| `path` | `string` | Pathname only. |
| `segments` | `string[]` | Path segments. |
| `query` | `string` | Raw query string (without `?`). |
| `parameters` | `Record<string, string>` | Query parameters as an object. |

**Methods**

| Method | Description |
| --- | --- |
| `redirect()` | Navigates to the current `url`. |
| `replace()` | Replaces the current history entry. |
| `replaceState(state?, title?)` | Calls `history.replaceState`. |
