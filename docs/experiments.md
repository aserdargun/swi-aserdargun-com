# Experiments

## Role in SWI

Experiments connect the research catalog to active investigation. They do not
replace source-backed knowledge and do not inherit scientific authority merely
because they are interactive.

Each experiment separates:

- hypothesis;
- setup and environment;
- parameter definitions;
- simulation or execution engine;
- measurements;
- observations;
- result interpretation;
- limitations;
- evidence and reproduction instructions.

The experiment definition and simulation engine are different modules. A
visualization can change without changing the model, and the model can be tested
without rendering React.

## First experiment: Ant Foraging and Stigmergy

### Purpose

Demonstrate how local movement, food discovery, environmental traces, and
evaporation can produce collective route formation. It is an educational model,
not a claim that the implementation reproduces a particular ant species.

### Environment

- bounded two-dimensional field;
- one nest;
- one or more food sources;
- optional obstacles;
- ant agents;
- homeward and foodward pheromone fields.

### Agent rules

An agent senses only a bounded local neighborhood. Exploring agents combine a
seeded random walk with local pheromone preference and obstacle avoidance. On
food discovery, an agent carries one unit toward the nest and deposits the
appropriate environmental trace. Pheromone strength decays over time.

The exact equations, units, update order, and boundary behavior must be recorded
with the implementation. They are not inferred from the visual appearance.

### Controls

- agent count within device-safe limits;
- pheromone deposit strength;
- evaporation rate;
- exploration randomness;
- simulation speed;
- start, pause, single-step, reset, and seed.

### Measurements

- food delivered;
- active agent count;
- mean completed route length;
- time to first food discovery;
- time to stable route under a documented stability rule;
- pheromone-field concentration summary.

`Convergence time` is shown only after convergence is defined mathematically.
Until then the UI uses the narrower stable-route measurement.

### Technical contract

- Pure TypeScript engine with seeded deterministic tests.
- Fixed simulation timestep independent of display refresh rate.
- Worker adapter for normal execution.
- Canvas or lightweight WebGL presentation chosen after measurement.
- Reduced-motion presentation and static explanatory fallback.
- Textual metrics and keyboard-operable controls.
- Automatic pause when the page is hidden.
- Device-tier agent caps and no unbounded allocation.

## Future experiment families

- pheromone trail sensitivity;
- flocking and obstacle avoidance;
- bee-inspired consensus;
- distributed search;
- adaptive task allocation;
- robustness under agent failure;
- heterogeneous artificial-agent teams.

## North-star experiment: Small Model Swarm

The long-term Small Model Swarm investigates whether locally executable models
can collectively solve tasks that none solves reliably alone. Its variables
include agent count, model size, topology, communication bandwidth, context,
memory, specialization, heterogeneity, delegation, voting, failures, and
adversarial participants.

Its measurements include task success, latency, total tokens, energy or cost,
communication overhead, diversity, robustness, and scaling behavior. This work
requires a separate experimental protocol, baseline suite, reproducible model
artifacts, and safety review. It is not part of the first public release.
