---
title: How we turned a blocked high-value segment into a growth engine
navLabel: agency-sponsorships
subtitle: Unlocking Sponsorships offers for Agency-Represented Creators
category: Case Study
tags: [Growth]
timeline: "24 weeks"
role: Product Design Lead
team: PM, BE Engineer, 2 FE Engineers, Marketing Designer
impact: "2.4x more campaigns per creator | -37% time to launch | +15% retention"
bg: sky
fg: black
order: 3
published: true
goal: "Boost user **conversion** with a scalable solution for creators with agents"
businessGoal: "A performance-based sponsorship marketplace linking gaming and service advertisers with creators' audiences, built on an event-driven revenue model."
---

#### Context

## StreamElements Sponsorships

StreamElements Sponsorships is a marketplace connecting creators with sponsorship opportunities. It allows creators to easily discover, review, launch and track campaigns, unlocking new monetization opportunities for small to mid-size creators who often don't have access to such deals.

---

#### The Blocker

## We couldn't convert agency creators

We couldn't convert agency-represented creators, a high-value segment we knew performed better than individual creators. The problem: these creators don't manage their own sponsorships. Their agents do. But our platform only supported direct creator accounts. So when an offer came in, the creator couldn't accept it themselves, and their agent had no way in.

Our internal Creator Success Managers were manually coordinating with agencies over email to launch campaigns. It worked, but it didn't scale.

---

#### The Failed First Attempt

## An overlay that engineering killed

My first approach was an overlay system, let agents act on behalf of creators inside the existing product. We prototyped it, tested with users, got positive feedback. Then engineering flagged a critical issue: allowing users to control other users' accounts was a security breach. The validated solution was dead.

<details>
<summary>Examples from the process</summary>
<img src="/work/agency-sponsorships/process-overlay-1.png" alt="Early overlay prototype exploration">
<img src="/work/agency-sponsorships/process-overlay-2.png" alt="Agent-on-behalf-of flow prototype">
<img src="/work/agency-sponsorships/process-overlay-3.png" alt="Overlay system wireframe">
<img src="/work/agency-sponsorships/process-overlay-4.png" alt="Creator account control prototype">
<img src="/work/agency-sponsorships/process-overlay-5.png" alt="Initial agent interface concept">
</details>

---

#### Finding a Path

## With limited resources

At StreamElements, engineering capacity was tight. I explored lightweight alternatives, anything that wouldn't require building from scratch. I couldn't find one that solved the problem.

The solution I'd initially dismissed as too expensive, a dedicated agency platform, was the only viable path. Now I had to make the case for it.

<details>
<summary>More from the process</summary>
<img src="/work/agency-sponsorships/process-path-1.png" alt="Platform architecture exploration">
<img src="/work/agency-sponsorships/process-path-2.png" alt="Agency workflow mapping">
<img src="/work/agency-sponsorships/process-path-3.png" alt="Alternative solutions analysis">
<img src="/work/agency-sponsorships/process-path-4.png" alt="Technical feasibility assessment">
</details>

---

#### Building the Case

## Quantifying the opportunity

I partnered with the PM to quantify the opportunity:

- Agency creators showed higher intent
- They completed campaigns at a higher rate
- But we were losing them because our product didn't fit their workflow

We presented the business case to engineering and leadership. Got buy-in.

<details>
<summary>More from the process</summary>
<img src="/work/agency-sponsorships/process-case-1.png" alt="Business case data analysis">
<img src="/work/agency-sponsorships/process-case-2.png" alt="Opportunity sizing presentation">
</details>

---

#### The Insight

## What unlocked conversion

Through user interviews, agents told us directly: their clients wouldn't accept offers without a guaranteed base payment. Performance-only deals weren't enough.

This confirmed what we'd seen signals of in the main product, but for this segment, it was non-negotiable. We built the case to stakeholders that adding base payments for agency creators would unlock the cohort entirely.

---

#### What We Built

## A dedicated agency platform

A dedicated platform for agencies to manage sponsorships for the creators they represent.

![Agency landing page with precise messaging and a clear value proposition](/work/agency-sponsorships/landing-page.png)

**Agency dashboard.** Every agency got their own platform where they can review their clients and browse through available offers.

![Open offers page with multi-creator overview and campaign management](/work/agency-sponsorships/open-offers.png)

**Offer and launch flow.** Every deal had its offer page, uniquely made for each creator with their own price. Agents could review the offer, communicate it with the creator, receive permission to start on behalf of the creator, or decline, and handle all the payments from the campaign. We wanted the process to be very transparent for agents and their clients.

![Offer page with deal terms, requirements, and earnings breakdown](/work/agency-sponsorships/offer-page-mvp.png)

**Shareable summary.** Agencies told us: "We need to show creators the offer in a way they'll say yes." We turned that into a product pattern, a copy-paste summary designed for how agents actually communicate with their clients. Agents could use whatever channel they already use with the creator, whether email, Discord, WhatsApp, or anything else.

![Copy-paste offer summary for sharing with creators](/work/agency-sponsorships/share-summary.png)

<details>
<summary>Version 2.0 design</summary>
<img src="/work/agency-sponsorships/v2-initial.png" alt="Version 2.0 with bulk actions, fewer steps to launch, and richer performance dashboards">
</details>

---

#### Impact

## The numbers

<div class="takeaway-grid">
<div class="takeaway-card">
<span class="takeaway-num">2.4x</span>
more campaigns per creator
</div>
<div class="takeaway-card">
<span class="takeaway-num">-37%</span>
time to launch a campaign
</div>
<div class="takeaway-card">
<span class="takeaway-num">+15%</span>
higher creator retention
</div>
</div>

This wasn't a UX improvement. It was a business unlock.

---

#### What We Unlocked

## Business outcomes

- A new high-value segment becomes active
- A scalable channel replaces manual operations
- An operational bottleneck turns into revenue

---

#### Voices

## What agencies said

> "Before this, we managed sponsorships over email. Now everything is streamlined, trackable and fast." - Ace Creators

> "Being able to see performance and progress in real time helps us make better decisions and move faster." - Crusaders agency

> "I can launch and manage campaigns independently - no waiting, no blockers." - Proxy agency

---

#### Key Learning

## Designing for the workflow

By designing for the agency workflow instead of around it, we unlocked a previously inaccessible user segment and converted an operational bottleneck into a scalable revenue engine.
