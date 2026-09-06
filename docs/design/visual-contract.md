# SWI proposed visual contract

Date: 2026-09-06
Status: **Proposed — user visual approval pending.**
Scope: Task 1, design only. No application implementation or browser validation is claimed.

The six coordinated concepts express “scientific field station × living topology”.
They are review references, not accepted production UI. The exact values below
resolve raster ambiguity into a proposed implementation contract. User approval
of the six references and these recorded deviations is required before Tasks 7–11
consume this as an accepted contract.

## References and canvas

| Surface | Project reference | Requested CSS viewport | Generated raster |
| --- | --- | --- | --- |
| Home desktop | [swi-home-desktop.png](swi-home-desktop.png) | 1440 × 1100 | 1435 × 1096 |
| Home mobile | [swi-home-mobile.png](swi-home-mobile.png) | 390 × 844 | 853 × 1844 |
| Explore desktop | [swi-explore-desktop.png](swi-explore-desktop.png) | 1440 × 1000 | 1504 × 1046 |
| Entity desktop | [swi-entity-desktop.png](swi-entity-desktop.png) | 1440 × 1100 | 1435 × 1096 |
| Graph desktop | [swi-graph-desktop.png](swi-graph-desktop.png) | 1440 × 1000 | 1504 × 1046 |
| Graph mobile | [swi-graph-mobile.png](swi-graph-mobile.png) | 390 × 844 | 852 × 1846 |

Built-in Image Gen approximated the requested dimensions. Preserve native files;
do not stretch them or treat image pixels as measured CSS. Later browser checks
must use the requested CSS viewports and include a visual comparison at matching
aspect ratios. Every final image was opened with view_image at original detail.

## Palette and treatment

| Token | Exact value | Purpose |
| --- | --- | --- |
| canvas | #F7F8F3 | Mineral-white page background; flat, neither beige nor true white |
| ink | #111714 | Primary text, scientific names and body copy |
| evidence | #247153 | Evidence indicators, selected leading rule, semantic emphasis |
| watch | #C98222 | Watch/hypothesis marker, never small text on canvas |
| interaction | #3157D5 | Links, primary action, focus, selected navigation |
| rule | #DDE3DA | Dividers and passive borders |
| graph-field | #0E1A17 | Bounded dark graph only |
| muted-ink | #526058 | Secondary text, never low-opacity body copy |
| selected-surface | #EDF3ED | Selected semantic row |
| watch-ink | #805017 | Accessible watch/hypothesis text when a colored label is necessary |
| inverse-ink | #F7F8F3 | Graph labels and primary-button text |

The first seven values are the task brief's verbatim palette. The final four are
explicit proposed derived tokens, not colors asserted to be sampled exactly from
the raster. Approximate WCAG contrast calculations against canvas: ink 17.01:1,
evidence 5.52:1, interaction 5.70:1, muted-ink 6.20:1, watch-ink 6.39:1.
Watch itself is only 2.94:1: pair it with an ink label and a shape, or use watch-ink.
On graph-field, inverse-ink is 16.69:1; interaction alone is 2.93:1, so a focus
ring must include the contrasting mineral-white separator.

No gradients, shadows, glass, blur, glow, washed overlays, stock imagery, or
decorative AI brains. Generated raster contains small color/texture variation;
this is not authorization to implement a gradient. All fills are flat tokens.
No surrounding hero panel. Hero trails sit directly on canvas, without overlay.
Graph has a hard bounded frame. No background image is required for the app;
the concepts are design artifacts, not assets to be shipped as interface.

## Typography

Use locally served **Inter** for UI and **Source Serif 4** for editorial headings.
Required local WOFF2 coverage: Latin and Turkish characters
ç, Ç, ğ, Ğ, ı, İ, ö, Ö, ş, Ş, ü, Ü. Font binaries are not created in Task 1.
Implementation must obtain licensed font files, preserve their license notices,
and self-host without a runtime font CDN.

