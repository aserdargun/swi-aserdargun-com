# SWI content review — 28 October 2026

## Scope

A seventh full pass over all 11 catalog sources. Every one of the 13 catalog
claims was checked against the text its cited source actually carries, and the
version pin behind every arXiv study record was checked as well.

No claim binding changed, no source was added, removed or re-pointed, and no
claim statement text was rewritten.

## What was actually verified

| Record | Resolved via | Result |
| --- | --- | --- |
| Goss et al. 1989 | Crossref for the same DOI | "Self-organized shortcuts in the Argentine ant", Naturwissenschaften 76(12), 579-581, 1989 |
| Théraulaz & Bonabeau 1999 | Crossref for the same DOI | "A Brief History of Stigmergy", Artificial Life 5(2), 97-116 |
| Dorigo, Maniezzo & Colorni 1996 | NCBI E-utilities, PMID 18263004 | "Ant system: optimization by a colony of cooperating agents", IEEE TSMC-B 26(1), 29-41 |
| Di Caro & Dorigo 1998 | jair.org article page | "AntNet" abstract read in full |
| Seeley et al. 2012 | NCBI E-utilities, PMID 22157081 | "Stop signals provide cross inhibition in collective decision-making by honeybee swarms", Science 335, 108-111, 2012-01-06 |
| Bassler et al. 2003 | PubMed Central full text, PMC145445 | "Vibrio harveyi quorum sensing: a coincidence detector for two autoinducers controls gene expression", EMBO J 22(4), 870-881 |
| Sarfati et al. 2021 | PubMed Central full text, PMC8262802 | "Self-organization in natural swarms of Photinus carolinus synchronous fireflies", Sci Adv 7(28), eabg9259 |
| Reynolds 1987 | red3d.com boids page and the full HTML of the SIGGRAPH '87 paper | "Flocks, Herds, and Schools: A Distributed Behavioral Model", Computer Graphics 21(4), 25-34 |
| Tero et al. 2010 | NCBI E-utilities, PMID 20093467 | "Rules for biologically inspired adaptive network design", Science 327, 439-442, 2010-01-22 |
| Werfel et al. 2014 | Princeton SSR publication page | "Designing Collective Behavior in a Termite-Inspired Robot Construction Team", Science 343(6172) |
| Couzin et al. 2005 | nature.com article page | "Effective leadership and decision-making in animal groups on the move", Nature 433, 513-516 |

Three of these needed a different route than they needed last time. The MIT
Press page for the Théraulaz record returned a client challenge to a plain
request, so the record was resolved through Crossref for the same DOI. The
Princeton SSR page for the Werfel record returned the same challenge and was
read in a browser instead. The ResearchGate locator on the Goss record also
returned a challenge, so that record was resolved through Crossref as well.

All nine tracked DOIs were confirmed through Crossref with no corrections or
retractions against them. The AntNet abstract still reads that the
"communication among the agents is indirect and asynchronous, mediated by the
network itself", and names that property stigmergy. The stored excerpt for
`evidence-boids-1987-interaction-radius` is still an exact match against the
live SIGGRAPH '87 full text. The Werfel record still states that "a user
specifies a desired structure" and that the robots "use only local sensing and
coordinate their activity via the shared environment".

All twelve arXiv-tracked studies still serve the version the catalog pins, with
no new version behind any of them. New candidate papers appeared in the domain
over the last week, but they are new submissions rather than new versions of
tracked sources, so none of them is a staleness signal for this catalog.

## What did not change

No source was added, removed or re-pointed, and no source URL, title, author
list, publication date or identifier changed. No claim statement text changed,
and no claim, entity or relationship was added or removed. The 13 claims still
bind to the 11 catalog sources through the evidence records, including
`claim-fish-interaction-range`, which still binds both the Couzin and the
Reynolds records after the correction the previous pass made. No study or
dossier was added or removed, and the stored summaries for the 23 studies were
not re-derived against their abstracts, so this is not a full literature
refresh.

The 11 source records advance their `accessedAt` to 28 October 2026, and the
13 claim records advance their `reviewedAt` to the same day. The entity,
relationship and study review dates stay at 24 October 2026, because this pass
covered the catalog sources and the catalog claims rather than the stored study
summaries.

## Boundary

This pass establishes identity, availability and whether each claim's wording
is still carried by the text its sources expose. It does not establish that any
published result replicates, that any figure transfers to another colony,
species or environment, or that the mechanisms described here are the only ones
that produce the same behaviour.
