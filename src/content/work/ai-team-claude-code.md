---
title: Building a full AI team inside Claude Code
subtitle: What happens when you treat AI agents like a real org chart? 15 specialized agents, 19 skill libraries, and a global ruleset in one CLI.
category: Personal
tags: [AI Workflow, Exploration, Single session]
bg: grape
fg: white
order: 1
published: true
---

## The premise

Most people use AI as a fast autocomplete. Smarter prompts, better output. That's useful, but it's not how I think about it. I'm interested in what happens when you treat AI as a team with structure, roles, and accountability — where each agent has a specific altitude, a specific mandate, and a specific set of tools.

The question I started with: could a solo founder operate with the decision-making support of a full C-suite and the execution capacity of a senior engineering team, all inside a terminal window?

The answer is yes — but only if the system has real architectural discipline. Skills need to be shared consistently. Rules need to be loaded always, not sometimes. Agents need to know exactly what they own and what they don't.

## The team — 15 agents, organized by altitude

The team is structured in layers, each with a different job. Strategy agents run on Opus because they need deep reasoning. Simpler agents run on Sonnet for efficiency.

**Strategy layer** — CPO, CTO, CDO, Growth. Product strategy, technical direction, design leadership, and GTM. These agents challenge assumptions and offer alternatives. They don't write code.

**Architecture layer** — Architect. Bridges strategy and implementation. Owns system design, service boundaries, data flow, and API contracts.

**Implementation layer** — Backend, Frontend, AI Engineer, DevOps. Read and write access. These agents build things. Frontend carries the most skills (8) of any agent in the system.

**Quality layer** — Code Review, QA, Security. Read-only. Think like auditors. Code Review outputs file:line findings with a ship / no-ship verdict.

**Craft layer** — Designer, UX Writer, Data. The layer that makes things polished and measurable.

## The skill library — 19 shared playbooks

Skills are specific playbooks that agents load at execution time, distinct from the always-on rules. The same `testing-patterns` skill serves Backend, Frontend, QA, and Code Review — so consistency comes from the library, not from repeating yourself in every prompt.

19 skills across API design, frontend, design, AI engineering, testing, DevOps, growth, analytics, and workflow.

## Memory — 5 layers that persist across sessions

The memory system is what separates an AI operating system from a collection of prompts. Without it, every session starts cold. With it, the system already knows the project state, the open threads, the last decision made.

**CLAUDE.md** — Always-on orchestration. Instructions, communication rules, and references to every other layer.

**Primer** — Static identity. Who I am, how I work, build philosophy, non-negotiables.

**Git context** — Live project state injected automatically at session start. Always fresh, never stale.

**Hindsight** — Session carry-forward. Project-level: what shipped, what broke, open threads. Global: cross-project learnings that accumulate over time.

**Obsidian vault** — Long-term knowledge base accessed on demand via MCP.

## Design decisions — what I decided not to build

The most useful design decisions were about scope. A system that tries to cover everything becomes incoherent.

Product Manager: cut. The founder owns that job. CPO covers strategy support. BizDev: cut. Growth and CPO handle positioning at this stage. Accessibility Specialist: cut. CDO and Frontend carry WCAG standards via shared rules. DBA: cut. Backend owns data modeling. The Supabase skill handles the specifics.

## Takeaways

**01** — Altitude discipline is everything. An agent that does both strategy and implementation gets neither right.

**02** — Skills as shared libraries eliminate drift. One `testing-patterns` file, four agents, consistent output.

**03** — Rules are always-on foundation. Skills are context-loaded execution. They solve different problems.

This is an evolving system, not a finished one. What this session proved is that the architecture is sound — and that treating AI collaboration as a system design problem is worth the effort.
