# Overview

Cotomy is a pragmatic frontend toolkit designed to make everyday web application development lighter, clearer, and more maintainable.  
It provides a structured layer over the DOM, forms, and API communication — without introducing a heavy framework or hidden magic.

Cotomy favors **predictability over abstraction**, **HTML over virtual DOM**, and **explicit structure over convention-based behavior**.

This reference explains the building blocks that make that possible.

---

## What is Cotomy?

Cotomy is **not** a full framework.  
It is a **lightweight UI toolkit** that adds structure to common web application tasks:

- DOM manipulation  
- Form handling  
- API communication  
- View-level behavior control  

It helps you build interactive screens without needing a large SPA framework.

---

## What Problems It Solves

Cotomy addresses practical issues often seen in business web applications:

- Forms and API requests become repetitive and error-prone  
- DOM utilities get duplicated across pages  
- Small and medium screens become over-engineered with large frameworks  
- View logic spreads across scripts and markup  

Cotomy provides **just enough structure** to keep code organized while staying close to standard HTML and JavaScript.

---

## Design Philosophy

Cotomy is built on the following principles:

- **Framework-less structure**  
  Adds order without replacing the platform.

- **HTML-first**  
  Markup remains the primary source of truth.

- **Explicit over magic**  
  Behavior is defined clearly — no hidden conventions.

- **Small surface area**  
  Only essential abstractions are introduced.

- **Predictable behavior**  
  Utilities behave consistently across screens.

---

## Core Concepts

| Concept | Description |
|--------|-------------|
| CotomyElement | A lightweight wrapper for DOM operations |
| View | A unit of screen-level behavior |
| API helper | Utilities for structured HTTP communication |
| Form binding | Data handling between UI and backend |

Each concept is explained in detail in the reference sections.

---

## When to Use Cotomy

Cotomy is well-suited for:

- Business applications  
- Form-driven interfaces  
- Admin and management screens  
- Server-rendered pages with dynamic behavior  

---

## When Not to Use Cotomy

Cotomy is not intended for:

- Large-scale SPA state management  
- Virtual DOM–driven UI systems  
- Graphics-heavy or canvas-based apps  

---

## How to Use This Reference

Use the sidebar to navigate to each class, interface, and utility.  
Each page describes its purpose, methods, and expected behavior.


---

## Quick Example

Below is a minimal example showing how Cotomy structures common UI tasks.
