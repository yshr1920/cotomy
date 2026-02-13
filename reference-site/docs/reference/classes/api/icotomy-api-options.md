---
title: ICotomyApiOptions
sidebar_position: 7
---

# ICotomyApiOptions

Options for configuring CotomyApi request behavior. All fields are optional.

**Properties**

| Property | Type | Description |
| --- | --- | --- |
| baseUrl | string | Base URL used when the path does not start with a letter (e.g. /users). |
| headers | Record&lt;string, string&gt; | Default request headers. |
| credentials | RequestCredentials | Fetch credentials mode. |
| redirect | RequestRedirect | Fetch redirect behavior. |
| cache | RequestCache | Fetch cache behavior. |
| referrerPolicy | ReferrerPolicy | Fetch referrer policy. |
| mode | RequestMode | Fetch mode (CORS, no-cors, etc.). |
| keepalive | boolean | Whether to keep the request alive on page unload (default: true). |
| integrity | string | Subresource integrity value. |
