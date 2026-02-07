# Comparison

## Cotomy Position

Cotomy is not a component framework.  
It is a DOM-structured runtime layer designed for form-driven, page-scoped business systems.

```mermaid
flowchart LR
  subgraph Frameworks[ React, Vue ]
    direction TB
    B1["Initial HTML"]
    B2["Component Framework\ncomponent tree / render"]
    B3["JS State - UI source"]
    B4["DOM - render output"]
    B5["Business Logic"]
    B1 --> B2
    B3 --> B2
    B2 --> B4
    B5 -- "update state" --> B3
    B4 -- "events / refs" --> B2
  end

  subgraph Cotomy[ Cotomy ]
    direction TB
    A1["Initial HTML"]
    A2["DOM - UI state"]
    A3["Cotomy Runtime\nlifecycle / forms / scoped CSS / event registry"]
    A4["Business Logic"]
    A1 --> A2 --> A3 --> A4
    A4 -- "update via CotomyElement" --> A3
    A3 --> A2
  end

  Frameworks ~~~ Cotomy
```

Cotomy does not replace the platform. It enforces runtime discipline on top of the platform.
The key difference is **where UI state lives** and **what owns the UI model**.

- **Cotomy:** The DOM is the UI state. Cotomy adds a runtime layer for lifecycle,
  forms, scoped CSS, and event cleanup. Updates should go through `CotomyElement`
  or Cotomy forms so the runtime can track lifecycle and handlers correctly.
- **React/Vue:** UI state lives primarily in JavaScript memory. The framework
  renders that state into the DOM, which becomes the output of the component tree.

“Initial HTML” here simply means the HTML that exists before the client runtime
starts. It could be server-rendered HTML, static HTML, or HTML produced by a build step.

Use Cotomy when you want HTML/DOM to remain the primary model and you need
runtime safety for forms and long-lived pages. Use a component framework when
you want a centralized render model and a JS state tree to be the source of truth.

## Responsibility Comparison

| Concern | Cotomy | React / Vue | Alpine | jQuery |
| --- | --- | --- | --- | --- |
| UI state location | DOM | JS memory | DOM + JS | DOM |
| Rendering model | Direct DOM | Virtual DOM / reactive | Direct DOM | Direct DOM |
| Form handling | First-class | Library dependent | Manual | Manual |
| Lifecycle safety | Built-in runtime | Hook-based | Manual | Manual |
| CSS scoping | Runtime scoped | Build or convention | None | None |
| Page model | Page-scoped | SPA / Component | Page / Widget | Page |
| Data binding | Renderer-driven | Reactive state | Attribute-based | Manual |
| Event cleanup | Automatic | Component lifecycle | Manual | Manual |

## Philosophy Differences

Cotomy:

- DOM = state
- No virtual render layer
- Form-first
- Page-scoped architecture
- Runtime lifecycle safety

React / Vue:

- JS state = source of truth
- Virtual or reactive render cycle
- Component tree centered
- SPA-oriented architecture

## Where Cotomy Fits

| Fit | Why |
| --- | --- |
| Business systems | Forms and APIs are central |
| Long-lived screens | Runtime safety reduces UI risk |
| Server HTML with dynamic behavior | Works alongside SSR |
| Admin and management tools | Input and process heavy |

## Where Cotomy Does Not Fit

| Not a Fit | Why |
| --- | --- |
| Large-scale SPA | No global state management |
| High-frequency re-render UIs | Not a render-optimization framework |
| Canvas / game UIs | DOM-centric design |

## Why Cotomy Is Not a Framework

Cotomy does not replace the platform.  
It enforces runtime discipline on top of the platform.

Cotomy can coexist with other frameworks when page scope and responsibilities
are clearly separated.

## Summary

Cotomy reduces UI risk, not rendering cost.
