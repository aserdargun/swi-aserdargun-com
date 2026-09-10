# SWI — Swarm Intelligence

SWI is a bilingual, evidence-based living map of swarm intelligence. It connects
observations from nature to general principles, computational algorithms,
robotics, and emerging artificial-agent systems.

The project is part of the wider `aserdargun.com` research ecosystem. It is a
research and learning platform, not a full scientific simulator.

## Product thesis

> Observe nature → extract principles → formalize mechanisms → simulate them →
> apply them to artificial agents.

SWI treats relationships as first-class research records. A visitor should be
able to move through a chain such as:

```text
Ant
  → exhibits → Stigmergy
  → inspires → Ant Colony Optimization
  → informs → Artificial Agent Coordination
```

Each substantive statement and relationship must be traceable to explicit
claims and sources. Synthesis, hypotheses, and open research questions must not
be presented as settled evidence.

## Status — revision 02, 6 September 2026

SWI now connects eight biological dossiers to 21 selected studies and eight
framework-independent agent experiment recipes. The workspace has a biology
atlas, searchable research library, protocol configurator, knowledge map and
personal agenda in Turkish and English. The original four-entity ant chain and
its source-linked claims remain available.

The live [ANT](https://ant.aserdargun.com/) and [BEE](https://bee.aserdargun.com/)
laboratories connect the workspace, atlas, recipes and knowledge map to interactive
models. ANT also connects the original ant, stigmergy and ACO profiles to trail
formation. BEE explores foraging and dance recruitment; the honeybee dossier’s
nest-site selection, stop signals and quorum remain a separate research context.
Localized links, observation exercises and transfer boundaries are maintained in
`src/research/laboratories.ts`. Each laboratory has its own TR / EN controls.

The dossiers cover ants, honeybees, starlings, termites, Physarum, collective
motion, bacterial quorum sensing and firefly synchronization. Each separates
biological evidence, engineering adaptation, transfer limits and a controlled
experiment. The library spans 1987–2026; it is a dated selection, not a live or
exhaustive feed. Review depth and publication/revision dates are visible.

Recipes generate Markdown and JSON using the entered task, agent count, rounds
and aggregate token budget. They specify roles, shared records, stopping rules,
metrics, ablations and single-agent / independent-parallel / coordinated-swarm
controls. They do not execute agents or invent benchmark results.

The agenda supports URLs and notes, UTF-8 Markdown/text and versioned SWI JSON
backups. It supports editing, statuses, mechanism links, archive/undo and merging
imports without overwriting local entries. Data stays in this browser; export a
backup to move it or protect against browser storage removal. There is no cloud
sync, automatic source download or automatic publication. Limits: 1 MB per file,
100,000 characters per note, 500 entries, 1 MB total serialized agenda. Storage
failures expose temporary-session and recovery flows.

The maintenance update preserves temporary agenda edits when another tab changes
the saved backup, rejects stale editor writes, and provides a retry when storage
recovers. Unsaved agenda changes trigger the browser's leave-page protection.
Imports reject invalid UTF-8 atomically. Agenda search and status filters survive
language changes through the URL; on small screens the editor precedes the list.

Recipe drafts stay in this tab's session storage across reloads and language
changes. When session storage is blocked, drafts remain in memory until the page
is unloaded. Drafts never enter the URL. Adding an unchanged experiment plan
again preserves the existing agenda record. No recipe is executed by SWI.

Content validation checks both directions of study/dossier links, duplicate
references, and publication/revision chronology. Static verification resolves
local page links, fragment targets and referenced assets in the exported HTML.
These checks do not constitute a new review of the scientific literature; the
source-review date remains 6 September 2026.

The first design was rejected by the user. The revision-02 visual direction is
an implementation choice for that requested redesign, not a new user approval.
See [the revision brief](docs/revision-02.md) and
[design contract](docs/design/revision-02/contract.md).

## Local workflow

Use Node.js 22 and npm 10. Run `npm ci` to install the locked dependencies.
`npm run dev` starts the development server. `npm run build` validates research
content and produces the static `out/` export.

After building, `npm run preview:start` serves the export at
`http://127.0.0.1:4173`. Use `SWI_PREVIEW_PORT` to select another port consistently
for start and browser testing. `npm run preview:status` reports its state and
`npm run preview:stop` stops only the recorded process after checking its live
working directory and command. A foreign listener is never terminated.
The runtime record lives in ignored `.codex/runtime/preview.json`.

`npm run validate:codex` runs content validation, lint, type checks, unit and
component tests, a production build, artifact checks, and browser acceptance.
The preview is stopped in a finally block, including when a check fails.
Install the browser once with `npx playwright install chromium` if necessary.
`npm run test:e2e` builds its own export and manages preview startup/cleanup;
the complete validation command reuses its freshly built export.

Static checks verify all localized routes, referenced framework assets, favicon,
robots, security headers, absence of source maps, and common secret patterns.
This pattern scan is a limited safeguard, not a proof that every possible
credential is absent. Browser checks exercise bilingual traversal, evidence,
search, graph/list links, recipe exports, agenda imports and persistence, mobile
overflow/navigation, and accessibility.

The root entry uses the last visited language (`swi-locale`), then the browser's
first supported Turkish/English language, falling back to English. Language
changes are remembered when the destination loads; blocked storage never blocks
navigation. A styled, keyboard-accessible language chooser remains available
without JavaScript. Entry tests cover mobile/desktop layouts, remembered and
invalid preferences, blocked storage, and missing application scripts.

Local validation does not publish the application. GitHub, Azure, DNS and
root-portfolio integration require separate authorization.

## Documentation

- [Vision](docs/vision.md)
- [Architecture](docs/architecture.md)
- [Taxonomy](docs/taxonomy.md)
- [Data model](docs/data-model.md)
- [Evidence model](docs/evidence-model.md)
- [Research methodology](docs/research-methodology.md)
- [Experiments](docs/experiments.md)
- [Roadmap](docs/roadmap.md)
- [Deployment](docs/deployment.md)
- [Foundation design specification](docs/superpowers/specs/2026-09-05-swi-foundation-design.md)

## Public target

- Product code: `SWI`
- Repository: `swi-aserdargun-com`
- Public URL: <https://swi.aserdargun.com>
- Languages: Turkish and English
- Deployment platform: Azure Static Web Apps

Local implementation does not update GitHub, Azure, DNS or the portfolio registry.
