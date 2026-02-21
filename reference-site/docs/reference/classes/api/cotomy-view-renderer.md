---
title: CotomyViewRenderer
sidebar_position: 5
---

# CotomyViewRenderer

Applies API response data to DOM elements using data-cotomy-bind and custom renderers.

**Constructor**
- new CotomyViewRenderer(element: CotomyElement, bindNameGenerator?: ICotomyBindNameGenerator)
  Creates a renderer bound to a root element. If bindNameGenerator is omitted,
  it uses CotomyViewRenderer.defaultBindNameGenerator.

**Properties**

| Property | Type | Description |
| --- | --- | --- |
| element | CotomyElement | Root element used for binding and rendering. |
| bindNameGenerator | ICotomyBindNameGenerator | Name generator for bind paths. |
| defaultBindNameGenerator (static) | ICotomyBindNameGenerator | Global default used when constructor argument is omitted. |

**Methods**

| Method | Description |
| --- | --- |
| renderer(type, callback) | Registers a custom renderer for a bind type. |
| applyAsync(response) | Clears bound elements, then applies response JSON. |
| resetDefaultBindNameGenerator() (static) | Resets static default bind name generator to bracket style. |

**Protected Members (for subclassing)**

| Member | Description |
| --- | --- |
| initialized | true once default renderers are registered. |
| renderers | Registered renderer map (initializes on access). |
| initialize() | Registers default renderers (mail, tel, url, number, utc, date). |
| bindPrimitiveValue(propertyName, value) | Binds a primitive value to matching elements. |
| applyArrayAsync(values, propertyName) | Binds array values recursively. |
| applyObjectAsync(target, propertyName?) | Binds object values recursively. |

## ISO 8601 UTC Handling

For `data-cotomy-bindtype="utc"`:

- Cotomy supports ISO 8601 timestamps ending with `+HH:mm`, `-HH:mm`, or `Z`.
- If no offset is provided, Cotomy treats the value as UTC.
- Output is local by default.
- Set `data-cotomy-timezone` on the element (or an ancestor) to render in a specific IANA timezone.
- This behavior is consistent with ISO 8601 UTC handling.

For `data-cotomy-bindtype="date"`:

- Output is local by default.
- Set `data-cotomy-timezone` on the element (or an ancestor) to render in a specific IANA timezone.