| Role | Family | Desktop size / line | Mobile size / line | Weight | Tracking |
| --- | --- | --- | --- | --- | --- |
| Hero | Source Serif 4 | 72 / 80 px | 40 / 44 px | 400 | -0.035em |
| Page title | Source Serif 4 | 56 / 64 px | 40 / 48 px | 400 | -0.025em |
| Entity title | Source Serif 4 | 88 / 96 px | 48 / 56 px | 400 | -0.035em |
| Section heading | Source Serif 4 | 32 / 40 px | 26 / 32 px | 400 | -0.015em |
| Article body | Inter | 18 / 28 px | 16 / 26 px | 400 | 0 |
| UI / control | Inter | 16 / 24 px | 16 / 24 px | 400 or 500 | 0 |
| Entity row title | Inter | 20 / 28 px | 16 / 24 px | 600 | -0.01em |
| Metadata / predicate | Inter | 14 / 20 px | 14 / 20 px | 400 | 0 |
| Brand SWI | Inter | 32 / 40 px | 20 / 28 px | 700 | -0.03em |
| Brand descriptor | Inter | 20 / 28 px | 16 / 24 px | 400 | -0.015em |

Fallbacks: Inter, Arial, sans-serif; Source Serif 4, Georgia, serif.
Use sentence case. Avoid all-caps pretitles. The concept's exact font shapes are
approximate; these declared families and metrics are the proposed source of truth.
No body or interface text below 14px. Controls must have deliberate typography.
Scientific prose stays within 68ch, with a 72ch hard maximum.

## Geometry, spacing and responsive container

Spacing scale: 4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96px.
Desktop content maximum: 1312px; desktop page gutter 64px at 1440px.
At 768–1199px use 32px gutters. Below 768px use 20px gutters.
Keep 16px gutters only for narrow widths below 360px. No minimum-width page shell.

Desktop header: 80px high, thin bottom rule. Header may use 32px gutters while
main content uses 64px. Mobile header: two rows, minimum 104px total:
brand row 48px, utility row 56px. The utility row holds locale choices and Menu.
At widths below 1200px primary navigation collapses into Menu; never shrink
labels or allow the six-link desktop header to overflow.

Home desktop: two-column hero with 56% text and 44% topology field, 48px gap,
64px top and bottom breathing room. Hero text maximum 720px. Follow with an
open five-stage band, 32px vertical padding, and the first-chain band.
At 390px: heading, full-width primary, full-width secondary, static 90px trail
field, five ordered rows, then first-chain continuation. Use natural page scroll;
never shrink typography or 44px targets merely to fit the 844px screenshot.

Explore desktop: semantic list approximately 2/3 and preview 1/3, separated by
32px gap and a single rule. Four seed rows; no filler records to increase density.
Entity desktop: article and first-chain rail in 8:3 proportions with 40px gap.
Graph desktop: graph and semantic rail in 7:3 proportions with 24px gap;
field target height 650px. Horizontal graph fits its bounded frame at first load.

Borders: 1px solid rule; selected leading edge 3px evidence.
Radius: 0px for lists, bands and article; 2px for inputs, buttons and graph frame;
4px maximum for graph nodes. No pill container or general card grid.
Focus: 2px solid interaction outline, 3px offset. Dark-field focus also uses a
2px inverse-ink separator. Focus must surround the actual focused control.
Interactive minimum hit area: 44 × 44px; primary buttons 48px high.
Mobile interaction spacing: at least 8px between distinct tap areas.

## Component families and variants

### Shell and navigation

Wordmark is plain code-native text: SWI / Swarm Intelligence. Desktop navigation:
Home, Explore, Research, Timeline, Experiments, Graph. Active item uses a 3px
interaction underline plus current-page semantics. Locale control exposes EN / TR
with selected state and two independent 44px hit areas. Mobile Menu is an outlined
button with menu icon and text; expansion must expose the same six destinations.

### Actions, inputs and filters

Primary action: interaction fill, inverse-ink text, 2px radius, 48px height,
20px horizontal padding, optional 20px arrow with 12px gap.
Secondary action: ink or interaction text on canvas, underline on hover;
mobile Home may use the outlined full-width variant shown in its reference.
Tertiary link: visibly underlined within narrative or relationship lists.
Hover adds underline or a stronger border without layout shift.
Disabled uses ink text plus explicit disabled state, not opacity alone.
Search: 56px high, 1px ink border, 20px search icon and 12px gap, clear label.
Filters: text tabs with 44px hit areas; active tab has 3px interaction underline.
Do not use multiple unrelated search fields.

