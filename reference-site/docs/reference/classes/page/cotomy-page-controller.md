---
title: CotomyPageController
sidebar_position: 2
---

# CotomyPageController

Base class for page-level orchestration and form management.

**Static Methods**

| Method | Description |
| --- | --- |
| `set(type)` | Initializes and registers a page controller instance. |
| `get()` | Returns the current controller instance. |

**Properties**

| Property | Type | Description |
| --- | --- | --- |
| `body` | `CotomyElement` | Root document body element. |

**Protected Members (for subclassing)**

| Member | Description |
| --- | --- |
| `setForm(form)` | Registers and initializes a form. |
| `getForm(id, type?)` | Retrieves a registered form by id. |
| `forms` | List of registered forms. |
| `restoreAsync()` | Reloads forms on BFCache restoration. |
| `initializeAsync()` | Initialization hook for subclasses. |
| `url` | `CotomyUrl` for the current location. |
