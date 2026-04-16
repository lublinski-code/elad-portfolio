# Elad Lublinski — Portfolio

**Built and owned by Elad Lublinski.** This repo is public for reference and learning, not for forking. If you like a pattern here, take inspiration and write your own. Don't clone the portfolio itself. See [LICENSE](./LICENSE).

A personal portfolio for a product designer who works at the intersection of design, AI, and product development.

One of the seven case studies inside this portfolio documents how I built an AI development team inside Claude Code: 15 specialized agents, 19 skill libraries, a global ruleset, organized by altitude from strategy down to QA.

That same system built this portfolio.

The case study describes the method. The repo you're looking at is the output.

---

## What's in it

- 7 case studies, each with its own color accent, typography rhythm, and impact grid
- Markdown-driven content with custom rendering (goal cards, takeaway grids, expandable process galleries, image captions, blockquote callouts)
- Sticky meta sidebar per case study (role, team, timeline, impact)
- Inner-page navigation with next-page scroll pull
- Parallax hero, lightbox, custom favicon and OG image
- Zero templates. Every component built from scratch to fit the content

## Stack

- Next.js 16 with Turbopack
- Tailwind CSS 4
- Content: gray-matter + remark + remark-gfm (with `sanitize: false` for authored HTML)
- Icons: lucide-react
- Deployed on Vercel

## Structure

```
src/
├── app/                   Next.js app router
├── components/
│   ├── sections/          Home page sections (work, about, contact)
│   └── work/              Inner case study components (body layout, meta card, lightbox, next-page-pull)
├── content/work/          Markdown case studies with frontmatter
├── lib/content.ts         Content loader, type system, accent color maps
└── app/globals.css        Typography system, 8pt spacing, component styles
```

Case studies live in `src/content/work/*.md`. Frontmatter drives metadata (title, tags, accent color, role, team, goals, links). Markdown body drives layout. Sections are split on `<hr>` and rendered as individual cream-colored cards with shared typography rules.

---

## The process

### Design source of truth

The UI started as a Figma file. Every screen, every layout variant, every interaction state was mocked up before a single line of code. The port from Figma to code happened through the Figma MCP server: a dedicated `designer` agent fetched each node directly from Figma using `get_design_context`, `get_screenshot`, and `get_variable_defs`, then translated the output into the project's stack, tokens, and component conventions. The rule was strict: no coding from thumbnails, no guessing from memory, no improvising missing specs. If anything was ambiguous, the agent stopped and asked.

This removed the usual translation losses between design and engineering. The designer saw their file, the code mirrored it, the tokens stayed in sync.

### Content pipeline

Case study content lived in Notion first. Each case study had a page with a goal block, a business goal block, a body, and process galleries. Migrating to markdown happened through the Notion MCP server: the `notion-fetch` tool pulled each page by ID, and the content was restructured into markdown with frontmatter (role, team, timeline, impact, goals) and embedded HTML blocks (takeaway grids, expandable process galleries).

The Notion page became the draft. The markdown file became the source of truth. The website became the published version.

### Perfecting the UI

Every component went through multiple rounds of review. The flow looked like:

1. `designer` agent builds from Figma
2. `code-review` agent checks for structural issues and dead code
3. `qa` agent hunts for edge cases and accessibility gaps
4. `web-design-guidelines` skill checks against Vercel's interface guidelines (file:line findings)
5. Back to the designer for polish

The 8pt grid was enforced rigidly. Every spacing value had to be 4, 8, 16, 24, 32, 40, or 48px. Em-based gaps got rejected. Arbitrary px values got rejected. The rules lived in `.claude/rules/design-standards.md` and every agent loaded them.

### Micro-interactions

The motion language was intentional, never decorative. Hover states used the same 150ms ease curve across every interactive surface. The scroll-pull-to-next-page interaction took several iterations to get right: too sensitive and it fired on accidental scrolls, too strict and it never triggered. The final version watches wheel and touch events, accumulates delta past the page boundary, and commits to navigation when the user has clearly pulled past the threshold.

The parallax hero uses scroll-linked transforms with graceful degradation: no scroll listener spamming the main thread, just CSS transforms tied to an IntersectionObserver.

Every transition was sanity-checked against `.claude/rules/micro-interactions.md`: if you can't name what a transition communicates, remove it.

### Typography and rhythm

The custom work-body styles took more iteration than anything else. Tailwind CSS 4 tree-shakes unused classes aggressively, which meant CSS-only classes referenced in markdown HTML kept getting stripped. The fix was to move those rules into `@layer base` so Tailwind preserves them. Tables, blockquotes, lists, image captions, inline code, callouts, takeaway grids, they all share the same vertical rhythm and max-width logic. Reading a case study feels like reading a well-set print magazine, not a web page.

## Design principles

Pulled from `.claude/rules/` in the author's global Claude Code setup:

- 8pt grid for all spacing. No arbitrary px values, no em-based gaps
- Muted text as default. Primary foreground reserved for emphasis
- One primary action per context. Everything else is ghost or outline
- Whitespace as structure, not decoration
- Motion communicates state change. If you can't name what a transition says, remove it

## The meta angle

This portfolio is the output of the system documented inside it. If you want to know how it was built, read the `ai-team-claude-code` case study. The process is the product.
