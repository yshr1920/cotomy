---
title: CotomyApi
sidebar_position: 1
---

# CotomyApi

HTTP client wrapper for calling Cotomy REST endpoints with consistent error handling.

**Constructor**
- `new CotomyApi(options?: ICotomyApiOptions)`
  Creates a client with optional base URL, headers, and fetch settings.

**Properties**

| Property | Type | Description |
| --- | --- | --- |
| `baseUrl` | `string` | Base URL used for relative paths. |
| `headers` | `Record<string, string>` | Default request headers. |
| `credentials` | `RequestCredentials` | Fetch credentials mode. |
| `redirect` | `RequestRedirect` | Fetch redirect behavior. |
| `cache` | `RequestCache` | Fetch cache behavior. |
| `referrerPolicy` | `ReferrerPolicy` | Fetch referrer policy. |
| `mode` | `RequestMode` | Fetch mode (CORS, no-cors, etc.). |
| `keepalive` | `boolean` | Whether to keep the request alive on page unload. |
| `integrity` | `string` | Subresource integrity value. |
| `abortController` | `AbortController` | Controller used for request cancellation. |

**Methods**

| Method | Description |
| --- | --- |
| `getAsync(path, parameters?)` | Sends a GET request with optional query parameters. |
| `postAsync(path, body)` | Sends a POST request. |
| `putAsync(path, body)` | Sends a PUT request. |
| `patchAsync(path, body)` | Sends a PATCH request. |
| `deleteAsync(path)` | Sends a DELETE request. |
| `headAsync(path)` | Sends a HEAD request. |
| `optionsAsync(path)` | Sends an OPTIONS request. |
| `traceAsync(path)` | Sends a TRACE request. |
| `connectAsync(path)` | Sends a CONNECT request. |
| `submitAsync(form)` | Sends a request based on `ICotomyRestSubmitForm`. |
