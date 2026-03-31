@AGENTS.md

# Camping Slap Af

Website for "Camping Slap Af" — a Danish campingplads located in Sejerslev on the island of Mors (Morsoe), Denmark.
Domain: campingslapaf.dk

## Pages

- **Home** — hero, highlights, CTA to booking
- **About** — the campsite, the area (Sejerslev/Morsoe), story
- **Accommodation** — types (tent, caravan, cabin, etc.) with details
- **Booking** — internal booking system (stub for now, full build later)
- **Activities** — things to do on-site and nearby
- **Contact** — address, phone, email, map placeholder
- **Gallery** — photo grid (placeholder images for now)

## Design

### Style
Minimal but warm. Nature-forward, clean, outdoor. Not sterile — should feel inviting and grounded.

### Colors
- **Shamrock Green**: `#2B9854` — primary, CTAs, active states
- **Mint Leaf**: `#77BA8A` — secondary, accents, hover states
- **White**: `#FFFFFF` — background
- **Floral White**: `#FCF6EB` — reserved for warm accent surfaces (cards, sections, etc.)

Use near-black (`#1A1A1A`) for body text and white (`#FFFFFF`) for contrast surfaces where needed.

### Fonts (Google Fonts)
- **Headings**: `Outfit` — geometric, modern, slightly soft. Weights: 500, 600, 700
- **Body**: `DM Sans` — clean, readable, friendly. Weights: 400, 500, 700

Import via `next/font/google` and apply as CSS variables (`--font-heading`, `--font-body`).

### Icons
Lucide React as primary icon set. Heroicons as fallback.

## i18n — Multi-language

The site must support dynamic language detection and switching. Auto-detect browser language on first visit. Persist user choice.

### Supported languages
| Code | Language   |
|------|------------|
| da   | Dansk (default) |
| en   | English    |
| de   | Deutsch    |
| nl   | Nederlands |
| fr   | Francais   |
| es   | Espanol    |
| it   | Italiano   |
| sv   | Svenska    |
| nb   | Norsk      |
| pl   | Polski     |

### i18n approach
- Use `next-intl` for translations
- Route structure: `/[locale]/...` (e.g. `/da/om-os`, `/en/about`)
- Translation files in `/messages/{locale}.json`
- Language switcher in the site header
- Fallback to English if browser language is unsupported, then Danish

## Stack

- Next.js 16 (App Router, TypeScript)
- Tailwind CSS v4
- shadcn/ui (Radix UI primitives, base-nova style)
- Lucide React + Heroicons for icons
- `next-intl` for i18n
- No database, no auth — will be added later for booking system

## Tools

- Use the context7 MCP skill to fetch up-to-date documentation before writing code that uses any library, framework, or API — even well-known ones. Your training data may be outdated.

## Conventions

- Use server components by default, `"use client"` only when needed
- Write full implementations, no stubs or TODOs
- Use the `cn()` utility from `@/lib/utils` for conditional classes
- Add shadcn components via `pnpm dlx shadcn@latest add <component>`
- Next.js 16 uses `proxy.ts` instead of `middleware.ts`
- All user-facing text must go through the i18n system — no hardcoded strings
- Placeholder content should be realistic (Danish camping context)
- Images: use placeholder divs with descriptive alt text until real assets arrive
