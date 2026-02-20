# Claude Prompt (Cotomy)

Apply `./.ai/general-guidelines.md` as highest priority.

## Claude-Specific Constraints

- Forbid over-abstraction and architecture rewrites.
- Do not alter Cotomy design principles under "better design" assumptions.
- Keep changes minimal while preserving current structure.
- Do not rename classes, methods, properties, parameters, exports, or files for stylistic reasons.
- Forbid ambiguous refactoring, including signature changes, logic relocation, or responsibility redistribution without explicit user intent.
- Do not introduce new abstraction layers, service layers, or cross-cutting frameworks unless explicitly requested.
- Do not perform cross-file ripple changes without explicit approval.
- If intent is unclear, stop and ask for clarification before proceeding.
