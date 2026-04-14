---
title: Building a full AI team inside Claude Code
navLabel: ai-team-claude-code
subtitle: What happens when you treat AI agents like a real org chart? 15 specialized agents, 19 skill libraries, and a global ruleset in one CLI.
category: Personal
tags: [AI Workflow, Exploration]
timeline: "Single session after a lot of testing"
role: Orchestrator
team: Claude Code
impact: ""
bg: grape
fg: white
order: 1
published: true
---

#### Philosophy

## The premise

Most people use AI as a fast autocomplete. Smarter prompts, better output. That's useful, but it's not how I think about it. I'm interested in what happens when you treat AI as a team with **structure, roles, and accountability,** where each agent has a specific altitude, a specific mandate, and a specific set of tools.

The question I started with: could a solo founder operate with the decision-making support of a full C-suite and the execution capacity of a senior engineering team, all inside a terminal window?

> Each agent should have a clear altitude: decide what to build, design how systems connect, build it right, verify it works, or make it polished. Not all of those are the same job.

The answer is yes, but only if the system has real architectural discipline. Skills need to be shared consistently. Rules need to be loaded always, not sometimes. Agents need to know exactly what they own and what they don't.

![Claude Code welcome screen](/work/ai-team-claude-code/claude-code-welcome.png)

---

#### The Team

## 15 agents, organized by altitude

The team is structured in layers, each with a different job. Strategy agents run on Opus because they need deep reasoning. Simpler agents run on Sonnet for efficiency. Implementation agents have write access; review agents are read-only.

### Strategy Layer `Opus · Proactive`

| Agent | Role |
| --- | --- |
| CPO | Product strategy, prioritization, user psychology. Challenges assumptions, offers alternatives. |
| CTO | Technical strategy, build vs buy, MVP vs production trade-offs. Phase-aware advice. |
| CDO | Design leadership, UX strategy, AI-specific design principles. Connected to Figma MCP. |
| Growth | GTM strategy, positioning, activation, retention, pricing. Most skill-loaded agent in the system. |

### Architecture Layer `Opus`

| Agent | Role |
| --- | --- |
| Architect | System design, service boundaries, data flow, API contracts, migration planning. Bridges CTO decisions and implementation. |

### Implementation Layer `Opus · Read + Write`

| Agent | Role |
| --- | --- |
| Backend | API design, database modeling, performance. |
| Frontend | Component architecture, state management, rendering performance. Most skills of any agent (8). |
| AI Engineer | Prompt engineering, model selection, evals, cost optimization, guardrails. |
| DevOps | CI/CD, infrastructure, deployment, monitoring. |

### Quality Layer `Read-only`

| Agent | Role |
| --- | --- |
| Code Review | Bugs, security, performance, maintainability. Outputs file:line findings with a ship / no-ship verdict. |
| QA | Thinks like a destructive user. Edge cases, input validation, state management. |
| Security | OWASP top 10 auditing, auth flows, data exposure, dependency risks, secrets management. |

### Craft Layer `Sonnet`

| Agent | Role |
| --- | --- |
| Designer | Hands-on UI audits, accessibility, visual polish, design system compliance. Connected to Figma MCP. |
| UX Writer | Microcopy, error messages, button labels, onboarding text. Outputs current / suggested / why format. |
| Data | Tracking plans, event schemas, metric definitions, funnel analysis. |

![Agent strategy table](/work/ai-team-claude-code/strategy-table.png)

![CTO agent markdown file](/work/ai-team-claude-code/cto-agent-md-file.png)

---

#### Skill Library

## 19 shared playbooks

Skills are specific playbooks that agents load at execution time, distinct from the always-on rules in CLAUDE.md. The same `testing-patterns` skill serves Backend, Frontend, QA, and Code Review, so consistency comes from the library, not from repeating yourself in every prompt.

| Skill | Category |
| --- | --- |
| api-design | API |
| supabase-postgres | API |
| component-patterns | Frontend |
| composition-patterns | Frontend |
| next-best-practices | Frontend |
| react-best-practices | Frontend |
| frontend-design | Frontend |
| web-design-guidelines | Frontend |
| canvas-design | Design |
| prompt-engineering | AI |
| testing-patterns | Testing |
| systematic-debugging | Testing |
| deploy-checklist | DevOps |
| copywriting | Growth |
| pricing-strategy | Growth |
| seo-audit | Growth |
| launch-strategy | Growth |
| tracking-plan | Analytics |
| commit | Workflow |

![Skills playbook overview](/work/ai-team-claude-code/skills-playbook.png)

![Skills playbook detail](/work/ai-team-claude-code/skills-playbook2.png)

---

#### Memory

## 5 layers that persist across sessions

The memory system is what separates an AI operating system from a collection of prompts. Without it, every session starts cold. With it, the system already knows the project state, the open threads, the last decision made.

| # | Layer | What it is | Scope | Updated by |
| --- | --- | --- | --- | --- |
| 1 | **CLAUDE.md** | The orchestration layer. Always-on instructions, communication rules, and references to every other layer. Ties the whole system together every session. | Global + Project | Manually |
| 2 | **Primer** | Static identity: who I am, how I work, build philosophy, non-negotiables, current projects, key decisions already made. Written once, updated rarely. | Global | Manually, rarely |
| 3 | **Git Context** | Live project state injected automatically at session start. Current branch, recent commits, uncommitted changes, diff status. Always fresh, never stale. | Per project | Automatic via hook |
| 4 | **Hindsight** | Session carry-forward at two scopes. Project-level: what shipped, what broke, open threads. Global: cross-project learnings that accumulate over time. Written by `/end-session`, loaded at session start. | Global + Project | `/end-session` |
| 5 | **Obsidian Vault** | Long-term knowledge base: project notes, ideas, product decisions with reasoning, research. Not loaded every session — accessed on demand by any agent via MCP. | Global | Manually or via agents |

> Starting a session without context is just prompting. Starting a session where the system already knows the project state and the last decision, that's actually working.

---

#### Design Decisions

## What I decided not to build

The most useful design decisions were about scope. A system that tries to cover everything becomes incoherent. A few agents I considered and explicitly ruled out:

| Agent | Why it was cut |
| --- | --- |
| Product Manager | The founder owns that job. The CPO covers strategy support. |
| BizDev | Growth + CPO cover positioning and deals at this stage. |
| Accessibility Specialist | CDO and Frontend carry WCAG standards via shared rules. |
| DBA | Backend owns data modeling. The Supabase skill handles the specifics. |

The system also migrated from existing Cursor agent configs. The CPO and CTO had already been built for .cursor/agents/ — the session was partly an exercise in porting, improving, and formalizing what already worked in practice.

---

#### Takeaways

## What it actually changes

<div class="takeaway-grid">
<div class="takeaway-card">
<span class="takeaway-num">01</span>
Altitude discipline is everything. An agent that does both strategy and implementation gets neither right.
</div>
<div class="takeaway-card">
<span class="takeaway-num">02</span>
Skills as shared libraries eliminate drift. One <code>testing-patterns</code> file, four agents, consistent output.
</div>
<div class="takeaway-card">
<span class="takeaway-num">03</span>
Rules are always-on foundation. Skills are context-loaded execution. They solve different problems.
</div>
</div>

This is an evolving system, not a finished one. The agents will get better as the skills are refined and the ruleset is stress-tested on real projects. What this session proved is that the architecture is sound, and that **treating AI collaboration as a system design problem is worth the effort**.

![Full system architecture](/work/ai-team-claude-code/structure.png)
