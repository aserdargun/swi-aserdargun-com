# SWI foundation design specification

Date: 2026-09-05  
Status: Approved in conversation; written specification awaiting user review

## Summary

SWI is a bilingual, evidence-based research and learning platform that maps
swarm intelligence from natural collective behavior through principles and
algorithms to robotics and artificial-agent systems. Relationships, claims,
evidence, and freshness are first-class records. The first release is
static-first and deliberately separates the knowledge platform from simulation
engines and future data services.

## Goals

- Build a durable knowledge model spanning nature, principles, algorithms,
  robotics, and artificial agents.
- Make biological-to-computational causal chains explorable.
- Associate substantive claims and relationships with inspectable evidence.
- Support Turkish and English from the first public artifact.
- Deliver a fast, accessible public resource on Azure Static Web Apps.
- Preserve clean boundaries for later experiments, simulations, and persistent
  research workflows.

## Non-goals for the first release

- Accounts, permissions, CMS, database, or write API.
- Automatic publication or unattended ingestion.
- Semantic/vector search.
- Scientific-grade validation of the educational ant simulation.
- 3D simulation, swarm robotics runtime, or LLM swarm execution.
- A universal score or claim that swarm structures outperform alternatives.

## Chosen architecture

Use Next.js App Router, React, strict TypeScript, Tailwind CSS, and Zod with
static export. Vitest and Testing Library cover domain and component behavior;
Playwright covers critical desktop and mobile workflows.

Canonical bilingual content is stored in repository-managed records. Build-time
parsing and relational validation produce one normalized immutable catalog.
Static routes consume the catalog directly. Client boundaries own only search,
filters, graph interaction, disclosure state, preferences, and simulations.

The first persistence seam is a small read-only catalog loader. PostgreSQL is
introduced only when a defined editorial or ingestion workflow justifies it.

## Product structure

Primary navigation contains Home, Explore, Research, Timeline, Experiments, and
Graph. Nature, Principles, Algorithms, AI Swarms, and Robotics are first-class
Explore collections and remain directly linkable.

Entity pages share a consistent anatomy: identity, mechanism, natural context,
principles, computational analogues, artificial-system relevance, claims,
sources, relationships, freshness, and related research. Sections with no
valid content are omitted or explicitly labeled incomplete; they are not filled
with generated text.

English and Turkish use parallel route families. Stable IDs and slugs are not
translated. A locale switch preserves the active record and interaction state.

## Visual direction

The intended identity is “scientific field station × living topology”: precise
typography, restrained scientific color, high information density where useful,
open spatial layouts, thin graph lines, and motion derived from agent behavior.
It must not resemble a generic SaaS dashboard or reuse HNS/AIA composition
unchanged.

Before UI implementation, coordinated desktop and mobile concepts will define
the landing viewport, Explore surface, entity page, graph state, evidence
disclosure, and ant experiment. Those accepted images become the visual
implementation contract.

## Data and evidence

Entities use a discriminated union. Relationships use a controlled directed
predicate vocabulary. Claims are classified as evidence, synthesis, hypothesis,
or open question. Evidence connects a claim to a source and records whether it
supports, challenges, or contextualizes that claim.

Source publication date, access date, claim review date, and record update date
remain separate. Freshness is derived according to topic volatility. Unknown or
unsupported information remains visibly unknown.

Build validation covers IDs, slugs, dates, localization parity, URLs, foreign
keys, taxonomy cycles, relationship vocabulary, evidence requirements, and
freshness consistency.

## First vertical slice

The first implementation proves this chain:

```text
Ant
  → exhibits → Stigmergy
  → inspires → Ant Colony Optimization
  → informs → Artificial Agent Coordination
```

It includes the minimum source, evidence, claim, entity, taxonomy, topic, and
relationship records needed to support the chain; localized landing and entity
routes; Explore search; a compact graph; a semantic relationship list; and the
research methodology surface.

Seed sources are researched immediately before authoring and verified against
primary or peer-reviewed material. Dates, quotations, and causal relationships
are not drafted from model memory.

## First experiment

Ant Foraging and Stigmergy follows the knowledge slice. A pure TypeScript engine
models bounded local sensing, exploration, food return, pheromone deposition,
evaporation, and obstacle behavior. It uses a seeded random source and fixed
timestep. Presentation runs through a worker adapter and exposes start, pause,
step, reset, seed, agent-count, deposit, evaporation, randomness, and speed
controls.

Measurements include food delivered, time to first discovery, route length,
active agents, and a formally defined stable-route metric. The interface labels
the experiment as an educational model and records its limitations.

## Failure behavior

Invalid content stops validation and build with record-specific diagnostics.
Malformed URL state resets to a canonical safe state. Graph-rendering failure
preserves the semantic relationship list. Simulation-worker failure stops the
run, retains the last valid metrics, and offers reset. Research content remains
available when interactive enhancement fails.

## Accessibility and performance

All core research content works without graph or simulation execution. Mobile
touch targets are at least 44 by 44 CSS pixels. Graph relationships are exposed
as semantic links and lists. Reduced motion pauses decorative movement and
offers a static experiment explanation. Heavy code is route-scoped, decorative
animation stops while hidden, and simulations apply device-aware agent limits.

## Testing and release gates

The implementation requires schema, catalog, selector, simulation, component,
browser, and artifact tests. Browser acceptance covers both locales, search,
entity traversal, evidence disclosure, graph/list parity, experiment controls,
keyboard navigation, reduced motion, and mobile overflow.

Azure receives only the already validated static artifact. GitHub publication,
Azure resource creation, deployment, DNS changes, and root-portfolio integration
remain separately authorized actions.

## Documentation map

- `docs/vision.md`: purpose, boundaries, and ecosystem role.
- `docs/architecture.md`: system and module design.
- `docs/taxonomy.md`: entity, topic, principle, and relationship vocabulary.
- `docs/data-model.md`: record contracts and validation.
- `docs/evidence-model.md`: provenance, claim types, and freshness.
- `docs/research-methodology.md`: research and correction workflow.
- `docs/experiments.md`: experiment contract and ant demo.
- `docs/roadmap.md`: ordered delivery phases and acceptance criteria.

## Ordered implementation sequence

1. Approve this written specification.
2. Produce and approve desktop/mobile visual concepts.
3. Write the implementation plan with file-level tasks and acceptance checks.
4. Scaffold the static-first application and validation toolchain.
5. Implement schemas and failing catalog-contract tests.
6. Research and enter the first chain's sources, evidence, and claims.
7. Implement localized landing, Explore, and entity routes.
8. Implement graph traversal and semantic fallback.
9. Expand research navigation and MVP content.
10. Implement and measure the ant experiment.
11. Complete visual fidelity, accessibility, performance, and artifact QA.
12. Prepare separately authorized GitHub and Azure release work.

## Resolved decisions

- Framework: Next.js static export rather than Vite SPA or database-first Next.js.
- Languages: Turkish and English from the first release; English default.
- Persistence: repository-managed content with a narrow future adapter seam.
- Search: conventional normalized search in the MVP.
- Graph: progressive enhancement with a complete semantic fallback.
- Simulation: separate pure engine and worker adapter.
- Application type for future portfolio manifest: `lab`.
- External changes: excluded until separately authorized.
