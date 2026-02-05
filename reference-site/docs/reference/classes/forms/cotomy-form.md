---
title: CotomyForm
sidebar_position: 1
---

# CotomyForm

Abstract base class for Cotomy forms.

**Properties**

| Property | Type | Description |
| --- | --- | --- |
| `actionUrl` | `string` | Form action URL (defaults to current path + query). |
| `autoReload` | `boolean` | Whether the form reloads on page restoration. |
| `initialized` | `boolean` | `true` after event handlers are wired. |

**Methods**

| Method | Description |
| --- | --- |
| `generateId(prefix?)` | Ensures the form has an `id`. |
| `reloadAsync()` | Reloads the page (uses `CotomyWindow`). |
| `initialize()` | Wires submit handler and marks the form as initialized. |
| `submitAsync()` | Abstract submit handler implemented by subclasses. |
