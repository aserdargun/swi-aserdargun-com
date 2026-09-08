# SWI working contract

- Build the bilingual, evidence-based research and learning platform for swarm intelligence, with SWI (Swarm Intelligence) as the living atlas.
- Keep research truth in `src/research`; every claim, study, and recipe carries an explicit source or is marked as hypothesis. No fabricated citations, no invented benchmark results, and no real agent execution happens here — simulation ground truth for subordinate apps (ANT, BEE) belongs to their own workspaces, not SWI.
- SWI is an observer: biology dossiers, library entries, and laboratory outcomes are observer outputs that may inform recipe structure, but recipes are static Markdown/JSON experiment templates generated from the entered task, agent count, rounds, and aggregate token budget. The agenda is local user state, not a decision input.
- Behavior, experiment, world, simulation, metric, and export schema versions are explicit. Update affected versions when semantics change.
- Every recipe export is a snapshot of the inputs at generation time and includes its schema and generator version. Reject exports whose schema version is unknown or unsupported.
- Keep Turkish and English controls and explanations equivalent. Label model assumptions and simulation units.
- Verify `npm run validate:codex` and review `git diff --check` before handoff.
- Local work only unless the user authorizes external publication. Preserve unrelated work and processes.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
