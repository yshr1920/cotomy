---
title: Debugging and Tips
sidebar_position: 8
---

# Debugging and Tips

This final chapter focuses on **Cotomy-specific debugging**.  
The goal is not to teach DevTools, but to show how to diagnose issues by
following Cotomy's design philosophy.

## Goals

- Debug by inspecting the real DOM, not shadow state
- Find common failure points quickly
- Apply a consistent, Cotomy-style troubleshooting flow

## 1) Cotomy Debugging Mindset

Cotomy uses the real DOM as UI state.

When debugging:

- Inspect the DOM, not JavaScript variables
- Check attributes and `textContent`
- Confirm event handlers are attached to elements

If you can explain what the DOM looks like, you can explain what the UI is.

## 2) UI Does Not Update

Symptoms: data changed but the view does not.

Check:

- Is the element actually in the DOM?
- Does it have the expected `data-cotomy-bind`?
- Is there a typo in `data-cotomy-bind`?
- Did the API response contain that field?
- Was rendering skipped due to an API error?

Cotomy binds to DOM attributes. If the attribute is missing, no renderer runs.

## 3) Event Not Firing

Check:

- Confirm `initialize()` was called
- Check that the element was not removed
- Use DevTools → Event Listeners tab

Cotomy removes handlers when elements are removed.  
If the element was re-created or swapped, the handler is gone.

## 4) Form Submit Not Triggered

Check:

- Is the root element a `<form>`?
- Was `initialize()` called?
- Does the button have `type="submit"`?

CotomyForm assumes real HTML form semantics.

## 5) Ajax Form Not Loading

Check:

- Does the form have an entity key?
- Is `data-cotomy-identify="false"` set?
- Did the GET request succeed?

If the GET fails, no fill happens.

## 6) Renderer Issues

Check:

- Does the element have `data-cotomy-bind`?
- Is the bind name style correct (bracket vs dot)?
- Is the response JSON shape correct?

Bind names are just lookup keys.  
If the shape is wrong, the renderer never runs.

If input values update but display elements do not, the issue is likely in
rendering. If display updates but inputs do not, the issue is in fill.

## 7) Scoped CSS Problems

Check:

- Is a `<style id="css-...">` generated?
- Does the selector use `[root]` when targeting the root?

Cotomy rewrites `[root]` to the element's scope id.

## 8) Page Restore Confusion

Check:

- Restore runs only when bfcache is used
- Use a normal reload to confirm baseline behavior

If a page is not restored from cache, restore hooks will not run.

## 9) Network Checklist

In the Network tab, check:

- Status code
- Response body
- Request payload (FormData)

## 10) Often Not a Cotomy Issue

- The API did not return the expected JSON shape
- The server returned `204 No Content`
- The element is outside the form or page scope

## 11) Debug Features

Enable debug logs with `CotomyDebugSettings`.

```ts
import { CotomyDebugSettings, CotomyDebugFeature } from "cotomy";

CotomyDebugSettings.enableAll();
CotomyDebugSettings.enable(CotomyDebugFeature.Fill);
CotomyDebugSettings.enable(CotomyDebugFeature.Api);
```

Typical useful keys:

- `Fill` for form fill output
- `Api` for request/response logging
- `Bind` for bind resolution
- `FormLoad` for auto load behavior

## 12) The Most Important Habit

When something is wrong, inspect in this order:

DOM → Attributes → Event listeners → Network → API response

This is the Cotomy debugging flow.

## What just happened?

You learned a practical, Cotomy-specific debugging approach:

- DOM first
- Attributes second
- API and network last

This is the fastest way to solve real-world Cotomy issues.