### Semantic entity list and relationship rail

Entity row is an open horizontal band with top/bottom separators, title, type,
freshness and source count. Selected row uses selected-surface, evidence leading
edge and visible Selected label. No numeric source counts before researched data.
Desktop rows use 96–120px depending on content; text may wrap without clipping.
Relationship rail is an ordered list of complete subject–predicate–object links.
The four-node identity order is separate from the three relationship-row numbers.
Use actual type names: Nature, Principle, Algorithm, AI Swarms.

### Entity article and evidence disclosure

Article order: identity, Mechanism, Claims & sources, Freshness, Related research.
Desktop first-chain rail remains beside the article. A claim disclosure row has
a chevron, textual classification and full-width 44px minimum button; expanded
content is inset 24px and separated by rules. Evidence, Synthesis, Hypothesis and
Open question remain explicit text. Supporting sources, source publication,
access, claim review and record update dates must remain distinct data fields.
Omit unsupported sections or show an explicit pending state. No fabricated
bibliography or scientific statistics may be derived from concept imagery.

### Icons

Use a consistent 20px outline family, 1.5px stroke, round joins/caps, currentColor.
24px only for main navigation actions; tiny icons never replace a text label.
Inventory: search (search field), arrow-right (navigation), chevron-right/down
(disclosure), menu (collapsed navigation), plus/minus (zoom), crosshair (reset),
leaf (Nature), trail (Stigmergy), linked cells (algorithm), connected agents
(AI coordination), document (source), calendar (date), refresh (review).
Entity-specific icons are optional semantic aids, not mandatory decorative art.
Do not mix the concept's disparate metaphor drawings into a new icon system.
No gradient, fill/shadow treatment or extra icon-only control.

## Graph anatomy and equivalence

Canonical first chain, identically in graph and semantic list:

1. Ant → exhibits → Stigmergy
2. Stigmergy → inspires → Ant Colony Optimization
3. Ant Colony Optimization → informs → Artificial Agent Coordination

Exactly four nodes and three directed edges. Use full desktop node labels and
type subtitles; graph arrows point toward the target. Edge labels remain readable
above the line, never beneath a node. Primary labels use inverse-ink. Edge strokes
use rule at 1.5px and arrowheads at least 8px. A selected node adds evidence border
and Selected text; a focused node retains a separate focus outline.
No decorative particles inside the data graph. Topology decoration belongs only
on Home and must never masquerade as additional knowledge records.

Desktop graph controls: Zoom in, Zoom out, Reset view; 44px targets with names.
Keep semantic relationship rail visible regardless of rendering or graph focus.
Keyboard traversal must never trap focus; selection and focus are different states.

Mobile: semantic relationships appear first, each as a stacked subject,
predicate and target row with natural height. Every entity link retains a 44px
tap area; allow longer pages to preserve this minimum. Follow with a non-pan,
350px maximum-width × 205px graph using a two-row snake arrangement:
1 Ant → 2 Stigmergy → 3 ACO → 4 Agent coordination.
These shortened labels exist only in the secondary mobile graph. Full names
remain in the primary list. No mobile zoom/drag controls. The count footer is
4 entities · 3 relationships, followed by All relationships listed above.
Graph failure leaves the entire list usable. Color is never the sole identifier.

## Allowed first-viewport English copy

The following copy is the proposed allowlist; no extra hero eyebrow, badge,
statistic, marketing subtitle or research claim is allowed.

Shared desktop: SWI / Swarm Intelligence; Home; Explore; Research; Timeline;
Experiments; Graph; EN; TR. Shared mobile: SWI / Swarm Intelligence; EN; TR; Menu.

Home:
- Study how simple agents produce complex collective intelligence.
- Explore the map
- Read the method
- Nature → Collective behavior → Principles → Algorithms → Artificial agents
- Follow the first chain
- Ant; Stigmergy; Ant Colony Optimization; Artificial Agent Coordination
- exhibits; inspires; informs
- Research, with evidence
- Motion paused (mobile/static state only)

