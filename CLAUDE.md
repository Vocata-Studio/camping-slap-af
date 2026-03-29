@AGENTS.md

# Blank Canvas Starter

This is a fresh starter template, not an active project. Before doing any real work, ask the user to update this CLAUDE.md with project-specific instructions. Do not begin building features until this file has been customized.

## First steps for a new project

Prompt the user to fill in the following before writing code:
- Project name and description
- Key features / pages to build
- Any additional dependencies or integrations needed
- Design direction (colors, style, layout preferences)

## Stack

- Next.js 16 (App Router, TypeScript)
- Tailwind CSS v4
- shadcn/ui (Radix UI primitives, base-nova style)
- Lucide React + Heroicons for icons
- No database, no auth — add as needed per project

## Tools

- Use the context7 MCP skill to fetch up-to-date documentation before writing code that uses any library, framework, or API — even well-known ones. Your training data may be outdated.

## Conventions

- Use server components by default, `"use client"` only when needed
- Write full implementations, no stubs or TODOs
- Use the `cn()` utility from `@/lib/utils` for conditional classes
- Add shadcn components via `pnpm dlx shadcn@latest add <component>`
- Next.js 16 uses `proxy.ts` instead of `middleware.ts`
