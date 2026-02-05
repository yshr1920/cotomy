---
title: CotomyApiResponse
sidebar_position: 2
---

# CotomyApiResponse

Wrapper for a Fetch `Response` with lazy parsing helpers.

**Constructor**
- `new CotomyApiResponse(response?: Response | null)`
  Wraps a `Response` (or an empty response).

**Properties**

| Property | Type | Description |
| --- | --- | --- |
| `available` | `boolean` | `true` if a response object exists. |
| `empty` | `boolean` | `true` if there is no response or the status is `0`. |
| `ok` | `boolean` | Mirrors `Response.ok`. |
| `status` | `number` | HTTP status code. |
| `statusText` | `string` | HTTP status text. |
| `headers` | `Headers` | Response headers. |

**Methods**

| Method | Description |
| --- | --- |
| `textAsync()` | Reads the response body as text (cached). |
| `objectAsync(defaultValue?)` | Parses JSON into an object, returning `defaultValue` if empty. |
| `arrayAsync(defaultValue?)` | Parses JSON into an array, returning `defaultValue` if not an array. |
