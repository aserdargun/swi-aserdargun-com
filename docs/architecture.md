# Architecture

> Revision 02 (2026-09-06): [current implementation and boundaries](revision-02.md).
> The planning sections below retain the original foundation direction;
> simulation, ingestion and future database proposals are not shipped features.

## Decision

SWI will begin as a static-first Next.js application using the App Router,
React, strict TypeScript, Tailwind CSS, and Zod. Canonical research records will
live in the repository and be validated during local checks and production
builds. Interactive features will be isolated in focused client components.

This approach was selected over a Vite single-page application because SWI will
have many durable entity and research routes that benefit from page-specific
HTML and metadata. It was selected over a database-first application because
the first release does not require accounts, editing, ingestion, or runtime
secrets.

## System flow

```text
content records
  → schema parsing
  → referential and editorial validation
  → normalized catalog
  → graph/search/freshness indexes
  → statically generated localized pages
  → focused interactive client islands
```

No ordinary page request performs a research-data fetch in the first release.
Invalid content fails the build rather than degrading silently in production.

## Module boundaries

```text
content/
  Repository-managed bilingual records.

src/research/
  Schemas, parsing, validation, normalization, selectors, and freshness rules.

src/graph/
  Relationship vocabulary, adjacency indexes, traversal, and presentation data.

src/experiments/
  Experiment definitions, hypotheses, parameters, metrics, and run records.

src/simulations/
  Pure engines, deterministic random sources, worker protocol, and measurements.

src/ui/
  Accessible visual primitives and feature components.

src/app/
  Routes, metadata, server composition, and narrow client boundaries.
```

`src/ui` may depend on public selectors from research, graph, and experiments.
Research and graph code must not import React. Simulation engines must not
import UI or browser APIs. Browser-worker integration belongs in a simulation
adapter, not the engine.

## Routing and localization

The first release will generate `/en` and `/tr` route families. English is the
default for a visitor without a stored preference; switching languages preserves
the current entity, filters, query, and fragment when an equivalent route exists.

Stable slugs and identifiers remain language-neutral. Visible titles,
summaries, descriptions, relationship labels, UI labels, and explanatory notes
are localized. Source titles and quoted excerpts remain in their source language
and may include a clearly marked localized explanation.

Planned route families:

```text
/{locale}
/{locale}/explore
/{locale}/nature
/{locale}/principles
/{locale}/algorithms
/{locale}/ai-swarms
/{locale}/robotics
/{locale}/entities/{slug}
/{locale}/research
/{locale}/timeline
/{locale}/questions
/{locale}/experiments
/{locale}/experiments/ant-foraging
/{locale}/graph
/{locale}/methodology
```

Unknown locales and missing records return a real not-found result. URL query
state is parsed against a schema before use and serialized in one canonical
order.

## Static-first persistence boundary

The initial `CatalogRepository` has one implementation backed by validated local
records. Consumers receive a normalized immutable catalog rather than importing
individual JSON files. A later PostgreSQL implementation can satisfy the same
read contract without moving presentation rules into the database layer.

This is a narrow migration seam, not a generic repository framework. Database
tables, write APIs, authentication, and migrations will only be designed when a
real editorial or ingestion workflow requires them.

## Interactive boundaries

Server-rendered/static by default:

- landing and collection content;
- entity identity, claims, evidence, and sources;
- timeline and research-question text;
- methodology and experiment documentation.

Client-side only where interaction requires it:

- global search and filters;
- URL-synchronized exploration state;
- expandable evidence details;
- knowledge-graph pan, focus, and traversal;
- ant-foraging controls and live metrics;
- theme and locale preferences.

Heavy graph or simulation code is loaded only on its route or after explicit
interaction. The decorative homepage swarm must use a smaller implementation
than the experiment engine and must stop when hidden.

## Accessibility and responsive behavior

- All navigation and filters are keyboard operable.
- Interactive targets meet a minimum 44 by 44 CSS-pixel touch area on mobile.
- The graph has a semantic relationship list exposing the same nodes and edges.
- Simulation state has textual metrics and control labels; color is not the only
  carrier of meaning.
- Motion responds to `prefers-reduced-motion`; decorative motion can be paused.
- Canvas and graph regions have bounded dimensions and never create page-level
  horizontal overflow.
- Focus is restored deliberately after mobile drawers and modal surfaces close.

## Error handling

Build-time errors include the record kind, stable ID, field, and failed
constraint. Referential failures are fatal. Missing optional descriptions may
render an explicitly labeled incomplete state; missing evidence for a record
classified as evidence may not.

At runtime, invalid URL filters fall back to a canonical safe state and replace
the malformed URL. A graph rendering failure falls back to the relationship
list. A worker failure stops the simulation, retains the last valid metrics, and
offers a reset without affecting research content.

## Security and deployment

The first release has no runtime secrets, write endpoints, user-generated HTML,
or third-party analytics requirement. Content is escaped by framework defaults.
External links use HTTPS and visibly identify their publisher.

Azure Static Web Apps receives a prebuilt, validated `out/` artifact. Security
headers should deny framing and unused device permissions, restrict content
sources, and apply immutable caching only to hashed assets. CI validates the
same build that is eligible for deployment.

GitHub, Azure, DNS, and root-portfolio mutations are separate release actions
and require explicit authorization.

## Verification strategy

- Schema tests: individual record shapes and enums.
- Catalog tests: unique IDs, foreign keys, localization parity, chronology, and
  evidence requirements.
- Selector tests: search, filters, adjacency, path traversal, and freshness.
- Simulation tests: seeded determinism, movement bounds, deposition,
  evaporation, food return, and metric integrity.
- Component tests: filters, evidence disclosure, locale switching, and fallbacks.
- Browser tests: landing-to-entity traversal, search, graph/list parity,
  experiment controls, desktop/mobile overflow, and keyboard navigation.
- Artifact tests: localized routes, metadata, assets, security configuration,
  release identity, and static MIME behavior.