Explore:
- Explore
- Search entities, principles, algorithms…
- All; Nature; Principles; Algorithms; AI Swarms; Robotics
- Entity; Type; Freshness; Sources
- Ant; Stigmergy; Ant Colony Optimization; Artificial Agent Coordination
- Nature; Principle; Algorithm; AI Swarms
- Pending review; —; Selected
- Relationships; exhibits; inspires; informs
- Open entity; View graph
- Source counts appear after evidence review.

Entity:
- Explore / Nature / Ant
- Ant; Nature; Pending review; Mechanism
- Local actions leave traces in a shared environment. The first chain examines how this connects to stigmergy and computational coordination.
- Synthesis · Pending review
- Claims & sources; Evidence; Synthesis; Source review pending
- Supporting sources; No verified sources yet
- First chain; all four canonical node names and three predicates; View graph
- Freshness; Reviewed —; Updated —
- Related research; Research review pending

The mechanism narrative is design-only provisional synthesis, not researched
publication content. Task 6 must replace or evidence it before release.

Graph:
- Graph; First chain; Relationships; Selected
- All four canonical full node names and three canonical predicates
- Nature; Principle; Algorithm; AI Swarms
- Zoom in; Zoom out; Reset view (desktop only)
- 4 entities · 3 relationships
- ACO; Agent coordination; All relationships listed above (mobile graph only)
- Structural node numbers 1–4 and relationship row numbers 1–3

## Turkish parity

EN and TR are parallel locale routes. Locale changes preserve entity and selected
state. Translate content labels, retain stable IDs and proper algorithm names
where the glossary requires it. Proposed hero translation:
“Basit ajanların karmaşık kolektif zekâyı nasıl ortaya çıkardığını inceleyin.”
Primary: “Haritayı keşfet”; secondary: “Yöntemi oku”.
Five stages: “Doğa → Kolektif davranış → İlkeler → Algoritmalar → Yapay ajanlar”.
Turkish is not visually approved by an English raster. Validate Turkish line
lengths separately; no smaller typography or hidden navigation to force parity.

## Responsive continuation and motion

Below 1024px, Explore preview follows the list and entity first-chain rail follows
identity before the long article. Keep all semantics and evidence available.
Explore filters wrap; they never become a horizontally overflowing chip strip.
Metadata stacks below title on mobile. Graph switches to list-first below 768px.
Home stage band becomes a vertical ordered list below 768px. Long graph and
algorithm names wrap; overflow:hidden must not hide meaningful content.

Trail animation, if later introduced, is restrained: linear drift with 8s cycle,
maximum 12px translation, no flashing, no reactive physics implied. Stop while
hidden. prefers-reduced-motion and mobile default use a static field. General
interaction transitions: 120ms ease-out; disclosure: no animated height required.
The proposed references do not authorize simulation controls or an experiment.

## Review ledger and explicit proposed deviations

- Approval remains pending. These concepts cannot be called user-approved.
- Native raster sizes approximate the requested viewports; CSS dimensions above
  govern later checks.
- Home desktop adds Observe, Measure, Analyze, Synthesize at the next-band edge.
  These are omitted from the allowlist and proposed implementation.
- Explore adds short explanatory role sentences that have not been researched.
  They are omitted from the allowlist pending Task 6 evidence work.
- Entity uses amber for small text in the raster; use ink/watch-ink for accessible
  text. Its dotted View graph focus becomes the shared solid focus rule.
- Desktop graph invents type subtitles Biological Entity, Behavioral Mechanism,
  Computational Method, Computational Concept. Replace with canonical type names
  above. Its rail has a full frame; contract uses an open rail with separating rule.
- Mobile Graph focuses the whole second relationship row; actual implementation
  must outline the focused entity link. Mobile Home and Graph show matching
  two-row headers; exact 44px target sizes remain a browser acceptance check.
- Raster does not prove contrast, target geometry, keyboard behavior, responsive
  overflow, or local fonts. Those must be measured on the implementation.
- No application code, runtime asset, font binary, or browser screenshot exists
  in this design-only checkpoint. No implementation fidelity claim is made.
