# Agent Guidelines

- AI agent must avoid using Angular structural directives `*ngIf` and `*ngFor` in generated code.
- Prefer alternative conditional rendering and iteration patterns (e.g., `@if`/`@for` syntax or explicit component logic) consistent with project style.
- Keep changes minimal and aligned with existing coding standards in this repository.
- Default to Angular's `inject()` for dependency injection instead of constructor injection.
