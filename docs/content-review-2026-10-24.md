# SWI content review — 24 October 2026

## Scope

A fifth full availability and identity pass over all 11 catalog sources, and
the first pass that also checks the version pin behind every arXiv study
record. No claim, entity or relationship text changed. One study record moved:
the Meta-Team preprint was re-posted as v2 on 13 October 2026, with an
abstract identical to v1.

## What was actually verified

| Record | Resolved via | Result |
| --- | --- | --- |
| Goss et al. 1989 | Springer article page, and Crossref `10.1007/BF00462870` | "Self-organized shortcuts in the Argentine ant", Naturwissenschaften 76, 579-581, 1989 |
| Théraulaz & Bonabeau 1999 | Crossref `10.1162/106454699568700` | "A Brief History of Stigmergy", Artificial Life 5, 97-116, 1999 |
| Dorigo, Maniezzo & Colorni 1996 | Crossref `10.1109/3477.484436` | "Ant system: optimization by a colony of cooperating agents", IEEE TSMC-B 26, 29-41, 1996 |
| Di Caro & Dorigo 1998 | jair.org article page | "AntNet" and its asynchronous indirect-communication description |
| Seeley et al. 2012 | NCBI E-utilities, PMID 22157081 | "Stop signals provide cross inhibition in collective decision-making by honeybee swarms", Science 335, 108-111, 2012-01-06 |
| Bassler et al. 2003 | NCBI E-utilities, PMC145445 | "Vibrio harveyi quorum sensing: a coincidence detector for two autoinducers controls gene expression", EMBO Journal 22(4), 870-881, 2003-02-17 |
| Sarfati et al. 2021 | NCBI E-utilities, PMC8262802 | "Self-organization in natural swarms of Photinus carolinus synchronous fireflies", Science Advances 7(28), eabg9259, 2021 |
| Reynolds 1987 | red3d.com boids page | "Flocks, Herds, and Schools", Computer Graphics 21(4), 25-34 |
| Tero et al. 2010 | NCBI E-utilities, PMID 20093467 | "Rules for biologically inspired adaptive network design", Science 327, 439-442, 2010-01-22 |
| Werfel et al. 2014 | Crossref `10.1126/science.1245842` | "Designing Collective Behavior in a Termite-Inspired Robot Construction Team", Science 343(6172), 754-758, 2014-02-14 |
| Couzin et al. 2005 | nature.com article page | "Effective leadership and decision-making in animal groups on the move", Nature 433, 513-516 |

Seven of these could not be read through the listed page today and were
resolved through a registry instead. The Princeton SSR publication page for the
TERMES paper and the MIT Press page for the Théraulaz record answered with the
Cloudflare security-verification interstitial (HTTP 403), and the IEEE Xplore
page for the Dorigo record answered with an empty body (HTTP 202); their
bibliographic identity was therefore confirmed through the Crossref records for
the same titles, author lists, volumes and pages. Both PubMed pages for the
Seeley and Tero records and both PubMed Central pages for the Bassler and
Sarfati records answered with a proof-of-work challenge rather than the record
itself (PubMed HTTP 203, PubMed Central HTTP 200), so their records were
confirmed through the NCBI E-utilities summaries for the same PMIDs and PMC
identifiers, which carry the title, the author list, the journal, the volume,
the pages and the publication date.

The remaining four answered directly. The Springer article page for the Goss
record, the JAIR page for the AntNet record, the red3d.com page for the Boids
record and the nature.com page for the Couzin record all rendered, and each
returned the title the catalog already holds. The Couzin paper is behind a
subscription wall, so only the publisher's own article metadata was readable.

## Version pins behind the study records

All 12 arXiv study records were resolved through the arXiv API today, and the
seven that pin a version were compared against the version arXiv currently
serves. Six of those seven pins are still current: MetaGPT v7 (2024-11-01),
MAST v3 (2025-10-26), SwarmSys v1 (2025-10-11), Scaling agent systems v3
(2026-04-08), SyncSBC v1 (2026-08-06) and Agent Response Map v1 (2026-07-14).
The five records that carry an un-versioned arXiv URL — Topological neighbours
0709.1916, Multiagent debate 2305.14325, AutoGen 2308.08155,
Mixture-of-Agents 2406.04692 and Agentless 2407.01489 — follow the latest
version automatically and needed no change.

One pin had moved. The Meta-Team preprint at `https://arxiv.org/abs/2605.29790`
was re-posted as **v2 on 13 October 2026**
(`https://arxiv.org/abs/2605.29790v2`). The title and abstract of v2 are
identical to v1, so the stored finding, takeaway and limitation still describe
the abstract that was read. The record therefore now pins v2, carries the
revision date 13 October 2026 and keeps its 28 May 2026 publication date,
exactly as the MAST, Scaling agent systems and MetaGPT records already do. No
finding, takeaway or limitation text changed, and the Turkish and English
fields remain equivalent.

## What did not change

No source was added, removed or re-pointed. No claim, entity or relationship
text was rewritten. No study or dossier was added or removed. The 13 claims all
bind to the 11 catalog sources through the evidence records, and none of those
sources moved: every title, author list, journal, volume, page range and
publication date matched the record already held.

The remaining edits are the access and review dates: the 11 source records
advance their `accessedAt` to 24 October 2026, and the 13 claim records, 4
entity records, 3 relationship records and 23 study records advance their
`reviewedAt` to the same day. The publication dates held in the source records
were not touched, and `README.md` records this pass in the same place as the
19, 20 and 21 October passes.

## Boundary

Identity, availability and version currency are what this pass establishes. It
does not establish that any published result replicates, that any figure
transfers to another colony, species or environment, or that the mechanisms
described here are the only ones that produce the same behaviour.
