# SWI content review — 19 October 2026

## Scope

A second full availability and identity pass over all 11 catalog sources, with
no claim, study, entity or relationship text changed. The 2 October review
resolved every source identifier against an authoritative registry and added
two 2026 studies; this pass repeats the identity work against the same
registries, because publisher pages answer a plain request with bot-protection
status codes that say nothing about whether the source is still real.

## What was actually verified

| Record | Resolved via | Result |
| --- | --- | --- |
| Goss et al. 1989 | Crossref `10.1007/BF00462870` | "Self-organized shortcuts in the Argentine ant", Naturwissenschaften, 1989-12 |
| Théraulaz & Bonabeau 1999 | Crossref `10.1162/106454699568700` | "A Brief History of Stigmergy", Artificial Life, 1999-04 |
| Dorigo, Maniezzo & Colorni 1996 | Crossref `10.1109/3477.484436` | "Ant system: optimization by a colony of cooperating agents", IEEE TSMC-B, 1996-02 |
| Di Caro & Dorigo 1998 | jair.org article page | "AntNet" and its asynchronous indirect-communication description |
| Seeley et al. 2012 | PubMed PMID 22157081 | honeybee stop-signal record |
| Bassler et al. 2003 | PMC145445 | quorum sensing record |
| Sarfati et al. 2021 | PMC8262802 | Schlegel stop-signal record |
| Reynolds 1987 | red3d.com boids page | "Flocks, Herds, and Schools", Computer Graphics 21(4), 25-34 |
| Tero et al. 2010 | PubMed PMID 20093467 | "Rules for biologically inspired adaptive network design", Science 2010 |
| Werfel et al. 2014 | Crossref `10.1126/science.1245842` | "Designing Collective Behavior in a Termite-Inspired Robot Construction Team", Science 343(6172), 754-758, 2014-02-14 |
| Couzin et al. 2005 | nature.com article page | "Effective leadership and decision-making in animal groups on the move", Nature 433, 513-516 |

Two of these could not be read through the publisher page and were resolved
through a registry instead: the Werfel paper is listed in the catalog against
the Princeton SSR publication page, which answered HTTP 403 to every fetch
path, so its bibliographic identity was confirmed through Crossref against the
Science record of the same title, authors, volume and pages; and the Couzin
paper is behind a subscription wall, so only its abstract and article metadata
were readable, which is the depth this record already carries.

## What was not done

- The stored `finding`, `takeaway` and `limitation` text for the twenty-three
  studies was **not** re-derived against their abstracts in this pass. Their
  `reviewedAt` advances because the source chain each one rests on was
  confirmed intact on 19 October, not because each summary was re-read.
- No literature search was run, so this pass cannot report that no new
  collective-behaviour work exists; it only reports that the twenty-three
  records already held still resolve to the sources they claim.
- No full-text audit and no experimental reproduction is claimed. SWI executes
  no agents and imports no lab results; ANT and BEE own the measurement layer.
- Publication and revision chronology within each record was not re-audited.

## Date handling

All 11 source `accessedAt` values and all study, entity, claim and relationship
`reviewedAt` values now read 2026-10-19. Entity `createdAt` and `updatedAt`
stay at their original values: this pass changed review state, not content, so
rewriting a modification date would misreport the edit history.
