# Product Requirements Document — Camping Slap Af

## Overview

**Product:** Website for Camping Slap Af
**Type:** Danish campingplads (danish campsite)
**Location:** Sejerslev, island of Mors (Morsoe), Denmark
**Domain:** campingslapaf.dk
**Tagline:** TBD

## Goals

1. Establish an online presence for Camping Slap Af
2. Provide visitors with essential information about the campsite, accommodation, and local activities
3. Serve an international audience with full multi-language support (10 EU languages)
4. Lay the foundation for a future internal booking system (embed will come soon for this)

## Target Audience

- Danish domestic campers
- International tourists (primarily German, Dutch, Scandinavian, and broader EU travelers)
- Families, couples, and outdoor enthusiasts looking for camping on Morsoe

## Phases

### Phase 1 — Marketing Site (current)

Static marketing website with i18n, placeholder content, and no dynamic backend.

### Phase 2 — Booking System (future)

Internal booking system with database, auth, user accounts, and admin panel.

### Phase 3 — Enhancements (future)

Weather widget, interactive map, CMS, Google Maps integration, social media feeds, newsletter signup.

---

## Phase 1 Requirements

### Pages

| Page | Purpose | Key Content |
|------|---------|-------------|
| **Home** | Landing page, first impression | Hero section, campsite highlights, CTA to booking/accommodation |
| **About** | Story and context | About the campsite, Sejerslev, Morsoe island, the people behind it |
| **Accommodation** | What's available | Accommodation types (tent pitches, caravan spots, cabins, etc.) with descriptions |
| **Booking** | Reservation entry point | Stub/placeholder — will become full internal booking system in Phase 2 |
| **Activities** | Things to do | On-site activities and nearby attractions on Morsoe |
| **Contact** | Get in touch | Address, phone, email, directions, map placeholder |
| **Gallery** | Visual showcase | Photo grid — placeholder images until real photos are provided |

### Internationalization (i18n)

- **Auto-detection:** Browser language detected on first visit, site language set automatically
- **Persistence:** User's language choice persisted across sessions
- **Fallback chain:** Browser language -> English -> Danish
- **Language switcher:** Visible in site header on all pages

**Supported languages:**

| Code | Language | Priority |
|------|----------|----------|
| da | Dansk | Default / primary |
| en | English | High — international fallback |
| de | Deutsch | High — largest tourist segment |
| nl | Nederlands | Medium |
| fr | Francais | Medium |
| es | Espanol | Medium |
| it | Italiano | Medium |
| sv | Svenska | Medium — neighboring country |
| nb | Norsk | Medium — neighboring country |
| pl | Polski | Medium |

**Route structure:** `/[locale]/page-slug` (e.g. `/da/overnatning`, `/en/accommodation`)

### Design

**Style:** Minimal, earthy, and grounded. Nature-forward with a clean modern feel — inviting but not cluttered. Pure white base background throughout — no warm tinted section fills. No animations or transitions — static and fast. Balanced spacing (not cramped, not overly sparse). Every page opens with a large full-width hero image as its lead element.

**Reference:** dragstrupcamping.dk — specifically the large full-width hero image anchoring the top of every page. Everything else about our design should feel more modern and refined than dragstrup.

**Color palette:**

| Name | Hex | Usage |
|------|-----|-------|
| Shamrock Green | `#2B9854` | CTAs, links, active states. Used sparingly — no large green fills |
| Mint Leaf | `#77BA8A` | Hover states and subtle accents only |
| White | `#FFFFFF` | Pure base background for all pages and sections |
| Sage Mist | `#EEF4F0` | Soft nature accent — cards, callouts, CTA bands. Not used as section background |
| Near Black | `#1A1A1A` | Body text |
| Muted Grey | `#6B7280` | Secondary text, captions |

**Typography (Google Fonts):**

| Role | Font | Weights | Character |
|------|------|---------|-----------|
| Headings | Outfit | 500, 600, 700 | Geometric, modern, slightly soft |
| Body | Inter | 400, 500, 600 | Clean, highly legible, neutral geometric |

**Icons:** Inline SVG, paths copied from Lucide's open-source set when needed. No icon library dependency.

### Layout

**Header:** Sticky — logo (left), navigation links (center/right), language switcher, prominent "Book now" CTA. Mobile: hamburger menu.

**Homepage structure:**
1. Full-viewport hero image (later video) with text overlay (tagline + subtitle) and CTA
2. Short intro/welcome section about the campsite and location
3. Feature cards grid — key offerings (accommodation, activities, nature/location)
4. Alternating text + image content blocks for deeper detail
5. Guest testimonials/reviews
6. Full-width CTA banner to book (accent background)

**General page patterns:**
- Consistent header + content + footer on all pages
- Every page opens with a large full-width hero image (following dragstrupcamping.dk's approach), with the page title or short tagline overlaid
- Pure white section backgrounds throughout — visual rhythm comes from spacing, hairline dividers, and card groupings rather than alternating fills
- Cards and grids for listing items (accommodations, activities); cards may use floral white for warmth
- Generous but not excessive section padding

### Content

- All text content is placeholder for Phase 1
- Placeholder content should be realistic and contextually appropriate (Danish camping setting)
- Images use placeholder containers with descriptive alt text until real photos are supplied
- Logo and brand assets are available from the owner

### Technical Stack

| Layer | Technology |
|-------|------------|
| Framework | Astro 5 (static output, TypeScript) |
| Styling | Plain CSS — global tokens in `src/styles/global.css` + scoped `<style>` blocks in `.astro` components |
| Components | Plain `.astro` components (no UI library). React allowed only when client-side interactivity requires it |
| Icons | Inline SVG (Lucide paths copied as static SVG when needed) |
| i18n | Custom utility in `src/i18n/utils.ts` + JSON message files in `/messages` |
| Package manager | pnpm |

### Technical Constraints

- Astro defaults to zero JavaScript — only add inline `<script>` or React islands when interactivity truly requires it
- No Tailwind, shadcn, or component libraries
- No database or auth in Phase 1
- No CMS in Phase 1
- No external integrations in Phase 1
- All user-facing strings must go through the i18n system

---

## Out of Scope (Phase 1)

- Booking logic and payment processing
- Database and authentication
- CMS / content management
- Weather widget
- Interactive map
- Google Maps integration
- Social media feeds
- Newsletter signup
- SEO optimization beyond basics

## Success Criteria

1. All 7 pages are built and navigable
2. Site renders correctly in all 10 supported languages
3. Browser language auto-detection works on first visit
4. Design matches the specified color palette, typography, and minimal-nature aesthetic
5. Site is responsive across desktop, tablet, and mobile
6. Foundation is structured to support Phase 2 booking system addition

## Assets Available

- Logo (from owner)
- Brand assets (from owner)
- Photos: not yet — use placeholders

## Open Questions

- Tagline / slogan — to be decided
- Specific accommodation types and pricing — to be provided
- Contact details (address, phone, email) — to be provided
- Specific activities to highlight — to be provided
- SEO keywords and meta descriptions — to be decided
