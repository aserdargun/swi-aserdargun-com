# Research methodology

## Current reading collection

The 6 September 2026 snapshot contains 21 studies (1987–2026), eight biological
dossiers and eight original engineering recipes. `content/studies.json` records
source titles, authors, venue, publication/revision dates, reviewed date,
reading depth and separate bilingual finding / takeaway / limitation fields.
`content/dossiers.json` links each biological observation to these studies and
to a proposed agent protocol. See [revision 02](revision-02.md).

Publication-record and abstract reviews are explicitly labeled; neither claims
a full-text audit. Null exact dates mean the day was not verified. arXiv records
remain version-labeled without an inferred peer-review status. The Scaling
Agent Systems record uses v3 (2026-04-08; 260 configurations / 6 benchmarks),
not an older abstract's 180 / 4 figures. MAST uses v3 (2025-10-26).

The original ant chain uses granular claim/evidence records. The expanded
reading library uses source-level summaries and marked engineering synthesis;
it does not pretend every recipe has been experimentally validated. Original
proposed experiments are linked to evidence but are not source-reported results.

## Research loop

```text
Discover → Collect → Verify → Structure → Connect
  → Explain → Experiment → Measure → Publish → Revisit
```

The first six steps govern knowledge records. Experiments and measurements are
only added when the product has a defined, reproducible setup.

## Intake

1. Define a bounded research question or missing relationship.
2. Search scholarly indexes, publisher records, original research groups, and
   official project repositories.
3. Prefer primary evidence; use review papers to discover terminology and
   contested areas.
4. Record candidate sources before drafting explanatory copy.
5. Exclude sources that cannot be identified, accessed, or attributed reliably.

## Verification

For every source, verify title, authors, publisher or venue, publication date,
URL, DOI or identifier when applicable, and access date. Determine what the
source actually establishes and where its limits lie.

Claims remain narrow enough that a reviewer can decide whether the cited
evidence supports them. A source about biological stigmergy does not by itself
prove that an analogous AI architecture improves performance.

## Structuring and synthesis

Sources are entered first, then evidence, then claims, and finally entity or
relationship references. Editorial synthesis may connect multiple established
claims but carries a synthesis label and cites its inputs.

Biological inspiration is described as a relationship, not identity. A
computational algorithm inspired by an organism is not assumed to reproduce the
organism faithfully.

Turkish and English explanations must preserve the same claim scope. Translation
may improve fluency but may not strengthen certainty, erase limitations, or
replace technical terms without recording the accepted equivalent.

## Publication gate

A research change is publishable when:

- all references resolve and schemas pass;
- substantive claims have evidence records;
- source metadata and links were checked;
- both language versions communicate the same scope;
- synthesis and hypotheses are labeled;
- relationship directions and predicates are correct;
- review dates and freshness state agree;
- timeline dates are source-backed;
- rendered evidence disclosures are usable on desktop and mobile;
- corrections or supersession notes are included where relevant.

## Use of AI

AI tools may assist discovery queries, deduplication, classification,
translation, and draft synthesis. A human-reviewable source record remains the
authority. AI output cannot serve as an evidence excerpt or bibliographic fact
unless independently verified against the source.

Unsupported statements are removed or explicitly represented as hypotheses or
open questions. Citation-looking text generated without a verified source is
treated as invalid data.

## Maintenance and corrections

Research updates are append-oriented. When a source disappears, the access
state changes and an alternative authoritative location may be added without
erasing provenance. When evidence changes a conclusion, the affected claim and
relationships are reviewed together.

High-volatility AI and project records are revisited more frequently than
foundational biological material. Automated jobs may later identify review
candidates, but they may not publish unreviewed claims.
