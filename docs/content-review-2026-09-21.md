# SWI content and portfolio review — 21 September 2026

## Scope

Reviewed the repository's public content surfaces: workspace, eight dossiers,
eight recipes, 21 study summaries, original claim/evidence chain, map, agenda,
methodology and product documentation. Compared SWI's role with the current
local `aserdargun-com/data/living-system.json` and its generated portfolio.
Historical design specifications remain historical artifacts.

## Changes

- Added bilingual learning-system context and a root-site return link. LCL/CLD
  provide compute context; SWI and WFM are parallel research paths toward ITL.
- Clarified that recipes are static Markdown/JSON plans; SWI executes no agents,
  imports no lab results automatically and uses no agenda entries as inputs.
- Aligned the root site's SWI summary and ANT/BEE explanatory copy with those
  boundaries through source data and generation, preserving unrelated edits.
- Replaced outdated architecture, experiment and roadmap descriptions with the
  current observer contract. Simulation engines and measurements belong to ANT
  and BEE; old plans for a simulation engine inside SWI are not current scope.
- Localized the shared page description and SWI identity metadata.
- Kept the initial collection date separate from partial source review dates.

## Source review actually performed

Read the version-specific primary-source abstracts and publication metadata:

| Record | Primary source | Review depth |
| --- | --- | --- |
| MAST | https://arxiv.org/abs/2503.13657v3 | Abstract and publication metadata |
| SwarmSys | https://arxiv.org/abs/2510.10047v1 | Abstract and publication metadata |
| Scaling Agent Systems | https://arxiv.org/abs/2512.08296v3 | Abstract and publication metadata |
| Meta-Team | https://arxiv.org/abs/2605.29790v1 | Abstract and publication metadata |

The stored summaries match these source versions; only these four `reviewedAt`
values advance to 2026-09-21. The other 17 studies and original claim-chain
reviews retain their earlier dates. No full-text audit, exhaustive literature
search or experimental reproduction is claimed. A copy edit does not renew
scientific evidence or establish current source availability.

The root portfolio's SWI `updatedAt` records the local content edit. Its
`researchCutoff`, `lastVerified`, `lastReleased` and `releaseSha` are preserved:
a partial abstract recheck and local validation do not establish a new release.

## Verification

Root verification passed: `npm test` (including generated-content and site
validation) and `npm run test:server`, totaling 421 tests. Additional Chromium
checks passed for EN/TR home and application pages at 390 and 1440 px, with
no page errors or horizontal overflow. All nine linked ecosystem destinations
returned HTTP 200; both root learning anchors exist.

SWI verification passed with `SWI_PREVIEW_PORT=54371 npm run validate:codex`:
162 unit/component tests, 28 browser acceptance tests, lint, types, production
build and static artifact verification (64 required artifacts, 408 scanned
files, 2,415 local link/asset references). `git diff --check` passed in both
repositories. Port 4173 belonged to another listener; it was left untouched.

An additional Chromium traversal checked all 58 localized desktop routes.
The new ecosystem section passed EN/TR checks at 320, 768 and 1440 px without
page errors or horizontal overflow; desktop and narrow-screen screenshots
were visually reviewed. The acceptance suite also traversed all mobile routes.

The static recovery suite builds the entire site in setup; its original
30-second deadline was exceeded on this shared host. The setup allowance is
now 120 seconds, and all recovery assertions pass unchanged.

All work in this review is local; no external publication is authorized by
this document.
