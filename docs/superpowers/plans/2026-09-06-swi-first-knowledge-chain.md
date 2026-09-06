# SWI First Knowledge Chain Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the first production-quality SWI vertical slice, connecting Ant → Stigmergy → Ant Colony Optimization → Artificial Agent Coordination through bilingual, source-backed records, searchable pages, and an accessible relationship graph.

**Architecture:** Use a statically exported Next.js App Router application. Repository-managed JSON records are parsed by Zod into one immutable catalog; server components render localized routes, while narrow client components own search, URL state, evidence disclosure, theme, and graph focus. This plan stops at the first knowledge chain; the ant simulation and wider MVP content receive separate plans after this slice passes its release gates.

**Tech Stack:** Node.js 22, npm 10, Next.js 16.3, React 19.2, TypeScript 5.9, Tailwind CSS 4.3, Zod 4.5, Vitest 4.1, Testing Library 16.3, Playwright 1.62, Azure Static Web Apps static artifact.

**Spec:** `docs/superpowers/specs/2026-09-05-swi-foundation-design.md`

## Global Constraints

- Generate and obtain approval for the complete desktop/mobile visual reference set before writing application code.
- Support both `tr` and `en`; every editorial `LocaleText` must contain non-empty values for both languages.
- Use language-neutral immutable lowercase kebab-case IDs and slugs.
- Treat evidence, synthesis, hypothesis, and open questions as distinct claim classes.
- Do not publish a substantive evidence claim or evidence-status relationship without a resolvable evidence record and source.
- Keep research and graph modules free of React imports.
- Keep graph visualization optional; semantic relationship navigation is the complete functional baseline.
- Use repository-managed content and static export; do not add accounts, a database, CMS, write API, analytics, remote fonts, or runtime secrets.
- Do not add the ant simulation, automated ingestion, semantic search, or wider catalog breadth in this plan.
- Use Image Gen for the approved visual contract and Browser/IAB plus `view_image` for fidelity verification.
- Do not commit, push, publish, deploy, change DNS, or modify the root portfolio without explicit user authorization. Commit commands below are execution checkpoints and remain skipped until that authorization exists.
- Preserve unrelated changes in sibling repositories; do not edit outside `swi-aserdargun-com`.

---

## File map

### Project and delivery

- `package.json`: scripts and exact dependency ranges.
- `package-lock.json`: reproducible dependency resolution.
- `next.config.ts`: static export, strict build behavior, and image policy.
- `tsconfig.json`: strict TypeScript settings and `@/*` alias.
- `postcss.config.mjs`: Tailwind PostCSS integration.
- `eslint.config.mjs`: Next, TypeScript, React, hooks, and accessibility linting.
- `vitest.config.ts`, `vitest.setup.ts`: unit and component test environment.
- `playwright.config.ts`: desktop and mobile acceptance projects.
- `public/staticwebapp.config.json`: Azure routing, cache, CSP, security headers, and MIME rules.
- `scripts/validate-content.ts`: CLI content-validation entry point.
- `scripts/verify-static.ts`: static artifact contract.
- `scripts/preview-control.mjs`: checkout-owned preview start/status/stop.
- `.gitignore`: generated, runtime, and test artifacts.

### Research content and domain

- `content/taxonomies.json`, `content/topics.json`: controlled classification records.
- `content/entities.json`: the four bilingual first-chain entities.
- `content/relationships.json`: three directed first-chain edges.
- `content/sources.json`: verified bibliographic records.
- `content/claims.json`: bounded evidence and synthesis statements.
- `content/evidence.json`: source-to-claim evidence links.
- `src/research/schema.ts`: Zod source of truth and inferred public types.
- `src/research/raw-content.ts`: JSON imports only.
- `src/research/catalog.ts`: normalization and immutable indexes.
- `src/research/validation.ts`: referential and editorial validation.
- `src/research/selectors.ts`: locale, entity, relationship, source, and evidence selectors.
- `src/research/search.ts`: normalized bilingual search index and filters.
- `src/research/freshness.ts`: deterministic freshness derivation.

### Graph and localization

- `src/graph/types.ts`: presentation-neutral graph types.
- `src/graph/build-graph.ts`: entity/relationship projection and adjacency traversal.
- `src/i18n/locales.ts`: locale parsing and route helpers.
- `src/i18n/copy.ts`: bilingual UI copy.

### Application and UI

- `src/app/layout.tsx`, `src/app/page.tsx`, `src/app/globals.css`: document shell, root locale handoff, and tokens.
- `src/app/[locale]/layout.tsx`, `src/app/[locale]/page.tsx`: localized shell and landing page.
- `src/app/[locale]/explore/page.tsx`: searchable catalog entry.
- `src/app/[locale]/entities/[slug]/page.tsx`: statically generated entity detail.
- `src/app/[locale]/graph/page.tsx`: first-chain graph and semantic alternative.
- `src/app/[locale]/methodology/page.tsx`: evidence methodology.
- `src/app/[locale]/not-found.tsx`: localized missing-record state.
- `src/ui/AppHeader.tsx`, `src/ui/AppFooter.tsx`: shell and locale navigation.
- `src/ui/RootLocaleRedirect.tsx`: validated stored-locale enhancement for the root page.
- `src/ui/SwarmField.tsx`: decorative, pausable, reduced-motion-safe homepage field.
- `src/ui/KnowledgeChain.tsx`: first-chain narrative.
- `src/ui/ExploreClient.tsx`: search, filters, and canonical URL state.
- `src/ui/EntityProfile.tsx`: entity-page composition.
- `src/ui/EvidenceList.tsx`: claim/source disclosure.
- `src/ui/RelationshipGraph.tsx`: progressively enhanced SVG graph.
- `src/ui/RelationshipList.tsx`: complete semantic graph alternative.
- `src/ui/LocaleSwitcher.tsx`, `src/ui/MobileNav.tsx`, `src/ui/ThemeToggle.tsx`: focused client controls.

