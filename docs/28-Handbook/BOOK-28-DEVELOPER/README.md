# BOOK-28 — Developer Handbook & Coding Standards

| Field | Value |
|-------|-------|
| Project | TWallet Services |
| Version | 1.0.0 |
| Status | Production Ready |
| Priority | Critical |
| Classification | Engineering Standards |

## Purpose

Define the coding standards, architecture principles, workflows, and engineering practices for the TWallet Services project.

### Goals

- Consistent codebase
- Maintainability
- Readability
- Scalability
- Developer productivity
- AI-friendly development

## Folder Structure

```
BOOK-28-DEVELOPER/
├── README.md
├── 01-Project-Structure.md
├── 02-TypeScript-Standards.md
├── 03-React-Standards.md
├── 04-NextJS-Standards.md
├── 05-Supabase-Standards.md
├── 06-Naming-Conventions.md
├── 07-Git-Workflow.md
├── 08-Code-Reviews.md
├── 09-Documentation.md
├── 10-Error-Handling.md
├── 11-Testing-Rules.md
├── 12-Performance-Rules.md
├── 13-Security-Rules.md
├── 14-AI-Guidelines.md
└── 15-OpenCode.md
```

## Required Tools

| Tool | Purpose |
|------|---------|
| ESLint | Code linting |
| Prettier | Code formatting |
| Husky | Git hooks |
| lint-staged | Staged file linting |
| Commitlint | Commit message validation |
| TypeScript Strict Mode | Type safety |
| GitHub Actions | CI/CD |
| Dependabot | Dependency updates |

## Cross-References

- **Book 12 — System Architecture:** src/ folder structure, RSC vs Client patterns, Supabase clients
- **Book 22 — Testing & QA:** test rules, coverage requirements
- **Book 23 — DevOps:** Git branching, CI/CD, code review integration
- **Book 24 — Monitoring:** error tracking, logging standards
- **Book 25 — Performance:** performance rules and budgets
- **Book 21 — Security:** security rules and compliance
