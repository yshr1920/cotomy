---
title: CotomyEntityFillApiForm
sidebar_position: 6
---

# CotomyEntityFillApiForm

Entity API form that loads data and fills inputs automatically.

**Methods**

| Method | Description |
| --- | --- |
| filler(type, func) | Registers a custom fill handler for input types. |
| initialize() | Registers fillers and loads on cotomy:ready. |
| reloadAsync() | Reloads by fetching data from the API. |
| renderer() | Creates a CotomyViewRenderer for the form. |

**Protected Members (for subclassing)**

| Member | Description |
| --- | --- |
| loadActionUrl | URL used for loading entity data. |
| bindNameGenerator() | Name generator for binding (default: bracket). |
| canLoad | true if loading should proceed. |
| loadAsync() | Loads entity data and fills the form. |
| applyValueToInputs(pname, value) | Applies a single value to inputs. |
| fillArrayAsync(generator, values, propertyName) | Fills array values recursively. |
| fillObjectAsync(generator, target, propertyName?) | Fills object values recursively. |
| fillAsync(response) | Fills inputs and applies renderer. |
| submitToApiAsync(formData) | Submits and then fills on success. |

## Fill behavior

:::important Multiple select is intentionally excluded from automatic fill

CotomyEntityFillApiForm does not automatically synchronize
select elements with the multiple attribute.

This is an intentional boundary decision in Cotomy core.

Reasons:

- Array binding strategies differ across projects.
- Business applications often replace native multiple select
  with token UI, checkbox groups, or custom selector components.
- Enforcing a single array synchronization model in core
  would reduce architectural flexibility.

Cotomy core keeps multiple select behavior strictly native.

If array-based synchronization is required,
implement it explicitly at application level.

Standardized multi-select synchronization may be provided
through a separate class in the upcoming project template.
:::