### Tests and design evidence

- `tests/research/schema.test.ts`, `tests/research/catalog.test.ts`: record and relationship contracts.
- `tests/research/fixtures.ts`: fresh valid catalog factory for mutation tests.
- `tests/research/search.test.ts`, `tests/research/freshness.test.ts`: deterministic domain behavior.
- `tests/graph/build-graph.test.ts`: adjacency and first-chain traversal.
- `tests/ui/ExploreClient.test.tsx`, `tests/ui/EvidenceList.test.tsx`, `tests/ui/RelationshipList.test.tsx`: component behavior.
- `e2e/first-chain.spec.ts`, `e2e/mobile.spec.ts`, `e2e/accessibility.spec.ts`: browser acceptance.
- `docs/design/swi-home-desktop.png`, `docs/design/swi-home-mobile.png`: landing references.
- `docs/design/swi-explore-desktop.png`, `docs/design/swi-entity-desktop.png`: research surfaces.
- `docs/design/swi-graph-desktop.png`, `docs/design/swi-graph-mobile.png`: graph and fallback references.
- `docs/design/visual-contract.md`: accepted tokens, typography, component and responsive rules.
- `docs/design/fidelity-ledger.md`: concept-to-render comparison evidence.

---

### Task 1: Establish the visual contract

**Files:**
- Create: `docs/design/swi-home-desktop.png`
- Create: `docs/design/swi-home-mobile.png`
- Create: `docs/design/swi-explore-desktop.png`
- Create: `docs/design/swi-entity-desktop.png`
- Create: `docs/design/swi-graph-desktop.png`
- Create: `docs/design/swi-graph-mobile.png`
- Create: `docs/design/visual-contract.md`

**Interfaces:**
- Consumes: `docs/superpowers/specs/2026-09-05-swi-foundation-design.md`, especially the “scientific field station × living topology” direction.
- Produces: six user-approved image references and an exact design-token/component contract consumed by Tasks 7–11.

- [ ] **Step 1: Generate coordinated visual references**

Use Image Gen with separate fresh prompts per surface. Every prompt must preserve this shared system:

```text
Design a production web interface for “SWI — Swarm Intelligence”, a bilingual
scientific research instrument. Visual identity: scientific field station ×
living topology. Mineral-white #F7F8F3 canvas, near-black #111714 text,
chlorophyll #247153 evidence accents, colony amber #C98222 watch/hypothesis
accents, ultramarine #3157D5 interaction accents, cool-gray #DDE3DA rules,
and a deep-forest #0E1A17 graph field. No gradients, glassmorphism, generic SaaS
cards, hero eyebrow, stock imagery, or decorative AI brains. Use precise grotesk
UI typography paired with an editorial scientific serif for long-form headings.
Show code-native interface text legibly. Use open bands, thin topology lines,
small measurement labels, generous whitespace, and restrained agent motion.
All controls must have clear selected, focus, and mobile states.
```

Add surface-specific requirements:

- Home desktop, 1440×1100: header; `SWI / Swarm Intelligence`; exact hero line
  `Study how simple agents produce complex collective intelligence.`; primary
  action `Explore the map`; secondary action `Read the method`; visual chain
  `Nature → Collective behavior → Principles → Algorithms → Artificial agents`;
  first-chain preview and the beginning of the next research band.
- Home mobile, 390×844: same hierarchy and copy, 44-pixel controls, paused/static
  particle alternative, no horizontal overflow.
- Explore desktop, 1440×1000: unified search, type filters, dense semantic list,
  selected Ant row, relationship preview, freshness and source counts.
- Entity desktop, 1440×1100: Ant profile, mechanism narrative, claims and sources,
  first-chain rail, freshness, related research; no dashboard card grid.
- Graph desktop, 1440×1000: deep-forest bounded graph field plus visible semantic
  list rail; four nodes and three labeled edges; keyboard focus state.
- Graph mobile, 390×844: relationship list is primary; compact non-pan graph is
  secondary; all meaning remains available without color.

- [ ] **Step 2: Inspect every generated reference**

Use `view_image` at original detail for all six outputs. Reject any reference
with unreadable text, invented hero copy, gradients, excessive cards, desktop
overflow, inaccessible controls, or inconsistent visual language.

- [ ] **Step 3: Obtain user approval**

Present the six references together, explain the shared system and meaningful
responsive changes, and stop execution until the user explicitly approves or
requests revisions.

- [ ] **Step 4: Record the accepted contract**

Write `docs/design/visual-contract.md` with exact accepted colors, local font
families, scale, container widths, spacing, borders, focus ring, graph anatomy,
component variants, allowed first-viewport copy, and mobile collapse rules.
Reference every accepted image by path.

