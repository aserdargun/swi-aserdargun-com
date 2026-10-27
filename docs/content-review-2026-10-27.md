# SWI content review — 27 October 2026

## Scope

A sixth full pass over all 11 catalog sources, and the first one that reads
each source's own text rather than only confirming its identity and
availability. Every one of the 13 catalog claims was checked against the text
its cited source actually carries.

One claim binding changed. No source was added, removed or re-pointed, and no
claim statement text was rewritten.

## What was actually verified

| Record | Resolved via | Result |
| --- | --- | --- |
| Goss et al. 1989 | Springer article page (rendered in a browser), and Crossref / Semantic Scholar / CoLab for the same DOI | "Self-organized shortcuts in the Argentine ant", Naturwissenschaften 76(12), 579-581, 1989 |
| Théraulaz & Bonabeau 1999 | NCBI E-utilities, PMID 10633572 | "A Brief History of Stigmergy", Artificial Life 5(2), 97-116 |
| Dorigo, Maniezzo & Colorni 1996 | NCBI E-utilities, PMID 18263004 | "Ant system: optimization by a colony of cooperating agents", IEEE TSMC-B 26(1), 29-41 |
| Di Caro & Dorigo 1998 | jair.org article page | "AntNet" abstract read in full |
| Seeley et al. 2012 | NCBI E-utilities, PMID 22157081 | "Stop signals provide cross inhibition in collective decision-making by honeybee swarms", Science 335, 108-111, 2012-01-06 |
| Bassler et al. 2003 | PubMed Central full text, PMC145445 | "Vibrio harveyi quorum sensing: a coincidence detector for two autoinducers controls gene expression", EMBO J 22(4), 870-881 |
| Sarfati et al. 2021 | PubMed Central full text, PMC8262802 | "Self-organization in natural swarms of Photinus carolinus synchronous fireflies", Sci Adv 7(28), eabg9259 |
| Reynolds 1987 | red3d.com boids page and the full HTML of the SIGGRAPH '87 paper | "Flocks, Herds, and Schools: A Distributed Behavioral Model", Computer Graphics 21(4), 25-34 |
| Tero et al. 2010 | NCBI E-utilities, PMID 20093467 | "Rules for biologically inspired adaptive network design", Science 327, 439-442, 2010-01-22 |
| Werfel et al. 2014 | Princeton SSR publication page | "Designing Collective Behavior in a Termite-Inspired Robot Construction Team", Science 343(6172) |
| Couzin et al. 2005 | nature.com article page | "Effective leadership and decision-making in animal groups on the move", Nature 433, 513-516 |

Four of these answered directly. The JAIR page for the AntNet record, the
red3d.com page and the full HTML of the Reynolds paper, the nature.com page for
the Couzin record and the PubMed Central pages for the Bassler and Sarfati
records all rendered, and each returned the text the catalog already holds.
The AntNet abstract still reads "The communication among the agents is indirect
and asynchronous, mediated by the network itself." The Reynolds paper still
defines its neighbourhood by "a radius and exponent". The Couzin abstract still
reads "We reveal that the larger the group the smaller the proportion of
informed individuals needed to guide the group". The Bassler record is still
titled "Vibrio harveyi quorum sensing: a coincidence detector for two
autoinducers controls gene expression", and the Sarfati record still reports
that "Flash bursts relay around vegetation across the swarm".

The remaining seven answered through a registry rather than the publisher
page. The MIT Press page for the Théraulaz record returned the Cloudflare
interstitial (HTTP 403) and the IEEE Xplore page for the Dorigo record
returned an empty body (HTTP 202), so both were resolved through NCBI
E-utilities, whose abstracts carry the titles, author lists, journals,
volumes, pages and dates. Both PubMed pages for the Seeley and Tero records
answered with a proof-of-work challenge (HTTP 203), so those two were
resolved the same way, with the abstracts read in full. The Princeton SSR page
for the TERMES paper returned the same interstitial to a plain request and was
read in a browser instead. The Springer article page for the Goss record
answers a plain request with a client-challenge interstitial and was likewise
read in a browser.

## The one change

`claim-fish-interaction-range` reads "Individuals interacting only with
neighbours can form large schools at a fixed interaction radius." It was bound
to exactly one evidence record, `evidence-couzin-2005`, whose locator was the
publisher abstract of the 2005 Nature paper. That abstract was read again
today and it states a different result — that a small informed minority can
guide a group without members recognising who is informed — and it contains no
statement about an interaction radius at all. The Couzin study record in
`content/studies.json` is marked `depth: "abstract"`, so the radius wording was
never carried by the text that was read.

The wording is carried by a source the catalog already holds. The Reynolds 1987
paper defines the neighbourhood of each boid as "a spherical zone of
sensitivity" whose "magnitude is defined as an inverse exponential of
distance", so that "the neighborhood is defined by two parameters: a radius and
exponent", and it states that "birds can flock with any number of flockmates".
A new evidence record, `evidence-boids-1987-interaction-radius`, now binds
that source to the claim with a stable locator and a copyright-safe excerpt.
Its bilingual note records the caveat that the radius is a model parameter
rather than a measured real-world interaction threshold.

The Couzin record stays attached and unchanged. `docs/evidence-model.md` allows
one claim to use multiple sources and requires that corrections preserve the
earlier public state rather than silently rewriting published research, so the
binding that was already public remains public alongside the new one.

## What did not change

No source was added, removed or re-pointed, and no source URL, title, author
list, publication date or identifier changed. No claim statement text changed,
and no claim, entity or relationship was added or removed. The 13 claims still
bind to the 11 catalog sources through the evidence records. No study or
dossier was added or removed, and the stored summaries for the 23 studies were
not re-derived against their abstracts, so this is not a full literature
refresh.

The 11 source records advance their `accessedAt` to 27 October 2026, and the
13 claim records advance their `reviewedAt` to the same day. The entity,
relationship and study review dates stay at 24 October 2026, because this pass
covered the catalog sources and the catalog claims rather than the stored study
summaries.

## Boundary

This pass establishes identity, availability and whether each claim's wording
is still carried by the text its sources expose. It does not establish that any
published result replicates, that any figure transfers to another colony,
species or environment, or that the mechanisms described here are the only ones
that produce the same behaviour. The Couzin article sits behind a subscription
wall, so only its publisher metadata and abstract were readable; the radius
result is therefore recorded against the source that states it in full.
