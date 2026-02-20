# Codex Prompt (Cotomy)

Apply `./.ai/general-guidelines.md` as highest priority.

## Codex-Specific Constraints

- Perform edits strictly within requested scope.
- Do not modify multiple files unless the request requires it.
- Provide changes in diff-oriented form.
- Do not rename classes, methods, properties, parameters, exports, or files for stylistic reasons.
- Forbid ambiguous refactoring, including signature changes, responsibility redistribution, and logic relocation without explicit user intent.
- Do not execute behavior-changing cleanup before user confirmation.
- Treat removal of apparently unused methods, exports, imports, or fields as proposal-only unless explicitly approved.
- Do not introduce new abstraction layers, service layers, or cross-cutting frameworks unless explicitly requested.
- Do not perform cross-file ripple changes without explicit approval.
- If intent is unclear, stop and ask for clarification before proceeding.