- [ ] **Step 5: Checkpoint**

After explicit commit authorization only:

```bash
git add docs/design
git commit -m "docs: define SWI visual contract"
```

Expected: one reviewable design-only checkpoint.

---

### Task 2: Scaffold the validated static application

**Files:**
- Create: `package.json`
- Create: `package-lock.json`
- Create: `next.config.ts`
- Create: `tsconfig.json`
- Create: `postcss.config.mjs`
- Create: `eslint.config.mjs`
- Create: `vitest.config.ts`
- Create: `vitest.setup.ts`
- Create: `.gitignore`
- Create: `src/app/layout.tsx`
- Create: `src/app/page.tsx`
- Create: `src/ui/RootLocaleRedirect.tsx`

**Interfaces:**
- Consumes: Node.js 22 and npm 10.
- Produces: `npm run dev`, `npm run build`, `npm run lint`, `npm run typecheck`, `npm test`, and `npm run check`; `@/*` resolves to `src/*`.

- [ ] **Step 1: Create the package contract**

Use this script/dependency shape and generate the lockfile with npm:

```json
{
  "name": "swi-swarm-intelligence",
  "private": true,
  "version": "0.1.0",
  "scripts": {
    "dev": "next dev",
    "build": "npm run validate:content && next build",
    "lint": "eslint .",
    "typecheck": "tsc --noEmit",
    "test": "vitest run",
    "test:e2e": "playwright test",
    "validate:content": "tsx scripts/validate-content.ts",
    "verify:static": "tsx scripts/verify-static.ts",
    "check": "npm run validate:content && npm run lint && npm run typecheck && npm test && npm run build && npm run verify:static"
  },
  "dependencies": {
    "@fontsource/ibm-plex-mono": "^5.2.6",
    "@fontsource/manrope": "^5.2.6",
    "@fontsource/source-serif-4": "^5.3.0",
    "next": "16.3.0",
    "react": "19.2.8",
    "react-dom": "19.2.8",
    "zod": "^4.5.4"
  },
  "devDependencies": {
    "@axe-core/playwright": "^4.13.0",
    "@playwright/test": "^1.62.1",
    "@tailwindcss/postcss": "^4.3.3",
    "@testing-library/jest-dom": "^7.0.1",
    "@testing-library/react": "^16.3.3",
    "@testing-library/user-event": "^14.6.7",
    "@types/node": "^26.4.1",
    "@types/react": "^19.2.18",
    "@types/react-dom": "^19.2.5",
    "eslint": "^9.39.5",
    "eslint-config-next": "16.3.0",
    "eslint-plugin-jsx-a11y": "^6.10.2",
    "jsdom": "^30.0.1",
    "tailwindcss": "^4.3.3",
    "tsx": "^4.23.13",
    "typescript": "^5.9.3",
    "vitest": "^4.1.11"
  }
}
```

Run: `npm install`

Expected: `package-lock.json` is created without peer-dependency errors.

- [ ] **Step 2: Configure static export and strict TypeScript**

`next.config.ts` must export:

```ts
import type { NextConfig } from 'next'

const config: NextConfig = {
  output: 'export',
  trailingSlash: true,
  images: { unoptimized: true },
  reactStrictMode: true,
}

export default config
```

Set `strict: true`, `noUncheckedIndexedAccess: true`, and the `@/*` alias in
`tsconfig.json`. Configure Tailwind through `@tailwindcss/postcss` and Vitest
with `jsdom`, `vitest.setup.ts`, and the same alias.

- [ ] **Step 3: Add the minimal document shell**

`src/app/layout.tsx` must import local Fontsource assets and provide static
metadata. `src/app/page.tsx` must render visible English and Turkish links plus
`RootLocaleRedirect`. That client component reads only the `swi-locale` key,
accepts only `tr` or `en`, and calls `location.replace('/' + locale + '/')`.
The visible links keep the page usable when JavaScript is unavailable.

- [ ] **Step 4: Run foundation checks**

Run: `npm run lint && npm run typecheck && npm test -- --passWithNoTests`

Expected: all three commands exit 0.

- [ ] **Step 5: Checkpoint**

After explicit commit authorization only:

```bash
git add package.json package-lock.json next.config.ts tsconfig.json postcss.config.mjs eslint.config.mjs vitest.config.ts vitest.setup.ts .gitignore src/app src/ui/RootLocaleRedirect.tsx
git commit -m "chore: scaffold SWI static application"
```

---

### Task 3: Define research schemas with failing tests first

**Files:**
- Create: `src/research/schema.ts`
- Create: `tests/research/schema.test.ts`

**Interfaces:**
- Consumes: Zod.
- Produces: `Locale`, `LocaleText`, `Entity`, `Relationship`, `Source`, `Claim`, `Evidence`, `Taxonomy`, `Topic`, `RawCatalog`, and `RawCatalogSchema`.

- [ ] **Step 1: Write failing schema tests**

Cover both valid minimal records and these rejected cases:

```ts
it.each([
  ['missing Turkish copy', { en: 'Ant' }],
  ['empty English copy', { tr: 'Karınca', en: '' }],
])('rejects %s', (_label, title) => {
  expect(() => LocaleTextSchema.parse(title)).toThrow()
})

it('rejects evidence claims with no evidence ids', () => {
  expect(() => ClaimSchema.parse({
    id: 'ant-local-signals',
    kind: 'evidence',
    statement: { tr: 'Dar bir ifade.', en: 'A bounded statement.' },
    subjectEntityIds: ['ant'],
    confidence: 'high',
    evidenceIds: [],
    reviewedAt: '2026-09-06',
  })).toThrow()
})
```

