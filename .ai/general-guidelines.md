# Cotomy AI General Guidelines

This document defines mandatory rules for all AI agents operating in Cotomy. No exceptions are allowed.

## 1. Core Policy

- Preserve Cotomy design principles and public API stability.
- Do not transfer architecture decisions to AI assumptions.
- Respect existing naming, layering, and responsibility boundaries.
- Do not perform broad rewrites without explicit user intent.
- Do not rename classes, methods, properties, parameters, exports, or files for stylistic reasons.

## 2. TypeScript / Library Rules

- Use existing classes in `src/` as first priority (`CotomyElement`, `CotomyForm`, `CotomyApi`, `CotomyPageController`).
- Do not introduce direct DOM mutation patterns that bypass `CotomyElement` in framework-level code.
- Keep async flows with `async/await`; avoid Promise chain-heavy rewrites.
- Do not change exported signatures without explicit approval.
- Avoid behavior-changing cleanup mixed with unrelated formatting edits.

## 3. Architecture Boundaries

- Treat `src/` as the framework core and preserve backward compatibility.
- Keep `reference-site/` as documentation and usage examples, not as a place for core runtime logic.
- Do not edit `dist/` manually; generated artifacts must come from build commands.
- Do not introduce SPA-style global state management into core architecture.

## 4. Existing Class First

- Reuse existing project classes before creating new abstractions.
- Forbid reimplementation of existing behavior unless a functional gap is demonstrated.
- If wide-impact changes are needed, stop and ask the user before implementation.

## 5. Method Design Convention

- Method names must describe concrete responsibility.
- Do not split logic only for cosmetic decomposition.
- Keep method boundaries aligned with functional responsibilities.
- Avoid excessive private-method fragmentation for trivial logic.

## 6. Coding Convention

- Follow `.editorconfig`, `tsconfig*.json`, and existing project style.
- Keep changes minimal and local to the requested scope.
- Do not leave debug-only code in final output.

## 7. Testing and Validation

- When code changes behavior, run relevant checks (`npm run check`, `npm run build`, tests if present) when feasible.
- Report what was executed and what could not be executed.

## 8. Security and Safety

- Enforce XSS-safe rendering defaults.
- Ask before introducing high-risk constructs (raw HTML injection patterns, dynamic script insertion, unsafe eval patterns).
- Keep API/error handling behavior consistent unless explicitly requested.

## 9. Change Reporting Rule

- Respond in the same language as the user inquiry.
- Present edits in diff-oriented form when applicable.
- Explain rationale and impact for non-trivial changes.
- Do not claim verification that was not actually executed.

## 10. Prohibition Handling

- Treat forbidden actions as blocked by default.
- If completion requires a forbidden action, ask the user first and proceed only after explicit approval.

## 11. Mass-Change Gate

- Forbid coordinated multi-file architectural transformations without explicit user approval.
- Forbid pattern-based project-wide rewrites without explicit instruction.
- If a change implies cascading edits, stop and confirm scope before proceeding.
