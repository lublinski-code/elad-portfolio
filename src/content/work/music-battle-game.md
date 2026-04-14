---
title: I had the product sense. I wanted to test if that was enough to ship.
navLabel: music-battle-game
subtitle: A music battle game built from zero to live, using AI as a co-builder and years of design experience as the foundation.
category: Side Project
tags: [Exploration, AI Development, Solo Build]
timeline: "3 weeks"
role: Product Designer
team: Agent CPO, Agent CTO, Claude Code, Cursor
impact: "Shipped to production"
bg: lemon
fg: black
order: 2
published: true
---

#### The Idea

## SoundClash

A music guessing game with arcade fighting mechanics, built independently from idea to shipped product using AI as a co-builder.

Music guessing games exist. Fighting games exist. SoundClash puts them together. Players take turns listening to song snippets and race to identify the track. The faster you guess, the more damage you deal to your opponent's HP. Choose your genres, your era, your teams, and battle.

The concept came out of a brainstorming session with a CPO agent I built, an AI thought partner tuned to challenge my product assumptions. We shaped it into a proper PRD before a single line of code was written.

![SoundClash home screen](/work/music-battle-game/home.png)

---

#### The Process

## How it was built

This project was as much about how I build as what I built. I wanted to see how far I could take my product and design instincts as a solo builder, using AI tooling as a genuine development partner.

**Product thinking first.** I started by pressure-testing the concept with my CPO agent, then ran the technical approach past a CTO agent I built for architecture decisions. Both pushed back, shaped tradeoffs, and helped me adjust the PRD before I committed to a direction.

**Design before code.** Vibe-designing did not work. I needed control over the output. So I designed properly in Figma: colors, typography, layouts, component attributes, and an improved player flow. Then I connected the Figma MCP server, created design tokens for the project, and pushed the design directly into the build. The game looks the way I intended it to look.

![First draft without designing in Figma](/work/music-battle-game/no-ui-design.png)

**Phased builds for better control.** Rather than building everything at once, I sliced the project into phases to maintain context, reduce risk, and keep output quality high throughout.

**Built with Cursor and Claude.** Most of the build happened in Cursor using Claude Opus 4.6 and Sonnet 4.6. Midway through, I hit my Cursor token limit and shifted to Claude Code, which felt more natural than expected, especially working in Cursor's terminal where my environment was already set up.

![Battle setup with genre, era, and HP configuration](/work/music-battle-game/battle-setup.png)

---

#### The Hard Parts

## What almost killed the project

**Spotify locked me out.** I built the first version on Spotify's API, full song playback, auth, the works. Their developer tier limits test apps to 5 users, and midway through, a policy change severed my access to their song quota entirely. Zero songs returned, no matter what I tried.

I migrated to Deezer's API. It offers 30-second previews and a wide catalog, and the tradeoff was manageable. To compensate for sending players to a less familiar platform, I added multi-platform links. After each round, players can open the full track on Spotify, Apple Music, YouTube, or wherever they prefer.

![Spotify to Deezer architecture migration](/work/music-battle-game/deezer-migration.png)

![Multi-platform song links after each round](/work/music-battle-game/full-song-selector.png)

**The song pool fetch was the hardest engineering problem.** Filtering songs by genre, era, and market in a way that felt right for the game and stayed consistent took more iterations than anything else in the project. It is still the most refined part of the codebase.

**Performance was a product decision.** Players hit Start Battle and expect the game to begin immediately, not wait 20 to 30 seconds while songs fetch. So I rearchitected the sequence: the first song loads on Start, the game begins, and the rest of the pool fetches in the background. Players never feel the wait.

![Progressive song pool loading](/work/music-battle-game/optimization-for-game-start.png)

---

#### What Shipped

## The game

- Team setup with custom player and team names
- Genre, era, and market selection before each battle
- Progressive snippets: hear more of the song, but take more damage for a wrong guess
- HP system: wrong guesses and skips deal damage; artist-only guesses cost less
- Album reveal and full-song links across platforms after each round
- Deployed on Vercel, no login or subscription required

**Stack:** Next.js 16 · React 19 · TypeScript · Zustand · Framer Motion · Tailwind CSS v4 · Deezer API

![Round 1 with autocomplete search](/work/music-battle-game/turn-w-input.png)

![Round 4 with countdown timer](/work/music-battle-game/turn.png)

![Perfect hit](/work/music-battle-game/perfect-hit.png)

---

#### Feedback

## What players said

> "I love the concept of building this as a fighting game!"

> "I wish I could play this online"

> "It works! and it's fun!!!"

> "This is more fun than Hitster!"

---

#### What's Next

## The roadmap

The game is live and collecting real user feedback. Next phases:

- Monetization research: exploring whether this is a viable business
- User accounts and a database to support them
- Leaderboards so games carry more weight
- Multiplayer and new game modes

---

#### Why It Matters

## Closing the gap

I am a product designer. I have always had strong opinions about what to build and why. What changed here is that I can now build it myself, scoped, shipped, and iterated. SoundClash is proof that the gap between design and product is closable, with the right process and the right tools.
