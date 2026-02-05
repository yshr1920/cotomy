---
title: CotomyApiException
sidebar_position: 1
---

# CotomyApiException

Base exception for API errors.

**Constructor**
- `new CotomyApiException(status, message, response, bodyText?)`
  Creates an error with HTTP status, message, response wrapper, and optional body text.

**Properties**

| Property | Type | Description |
| --- | --- | --- |
| `status` | `number` | HTTP status code. |
| `message` | `string` | Error message. |
| `response` | `CotomyApiResponse` | Associated response wrapper. |
| `bodyText` | `string` | Raw response body text (if captured). |
