# Evidence model

## Principle

AI may help organize or translate research, but it is not a silent source. Every
substantive public claim must show whether it is direct evidence, editorial
synthesis, a hypothesis, or an open question.

The evidence chain is:

```text
Source
  → Evidence record
  → Claim
  → Entity or relationship
  → Localized explanation in the interface
```

This separation allows one source to support multiple claims, one claim to use
multiple sources, and conflicting evidence to remain visible.

## Source classes

Preference order:

1. peer-reviewed papers and authoritative scholarly books;
2. original research-group or institutional publications;
3. conference proceedings and standards;
4. official project repositories and technical documentation;
5. reputable technical reporting used as context, not as a substitute for
   primary evidence.

Source type and reliability are separate. A peer-reviewed paper can be narrow
or disputed; an official repository can be authoritative for implementation
behavior but not for biological claims.

## Claim classes

- `evidence`: a bounded statement directly supported by cited material.
- `synthesis`: an editorial connection or explanation derived from explicit
  sources; it identifies itself as interpretation.
- `hypothesis`: a testable proposition that has not been established.
- `open-question`: an unresolved research question without an implied answer.

Confidence is an editorial assessment of support, not a mathematical
probability. `contested` is used when credible sources disagree. `not-assessed`
is preferred to invented certainty.

## Evidence records

An evidence record identifies its claim, source, evidential relation, stable
locator when available, a copyright-safe excerpt when useful, and a bilingual
editorial note explaining relevance.

The evidential relation can support, challenge, or contextualize a claim.
Contradictory evidence remains attached rather than being overwritten by the
latest editorial conclusion.

## Freshness

SWI stores distinct dates:

- `publicationDate`: when the source was published;
- `accessedAt`: when the source was retrieved;
- `reviewedAt`: when a contributor checked the claim against its evidence;
- `updatedAt`: when the SWI record changed.

Freshness is derived by policy and topic volatility:

- `current`: within its review interval and sources remain available;
- `review-due`: review interval expired or a watched dependency changed;
- `historical`: intentionally retained historical material;
- `superseded`: a newer record or source replaces it while provenance remains.

Biological foundations and fast-moving AI-agent projects should not share the
same review interval. The exact interval belongs to a reviewed policy table,
not a hard-coded universal number.

## Interface contract

- A claim displays its class, review date, and source count.
- Evidence expansion shows title, authors or organization, publication date,
  source type, direct link, and relevance note.
- Hypotheses and open questions use distinct language and color-independent
  labels.
- A relationship visualization communicates evidence state in its accessible
  name and text alternative, not only line style or color.
- Missing evidence is visible as `Not established` rather than omitted.
- Corrections preserve the earlier public state through a correction note or
  version history; published research is not silently rewritten.
