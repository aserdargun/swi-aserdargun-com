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

The foundation design is documented and awaiting final review. Application code
has not been scaffolded yet. There is therefore no local development command in
this revision.

The approved technical direction is a static-first Next.js application with
React, strict TypeScript, Tailwind CSS, Zod validation, Vitest, Testing Library,
and Playwright. Repository-managed research records will be validated at build
time. A persistent database, ingestion service, and advanced simulations remain
outside the first release.

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
