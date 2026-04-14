---
title: "The Drop-Off That Made Us Rethink Our Sponsorship Product"
navLabel: audience-pivot
subtitle: "An 80% loss of players, after campaigns ended, forced us to focus on a new user type - The audience."
category: Case Study
tags: [Retention, Lifetime Value]
timeline: "13 weeks"
role: Product Design Lead
team: "Marketing Designer, Head Of UX, BE Engineer, 2 FE Engineers"
impact: "+21% ROAS D30 | +7% user LTV | Faster time to install"
bg: sunflower
fg: black
order: 4
published: true
---

#### Context

## Background

StreamElements Sponsorships helps creators promote games and products. While creators launch campaigns, their audiences drive the actual performance. But the product primarily focused on creators, leaving a gap in how players were supported and retained.

---

#### Problem

## An 80% drop-off after every campaign

StreamElements Sponsorships had an 80% drop-off problem: players stopped playing once the sponsored stream ended. D30 ROAS was declining. LTV was weak.

The root cause was structural. Our product treated creators as the primary user and audiences as an attribution link. But audiences were the actual revenue drivers -- they generated the events advertisers paid for.

We'd built the system around a bottleneck.

---

#### Process

## Exploring the right approach

The team identified a core tension: continuing to route everything through creators, or building a direct relationship with audiences.

There were internal discussions with stakeholders about the right path forward. The question was whether to extend the existing sponsorships model or create something new. We explored multiple directions, including a standalone product, but ultimately aligned on building a layer on top of Sponsorships that could leverage existing infrastructure while adding value for players.

### Working within constraints

This approach came with real limitations. The architecture was built around creators as the core unit. The back office couldn't support viewers as a fully separate user type. We had to design around these constraints rather than rebuild from scratch.

### Learning and evolving

After launching v1, data showed that creator-driven distribution alone wasn't delivering the engagement we needed. This insight led to a shift: we expanded to direct-to-audience acquisition and added community features that gave players reasons to return beyond just supporting their favorite creator.

The v2 additions -- leaderboards, social mechanics, challenges -- came from data and creator interviews. Points alone weren't enough. Community and competition became our differentiators.

<details>
<summary>Strategy and wireframes from the process</summary>

![Strategy tree mapping goals to solutions](/work/audience-pivot/strategy-tree.png)

![Early wireframes for groups and communities](/work/audience-pivot/wireframes.png)

![Opt-in list page and SE dashboard integration](/work/audience-pivot/opt-in-list-page.png)

![GrabTap creator dashboard with active campaigns](/work/audience-pivot/grabtap-dashboard.png)

![Upgrade flow for creators joining the sponsorship program](/work/audience-pivot/upgrade-modal.png)

</details>

---

#### Solution

## What We Built

### Onboarding

- Focused messaging with clear value proposition
- Sign in with trusted platforms (Twitch, Google, Facebook)
- Terms and privacy for added trust

![Onboarding screens with clear value proposition and trusted sign-in](/work/audience-pivot/onboarding.png)

<p class="img-caption">The interface needed to be precise with a clear value proposition and reflect trust with an uncharted type of users</p>

### Games marketplace

- Designed to create a retention loop
- Gaming patterns to drive conversion
- Vibrant interface showcasing variety

![Games marketplace with featured games, categories, and continue playing](/work/audience-pivot/games-marketplace.png)

<p class="img-caption">The marketplace needed to create a retention loop for players to keep playing or choose their next game. I added patterns from gaming to help increase conversions</p>

### Game page

- Displaying other players to reflect trust and create urgency
- Missions and earnings potential overview
- Bonus rewards as engagement and retention mechanic

![Game page with missions, bonus rewards, and player activity](/work/audience-pivot/game-page.png)

<p class="img-caption">The community aspect was a driver I chose to use in the game page by displaying other players. This helped create trust and FOMO. Displaying missions and bonus rewards created engagement and excitement</p>

### Communities (v2.0)

- Creator management dashboard
- Track metrics and affiliated players' progress
- Public page with leaderboards and engagement features

![Communities v2 with creator dashboard, leaderboards, and analytics](/work/audience-pivot/communities.png)

<p class="img-caption">Creators had a dashboard to track and manage their players' progression and revenue. Every creator had a public page with leaderboards and engagement features for their audience</p>

<details>
<summary>Creator-side dashboard</summary>

![Creator dashboard with game tracking, analytics, and player management](/work/audience-pivot/creator-dashboard.png)

</details>

---

#### Results

## Impact

<div class="takeaway-grid">
<div class="takeaway-card">
<span class="takeaway-num">+21%</span>
Increase in ROAS D30. Players showed stronger ongoing engagement and early monetization signals.
</div>
<div class="takeaway-card">
<span class="takeaway-num">+7%</span>
Uplift in user LTV. Rewarded players returned more consistently and stayed active longer.
</div>
<div class="takeaway-card">
<span class="takeaway-num">Faster</span>
Install flow. Reduced friction helped players reach gameplay quicker.
</div>
</div>

---

#### Reflection

## What I Learned

- **Opening incentives to audiences unlocked new acquisition channels.** Shifting focus from creators to audiences created opportunities we couldn't access before.
- **Enhancing an existing system drove major gains with minimal disruption.** A well-targeted layer improved performance without rebuilding the core.
- **Players loved the added value of earning while supporting creators.** Incentives created a stronger connection between player and creator -- validated by redeem rates and creator feedback.
