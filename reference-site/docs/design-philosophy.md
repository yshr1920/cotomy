---
slug: /design-philosophy
title: Design Philosophy
description: The principles behind Cotomy, including DOM-first architecture, minimal runtime design, transparency, and maintainability over time.
---

# Design Philosophy

Cotomy is built around the idea that many business web applications do not need a full component-rendering client framework to stay maintainable.

## DOM-First Architecture

Cotomy treats the DOM as the primary UI model.

- The visible structure is the actual structure
- Form controls represent current input state
- Browser tooling remains the main debugging surface

This keeps the runtime close to the platform instead of introducing another source of UI truth.

## Minimal Runtime

Cotomy adds structure where business screens usually need it most:

- lifecycle tracking
- event cleanup
- scoped CSS
- form and API integration

It avoids expanding into a broad application shell with its own render cycle and app-wide state model.

## Framework Transparency

Cotomy aims to be easy to reason about.

- The DOM is still the DOM
- HTML remains central
- Runtime behavior is explicit rather than hidden behind generated abstractions

The point is not cleverness. The point is traceability.

## Systems Designed to Stay Maintainable

Cotomy is designed for systems that must remain operable over time.

- Internal tools
- admin panels
- document-oriented business applications
- enterprise screens with steady change over many years

These systems usually benefit more from predictable boundaries than from maximum client-side abstraction.

## Server-Oriented Development

Cotomy fits naturally with server-rendered or mixed architectures.

- Pages can be delivered independently
- Server responsibilities remain clear
- Client logic can be added without turning the whole system into a SPA

This makes Cotomy a practical fit for teams that want progressive enhancement with stronger runtime structure.

## Related Pages

- [Overview](/)
- [Architecture](/architecture/)
- [Use Cases](/use-cases/)
- [Getting Started](/reference/getting-started/)
