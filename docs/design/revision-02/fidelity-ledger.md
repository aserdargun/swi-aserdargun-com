# Revision 02 — visual and interaction verification

Date: 6 September 2026. Scope: local SWI implementation on
`codex/swi-research-workspace`. The user rejected the preceding design and
requested the rebuild. These are the implementation references selected for
that request; they are not recorded as a new user design approval.

## Reference and render evidence

| Surface | Concept | Browser capture |
| --- | --- | --- |
| Workspace | [workspace-concept.png](workspace-concept.png) | [workspace-desktop.png](workspace-desktop.png), [workspace-mobile.png](workspace-mobile.png) |
| Configurable recipe | [recipe-concept.png](recipe-concept.png) | [recipe-desktop.png](recipe-desktop.png), [recipe-mobile.png](recipe-mobile.png) |
| Agenda | [agenda-mobile-concept.png](agenda-mobile-concept.png) | [agenda-mobile.png](agenda-mobile.png), [agenda-mobile-editor.png](agenda-mobile-editor.png) |
| Connected knowledge | Workspace/recipe visual system | [map-desktop.png](map-desktop.png) |

Captures use the Codex in-app browser against the real production export at
`http://127.0.0.1:4196/tr/`, with native controls and real local navigation.
The Browser/IAB CUA API supplies DOM snapshots, computed layout measurements,
interactions and viewport screenshots (`fullPage: false`). Screenshots were
taken after the viewport and images settled. IAB raster captures exclude the
scrollbar gutter; measured CSS viewports are 1440 × 1100 and 390 × 1000.
Playwright additionally exercises 390 × 844 and 320 × 900. There is no Browser
fallback or browser-verification blocker.

`view_image` was used at original detail on the paired workspace and recipe
concept/render files, then on the agenda concept and its actual mobile states,
plus the mobile workspace and recipe captures. This is a direct visual review,
in addition to the functional tests.

## Comparison and repair ledger

