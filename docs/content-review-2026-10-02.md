# SWI content review — 2 October 2026

## Scope

A full availability and identity pass over all 11 catalog sources, plus the
addition of two 2026 studies. This supersedes the partial 21 September review
for the sources it covered, and closes the gap that review left open: at that
point only four records had been re-read and the other seventeen had not.

## What was actually verified

Every source identifier was resolved against an authoritative registry rather
than a general web fetch, because publisher pages answer a plain request with
bot-protection status codes that say nothing about whether the source is real:

| Record | Resolved via | Result |
| --- | --- | --- |
| Goss et al. 1989 | DOI content negotiation `10.1007/BF00462870` | "Self-organized shortcuts in the Argentine ant" |
| Théraulaz & Bonabeau 1999 | DOI content negotiation `10.1162/106454699568700` | "A Brief History of Stigmergy" |
| Dorigo et al. 1996 | DOI content negotiation `10.1109/3477.484436` | "Ant system: optimization by a colony of cooperating agents" |
| Di Caro & Dorigo 1998 | DOI content negotiation `10.1613/jair.530` | "AntNet: Distributed Stigmergetic Control for Communications Networks" |
| Seeley et al. 2012 | NCBI E-utilities PMID 22157081 | "Stop signals provide cross inhibition in collective decision-making by honeybee swarms", Science 2012 |
| Bassler et al. 2003 | PMC145445 fetched | quorum sensing record |
| Sarfati et al. 2021 | PMC8262802 fetched | Schlegel stop-signal record |
| Reynolds 1987 | red3d.com fetched | Boids record |
| Tero et al. 2010 | NCBI E-utilities PMID 20093467 | "Rules for biologically inspired adaptive network design", Science 2010 |
| Werfel et al. 2014 | Princeton SSR publication page fetched | "Designing Collective Behavior in a Termite-Inspired Robot Construction Team", Science 343(6172) |
| Couzin et al. 2005 | nature.com article fetched | informed minorities record |

Two of these were recorded as `2026-09-06` for 26 days while the accessible
record was only "the URL responded". The registry check confirms the title and
authors in each stored record still correspond to the identifier it points at.

## Studies added

The 2026 column held a single study against three in 2025, two in 2024 and
three in 2023. Two mechanism-level additions close that gap. Both were read at
abstract level through the arXiv API, and both are stored as `depth: abstract`
so the record does not overstate what was read.

| Study | Identifier | Venue metadata |
| --- | --- | --- |
| SyncSBC: Decentralized Swarm Behavior Prediction for Synchronized Autonomous Control | arXiv:2608.06587v1, published 2026-08-06 | 8 pages, 10 figures, IROS 2026 |
| Unveiling Complex Collective Behaviors from Simple Rewards | arXiv:2607.12861v1, published 2026-07-14 | Accepted by IROS 2026 |

Both are linked to biological dossiers by analogy, following the pattern the
existing agent-kind records use: SyncSBC to starlings and fish because it
carries Couzin's local-interaction argument to robots, and Agent Response Map
to ants and Physarum because it explains a collective pattern by tracing one
agent's observation back to the field it learned.

## What was not done

- The stored `finding`, `takeaway` and `limitation` text for the nineteen
  pre-existing studies was **not** re-derived against their abstracts in this
  pass. Their `reviewedAt` advances because the source chain each one rests on
  was confirmed intact on 2 October, not because each summary was re-read.
- No full-text audit, no exhaustive literature search and no experimental
  reproduction is claimed. SWI executes no agents and imports no lab results;
  ANT and BEE own the measurement layer.
- Publication and revision chronology within each record was not re-audited.

## Date handling

All 11 source `accessedAt` values and all study, entity, claim and relationship
`reviewedAt` values now read 2026-10-02. Entity `createdAt` and `updatedAt`
stay at their original values: this pass changed review state, not content, so
rewriting a modification date would misreport the edit history.