Run: `npm test -- tests/research/schema.test.ts`

Expected: FAIL because the schema exports do not exist.

- [ ] **Step 2: Implement strict Zod record schemas**

Use `z.discriminatedUnion('type', [...])` for entities. Export controlled enums
for entity type, relation type, claim kind, evidence relation, lifecycle status,
and source type. Use `.strict()` on every object schema. Validate calendar dates,
lowercase kebab-case IDs, HTTPS URLs, DOI shape when present, and non-empty
localized copy.

- [ ] **Step 3: Make schema tests pass**

Run: `npm test -- tests/research/schema.test.ts`

Expected: PASS with both accepted and rejected fixtures asserted.

- [ ] **Step 4: Checkpoint**

After explicit commit authorization only:

```bash
git add src/research/schema.ts tests/research/schema.test.ts
git commit -m "feat: define SWI research schemas"
```

---

### Task 4: Build fail-closed catalog validation and indexes

**Files:**
- Create: `src/research/catalog.ts`
- Create: `src/research/validation.ts`
- Create: `src/research/selectors.ts`
- Create: `tests/research/fixtures.ts`
- Create: `tests/research/catalog.test.ts`

**Interfaces:**
- Consumes: `RawCatalog` from `src/research/schema.ts`.
- Produces: `parseCatalog(input: unknown): Catalog`, `getEntityBySlug(catalog, slug): Entity | undefined`, `getEntityRelationships(catalog, entityId): Relationship[]`, `getClaimEvidence(catalog, claimId): Evidence[]`, and immutable maps on `Catalog`.
- Produces for tests: `makeValidRawCatalog(): RawCatalog`, returning a fresh deep copy containing entities `ant` and `stigmergy`, one `ant-stigmergy` relationship, one evidence claim, one source, and one evidence record.

- [ ] **Step 1: Write failing referential tests**

Include exact assertions for duplicate IDs, unknown source/target entities,
unknown claims, evidence attached to a different claim, taxonomy cycles, and an
evidence relationship with no claims:

```ts
it('rejects a relationship whose target does not exist', () => {
  const raw = makeValidRawCatalog()
  raw.relationships[0]!.targetEntityId = 'missing-entity'
  expect(() => parseCatalog(raw)).toThrow(/relationship.*missing-entity/i)
})

it('indexes outgoing and incoming edges', () => {
  const catalog = parseCatalog(makeValidRawCatalog())
  expect(catalog.outgoingByEntityId.get('ant')).toHaveLength(1)
  expect(catalog.incomingByEntityId.get('stigmergy')).toHaveLength(1)
})
```

Run: `npm test -- tests/research/catalog.test.ts`

Expected: FAIL because `parseCatalog` does not exist.

- [ ] **Step 2: Implement parsing and normalization**

Parse once through `RawCatalogSchema`, run cross-record checks, copy arrays
before sorting, and create `ReadonlyMap` indexes for every record family, slug,
outgoing relationship, incoming relationship, source-to-claim, and
claim-to-evidence relation.

- [ ] **Step 3: Implement selectors and verify**

Selectors throw only for programmer-facing required lookups and return
`undefined` for route/user-facing lookups. They never mutate catalog arrays.

Run: `npm test -- tests/research/catalog.test.ts`

Expected: PASS.

- [ ] **Step 4: Checkpoint**

After explicit commit authorization only:

```bash
git add src/research tests/research/catalog.test.ts
git commit -m "feat: validate and index SWI catalog"
```

---

### Task 5: Research and encode the first evidence chain

**Files:**
- Create: `content/taxonomies.json`
- Create: `content/topics.json`
- Create: `content/entities.json`
- Create: `content/relationships.json`
- Create: `content/sources.json`
- Create: `content/claims.json`
- Create: `content/evidence.json`
- Create: `src/research/raw-content.ts`
- Create: `scripts/validate-content.ts`
- Modify: `tests/research/catalog.test.ts`

**Interfaces:**
- Consumes: `parseCatalog(input)`.
- Produces: `catalog: Catalog` exported by `src/research/raw-content.ts`; four entities with slugs `ant`, `stigmergy`, `ant-colony-optimization`, and `artificial-agent-coordination`; three reviewed relationships.

- [ ] **Step 1: Verify sources before authoring claims**

Browse primary or peer-reviewed sources for ant foraging/pheromone behavior,
stigmergy, the original/formative ACO formulation, and stigmergic or
environment-mediated multi-agent coordination. For every candidate, verify the
publisher page or DOI record, bibliographic metadata, direct support scope,
stable URL, and access date. Do not use search-result snippets as evidence.

- [ ] **Step 2: Write a failing canonical-content test**

```ts
it('contains the complete first chain with evidence-visible edges', () => {
  expect(catalog.entities).toHaveLength(4)
  const edges = ['ant', 'stigmergy', 'ant-colony-optimization'].map((id) =>
    catalog.outgoingByEntityId.get(id)?.[0],
  )
  expect(edges.map((edge) => edge?.targetEntityId)).toEqual([
    'stigmergy',
    'ant-colony-optimization',
    'artificial-agent-coordination',
  ])
  expect(edges.every((edge) => edge && edge.claimIds.length > 0)).toBe(true)
})
```

