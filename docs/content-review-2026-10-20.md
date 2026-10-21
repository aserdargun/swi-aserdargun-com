# SWI content review — 20 October 2026

## Scope

A third full availability and identity pass over all 11 catalog sources, with
no claim, study, entity or relationship text changed. The 19 October review
repeated the identity work against the same authoritative registries; this pass
repeats it once more, because publisher pages answer a plain request with
bot-protection status codes that say nothing about whether the source is still
real.

## What was actually verified

| Record | Resolved via | Result |
| --- | --- | --- |
| Goss et al. 1989 | Crossref `10.1007/BF00462870`, and the Springer article page | "Self-organized shortcuts in the Argentine ant", Naturwissenschaften 76, 579-581, 1989 |
| Théraulaz & Bonabeau 1999 | Crossref `10.1162/106454699568700` | "A Brief History of Stigmergy", Artificial Life 5, 97-116, 1999 |
| Dorigo, Maniezzo & Colorni 1996 | Crossref `10.1109/3477.484436` | "Ant system: optimization by a colony of cooperating agents", IEEE TSMC-B 26, 29-41, 1996 |
| Di Caro & Dorigo 1998 | jair.org article page | "AntNet" and its asynchronous indirect-communication description |
| Seeley et al. 2012 | NCBI E-utilities, PMID 22157081 | "Stop signals provide cross inhibition in collective decision-making by honeybee swarms", Science 335, 108-111, 2012-01-06 |
| Bassler et al. 2003 | PMC145445 | quorum sensing record |
| Sarfati et al. 2021 | PMC8262802 | Schlegel stop-signal record |
| Reynolds 1987 | red3d.com boids page | "Flocks, Herds, and Schools", Computer Graphics 21(4), 25-34 |
| Tero et al. 2010 | NCBI E-utilities, PMID 20093467 | "Rules for biologically inspired adaptive network design", Science 327, 439-442, 2010-01-22 |
| Werfel et al. 2014 | Crossref `10.1126/science.1245842` | "Designing Collective Behavior in a Termite-Inspired Robot Construction Team", Science 343(6172), 754-758, 2014-02-14 |
| Couzin et al. 2005 | nature.com article page | "Effective leadership and decision-making in animal groups on the move", Nature 433, 513-516 |

Five of these could not be read through the listed page today and were resolved
through a registry instead. The Princeton SSR publication page for the TERMES
paper answered with the Cloudflare security-verification interstitial, and the
MIT Press and IEEE Xplore pages for the Théraulaz and Dorigo records answered
with the same interstitial and with `Error 418 — Unusual Traffic Detected`;
their bibliographic identity was therefore confirmed through the Crossref
records for the same titles, author lists, volumes and pages. The two PubMed
pages for the Seeley and Tero records answered HTTP 403 to every fetch path
today, so their records were confirmed through the NCBI E-utilities summaries
for the same PMIDs, which carry the title, the author list, the journal, the
volume, the pages and the publication date. The Goss record was confirmed
twice over: the Springer article page rendered in a browser and the Crossref
record agrees with it. The Couzin paper is behind a subscription wall, so only
its abstract and article metadata were readable, which is the depth this record
already carries.

## What was not done

- The stored `finding`, `takeaway` and `limitation` text for the twenty-three
  studies was **not** re-derived against their abstracts in this pass. Their
  `reviewedAt` advances because the source chain each one rests on was
  confirmed intact on 20 October, not because each summary was re-read.
- No literature search was run, so this pass cannot report that no new
  collective-behaviour work exists; it only reports that the twenty-three
  records already held still resolve to the sources they claim.
- No full-text audit and no experimental reproduction is claimed. SWI executes
  no agents and imports no lab results; ANT and BEE own the measurement layer.
- Publication and revision chronology within each record was not re-audited.

## Date handling

All 11 source `accessedAt` values and all study, entity, claim and relationship
`reviewedAt` values now read 2026-10-20. Entity `createdAt` and `updatedAt`
stay at their original values: this pass changed review state, not content, so
rewriting a modification date would misreport the edit history.
