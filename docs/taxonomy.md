# Taxonomy

## Taxonomy principles

SWI separates what a thing is from the topics it participates in. Entity type,
topic classification, and relationship role must not be collapsed into tags.
Stable identifiers use lowercase kebab-case and never change when display copy
is translated.

## Initial entity types

| Type | Meaning | Initial examples |
| --- | --- | --- |
| `species` | Biological organism or collective | ant, honeybee, termite |
| `swarm-behavior` | Observable collective behavior | foraging, flocking |
| `biological-mechanism` | Physical or biological coordination mechanism | pheromone deposition, quorum sensing |
| `principle` | Cross-domain explanatory principle | stigmergy, emergence, decentralization |
| `algorithm` | Formal computational method | ACO, PSO, ABC, Boids |
| `ai-technique` | Artificial-agent organization or technique | collective reasoning, shared artifact coordination |
| `robotics-system` | Swarm or multi-robot approach | decentralized task allocation |
| `paper` | Scholarly work | a versioned bibliographic entity when page-level treatment is useful |
| `researcher` | Person connected to documented research | added only with an explicit source |
| `organization` | Research group, institution, or project owner | added only with an explicit source |
| `project` | Implementation or research project | source repository or laboratory project |
| `dataset` | Research dataset | later release |
| `benchmark` | Evaluation definition and results context | later release |
| `experiment` | SWI experiment definition | ant foraging |
| `simulation` | Runnable model associated with an experiment | ant-foraging simulation engine |

The TypeScript model will use a discriminated union so type-specific attributes
remain explicit. Empty subtype fields are not added solely for visual symmetry.

## Topic families

The initial topic taxonomy supports multiple views of the same entity:

- Domain: nature, optimization, robotics, multi-agent systems, artificial agents.
- Organism: ants, bees, termites, birds, fish, microorganisms.
- Mechanism: direct communication, indirect communication, local sensing,
  feedback, environmental memory, task allocation.
- Objective: search, navigation, consensus, allocation, control, reasoning.
- System property: robustness, scalability, diversity, specialization,
  emergence, adaptability.
- Evidence status: established observation, computational formulation,
  experimental result, synthesis, open question.

Topic families are explicit records with ordering and optional hierarchy. A
topic does not become a free-form visual category merely because it appears in
content.

## First-class swarm principles

The initial principle vocabulary is:

- decentralization;
- local interaction;
- local sensing;
- simple individual rules;
- emergence;
- self-organization;
- stigmergy;
- environmental memory;
- positive feedback;
- negative feedback;
- redundancy;
- robustness;
- diversity;
- specialization;
- quorum sensing;
- consensus;
- distributed memory;
- adaptive task allocation;
- exploration versus exploitation.

Only the principles supported by completed research records enter the public
catalog. This list is a controlled scope, not fabricated seed content.

## Relationship vocabulary

Relationships are directional and use controlled predicates:

| Predicate | Source → target example |
| --- | --- |
| `exhibits` | ant → stigmergy |
| `observed-in` | flocking → birds |
| `uses-mechanism` | ant foraging → pheromone deposition |
| `instantiates` | pheromone trail → positive feedback |
| `inspires` | stigmergy → ant colony optimization |
| `formalizes` | ACO formulation → distributed path search |
| `models` | Boids → flocking |
| `belongs-to` | ACO → swarm optimization |
| `applies-to` | consensus → collective decision making |
| `uses` | artificial-agent coordination → shared artifact memory |
| `evaluated-by` | experiment → metric or benchmark |
| `documented-by` | entity or relationship → claim |
| `precedes` | timeline milestone → later milestone |
| `contrasts-with` | centralized coordination → decentralized coordination |

Inverse labels are defined centrally for UI traversal. Symmetry is explicit:
`contrasts-with` is symmetric; `inspires` is not. Relationships may not invent a
new predicate inside a content file.