Run: `npm test -- tests/research/catalog.test.ts`

Expected: FAIL because canonical content is absent.

- [ ] **Step 3: Add source-first records**

Enter verified sources, then copyright-safe evidence records, then bounded
claims, then bilingual entities and relationships. Classify the ACO-to-artificial
coordination connection as synthesis unless a reviewed source directly supports
the exact statement. Preserve technical terms and equal certainty in TR/EN.

- [ ] **Step 4: Wire the canonical catalog**

`src/research/raw-content.ts` imports each JSON file and exports exactly:

```ts
export const catalog = parseCatalog({
  taxonomies,
  topics,
  entities,
  relationships,
  sources,
  claims,
  evidence,
})
```

`scripts/validate-content.ts` imports `catalog` and prints deterministic counts
for each record family. It exits nonzero on any validation error.

- [ ] **Step 5: Verify data and tests**

Run: `npm run validate:content && npm test -- tests/research`

Expected: output reports exactly four entities and three relationships; all
research tests pass.

- [ ] **Step 6: Checkpoint**

After explicit commit authorization only:

```bash
git add content src/research/raw-content.ts scripts/validate-content.ts tests/research
git commit -m "feat: add first sourced swarm knowledge chain"
```

---

### Task 6: Implement localization and static route generation

**Files:**
- Create: `src/i18n/locales.ts`
- Create: `src/i18n/copy.ts`
- Create: `src/app/[locale]/layout.tsx`
- Create: `src/app/[locale]/not-found.tsx`
- Create: `src/app/[locale]/entities/[slug]/page.tsx`
- Create: `tests/research/locales.test.ts`

**Interfaces:**
- Consumes: `catalog`, `Locale`, and entity selectors.
- Produces: `locales`, `isLocale(value): value is Locale`, `localizedPath(path, locale): string`, `generateStaticParams()` for locales and entity slugs, and entity-specific static metadata.

- [ ] **Step 1: Write failing locale and route-param tests**

```ts
it('switches locale without changing slug, query, or fragment', () => {
  expect(localizedPath('/en/entities/ant/?type=species#evidence', 'tr')).toBe(
    '/tr/entities/ant/?type=species#evidence',
  )
})

it('rejects unsupported locale segments', () => {
  expect(isLocale('de')).toBe(false)
})
```

Run: `npm test -- tests/research/locales.test.ts`

Expected: FAIL because locale helpers are absent.

- [ ] **Step 2: Implement locale helpers and complete UI copy**

Define both translations for navigation, search, filter labels, evidence terms,
freshness states, graph/list controls, not-found content, and methodology labels.
No component owns ad hoc translation objects.

- [ ] **Step 3: Generate locale and entity routes**

Use `generateStaticParams` for `en` and `tr`, and for the Cartesian product of
both locales with the four entity slugs. Call `notFound()` for invalid locale or
slug. Metadata uses localized title/summary and a canonical language-specific
path.

- [ ] **Step 4: Verify static route generation**

Run: `npm test -- tests/research/locales.test.ts && npm run build`

Expected: PASS and static output exists for all eight entity routes.

- [ ] **Step 5: Checkpoint**

After explicit commit authorization only:

```bash
git add src/i18n src/app tests/research/locales.test.ts
git commit -m "feat: generate bilingual SWI entity routes"
```

---

### Task 7: Implement the accepted shell and design system

**Files:**
- Create: `src/app/globals.css`
- Create: `src/ui/AppHeader.tsx`
- Create: `src/ui/AppFooter.tsx`
- Create: `src/ui/LocaleSwitcher.tsx`
- Create: `src/ui/MobileNav.tsx`
- Create: `src/ui/ThemeToggle.tsx`
- Modify: `src/app/[locale]/layout.tsx`
- Test: `tests/ui/AppHeader.test.tsx`

**Interfaces:**
- Consumes: exact tokens and responsive rules from `docs/design/visual-contract.md`; `localizedPath` and UI copy.
- Produces: semantic page shell, preserved locale paths, theme preference, mobile navigation with inert background, and shared CSS component primitives.

- [ ] **Step 1: Write failing interaction tests**

Test that mobile navigation changes its accessible name between localized open
and close labels, applies `aria-expanded`, moves focus into the open menu,
restores focus on close, and marks main/footer inert while open. Test that the
locale switch preserves pathname, query, and fragment.

Run: `npm test -- tests/ui/AppHeader.test.tsx`

Expected: FAIL because shell components do not exist.

- [ ] **Step 2: Implement tokens and typography**

Transcribe exact accepted values from `visual-contract.md` into CSS custom
properties. Load Fontsource files locally. Define content typography and UI
control typography separately. Include visible `:focus-visible`, reduced motion,
high-contrast-safe borders, 44-pixel mobile targets, and bounded containers.

- [ ] **Step 3: Implement shell interactions**

Use small client components only for locale, theme, and navigation state. Avoid
global event listeners unless the menu is open. Escape closes the menu, focus is
trapped within it, and scroll locking is released on cleanup.

- [ ] **Step 4: Verify**

Run: `npm test -- tests/ui/AppHeader.test.tsx && npm run lint && npm run typecheck`

