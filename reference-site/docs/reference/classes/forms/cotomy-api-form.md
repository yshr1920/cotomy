---
title: CotomyApiForm
sidebar_position: 4
---

# CotomyApiForm

Form that submits to an API endpoint and surfaces failure events.

**Properties**

| Property | Type | Description |
| --- | --- | --- |
| `actionUrl` | `string` | Form action URL (required). |

**Methods**

| Method | Description |
| --- | --- |
| `apiClient()` | Returns a new `CotomyApi` instance. |
| `apiFailed(handle)` | Subscribes to `cotomy:apifailed`. |
| `submitFailed(handle)` | Subscribes to `cotomy:submitfailed`. |
| `formData()` | Builds a `FormData` from form fields. |
| `submitAsync()` | Builds FormData and submits to the API. |

**Protected Methods (for subclassing)**  
| Method | Description |
| --- | --- |
| `triggerApiFailedEvent(response)` | Dispatches the API failed event. |
| `triggerSubmitFailedEvent(response)` | Dispatches the submit failed event. |
| `submitToApiAsync(formData)` | Submits FormData and returns the response. |
