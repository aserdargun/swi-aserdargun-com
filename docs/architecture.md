# Architecture

Current implementation reviewed on 21 September 2026. The original design in
`docs/superpowers/` records historical proposals; it is not the shipped contract.

## Application boundary

SWI is a static Next.js App Router application with React, strict TypeScript,
Zod and bilingual repository content. It is the observer and research atlas in
the aserdargun.com learning system. It does not run agents, fetch research on
page requests, execute colony simulations or automatically consume lab results.

ANT and BEE own their simulation engines, units, model versions and measurements
in their own workspaces. SWI's lab links supply reading context and observation
exercises. Connections to LCL, CLD, WFM and ITL describe learning relationships.
WFM and SWI are parallel research paths; neither is a prerequisite for the other.

## Content and modules

```text
content/*.json
  → src/research schemas and validation
  → catalog / workbench records
  → localized static pages and interactive views

recipe dossier + task + agent count + rounds + aggregate token budget
  → versioned Markdown / JSON experiment specification
  → manual use in the reader's own execution environment
```

- `content/`: bilingual source, claim, evidence, entity, relationship, study and
  dossier records. Public research is edited here and validated in `src/research`.
- `src/research/`: parsing, schemas, validation, search, freshness, laboratory
  context, recipe generation and the agenda backup contract. No React dependency.
- `src/graph/`: relationship graph construction and types.
- `src/i18n/`: UI text, locale helpers and documented review scope.
- `src/ui/`: evidence views, navigation, research workbench and browser storage.
- `src/app/`: static route composition, metadata and styles.

There is no `src/simulations/` or `src/experiments/` engine in SWI. Decorative
swarm and protocol diagrams are explanatory visuals, not research measurements.

## Routes and localization

Both `/tr/` and `/en/` expose the workspace, `atlas/`, `research/`, `recipes/`,
`agenda/`, `map/`, `methodology/`, `explore/`, `graph/`, dossier and recipe detail
pages, and the four original `entities/` pages. Slugs remain language-neutral.
The root uses the remembered locale, then the first supported browser language,
then English. A language chooser remains available without application scripts.

Locale changes preserve equivalent paths, query filters and fragments. Source
titles remain in the publication language. Explanations, limits, controls and
metadata preserve Turkish/English meaning. Unknown routes use static recovery.

## Persistence and generation

The agenda is local user state in `swi-agenda-v1`; it is not an input to recipe
selection or generation. There is no account, cloud synchronization or automatic
source download. Strict version 1 JSON backups support manual transfer. Invalid
imports fail atomically; existing identities and URLs are preserved on merge.
Blocked/full/corrupt storage exposes temporary-session and recovery flows.

Recipe drafts use session storage with an in-memory fallback. A prepared export
is a snapshot of its generation inputs with explicit schema and generator
versions. The generated roster's token caps sum to the aggregate budget. The
execution environment must enforce these caps: SWI does not enforce runtime
budgets. No measured result is generated. See [Experiments](experiments.md).

## Freshness and evidence

The original claim catalog computes freshness against an explicit date; static
pages identify their build-time evaluation date. A rebuild does not refresh a
source review. Study records show their own review date and depth. The initial
collection date and later partial source reviews are distinct; see
[the content review](content-review-2026-09-21.md).

## Verification and publication

`npm run validate:codex` runs content validation, lint, type checks, unit and
component tests, production export, artifact checks and Playwright acceptance.
Browser checks cover all localized mobile routes, key accessible views, evidence
navigation, recipe exports, agenda imports/persistence and recovery. Preview
lifecycle checks process ownership before stopping a listener.

Azure Static Web Apps receives the prebuilt `out/` artifact. Static security
headers restrict framing and unused capabilities; hashed assets are immutable.
Local validation does not publish. Every future release needs authorization for
that release plus independent deployment verification; historical deployment
notes do not authorize new releases.
