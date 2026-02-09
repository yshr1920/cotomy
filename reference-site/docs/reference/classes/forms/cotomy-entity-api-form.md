---
title: CotomyEntityApiForm
sidebar_position: 5
---

# CotomyEntityApiForm

API form that supports entity key routing and HTTP method inference.

## Behavior

- Entity key is read from `data-cotomy-entity-key` on the form.
- `actionUrl` is normalized to a collection path. If no entity key is present,
	the URL ends with a trailing slash. If a key exists, it is appended as the
	final path segment (URL-encoded).
- `method` uses the form `method` attribute when it is set. Otherwise it
	switches automatically: `POST` when no entity key is present, `PUT` when a
	key is present.
- On a creation response (status **201 Created**) and when identification is
	enabled, the form extracts a single extra path segment from the `Location`
	header and stores it to `data-cotomy-entity-key`. Subsequent submits then use
	`PUT` automatically.

## Prerequisites

- Omit the form `method` attribute (or leave it empty) to enable auto switching.
- Set `action` to the collection URL (without the entity key segment).
- For existing entities, set `data-cotomy-entity-key` on the form before
	initializing or submitting. New entities can start without it and rely on
	`201 Created` + `Location` to populate the key.
- Your API should return `201 Created` for new entities and include a
	`Location` header whose **path** starts with the action path and adds
	**exactly one** extra segment for the entity key (absolute or relative URL is
	OK).
- Composite keys are not supported. The entity key must be a single path
	segment.
- If you set `data-cotomy-identify="false"`, automatic key extraction is
	disabled and no POST to PUT transition occurs unless you set the key
	yourself.
- If `data-cotomy-entity-key` is already present and the server still returns
	`201 Created`, Cotomy keeps the existing key (and may log a warning when debug
	`FormLoad` is enabled).

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
