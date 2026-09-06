# SWI revision 02 — research you can use in your swarm

The user rejected the first release's content depth and design. This revision
implements a richer research workspace and a personal agenda. The user selected
framework-independent packages. The redesign passed local review and validation;
the user explicitly authorized deployment on 2026-09-06. The existing publication
target and validation contract are recorded in [Deployment](deployment.md).

## Implemented routes, in both Turkish and English

| Surface | Purpose |
| --- | --- |
| `/tr/`, `/en/` | Reading paths, biological mechanisms and a dated research radar |
| `atlas/` and `atlas/{slug}/` | Eight dossiers with observations, sources, transfer maps, limits and experiment ideas |
| `research/` | 21 studies; search, field filters, chronology/revision ordering, source disclosures and agenda intake |
| `recipes/` and `recipes/{slug}/` | Problem-oriented recipes, native communication diagrams, configuration and Markdown/JSON exports |
| `agenda/` | Manual URLs/notes, file imports, status tracking, editing, archive, recovery and backups |
| `map/` | Selectable biology → mechanism → experiment paths with their source connections |
| `methodology/` | Scope, reading depth, evidence, uncertainty, agenda boundaries and maintenance |

The original `entities/`, `explore/` and `graph/` routes remain available. Their
granular claim/evidence chain complements the new source-summary collection.

## Biological coverage and original engineering adaptation

| Biological anchor | Mechanism | Experiment recipe |
| --- | --- | --- |
| Argentine ants | Stigmergy, reinforcement and trace decay | Shared research memory with provenance and expiry |
| Honeybees | Independent scouting, recruitment and stop signals | Evidence comparison with preserved dissent |
| Starlings | Topological neighbourhoods | Bounded communication and explicit escalation |
| Termite-inspired TERMES robots | Local construction rules and prerequisites | Dependency-aware ownership and integration |
| Physarum | Flow-dependent network adaptation | Utility-weighted communication with redundancy checks |
| Couzin collective-motion model | Informed minorities and collective direction | Bounded specialist assistance and independent verification |
| Vibrio harveyi | Integration of quorum-sensing signals | Stage gates based on independent evidence |
| Photinus carolinus | Collective synchronization and local interaction | Asynchronous work with bounded checkpoints |

Physarum is a multinucleate cell, not an insect colony. The fish-related source
is a mathematical model, not a new field observation. Bird neighbour counts do
not establish an optimal LLM team size. Robot construction guarantees are not
claimed for arbitrary software tasks. These boundaries are visible in dossiers
and exported packages.

## Research snapshot

The selection spans Boids (1987), ant foraging (1989), Ant System (1996), AntNet
(1998), stigmergy (1999), quorum sensing (2003), collective motion (2005),
starling neighbourhoods (2008), Physarum networks (2010), honeybee stop signals
(2012), TERMES (2014), firefly synchronization (2021), debate / MetaGPT / AutoGen
(2023), Mixture-of-Agents / Agentless (2024), MAST / SwarmSys / Scaling Agent
Systems (2025, with current reviewed revisions), and Meta-Team (2026).

Every source has a direct primary/publication link. A reviewed date marks the
editorial snapshot, not continuous monitoring. Article, abstract and publication
record review are distinct. The collection is selected literature, not an
exhaustive systematic review. Engineering guidance is SWI synthesis.

## Portable experiment contract

`src/research/recipe.ts` generates version 1 `swi-experiment-spec` records.
Inputs are a task (10–6000 characters), 3–32 agents, 1–12 rounds, and a total
token budget of 1,000–1,000,000. Each recipe has three role categories; additional
agents expand its worker role. Roster token caps sum exactly to the aggregate
budget. Planning, messages, tool-result context, generation and verification all
consume that same budget; the host must enforce it.

The package includes concrete instructions, shared-record fields, stop/failure
conditions, sources, the biological transfer boundary, metrics and ablation.
Controls are single agent, independent parallel and coordinated swarm at the
same aggregate budget. `executionStatus: not-executed` and `experiment.result:
null` prevent a generated plan from being mistaken for a measured run.

## Agenda data contract

`src/research/agenda.ts` defines a strict version 1 SWI JSON backup. Imported
Markdown and text are displayed as escaped text. URLs accept only HTTP/HTTPS;
opening a source does not scrape it. JSON import preserves existing IDs and
nonempty exact source URLs, adds only new entries and validates all selected
files before writing. It never silently replaces a local edit.

Browser storage key: `swi-agenda-v1`. Limits: 1 MB/file, 100,000 characters/note,
500 entries and 1 MB total serialized agenda. Archive remains in backups and
can be restored through status controls. Storage-full or blocked-storage states
retain in-memory changes for export. A corrupt record blocks writes, exposes its
original bytes for download and requires a successful recovery backup before
starting empty. Browser storage is not an encrypted vault or cloud backup.

## Maintenance

Add or revise the source record first; preserve source version and reading
depth. Then update dossier references in both directions, interpretation and
limits in both languages. Change the reviewed date only after an actual source
check. Public library edits live in the repository; agenda items stay personal.
Run `npm run validate:codex` and review the affected desktop/mobile surfaces.
Revisit contemporary agent results separately from stable biological findings.
Automatic source discovery, cross-device sync, PDF extraction and model execution
are future work, not represented as operating features.
