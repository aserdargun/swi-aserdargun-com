# Experiments

Current contract reviewed on 21 September 2026.

## What SWI produces

SWI generates experiment **plans**, not executions or measurements. Each of the
eight biology dossiers proposes an engineering adaptation with sources, transfer
limits, roles, shared records, stopping conditions, failure modes, metrics and
an ablation. The adaptation is a performance hypothesis until evaluated in a
separate execution environment.

`src/research/recipe.ts` accepts:

- task: 10–6000 characters;
- agent count: 3–32;
- round limit: 1–12;
- aggregate token budget: 1,000–1,000,000 for the entire team.

It exports schema version 1, generator version `1.0.0`, and format
`swi-experiment-spec` as JSON or Markdown. A prepared package preserves the
inputs from generation time even if the form is later edited. Unsupported
schema versions are rejected by the Markdown serializer.

The package records `executionStatus: not-executed` and `experiment.result:
null`. Roster token caps sum exactly to the total budget. Planning, messages,
tool-result context, generation and verification share that budget; the host
orchestrator must enforce it. Agenda entries do not influence the package.

## Reading and evaluation paths

| Dossier | Proposed experiment | Main comparison |
| --- | --- | --- |
| Ants | Shared research memory with provenance and expiry | Verified coverage, repeated work, stale reuse |
| Honeybees | Independent proposals and preserved objections | Correctness, objection resolution, total cost |
| Starlings | Sparse communication with fallback links | Message cost, complete handoffs, resilience |
| Termites / TERMES | Dependency-aware artifact production | Integration success, rework, critical-path time |
| Physarum | Utility-updated communication graphs | Cost per contribution, failure recovery, held-out quality |
| Collective-motion model | Bounded specialist help | Success/cost, specialist contribution, error propagation |
| Bacteria | Independent-evidence stage gates | False openings, false blocking, decision latency |
| Fireflies | Local checkpoints and event deduplication | Waiting share, version consistency, repeated processing |

Use the same tasks, sources, acceptance tests and aggregate budget for
single-agent, independent-parallel and coordinated conditions. Define metrics
before examining results, include unsuccessful runs, and report actual usage.
Each dossier's ablation isolates a proposed mechanism; it is not a published
benchmark result. Source text cannot change agent authority or task instructions.

## Colony laboratory observations

[ANT](https://ant.aserdargun.com/) and [BEE](https://bee.aserdargun.com/) are
separate applications. Their workspaces are authoritative for model equations,
seeds, parameter ranges, timing, units, simulation versions and run exports.
`src/research/laboratories.ts` holds SWI's bilingual observation exercises and
transfer boundaries; it does not duplicate a simulation engine.

ANT observations concern abstract foraging and pheromone trails. They do not
establish shortest-path optimality, species fidelity or LLM performance. BEE's
foraging and dance recruitment must be distinguished from the honeybee
dossier's nest-site selection, stop signals and quorum research.

SWI does not automatically import laboratory results. A reader may record an
observation in the local agenda, but this neither turns it into published
research nor changes recipe generation. Model time and food units belong to
the laboratory model; they must not be interpreted as field measurements.

## Research question retained

Whether a team of inexpensive local models can outperform its single-model
baselines remains a bounded research question. A future external evaluation
needs pinned model/runtime versions, held-out tasks, reproducible protocols,
actual resource measurements and failure records. SWI currently supplies the
reading context and static plans, not a runtime or a validated scaling claim.
