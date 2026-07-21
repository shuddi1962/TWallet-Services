# OpenCode: Developer Handbook Build Instructions

## Requirements

The developer handbook is a reference document. No application code is created from this book. Instead, the rules and standards defined here MUST be followed when implementing ALL other books.

## Implementation Rules

When implementing ANY feature book, OpenCode MUST:

1. Follow the TypeScript standards in `02-TypeScript-Standards.md`
2. Follow the React standards in `03-React-Standards.md`
3. Follow the Next.js standards in `04-NextJS-Standards.md`
4. Follow the Supabase standards in `05-Supabase-Standards.md`
5. Use naming conventions from `06-Naming-Conventions.md`
6. Use the Git workflow from `07-Git-Workflow.md`
7. Follow error handling patterns from `10-Error-Handling.md`
8. Follow testing rules from `11-Testing-Rules.md`
9. Follow performance rules from `12-Performance-Rules.md`
10. Follow security rules from `13-Security-Rules.md`
11. Follow AI guidelines from `14-AI-Guidelines.md`
12. Follow the project structure from `01-Project-Structure.md`

## Verification Checklist

- [ ] TypeScript strict: true configured
- [ ] No `any` usage in the codebase
- [ ] Server Components used by default
- [ ] Server Actions for all mutations
- [ ] RLS on every database table
- [ ] Naming conventions followed consistently
- [ ] Git commits follow conventional commits
- [ ] PRs follow the review template
- [ ] All features include tests
- [ ] Error handling follows the consistent pattern
- [ ] Performance rules followed
- [ ] Security rules followed
- [ ] AI guidelines documented
- [ ] Documentation updated with code changes
- [ ] Production ready
