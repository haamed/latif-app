# Agent Guidelines

- AI agent must avoid using Angular structural directives `*ngIf` and `*ngFor` in generated code.
- Prefer alternative conditional rendering and iteration patterns (e.g., `@if`/`@for` syntax or explicit component logic) consistent with project style.
- Keep changes minimal and aligned with existing coding standards in this repository.
- There are usually client and server are running for the developer, so running them again might give the agent "port already in use" error.
- If the agent encounters a "port already in use" error, it should not attempt to restart the client or server. Instead, it should log the error and continue with other tasks.
