---
slug: /reference
title: Class Index
description: Browse all Cotomy classes across View, Forms, Page, API, Debug, and Errors with direct links.
---

Cotomy is a structured runtime, not a component-rendering SPA framework.
It is designed for admin systems, internal tools, and form-heavy business screens where the DOM remains the primary UI model.

This page lists all available classes in the Cotomy reference.
For design and architectural context behind these APIs, visit the [Cotomy Blog](https://blog.cotomy.net/).

## Before You Browse the API

- Cotomy keeps the DOM as the primary UI state instead of introducing a separate render model
- It adds lifecycle, event, and form structure around ordinary browser behavior
- It works best when page boundaries and business responsibilities stay explicit

## View
- [CotomyScrollOptions](/reference/classes/view/cotomy-scroll-options/)
- [CotomyElement](/reference/classes/view/cotomy-element/)
- [CotomyMetaElement](/reference/classes/view/cotomy-meta-element/)
- [CotomyWindow](/reference/classes/view/cotomy-window/)

## Forms
- [CotomyForm](/reference/classes/forms/cotomy-form/)
- [CotomyQueryForm](/reference/classes/forms/cotomy-query-form/)
- [CotomyApiFailedEvent](/reference/classes/forms/cotomy-api-failed-event/)
- [CotomyApiForm](/reference/classes/forms/cotomy-api-form/)
- [CotomyEntityApiForm](/reference/classes/forms/cotomy-entity-api-form/)
- [CotomyEntityFillApiForm](/reference/classes/forms/cotomy-entity-fill-api-form/)

## Page
- [CotomyUrl](/reference/classes/page/cotomy-url/)
- [CotomyPageController](/reference/classes/page/cotomy-page-controller/)

## API
- [CotomyApi](/reference/classes/api/cotomy-api/)
- [CotomyApiResponse](/reference/classes/api/cotomy-api-response/)
- [CotomyBracketBindNameGenerator](/reference/classes/api/cotomy-bracket-bind-name-generator/)
- [CotomyDotBindNameGenerator](/reference/classes/api/cotomy-dot-bind-name-generator/)
- [CotomyViewRenderer](/reference/classes/api/cotomy-view-renderer/)
- [ICotomyBindNameGenerator](/reference/classes/api/icotomy-bind-name-generator/)
- [ICotomyApiOptions](/reference/classes/api/icotomy-api-options/)
- [ICotomyRestSubmitForm](/reference/classes/api/icotomy-rest-submit-form/)

## Debug
- [CotomyDebugFeature](/reference/classes/debug/cotomy-debug-feature/)
- [CotomyDebugSettings](/reference/classes/debug/cotomy-debug-settings/)

## Errors
- [CotomyApiException](/reference/classes/errors/cotomy-api-exception/)
- [CotomyConflictException](/reference/classes/errors/cotomy-conflict-exception/)
- [CotomyForbiddenException](/reference/classes/errors/cotomy-forbidden-exception/)
- [CotomyHttpClientError](/reference/classes/errors/cotomy-http-client-error/)
- [CotomyHttpServerError](/reference/classes/errors/cotomy-http-server-error/)
- [CotomyInvalidFormDataBodyException](/reference/classes/errors/cotomy-invalid-form-data-body-exception/)
- [CotomyNotFoundException](/reference/classes/errors/cotomy-not-found-exception/)
- [CotomyRequestInvalidException](/reference/classes/errors/cotomy-request-invalid-exception/)
- [CotomyResponseJsonParseException](/reference/classes/errors/cotomy-response-json-parse-exception/)
- [CotomyTooManyRequestsException](/reference/classes/errors/cotomy-too-many-requests-exception/)
- [CotomyUnauthorizedException](/reference/classes/errors/cotomy-unauthorized-exception/)

## Related Pages

- [Architecture](/architecture/)
- [Design Philosophy](/design-philosophy/)
- [Getting Started](/reference/getting-started/)
- [Release Notes](/reference/release-notes/)
