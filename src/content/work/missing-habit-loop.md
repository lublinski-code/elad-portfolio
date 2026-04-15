---
title: The missing habit loop.
navLabel: missing-habit-loop
subtitle: "Re-engaging GrabTap Players with Smarter Notifications & Live Ops"
category: Case Study
tags: [Retention]
timeline: "8 weeks"
role: Product Design Lead
team: "BE Engineer, FE Engineer"
impact: "Deprioritized before launch"
bg: mint
fg: black
order: 6
published: true
goal: "Boost player **retention** through a smart notification & live ops system"
businessGoal: "A performance-based sponsorship platform that connects advertisers with high-intent audiences through community-driven play and rewards. Powered by an event-driven revenue model."
---

#### Context

## Background

GrabTap rewards players with points for completing game missions, redeemable as gift cards. But progression inside individual games was the only reason to return. There was no lifecycle layer, no re-engagement system, and no reason to open GrabTap specifically once a game session ended.

---

#### Problem

## No reason to come back

Players completed a few missions during their first session and didn't return. The games had their own retention mechanics, but players needed additional motivation to come back to GrabTap specifically.

Data showed a clear pattern: user acquisition was amplifying the retention problem. Without engagement loops, more users simply meant more churn. A leaky bucket.

---

#### Process

## How I got there

### Mapping the lifecycle

I mapped the player journey and identified key moments where we were losing people: after first session, after completing a mission, after earning enough for a reward but not redeeming.

### Researching patterns

I looked at similar systems in play-to-earn apps and mobile games. The common thread: successful apps don't wait for users to return. They create reasons to come back.

### Designing the retention pillars

I broke down the retention system into three pillars: notifications (push + in-app), lifecycle emails, and live ops events. Each pillar addressed a different drop-off moment in the player journey.

> **The insight:** GrabTap had no communication layer at all. Players earned points, closed the app, and forgot about it. We needed to close the loop between earning and returning.

### Balancing nudges and fatigue

The challenge was finding the line between helpful reminders and annoying spam. I designed trigger logic based on player behavior, not just time intervals.

<details>
<summary>Process: retention strategy and wireframes</summary>

![Retention strategy mapping goals to engagement loops](/work/missing-habit-loop/retention-strategy.png)

![Three retention pillars: notifications, emails, live ops](/work/missing-habit-loop/retention-pillars.png)

![Player lifecycle flow with drop-off points and interventions](/work/missing-habit-loop/lifecycle-flow.png)

![Design solutions overview across notification types](/work/missing-habit-loop/design-solutions.png)

![Games page with notification bell indicator](/work/missing-habit-loop/games-with-bell.png)

![Notification center wireframes](/work/missing-habit-loop/notifications-wireframe.png)

![Weekly email summary design](/work/missing-habit-loop/weekly-email.png)

</details>

---

#### Solution

## What We Designed

### Notification center

In-app hub for all alerts across mobile and web. Missions, rewards, reminders, new games. A central place that made player progress visible and actionable.

![Notification center overlay with mission alerts and reward updates](/work/missing-habit-loop/notifications-overlay.png)

<p class="img-caption">The notification center collected all player-relevant updates in one place, giving players a reason to check back</p>

### Push notifications

Triggered by player progress and milestones, not arbitrary time intervals:

- "Don't quit now! Give [mission] another go"
- "Halfway there! Finish more missions to unlock your reward"
- "New games just dropped"

![Push notification designs for mobile](/work/missing-habit-loop/push-notifications.png)

<p class="img-caption">Push notifications were designed around player behavior triggers, making each message feel relevant rather than spammy</p>

### Dark mode notification view

![Notification center in dark mode](/work/missing-habit-loop/notifications-dark.png)

---

#### Outcome

## Why It Didn't Ship

Our numbers were declining and developer availability was tight. Leadership prioritized other projects that addressed more immediate needs.

I presented a case for continuing this work. My argument: for an app like GrabTap, live ops and continuous communication with users isn't optional. Without it, users move on to other things.

But with limited resources, we had to make tough decisions. The project was deprioritized.

### What would have happened

Had it launched, we anticipated:

- Faster first-game activation
- Habit loop formation through daily nudges
- Rewards and progress feeling tangible and within reach
- Higher long-term retention through momentum and feedback

---

#### Reflection

## What I Learned

- **User acquisition without retention is a leaky bucket.** Data showed this clearly, but competing priorities made it hard to act on.
- **If we had prioritized this MVP earlier, we might have kept a meaningful portion of the users we acquired.** Sometimes the unsexy infrastructure work is the most important work.
- **Making the case isn't always enough.** I believed in this project, advocated for it, and still didn't get it shipped. That's part of working within real constraints.
