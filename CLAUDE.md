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
Minimal, earthy, and grounded. Nature-forward with a clean modern feel — inviting but not cluttered. Pure white base background throughout — no warm tinted section fills. No animations or transitions — content loads statically for maximum speed. Balanced spacing throughout (not cramped, not overly sparse). Every page opens with a large full-width hero image as its lead element.

**Reference**: dragstrupcamping.dk — specifically the large full-width hero image anchoring the top of every page. Everything else should feel more modern and refined than dragstrup.

### Colors
- **Shamrock Green**: `#2B9854` — CTAs, links, active states. Used sparingly — no large green fills
- **Mint Leaf**: `#77BA8A` — hover states and subtle accents only
- **White**: `#FFFFFF` — pure base background for all pages and sections
- **Floral White**: `#FCF6EB` — warm accent only — cards, callouts, CTA bands. Not used as section background
- **Near-black**: `#1A1A1A` — body text
- **Muted grey**: `#6B7280` — secondary text, captions

### Fonts (Google Fonts)
Geometric sans-serif pairing.

- **Headings**: `Outfit` — geometric, modern, slightly soft. Weights: 500, 600, 700
- **Body**: `Inter` — clean, highly legible, neutral geometric. Weights: 400, 500, 600

### Layout patterns

#### Header
Fixed/sticky header: logo (left), navigation links (center/right), language switcher, and a prominent "Book now" CTA button. Clean and compact. Mobile: hamburger menu.

Navigation links: Home, About, Accommodation, Activities, Gallery, Contact. Booking is the CTA button.

#### Homepage structure
1. **Hero** — full-viewport image (later video) with text overlay (tagline + subtitle) and CTA button
2. **Intro section** — short welcome text about the campsite and its location
3. **Feature cards grid** — highlight key offerings (accommodation types, activities, nature/location) as visual cards
4. **Alternating content section** — deeper content blocks alternating text + image sides
5. **Testimonials** — guest reviews/quotes
6. **CTA banner** — final call-to-action to book, full-width accent background

#### General page structure
- Pages use a consistent header + content + footer structure
- Every page opens with a large full-width hero image (dragstrupcamping.dk-style), with the page title or short tagline overlaid
- Pure white section backgrounds throughout — rhythm comes from spacing, hairline dividers, and card groupings rather than alternating fills
- Cards and grids for listing items (accommodations, activities); cards may use floral white for warmth
- Generous but not excessive padding between sections

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
- Custom translation utility in `src/i18n/utils.ts`
- Route structure: `/[locale]/...` (e.g. `/da/about`, `/en/about`)
- Translation files in `/messages/{locale}.json`
- `t(locale, namespace, key)` helper for translations
- Navigation links and booking CTA defined in `src/i18n/utils.ts`
- Language switcher in the site header
- Fallback to English if key is missing, then key name

## Stack

- Astro 5 (static output)
- Plain HTML + CSS — scoped `<style>` blocks inside `.astro` components, plus a global stylesheet (`src/styles/global.css`) holding tokens and base typography as CSS custom properties
- TypeScript in component frontmatter and `src/i18n/utils.ts`
- No Tailwind, no shadcn, no component libraries
- React is permitted as an escape hatch, but only for UI that genuinely needs client-side interactivity which plain HTML + a small inline `<script>` cannot cover. Default to HTML/CSS
- No database, no auth — will be added later for booking system

## Tools

- Use the context7 MCP skill to fetch up-to-date documentation before writing code that uses any library, framework, or API — even well-known ones. Your training data may be outdated.

## Conventions

- Plain Astro components (`.astro` files) using HTML + CSS. Avoid reaching for React unless a piece of UI truly requires it
- Component styles live in scoped `<style>` blocks; shared tokens and base styles live in `src/styles/global.css`
- Icons: inline SVG (no icon libraries). Copy paths from Lucide's open-source set when needed
- Write full implementations, no stubs or TODOs
- All user-facing text must go through the i18n system via `t()` — no hardcoded strings
- Placeholder content should be realistic (Danish camping context)
- Images: use placeholder containers with descriptive alt text until real assets arrive
- Pages use dynamic `[locale]` routing with `getStaticPaths` for all locales