| Point | Concept evidence | Render evidence and outcome |
| --- | --- | --- |
| Page hierarchy | Forest navigation, editorial title, image or mechanism, open rows and one reading/configuration rail | Preserved across workspace, recipe, atlas, research and map. The desktop rail measures 216 CSS px and hero columns measure about 527/618 px (46:54). |
| Headline and reading type | Large serif titles with sans-serif controls | Source Serif 4 and Inter are loaded locally, including Turkish glyphs. Recipe H1 is 48/55.68 px; home H1 is about 56 px. Body 16 px; metadata and controls 14 px. A restrictive headline width was removed so the desktop recipe title fits naturally. |
| Palette and surfaces | Forest, teal, near-white canvas, muted sage diagrams and terracotta emphasis | Computed canvas is `rgb(246,247,244)` (#F6F7F4); forest #152E29, teal #176D5B and terracotta #A54E32 follow the written contract. Flat colors deliberately replace incidental generated-image shading. No gradient overlays or card shadows were added. |
| Illustration | Large honeybee over a forest field, right of the headline | A separate generated illustration is a real 1672px-wide WebP asset, loaded at about 296 KB. It is cropped with `object-fit: cover`, retains the bee and forest, and has an explicit illustrative caption. It is not a screenshot used as UI. |
| Mechanism graphics | Discovery, proposals, dissent and verification connected by arrows | Native SVGs describe eight different protocols. Numbered nodes replace decorative insect icons. Oversized recipe diagrams were capped at 250px so the protocol steps regain prominence. The diagrams are conceptual, not measured biological networks. |
| Icons and actions | Thin outline navigation, flask, source and download symbols | Native 20px, 1.5px-stroke icons retain their action meanings. Controls remain native and keyboard operable. Numbers use validated native inputs; the illustrative custom minus/plus controls were not copied. |
| Reading density | Open dossier rows and a research side column; numbered protocol rows | No generic card grid was introduced. Longer sourced instructions continue below the initial viewport. Roles, memory fields, metrics and limits remain readable instead of being compressed into the overview. |
| Mobile structure | One dark toolbar, stacked reading content, visible agenda actions | At 390/320px the rail becomes a menu. Small expanded SVGs become equivalent 15px text flows. Recipe downloads now share a row below a single breadcrumb. Empty status regions consume no extra space. |
| Agenda state | Illustrative populated list and a note form | Actual screenshots show the honest empty state and an opened form; example research is not fabricated as the user's personal entries. Adding opens and focuses the title field. Populated, edited, archived and restored states are covered by real browser tests. |
| Overflow and focus | Touch-friendly actions and simple single-column forms | A file-input rule that overrode visually-hidden dimensions caused 19px/15px overflow and was corrected. All 58 localized routes fit at 390px; core routes also fit at 320px. Navigation links have at least 44px height; menu Escape restores focus. |

## Initial-viewport copy comparison

The workspace title, two primary actions, three-stage journey and main section
names retain the selected direction. Recipe title, subtitle, downloads, tabs,
four step names and preparation action retain their intended roles. Agenda
title, subtitle, add/import/export actions and storage message retain the
concept wording. Source titles retain their original publication language;
explanations and UI are bilingual.

Intentional copy and information changes are recorded here:

- The generated honeybee slogan about trusting the majority is replaced by
  “Kanıtı karşılaştır, itirazı kaybetme.” Biological recruitment is not a proof
  of truth for language-model votes.
- “Araştırma kesiti · 06.09.2026” identifies a dated editorial snapshot. Radar
  format labels use “arXiv sürümü”; Scaling Agent Systems v3 takes the middle
  radar position because the revised study directly informs swarm design.
  MAST remains in the library and linked dossiers.
- Counts link to the actual eight dossiers and 21 studies. Repeated miniature
  “Nature → Mechanism → Agent” labels are consolidated into the journey and
  knowledge map. The callout describes the actual role/budget/export workflow.
- The recipe begins with an editable concrete task instead of an extra
  hypothetical problem selector. “Toplam token bütçesi” explicitly applies to
  the entire swarm. The conceptual diagram is captioned and its visual node
  count is not represented as the configured runtime count.
- Full source records are in the recipe's Sources view, rather than squeezing
  two unqualified paper summaries into a bottom strip. The recipe includes
  suitability, failure and biological-transfer boundaries.
- Agenda adds archive, search, item kind and explicit status selection. Import
  is a global action that atomically validates selected files. Detailed storage
  explanations live beside the reading workflow; the mobile headline retains
  the short browser-storage statement.
- The map labels the biological lesson as a “design idea from nature” so an
  engineering slogan is not mistaken for a field observation.

No unexplained initial-viewport copy changes remain. The implementation was
visually verified as faithful to the selected revision-02 direction and its
written refinements. There are no remaining material visual mismatches within
that contract. This is an implementation assessment, not a claim of user or
independent agency approval.

## Functional and artifact evidence

- `SWI_PREVIEW_PORT=4196 npm run validate:codex`: 150 unit/component tests,
  21 browser tests, lint, strict types, content validation, production export,
  static artifact scan and whitespace check passed. Managed preview cleanup
  was verified by the command's final stop.
- After the final mobile spacing/copy refinements, production build and the
  six mobile/workbench browser tests passed again. Static verification checks
  64 required artifacts and scans 402 files.
- Biology → recipe → JSON download → agenda → reload passed with a custom
  task, seven agents, four rounds and 14,003 aggregate tokens. Roster caps sum
  exactly to the requested total; the exported experiment is marked unrun.
- Agenda create/edit, literal text, status, archive/undo, backup download,
  duplicate-preserving merge, Markdown import and atomic rejection of a mixed
  valid/broken import batch passed. Unit tests cover Unicode, malformed/unsafe
  input, size limits, quota failure, original-byte recovery and cross-tab state.
- Search by MAST's short name, source disclosure, add-to-agenda, preserved
  language/query context and map-to-recipe navigation passed.
- Axe found no serious/critical violations in the tested English/Turkish
  surfaces or the settled dark-theme recipe. Browser console inspection on the
  final IAB preview returned no entries. No benchmark run or agent execution is
  implied by any UI demonstration.

The final local preview is intentionally running for review. No commit, push,
deployment, DNS change or portfolio update was performed.
