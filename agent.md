# Agent Guidelines

- AI agent must avoid using Angular structural directives `*ngIf` and `*ngFor` in generated code.
- Prefer alternative conditional rendering and iteration patterns (e.g., `@if`/`@for` syntax or explicit component logic) consistent with project style.
- Keep changes minimal and aligned with existing coding standards in this repository.
- Default to Angular's `inject()` for dependency injection instead of constructor injection.
- For each page we need to support at least two languages (Farsi and English).
- We need all components to support bidirectional text and layout.
- If possible we want to use prime-ng as the main control toolkit.
