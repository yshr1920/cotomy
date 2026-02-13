---
title: ICotomyRestSubmitForm
sidebar_position: 8
---

# ICotomyRestSubmitForm

Payload shape used by CotomyApi.submitAsync for REST-style form submission.

**Properties**

| Property | Type | Description |
| --- | --- | --- |
| method | string | HTTP method (e.g. POST, PUT). |
| action | string | Target URL or path. |
| body | FormData \| Record&lt;string, string&gt; \| any | Request body content. |