Expected: PASS.

- [ ] **Step 5: Checkpoint**

After explicit commit authorization only:

```bash
git add src/app src/ui tests/ui/AppHeader.test.tsx
git commit -m "feat: build accessible SWI application shell"
```

---

### Task 8: Build the landing page and first-chain narrative

**Files:**
- Create: `src/ui/SwarmField.tsx`
- Create: `src/ui/KnowledgeChain.tsx`
- Create: `src/app/[locale]/page.tsx`
- Create: `tests/ui/KnowledgeChain.test.tsx`

**Interfaces:**
- Consumes: `catalog`, localized selectors, accepted home references.
- Produces: the exact allowed hero copy, accessible four-entity chain, evidence-state labels, and pausable decorative swarm enhancement.

- [ ] **Step 1: Write a failing semantic-chain test**

```tsx
render(<KnowledgeChain locale="en" catalog={catalog} />)
expect(screen.getByRole('link', { name: 'Ant' })).toHaveAttribute('href', '/en/entities/ant/')
expect(screen.getByText('exhibits')).toBeVisible()
expect(screen.getByRole('link', { name: 'Artificial Agent Coordination' })).toBeVisible()
```

Also assert equivalent Turkish labels and that synthesis edges are text-labeled.

Run: `npm test -- tests/ui/KnowledgeChain.test.tsx`

Expected: FAIL.

- [ ] **Step 2: Implement the static page composition**

Preserve exact accepted first-viewport copy and section order. Render the chain
from catalog relationships rather than hard-coded node arrays. The next research
band must enter the accepted viewport at the same vertical position as the
reference.

- [ ] **Step 3: Add decorative swarm enhancement**

Use a bounded number of DOM/canvas particles, passive pointer input, automatic
pause on `document.visibilityState !== 'visible'`, and a static reduced-motion
state. Decorative agents are `aria-hidden`; the nearby text communicates all
meaning.

- [ ] **Step 4: Verify**

Run: `npm test -- tests/ui/KnowledgeChain.test.tsx && npm run build`

Expected: PASS.

- [ ] **Step 5: Checkpoint**

After explicit commit authorization only:

```bash
git add src/app/[locale]/page.tsx src/ui/SwarmField.tsx src/ui/KnowledgeChain.tsx tests/ui/KnowledgeChain.test.tsx
git commit -m "feat: publish SWI first-chain landing page"
```

---

### Task 9: Implement unified search and Explore

**Files:**
- Create: `src/research/search.ts`
- Create: `src/ui/ExploreClient.tsx`
- Create: `src/app/[locale]/explore/page.tsx`
- Create: `tests/research/search.test.ts`
- Create: `tests/ui/ExploreClient.test.tsx`

**Interfaces:**
- Consumes: `Catalog`, locale, entity types, URLSearchParams.
- Produces: `buildSearchDocuments(catalog, locale): SearchDocument[]`, `searchEntities(documents, query, types): SearchResult[]`, `parseExploreState(params): ExploreState`, and canonical `serializeExploreState(state): string`.

- [ ] **Step 1: Write failing search tests**

Test case-insensitive and Turkish-diacritic-aware matching for `ants`, `karınca`,
`stigmergy`, `stigmerji`, `pheromone`, and `feromon`; type filtering; stable
ranking; empty query; malformed type parameters; and canonical serialization.

```ts
expect(searchEntities(enDocs, 'pheromone', [])[0]?.entityId).toBe('stigmergy')
expect(searchEntities(trDocs, 'karinca', [])[0]?.entityId).toBe('ant')
```

Run: `npm test -- tests/research/search.test.ts`

Expected: FAIL.

- [ ] **Step 2: Implement a small normalized index**

Build each document once from localized title, summary, description, topics,
claim text, and related entity titles. Normalize Unicode with explicit Turkish
case handling. Rank exact title, title prefix, title token, topic, then body
matches. Do not add fuzzy-search dependencies.

- [ ] **Step 3: Write and pass Explore interaction tests**

Test search, type selection, result count, empty state, reset, browser back/forward,
and `history.replaceState` canonical URL updates. Use `useDeferredValue` for the
query and derive results during render.

Run: `npm test -- tests/research/search.test.ts tests/ui/ExploreClient.test.tsx`

Expected: PASS.

- [ ] **Step 4: Match the approved Explore reference**

Implement the dense list and selected relationship preview without converting
it into a generic card grid. Preserve control typography and keyboard focus.

- [ ] **Step 5: Checkpoint**

After explicit commit authorization only:

```bash
git add src/research/search.ts src/ui/ExploreClient.tsx src/app/[locale]/explore/page.tsx tests/research/search.test.ts tests/ui/ExploreClient.test.tsx
git commit -m "feat: add unified SWI exploration search"
```

---

### Task 10: Build entity profiles and evidence disclosure

**Files:**
- Create: `src/ui/EntityProfile.tsx`
- Create: `src/ui/EvidenceList.tsx`
- Modify: `src/app/[locale]/entities/[slug]/page.tsx`
- Create: `tests/ui/EvidenceList.test.tsx`

**Interfaces:**
- Consumes: entity, localized claims, evidence records, sources, incoming/outgoing relationships.
- Produces: one reusable entity anatomy and keyboard-operable claim/source details.

- [ ] **Step 1: Write failing evidence tests**

