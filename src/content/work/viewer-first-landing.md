---
title: Friction at the highest-intent moment.
navLabel: viewer-first-landing
subtitle: "How simplifying intent and removing friction increased installs and login rates"
category: Case Study
tags: [Conversion]
timeline: "3 weeks"
role: Product Design Lead
team: "BE Engineer, FE Engineer"
impact: "+12% game installs | Higher Twitch login rate | Shorter time to install"
bg: candy
fg: black
order: 7
published: true
goal: "Boost user **conversion** with a focused and simplified landing page"
secondaryGoal: "Convert users to login with **Twitch**"
businessGoal: "A performance-based sponsorship marketplace linking gaming and service advertisers with creators' audiences, built on an event-driven revenue model."
---

#### Context

## Background

With StreamElements Sponsorships, content creators promote a game or service to their viewers. When viewers click the creator's link, they land on a page where we verify a few details and let them choose whether to log in with Twitch for recognition and rewards, or continue anonymously.

---

#### Problem

## Dropping off at peak intent

Viewers clicking a creator's sponsorship link were dropping off at the landing page -- the highest-intent moment in the funnel.

I audited the existing page and found multiple friction points:

- Two identical CTAs ("click here") creating confusion
- Long headline where the creator's name and value got lost
- No clear reason to log in -- felt like a one-time action with no benefit
- Multiple eligibility checks caused the page to blink and reload, hurting trust
- The page emphasized the game, not the creator the viewer intended to support

<details>
<summary>The old landing page</summary>

![Old Roblox campaign landing page with two competing CTAs](/work/viewer-first-landing/old-roblox.png)

![Old Raid: Shadow Legends campaign landing page](/work/viewer-first-landing/old-raid.png)

</details>

---

#### Process

## How I got there

### Reframing around user motivation

Viewers weren't there for the game -- they were there to support their favorite creator. The page needed to reflect that intent, not fight against it.

### Simplifying the action

I reduced the flow to a single, clear action. No competing CTAs. One path forward.

> **The insight:** the old page had two equal-weight buttons asking the same thing in different words. Removing the choice paradox was the simplest conversion win.

### Moving technical work to the background

All eligibility checks were moved to run silently. No more UI flicker, no more page reloads mid-flow. If a viewer was already connected with Twitch, they'd skip the landing page entirely and go straight to the App Store.

### Giving a reason to connect

The old page gave no incentive to log in with Twitch. The new page made the value clear: recognition on stream and rewards.

<details>
<summary>Process: user flow and issue mapping</summary>

![User flow diagram mapping eligibility checks, login paths, and edge cases](/work/viewer-first-landing/user-flow.png)

![Issues and solutions mapping with user needs and design responses](/work/viewer-first-landing/issues-mapping.png)

![Wireframes for mobile game flow, login paths, and QR code variations](/work/viewer-first-landing/wireframes.png)

</details>

---

#### Solution

## What We Built

### Desktop landing page

- Creator-first messaging: "Play to support [Creator Name]"
- Single primary CTA (Connect with Twitch)
- Clear secondary option (Stay anonymous)
- Clean visual hierarchy

![Desktop landing page with single CTA and creator-first messaging](/work/viewer-first-landing/landing-desktop.png)

<p class="img-caption">One message, one action. The page now leads with the creator's name and gives a clear reason to connect with Twitch</p>

### QR code for mobile installs

For mobile games accessed from desktop, a QR code replaced the traditional download flow.

![QR code view for mobile game installs from desktop](/work/viewer-first-landing/qr-desktop.png)

<p class="img-caption">Desktop users playing a mobile game just scan and go. No extra steps, no friction</p>

### Mobile experience

![Mobile landing page with Connect with Twitch CTA](/work/viewer-first-landing/mobile-view.png)

### Edge cases

Graceful handling for ineligible users and smart routing for already-connected viewers.

![Ineligible user error page](/work/viewer-first-landing/ineligible-page.png)

![PC gamers modal redirecting mobile users to desktop](/work/viewer-first-landing/pc-gamers-modal.png)

---

#### Results

## Impact

<div class="takeaway-grid">
<div class="takeaway-card">
<span class="takeaway-num">+12%</span>
Increase in game installs. More viewers completed the flow instead of dropping on the landing page.
</div>
<div class="takeaway-card">
<span class="takeaway-num">Higher</span>
Twitch login rate. Clear value and reduced friction encouraged users to connect.
</div>
<div class="takeaway-card">
<span class="takeaway-num">Shorter</span>
Time to install. Reducing cognitive load and removing visible checks helped users move faster.
</div>
</div>

---

#### Reflection

## What I Learned

- **Even valuable business steps can hurt conversion if placed at the wrong moment.** The eligibility checks were necessary, but showing them to users created hesitation.
- **Aligning the flow with user motivation improves results without sacrificing requirements.** Focusing on "support your creator" instead of "download this game" converted better while still achieving the business goal.
