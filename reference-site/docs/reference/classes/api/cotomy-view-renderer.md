---
title: CotomyViewRenderer
sidebar_position: 5
---

# CotomyViewRenderer

Applies API response data to DOM elements using `data-cotomy-bind` and custom renderers.

**Constructor**
- `new CotomyViewRenderer(element: CotomyElement, bindNameGenerator: ICotomyBindNameGenerator)`
  Creates a renderer bound to a root element and a bind name generator.

**Properties**

| Property | Type | Description |
| --- | --- | --- |
| `locale` | `string` | Current locale derived from data attributes or browser language. |
| `initialized` | `boolean` | `true` once default renderers are registered. |
| `renderers` | `Record<string, (element, value) => void>` | Registered renderer map (initializes on access). |

**Methods**

| Method | Description |
| --- | --- |
| `renderer(type, callback)` | Registers a custom renderer for a bind type. |
| `initialize()` | Registers default renderers (mail, tel, url, number, utc, date). |
| `bindPrimitiveValue(propertyName, value)` | Binds a primitive value to matching elements. |
| `applyArrayAsync(values, propertyName)` | Binds array values recursively. |
| `applyObjectAsync(target, propertyName?)` | Binds object values recursively. |
| `applyAsync(response)` | Applies the response JSON to bound elements. |