Test that each claim visibly exposes its class, confidence, review date, and
source count; expanding it reveals source title, author/organization,
publication/access date, source type, direct HTTPS link, evidence relation, and
localized relevance note. Assert hypotheses never receive an evidence label.

Run: `npm test -- tests/ui/EvidenceList.test.tsx`

Expected: FAIL.

- [ ] **Step 2: Implement evidence selectors and disclosure**

Use native `<details>` where it matches the accepted concept; otherwise preserve
native disclosure semantics in the custom control. Never inject source excerpts
as HTML. External links name the source and opening behavior.

- [ ] **Step 3: Implement entity anatomy**

Render identity, mechanism/context sections, claims, evidence, first-chain rail,
freshness, and incoming/outgoing related entities. Omit record-type sections
that do not apply. Match the approved Ant reference while keeping the component
valid for the other three discriminated entity types.

- [ ] **Step 4: Verify**

Run: `npm test -- tests/ui/EvidenceList.test.tsx && npm run build`

Expected: PASS and all eight localized entity pages export.

- [ ] **Step 5: Checkpoint**

After explicit commit authorization only:

```bash
git add src/ui/EntityProfile.tsx src/ui/EvidenceList.tsx src/app/[locale]/entities/[slug]/page.tsx tests/ui/EvidenceList.test.tsx
git commit -m "feat: expose SWI entity evidence profiles"
```

---

### Task 11: Add graph traversal and semantic parity

**Files:**
- Create: `src/graph/types.ts`
- Create: `src/graph/build-graph.ts`
- Create: `src/ui/RelationshipGraph.tsx`
- Create: `src/ui/RelationshipList.tsx`
- Create: `src/app/[locale]/graph/page.tsx`
- Create: `tests/graph/build-graph.test.ts`
- Create: `tests/ui/RelationshipList.test.tsx`

**Interfaces:**
- Consumes: `Catalog`, locale, focused entity ID.
- Produces: `buildGraph(catalog, locale): KnowledgeGraph`, `neighbors(graph, entityId): GraphNeighbor[]`, `walk(graph, startId, maxEdges): GraphNode[]`, the optional SVG visualization, and the complete semantic relationship list.

- [ ] **Step 1: Write failing graph-domain tests**

```ts
it('traverses the complete first chain in order', () => {
  const graph = buildGraph(catalog, 'en')
  expect(walk(graph, 'ant', 3).map((node) => node.id)).toEqual([
    'ant', 'stigmergy', 'ant-colony-optimization', 'artificial-agent-coordination',
  ])
})
```

Also test inverse labels, synthesis status, unknown focus, and stable output
ordering.

Run: `npm test -- tests/graph/build-graph.test.ts`

Expected: FAIL.

- [ ] **Step 2: Implement projection and traversal**

Project only display-ready localized node and edge fields. Build adjacency with
`Map` lookups, reject duplicate graph IDs through catalog validation, and keep
layout coordinates outside research records.

- [ ] **Step 3: Implement and test semantic parity**

The relationship list renders the same nodes, edge direction, localized
predicate, evidence class, and entity links as the SVG. Test both directions and
keyboard order.

Run: `npm test -- tests/graph/build-graph.test.ts tests/ui/RelationshipList.test.tsx`

Expected: PASS.

- [ ] **Step 4: Implement progressive graph enhancement**

Use production-quality SVG with labeled edges, stable viewBox, focused-node
state, keyboard-selectable nodes, and no document-level overflow. Animate a
wrapper or opacity/stroke dash state rather than continuously moving SVG
geometry. Render the semantic list before the graph on mobile according to the
approved reference.

- [ ] **Step 5: Checkpoint**

After explicit commit authorization only:

```bash
git add src/graph src/ui/RelationshipGraph.tsx src/ui/RelationshipList.tsx src/app/[locale]/graph/page.tsx tests/graph tests/ui/RelationshipList.test.tsx
git commit -m "feat: add accessible SWI knowledge graph"
```

---

### Task 12: Publish methodology and freshness behavior

**Files:**
- Create: `src/research/freshness.ts`
- Create: `tests/research/freshness.test.ts`
- Create: `src/app/[locale]/methodology/page.tsx`
- Modify: `src/i18n/copy.ts`

**Interfaces:**
- Consumes: record review date, source access state, topic volatility policy, current date injected by caller.
- Produces: `deriveFreshness(input, today): FreshnessStatus` and a bilingual public methodology page matching repository policy.

- [ ] **Step 1: Write failing boundary tests**

Test the day before, day of, and day after a review interval; unavailable source;
historical override; superseded record; and injected dates that remove ambient
clock dependence.

```ts
expect(deriveFreshness(stableRecord, new Date('2026-12-05T00:00:00Z'))).toBe('current')
expect(deriveFreshness(stableRecord, new Date('2026-12-06T00:00:00Z'))).toBe('review-due')
```

Run: `npm test -- tests/research/freshness.test.ts`

Expected: FAIL.

- [ ] **Step 2: Implement explicit review policies**

Define reviewed policy entries by topic volatility class and document every
interval on the methodology page. Prefer a record override for historical or
superseded state. Never infer freshness from page-build time without an injected
date.

- [ ] **Step 3: Build the methodology page**

