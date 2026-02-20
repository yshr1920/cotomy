# Copilot Prompt (Cotomy)

Apply `./.ai/general-guidelines.md` as highest priority.

## Copilot-Specific Constraints

- Operate with partial-completion assumptions.
- Do not infer and generate replacements for existing core classes.
- Prioritize type safety and signature consistency.
- Do not generate direct DOM manipulation patterns as framework conventions.
- Do not suggest renames of classes, methods, properties, parameters, exports, or files for stylistic reasons.
- Do not suggest new abstraction layers, service layers, architectural patterns, or cross-cutting frameworks unless explicitly requested.
- If intent is unclear, ask for clarification instead of inferring architecture changes.
