# Visual fidelity and local QA

Date: 2026-09-06. Chromium, production static export, local fonts loaded,
reduced motion enabled for deterministic screenshots. The six accepted raster
references were opened and compared with these six actual renders at the
contract's CSS viewport sizes (native reference image pixels are approximate).

| Surface | Actual render | Viewport |
| --- | --- | --- |
| Home desktop | [Render](qa/home-desktop.png) | 1440 × 1100 |
| Home mobile | [Render](qa/home-mobile.png) | 390 × 844 |
| Explore desktop | [Render](qa/explore-desktop.png) | 1440 × 1000 |
| Entity desktop | [Render](qa/entity-desktop.png) | 1440 × 1100 |
| Graph desktop | [Render](qa/graph-desktop.png) | 1440 × 1000 |
| Graph mobile | [Render](qa/graph-mobile.png) | 390 × 844 |

| Contract point | Observed result |
| --- | --- |
| Copy | Hero sentence, two actions, five stage labels and their order match the English contract. Turkish equivalents are in the centralized locale dictionary. Reviewed records replace the concepts' pending placeholders with real counts, dates and scoped claims. |
| Layout | Open two-column desktop hero; five-stage band; four-entity chain; Explore selection rail; entity article and chain rail; bounded dark graph with a semantic relationship rail. |
| Typography | Declared Inter UI and Source Serif 4 editorial fonts; 72/80 desktop hero and 40/44 mobile hero; mobile navigation corrected to explicit 16/24. Raster font outlines are not a pixel-identical target. |
| Palette | Mineral canvas, green evidence, blue interaction, hard rules and flat dark graph. No gradients or decorative panels. |
| Graph anatomy | Four nodes and three directed edges with readable names and explicit Evidence/Synthesis labels; keyboard selection and visible controls. Tablet now uses the list-first layout through 1199px so the desktop SVG is not shrunk into unreadable labels. |
| Evidence | Real scoped claims are native disclosures with direct source links, dates and support notes. They are longer than the placeholder concept and extend below the viewport when opened. |
| Spacing / container | 1312px desktop maximum, 64px main gutters at 1440, 20px mobile gutters. Responsive tracks retain the accepted ratios after their gaps. |
| Controls / icons | Minimum-height controls, visible focus and reduced-motion treatment. Timeline/Experiments retain accepted header labels with a strike-through and accessible unavailable annotation. Research opens the implemented methodology. Decorative entity icons in the raster are omitted; semantic names and statuses remain explicit. |
| Responsive collapse | Two-row mobile header, stacked actions, numbered mobile stages, list-first graph. The full sourced relationship notes make the mobile graph list taller than the placeholder reference; its diagram follows the complete list below the first viewport. |
| Motion | Captured static reduced-motion state; mobile is static. Browser acceptance checks data-running=false and animation-name=none when reduced motion is requested. |

The renders document implementation, not pixel-level equivalence to generated
concepts. Evidence density and omitted decorative entity icons are visible
differences. Functional content and accessible controls take precedence over
placeholder geometry. No production publication is represented by this QA.

Local acceptance includes bilingual source traversal, search, graph/list edge-ID
parity, graph keyboard selection, all 16 localized routes at 390px without
horizontal overflow, mobile menu focus restoration and 44px navigation links,
and axe serious/critical checks across the five page types in both languages.
The separate unknown-route regression checks three 404 cases and hydration.
