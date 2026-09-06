# SWI — Swarm Intelligence

SWI is a bilingual, evidence-based living map of swarm intelligence. It connects
observations from nature to general principles, computational algorithms,
robotics, and emerging artificial-agent systems.

The project is being established as part of the wider `aserdargun.com` research
ecosystem. Its first public release will be a research and learning platform,
not a full scientific simulator.

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

## Status

The first bilingual knowledge chain is implemented: four entities, three
relationships, source-linked claims, catalog search, graph/list navigation, and
research methodology. Six approved visual concepts guide the interface.

The approved technical direction is a static-first Next.js application with
React, strict TypeScript, Tailwind CSS, Zod validation, Vitest, Testing Library,
and Playwright. Repository-managed research records will be validated at build
time. A persistent database, ingestion service, and advanced simulations remain
outside the first release.

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
search, graph/list links, mobile overflow/navigation, and accessibility.

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
- [Foundation design specification](docs/superpowers/specs/2026-09-05-swi-foundation-design.md)

## Public target

- Product code: `SWI`
- Repository: `swi-aserdargun-com`
- Intended public URL: <https://swi.aserdargun.com>
- Languages: Turkish and English
- Intended deployment platform: Azure Static Web Apps

No GitHub, Azure, DNS, or portfolio-registry changes are part of the foundation
documentation phase.
