---
slug: /use-cases
title: Use Cases
description: Real-world scenarios where Cotomy fits well, including admin systems, internal workflows, and form-heavy enterprise screens.
---

# Use Cases

Cotomy works best when the application is page-oriented, form-driven, and expected to stay maintainable for years.

## Business Admin Systems

Admin systems usually revolve around editing records, validating input, and connecting screens to APIs.

Cotomy fits well here because:

- Forms are first-class runtime units
- The DOM stays easy to inspect during operations
- Page behavior can remain explicit instead of hidden behind a deep component tree

## Internal Workflow Applications

Internal tools often model approval flows, data review, and operational handoffs between teams.

Cotomy is useful here because:

- Each page can stay isolated and page-scoped
- API interactions can be standardized through forms
- Long-lived operational screens benefit from lifecycle and event cleanup

## Form-Heavy Enterprise Screens

Enterprise UIs frequently contain dense forms, query screens, edit views, and server-driven validation.

Cotomy helps because:

- The runtime is built around forms rather than around re-render cycles
- Existing HTML can remain central
- Teams can evolve screens incrementally without moving to a full SPA architecture

## Long-Lived Internal Tools

Some systems are not flashy products. They are operational tools that need to remain predictable for many years.

Cotomy is a good match because:

- It minimizes framework surface area
- It keeps debugging close to browser-native behavior
- It favors maintainability and operational clarity over client-side architectural complexity

## When Cotomy Is Usually the Wrong Choice

Cotomy is usually not the right tool when:

- You need a large global SPA state model
- The UI is primarily animation-driven or render-intensive
- You want the framework to own the entire rendering pipeline

## Next Steps

- [Getting Started](/reference/getting-started/)
- [Architecture](/architecture/)
- [Design Philosophy](/design-philosophy/)
- [Comparison](/comparison/)

