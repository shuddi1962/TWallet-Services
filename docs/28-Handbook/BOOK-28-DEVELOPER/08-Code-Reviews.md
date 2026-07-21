# Code Reviews

## Pull Request Template

```markdown
## Summary

[Brief description of the change]

## Related Issue

Closes #[issue-number]

## Type of Change

- [ ] feat: New feature
- [ ] fix: Bug fix
- [ ] docs: Documentation
- [ ] refactor: Code restructuring
- [ ] test: Tests
- [ ] perf: Performance improvement
- [ ] chore: Maintenance

## Database Changes

- [ ] New migration: [name]
- [ ] Schema change: [description]
- [ ] No database changes

## API Changes

- [ ] New endpoint: [method] [path]
- [ ] Changed endpoint: [description]
- [ ] No API changes

## UI Changes

- [ ] New component: [name]
- [ ] Changed component: [description]
- [ ] No UI changes

## Screenshots

[If applicable]

## Tests Added

- [ ] Unit tests: [count]
- [ ] Integration tests: [count]
- [ ] E2E tests: [count]

## Checklist

- [ ] TypeScript strict mode passes
- [ ] Lint passes (npm run lint)
- [ ] Tests pass (npm run test)
- [ ] Build passes (npm run build)
- [ ] Documentation updated
- [ ] No console.log in production code
- [ ] Error handling implemented
- [ ] Security considerations addressed
- [ ] Performance implications considered
- [ ] Accessibility checked

## Reviewer Notes

[Specific areas to focus on]
```

## Code Review Checklist

### General

| Check | Description |
|-------|-------------|
| Readability | Is the code easy to understand? |
| Duplication | Is there any duplicated logic? |
| Comments | Are there unnecessary comments? (code should be self-documenting) |
| Console logs | No `console.log` in production code |
| Dead code | No commented-out code or unused imports |

### TypeScript

| Check | Description |
|-------|-------------|
| Strict mode | Does it compile with strict: true? |
| Any usage | Is `any` used unnecessarily? (use `unknown`) |
| Type safety | Are edge cases handled with proper types? |
| Generics | Are generics used where appropriate? |

### React/Next.js

| Check | Description |
|-------|-------------|
| Server vs Client | Is the component in the right rendering mode? |
| Server Actions | Are mutations using Server Actions? |
| Suspense | Are slow sections wrapped in Suspense? |
| Dynamic imports | Are heavy components dynamically imported? |
| Images | Are all images using `next/image`? |
| Metadata | Does every public page have metadata? |

### Testing

| Check | Description |
|-------|-------------|
| Coverage | Are new features tested? |
| Edge cases | Are error states tested? |
| Accessibility | Is the component accessible? |
| Performance | Are there performance tests for critical flows? |

## Review Process

1. Author requests review after CI passes
2. Reviewer reads code and leaves comments
3. Author addresses comments
4. Re-review if significant changes
5. Approve and merge

## Review Expectations

| Role | Responsibility |
|------|----------------|
| Author | Keep PR small (< 400 lines), write clear description, respond to feedback |
| Reviewer | Review within 24 hours, be constructive, focus on code not person |
| Both | Assume good intent, blameless culture, learn from each other |
