---
title: CotomyEntityApiForm
sidebar_position: 5
---

# CotomyEntityApiForm

API form that supports entity key routing and HTTP method inference.

**Properties**

| Property | Type | Description |
| --- | --- | --- |
| `entityKey` | `string | undefined` | Entity identifier from `data-cotomy-entity-key`. |
| `actionUrl` | `string` | Action URL adjusted with the entity key. |

**Methods**

| Method | Description |
| --- | --- |
| `submitAsync()` | Inherited; submits to API. |

**Protected Members (for subclassing)**

| Member | Description |
| --- | --- |
| `requiresEntityKey` | Whether the entity key is required. |
| `hasEntityKey` | `true` if an entity key is present. |
| `setEntityKey(response)` | Extracts and stores the entity key from `Location` header. |
| `submitToApiAsync(formData)` | Submits and stores entity key on creation. |