Render the research loop, source priority, claim/evidence distinctions,
freshness rules, correction policy, AI-use policy, and current first-slice scope
from bilingual copy that agrees with `docs/research-methodology.md` and
`docs/evidence-model.md`.

- [ ] **Step 4: Verify**

Run: `npm test -- tests/research/freshness.test.ts && npm run build`

Expected: PASS.

- [ ] **Step 5: Checkpoint**

After explicit commit authorization only:

```bash
git add src/research/freshness.ts src/app/[locale]/methodology/page.tsx src/i18n/copy.ts tests/research/freshness.test.ts
git commit -m "feat: explain SWI evidence freshness"
```

---

### Task 13: Add local lifecycle, artifact, and browser release gates

**Files:**
- Create: `scripts/preview-control.mjs`
- Create: `scripts/verify-static.ts`
- Create: `public/staticwebapp.config.json`
- Create: `playwright.config.ts`
- Create: `e2e/first-chain.spec.ts`
- Create: `e2e/mobile.spec.ts`
- Create: `e2e/accessibility.spec.ts`
- Modify: `package.json`
- Create: `docs/design/fidelity-ledger.md`

**Interfaces:**
- Consumes: built `out/` directory and accepted visual references.
- Produces: `npm run preview:start`, `preview:status`, `preview:stop`, `test:e2e`, `verify:static`, and `validate:codex`; a complete local QA record.

- [ ] **Step 1: Implement checkout-owned preview lifecycle**

Use `.codex/runtime/preview.json` with PID, port, command, cwd, and start time.
Before signaling a PID, require both recorded cwd and live process cwd to equal
the current repository. Default to `127.0.0.1:4173`; support
`SWI_PREVIEW_PORT`. Add scripts:

```json
{
  "preview:start": "node scripts/preview-control.mjs start",
  "preview:status": "node scripts/preview-control.mjs status",
  "preview:stop": "node scripts/preview-control.mjs stop",
  "validate:codex": "npm run preview:stop && npm run check && npm run test:e2e && git diff --check"
}
```

- [ ] **Step 2: Implement the static artifact contract**

`verify-static.ts` must assert localized home, Explore, Graph, Methodology, and
all eight entity `index.html` files; hashed framework assets; favicon/robots;
`staticwebapp.config.json`; no source maps; and no known secret prefixes.

- [ ] **Step 3: Add SWA headers and routes**

Set immutable caching only for hashed `/_next/static/*` assets. Set HTML and JSON
to revalidate or no-store as appropriate. Use
`script-src 'self' 'unsafe-inline'` because a Next.js static export contains
inline hydration bootstrap code; do not allow `unsafe-eval` or external script
origins. Limit styles, fonts, images/data images, connections, and manifests to
self as required, and deny object, frame, and form destinations. Deny camera,
microphone, and geolocation. Declare JSON, SVG, WOFF, and WOFF2 MIME types.

- [ ] **Step 4: Write browser acceptance**

`first-chain.spec.ts` traverses Home → Ant → Stigmergy → ACO → Artificial Agent
Coordination in both locales, opens evidence, checks direct source links, uses
search, and compares Graph/List semantics.

`mobile.spec.ts` runs at 390×844, opens/closes navigation, verifies 44-pixel
targets, scrolls every route, and asserts:

```ts
expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(
  await page.evaluate(() => document.documentElement.clientWidth),
)
```

`accessibility.spec.ts` exercises keyboard traversal, reduced motion, focus
restoration, landmarks, headings, names, and an axe scan with no serious or
critical violations.

- [ ] **Step 5: Run full validation**

Run:

```bash
npm run validate:codex
```

Expected: content, lint, types, unit/components, production build, static
artifact, Playwright desktop/mobile/accessibility, and `git diff --check` all
pass; preview ends stopped.

- [ ] **Step 6: Perform visual fidelity QA**

Capture Browser/IAB screenshots at the six concept dimensions. Use `view_image`
on each accepted concept and corresponding render. Record at least these points
in `docs/design/fidelity-ledger.md`: copy, layout, typography, palette, graph
anatomy, evidence treatment, spacing/container model, control/icon treatment,
responsive collapse, and motion. Fix every actionable mismatch and repeat the
comparison.

- [ ] **Step 7: Verify the first-viewport copy allowlist**

Allowed visible hero copy is only:

```text
SWI
Swarm Intelligence
Study how simple agents produce complex collective intelligence.
Explore the map
Read the method
Nature
Collective behavior
Principles
Algorithms
Artificial agents
```

Localized Turkish equivalents from the accepted copy contract are permitted.
Fix additions, omissions, renames, or order drift.

- [ ] **Step 8: Final checkpoint**

After explicit commit authorization only:

```bash
git add package.json package-lock.json scripts public playwright.config.ts e2e docs/design/fidelity-ledger.md
git commit -m "test: enforce SWI release readiness"
```

Expected: a clean working tree, stopped preview, and no external publication.

---

## Completion boundary

This plan is complete when the four-entity bilingual chain is fully sourced,
searchable, traversable, statically exported, visually faithful to the approved
references, accessible through both graph and semantic list, and passes the full
local validation command.

The following work begins only through new reviewed plans: Ant Foraging
simulation, remaining MVP species/principles/algorithms/AI content, research
updates, timeline, open-question catalog expansion, GitHub publication, Azure
deployment, DNS, and root-portfolio integration.
