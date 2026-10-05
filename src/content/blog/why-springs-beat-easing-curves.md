---
title: Why Springs Beat Easing Curves (and What Bounce Actually Means)
description: Cubic-beziers are drawings; springs are simulations. What that difference means for interruptible UI motion, and how to read the duration and bounce parameters.
pubDate: 2026-06-05T00:00:00.000Z
author: Tanja Gomilar
tags:
  - springs
  - motion-theory
---
> CSS easing curves describe where an animation should be at each point in time.
> Springs simulate how an object moves.
> That difference seems subtle until a user interrupts an animation. Then it becomes impossible to ignore.

Every `motion-*` component in [motion-components](https://github.com/tgomilar/motion-components) uses a spring rather than an easing curve. That is not a stylistic choice. It gives every interaction continuity when the user changes their mind mid-animation. This article explains the difference, why it matters for interruptions, and how to read the two numbers the library asks for: `duration` and `bounce`.

## An easing curve is a drawing

A CSS transition is described by four numbers and a duration:

```css
.card {
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
```

That `cubic-bezier` is a static curve: a drawing of how progress maps to time. At 50% of the duration, the element will be exactly where the curve says, no matter what. The animation has no state beyond elapsed time.

This works fine as long as nothing interferes. The problem is that users change their minds constantly.

## The interruption problem

Imagine a card moving upward when the pointer suddenly leaves.
**A CSS transition effectively says:** ***"Forget everything. Start a new animation from here."***
**A spring says:** ***"I'm already moving upward. I'll use that momentum while heading back."***

The result is the small hitch you have felt on a thousand websites. The element stops dead for a frame, then eases back down as if it had been standing still. Each hitch is small. Together, they are why hover states feel sticky or cheap. Quick, repeated hovers make the problem obvious: the animation keeps restarting instead of flowing.

<figure style="margin: 2rem 0;">
  <svg viewBox="0 0 640 290" role="img" aria-label="Two position over time graphs. Both show a card rising from resting toward lifted when the pointer leaves mid animation. The CSS transition restarts from a standstill, so its curve has a sharp corner. The spring keeps its velocity, so its curve continues up briefly and arcs back down in one smooth motion." style="width: 100%; height: auto; display: block; font-family: var(--font-mono);">
    <defs>
      <marker id="interrupt-arrow" viewBox="0 0 8 8" refX="6" refY="4" markerWidth="7" markerHeight="7" orient="auto">
        <path d="M0,0 L8,4 L0,8 Z" fill="var(--mc-color-muted)" />
      </marker>
    </defs>
    <!-- divider -->
    <line x1="330" y1="24" x2="330" y2="266" stroke="var(--mc-color-border)" stroke-dasharray="4 4" />
    <!-- left panel: CSS transition -->
    <g>
      <text x="30" y="30" font-size="13" fill="var(--mc-color-muted)">CSS transition</text>
      <line x1="30" y1="90" x2="290" y2="90" stroke="var(--mc-color-border)" stroke-dasharray="3 4" />
      <text x="30" y="82" font-size="10" fill="var(--mc-color-muted)">lifted</text>
      <line x1="30" y1="215" x2="290" y2="215" stroke="var(--mc-color-border)" stroke-dasharray="3 4" />
      <text x="30" y="230" font-size="10" fill="var(--mc-color-muted)">resting</text>
      <line x1="145" y1="60" x2="145" y2="235" stroke="var(--mc-color-muted)" stroke-dasharray="3 4" />
      <text x="145" y="52" font-size="10" fill="var(--mc-color-muted)" text-anchor="middle">pointer leaves</text>
      <path d="M 40 215 C 85 215, 120 180, 145 130 L 162 130 C 195 132, 200 215, 250 215" fill="none" stroke="var(--mc-color-accent)" stroke-width="2" />
      <circle cx="40" cy="215" r="3.5" fill="var(--mc-color-accent)" />
      <circle cx="145" cy="130" r="3.5" fill="var(--mc-color-accent)" />
      <text x="153" y="118" font-size="10" fill="var(--mc-color-muted)">stops dead</text>
      <text x="290" y="232" font-size="11" fill="var(--mc-color-muted)" text-anchor="end">time</text>
      <line x1="30" y1="240" x2="284" y2="240" stroke="var(--mc-color-muted)" stroke-width="1" marker-end="url(#interrupt-arrow)" />
      <text x="160" y="272" font-size="12" fill="var(--mc-color-muted)" text-anchor="middle">the restart throws away velocity</text>
    </g>
    <!-- right panel: Spring -->
    <g>
      <text x="360" y="30" font-size="13" fill="var(--mc-color-muted)">Spring</text>
      <line x1="360" y1="90" x2="620" y2="90" stroke="var(--mc-color-border)" stroke-dasharray="3 4" />
      <text x="360" y="82" font-size="10" fill="var(--mc-color-muted)">lifted</text>
      <line x1="360" y1="215" x2="620" y2="215" stroke="var(--mc-color-border)" stroke-dasharray="3 4" />
      <text x="360" y="230" font-size="10" fill="var(--mc-color-muted)">resting</text>
      <line x1="475" y1="60" x2="475" y2="235" stroke="var(--mc-color-muted)" stroke-dasharray="3 4" />
      <text x="475" y="52" font-size="10" fill="var(--mc-color-muted)" text-anchor="middle">pointer leaves</text>
      <path d="M 370 215 C 415 215, 450 180, 475 130 C 490 100, 512 92, 532 140 C 545 175, 558 212, 580 215" fill="none" stroke="var(--mc-color-accent)" stroke-width="2" />
      <circle cx="370" cy="215" r="3.5" fill="var(--mc-color-accent)" />
      <circle cx="475" cy="130" r="3.5" fill="var(--mc-color-accent)" />
      <text x="468" y="112" font-size="10" fill="var(--mc-color-muted)" text-anchor="end">keeps moving</text>
      <text x="620" y="232" font-size="11" fill="var(--mc-color-muted)" text-anchor="end">time</text>
      <line x1="360" y1="240" x2="614" y2="240" stroke="var(--mc-color-muted)" stroke-width="1" marker-end="url(#interrupt-arrow)" />
      <text x="490" y="272" font-size="12" fill="var(--mc-color-muted)" text-anchor="middle">the momentum carries through</text>
    </g>
  </svg>
</figure>

Both cards are partway up when the pointer leaves. The left curve gets a hard corner: the new transition starts from a standstill, so the card stops dead for a frame. The right curve has no corner. The spring keeps its upward velocity, drifts a little higher, then turns around and settles in one motion.

### See it yourself

Two cards, same visual goal. Hover back and forth between them as fast as you can. Watch the status text below each card. The CSS card shows "restarting" on every reversal. It throws away the current motion and starts over. The spring card shows "continuing" because it picks up from where it is.

<style>
  .compare-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 2rem;
    margin: 2rem 0;
  }
  .compare-cell {
    text-align: center;
  }
  .compare-label {
    font-size: 0.85rem;
    margin-bottom: 0.5rem;
    opacity: 0.6;
  }
  .compare-status {
    font-family: var(--font-mono);
    font-size: 0.75rem;
    margin-top: 0.75rem;
    height: 1.2em;
    color: var(--mc-color-muted);
  }
  .compare-status.restarting { color: #e5484d; }
  .compare-status.continuing { color: #30a46c; }
  .compare-card {
    background: var(--mc-color-surface);
    border: 1px solid var(--mc-color-border);
    border-radius: 12px;
    padding: 2rem;
    text-align: center;
    cursor: pointer;
    user-select: none;
  }
  .css-card {
    transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  }
  .css-card:hover {
    transform: scale(1.12) translateY(-8px);
  }
  .compare-grid motion-hover {
    display: block;
  }
</style>

<div class="compare-grid">
  <div class="compare-cell">
    <p class="compare-label">CSS transition</p>
    <div class="compare-card css-card" id="css-demo">
      Hover me, then leave quickly
    </div>
    <p class="compare-status" id="css-status"></p>
  </div>
  <div class="compare-cell">
    <p class="compare-label">Spring (motion-hover)</p>
    <motion-hover scale="1.12" y="-8" bounce="0" duration="0.5">
      <div class="compare-card" id="spring-demo">
        Hover me, then leave quickly
      </div>
    </motion-hover>
    <p class="compare-status" id="spring-status"></p>
  </div>
</div>

<script>
  const cssCard = document.getElementById('css-demo')
  const springCard = document.getElementById('spring-demo')
  const cssStatus = document.getElementById('css-status')
  const springStatus = document.getElementById('spring-status')

  let cssCount = 0
  let springCount = 0

  cssCard.addEventListener('mouseenter', () => {
    cssCount++
    const n = cssCount
    cssStatus.textContent = 'restarting'
    cssStatus.className = 'compare-status restarting'
    setTimeout(() => { if (cssCount === n) cssStatus.textContent = '' }, 500)
  })
  cssCard.addEventListener('mouseleave', () => {
    cssCount++
    const n = cssCount
    cssStatus.textContent = 'restarting'
    cssStatus.className = 'compare-status restarting'
    setTimeout(() => { if (cssCount === n) cssStatus.textContent = '' }, 500)
  })

  springCard.addEventListener('mouseenter', () => {
    springCount++
    const n = springCount
    springStatus.textContent = 'continuing'
    springStatus.className = 'compare-status continuing'
    setTimeout(() => { if (springCount === n) springStatus.textContent = '' }, 500)
  })
  springCard.addEventListener('mouseleave', () => {
    springCount++
    const n = springCount
    springStatus.textContent = 'continuing'
    springStatus.className = 'compare-status continuing'
    setTimeout(() => { if (springCount === n) springStatus.textContent = '' }, 500)
  })
</script>

The CSS card shows "restarting" every time you enter or leave. Each hover change starts a brand-new curve and throws away the current velocity. The spring card shows "continuing" because the simulation retargets from its current state. No restart happens, so there is no hitch.

The animation is slow and the travel is large on purpose. That makes the interruption window wide enough to see the difference clearly. In production you'd use shorter durations. The physics stays the same.

<details>
<summary>Source</summary>

```html
<style>
  .compare-card {
    background: var(--mc-color-surface);
    border: 1px solid var(--mc-color-border);
    border-radius: 12px;
    padding: 2rem;
    text-align: center;
    cursor: pointer;
  }
  .css-card {
    transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  }
  .css-card:hover {
    transform: scale(1.12) translateY(-8px);
  }
  .compare-grid motion-hover {
    display: block;
  }
</style>

<div class="compare-grid">
  <div>
    <p>CSS transition</p>
    <div class="compare-card css-card">Hover me</div>
  </div>
  <div>
    <p>Spring (motion-hover)</p>
    <motion-hover scale="1.12" y="-8" bounce="0" duration="0.5">
      <div class="compare-card">Hover me</div>
    </motion-hover>
  </div>
</div>
```
</details>

## A spring is a simulation

A spring animation does not map time to progress. It simulates a physical system: the element has a position and a velocity. Each frame, the spring applies force toward the target.

At any moment a spring remembers:

- its current position
- its current velocity

When the target changes, it keeps both.

A CSS transition remembers only one thing:

- how much time has elapsed

That is the entire difference.

<figure style="margin: 2rem 0;">
  <svg viewBox="0 0 640 368" role="img" aria-label="Diagram comparing the two models. A CSS transition maps time to progress with a fixed curve from 0% to 100%. A spring runs frame by frame, each frame holding position and velocity. When the target changes, the simulation continues." style="width: 100%; height: auto; display: block; font-family: var(--font-mono);">
    <defs>
      <marker id="spring-sim-arrow" viewBox="0 0 8 8" refX="6" refY="4" markerWidth="7" markerHeight="7" orient="auto">
        <path d="M0,0 L8,4 L0,8 Z" fill="var(--mc-color-muted)" />
      </marker>
    </defs>
    <!-- divider -->
    <line x1="330" y1="24" x2="330" y2="344" stroke="var(--mc-color-border)" stroke-dasharray="4 4" />
    <!-- left panel: CSS transition -->
    <text x="30" y="30" font-size="13" fill="var(--mc-color-muted)">CSS transition</text>
    <path d="M 30 244 C 126 244, 78 124, 270 124" fill="none" stroke="var(--mc-color-accent)" stroke-width="2" />
    <circle cx="30" cy="244" r="3.5" fill="var(--mc-color-accent)" />
    <circle cx="270" cy="124" r="3.5" fill="var(--mc-color-accent)" />
    <text x="270" y="256" font-size="11" fill="var(--mc-color-muted)" text-anchor="end">time</text>
    <line x1="30" y1="264" x2="264" y2="264" stroke="var(--mc-color-muted)" stroke-width="1" marker-end="url(#spring-sim-arrow)" />
    <g stroke="var(--mc-color-muted)" stroke-width="1">
      <line x1="30" y1="264" x2="30" y2="269" />
      <line x1="90" y1="264" x2="90" y2="269" />
      <line x1="150" y1="264" x2="150" y2="269" />
      <line x1="210" y1="264" x2="210" y2="269" />
      <line x1="270" y1="264" x2="270" y2="269" />
    </g>
    <g font-size="11" fill="var(--mc-color-muted)" text-anchor="middle">
      <text x="30" y="286">0%</text>
      <text x="90" y="286">25%</text>
      <text x="150" y="286">50%</text>
      <text x="210" y="286">75%</text>
      <text x="270" y="286">100%</text>
    </g>
    <text x="150" y="320" font-size="12" fill="var(--mc-color-muted)" text-anchor="middle">progress follows a predefined curve</text>
    <!-- right panel: Spring -->
    <text x="390" y="30" font-size="13" fill="var(--mc-color-muted)">Spring</text>
    <g text-anchor="middle">
      <rect x="390" y="50" width="200" height="46" rx="8" fill="var(--mc-color-surface)" stroke="var(--mc-color-border)" />
      <text x="490" y="69" font-size="12" fill="var(--mc-color-text)">frame 1</text>
      <text x="490" y="85" font-size="11" fill="var(--mc-color-muted)">position · velocity</text>
      <line x1="490" y1="100" x2="490" y2="114" stroke="var(--mc-color-muted)" marker-end="url(#spring-sim-arrow)" />
      <rect x="390" y="120" width="200" height="46" rx="8" fill="var(--mc-color-surface)" stroke="var(--mc-color-border)" />
      <text x="490" y="139" font-size="12" fill="var(--mc-color-text)">frame 2</text>
      <text x="490" y="155" font-size="11" fill="var(--mc-color-muted)">position · velocity</text>
      <line x1="490" y1="170" x2="490" y2="184" stroke="var(--mc-color-muted)" marker-end="url(#spring-sim-arrow)" />
      <rect x="390" y="190" width="200" height="46" rx="8" fill="var(--mc-color-surface)" stroke="var(--mc-color-border)" />
      <text x="490" y="209" font-size="12" fill="var(--mc-color-text)">frame 3</text>
      <text x="490" y="225" font-size="11" fill="var(--mc-color-muted)">position · velocity</text>
      <line x1="490" y1="240" x2="490" y2="254" stroke="var(--mc-color-muted)" marker-end="url(#spring-sim-arrow)" />
      <rect x="390" y="260" width="200" height="32" rx="8" fill="var(--mc-color-accent-dim)" stroke="var(--mc-color-accent)" />
      <text x="490" y="280" font-size="12" fill="var(--mc-color-accent)">target changes</text>
      <line x1="490" y1="296" x2="490" y2="310" stroke="var(--mc-color-muted)" marker-end="url(#spring-sim-arrow)" />
      <rect x="390" y="316" width="200" height="32" rx="8" fill="var(--mc-color-surface)" stroke="var(--mc-color-border)" />
      <text x="490" y="336" font-size="12" fill="var(--mc-color-text)">simulation continues</text>
    </g>
  </svg>
</figure>

Now interrupt it. When the cursor leaves mid-flight, the target changes from "lifted" back to "resting". The simulation continues from its current position and velocity. The element slows down, turns around, and settles in one continuous motion. There is no restart, because the simulation never stopped.

This is what `motion-hover` does under the hood via [Motion](https://motion.dev)'s spring generator:

```html
<motion-hover scale="1.05" y="-4" bounce="0.3" duration="0.3">
  <button>Hover me, then leave quickly</button>
</motion-hover>
```

Wiggle the cursor across that button as fast as you can. It never stutters. Every retarget inherits the velocity of the motion already in progress. That property is called interruptibility. It cannot be retrofitted onto a cubic-bezier. It falls out of the physics, or it doesn't exist.

## But springs have three scary parameters, right?

The classic complaint about springs is their native parameterization: mass, stiffness, and damping. Nobody knows what `stiffness: 210, damping: 20` feels like without running it. Spring tuning has historically meant trial and error.

Motion uses a perceptual parameterization instead. motion-components does too. So does Figma's Smart Animate spring:

- **`duration`**: how long the motion takes to visually settle, in seconds. Under the hood, it converts into physical spring constants. It is a hint rather than a hard cutoff. A very bouncy spring keeps oscillating slightly past it. You reason in the same unit you already use everywhere else.
- **`bounce`**: how much the spring overshoots, from `0` to `1`. Bounce does not make the animation faster or slower. It controls how much energy is left when the motion reaches the target. At `0` the spring is critically damped: it approaches the target and stops without ever crossing it. At `1` it is severely underdamped: it overshoots hard and oscillates before settling.

Two numbers, both with intuitive meaning. If you've handed off designs from Figma, you've already used this exact model.

## What bounce values feel like

Rules of thumb, not laws:

| Bounce | Feels like | Use for |
| --- | --- | --- |
| `0` | Precise, mechanical, calm | Layout shifts, panels, anything large |
| `0.15`–`0.3` | Alive but professional | Hover lifts, buttons, cards (most UI) |
| `0.4`–`0.6` | Playful, toy-like | Emphasis moments, empty states, celebrations |
| `0.7`+ | Cartoon physics | Almost nothing, on purpose |

The library's defaults sit in the middle band on purpose. `motion-hover` ships with `bounce="0.3"`. That is where motion registers as physical without calling attention to itself.

### See each bounce in action

Click any square to replay its animation. All four scale up with the same duration. The only difference is bounce.

<style>
  .bounce-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 1.5rem;
    margin: 2rem 0;
  }
  .bounce-demo {
    text-align: center;
  }
  .bounce-demo .label {
    font-size: 0.85rem;
    opacity: 0.6;
    margin-bottom: 0.5rem;
  }
  .bounce-square {
    width: 80px;
    height: 80px;
    margin: 0 auto;
    background: var(--mc-color-surface);
    border: 1px solid var(--mc-color-border);
    border-radius: 12px;
    cursor: pointer;
  }
</style>

<div class="bounce-grid">
  <div class="bounce-demo">
    <p class="label">bounce="0"</p>
    <motion-hover scale="1.3" bounce="0" duration="0.4">
      <div class="bounce-square"></div>
    </motion-hover>
  </div>
  <div class="bounce-demo">
    <p class="label">bounce="0.15"</p>
    <motion-hover scale="1.3" bounce="0.15" duration="0.4">
      <div class="bounce-square"></div>
    </motion-hover>
  </div>
  <div class="bounce-demo">
    <p class="label">bounce="0.4"</p>
    <motion-hover scale="1.3" bounce="0.4" duration="0.4">
      <div class="bounce-square"></div>
    </motion-hover>
  </div>
  <div class="bounce-demo">
    <p class="label">bounce="0.7"</p>
    <motion-hover scale="1.3" bounce="0.7" duration="0.4">
      <div class="bounce-square"></div>
    </motion-hover>
  </div>
</div>

The `0` square stops dead at its target. The `0.15` square has a subtle settle. The `0.4` square overshoots and bounces back once. The `0.7` square overshoots hard and wobbles before settling. That range, from "barely alive" to "clearly playful", is the entire tuning space for most UI.

One caveat: **bounce belongs to transforms.** Overshoot makes sense for position, scale, and rotation, because a physical object can overshoot a location. It makes no sense for opacity. There is no such thing as 108% visible. That is why fade-driven components like `motion-reveal` expose `duration` but keep the fade itself smooth, and reserve the spring character for the movement.

## The part you don't have to do

If you've used springs via a JS animation library, you've written the plumbing: track the running animation, catch the interruption, read out the current velocity, feed it into the next spring. The entire premise of motion-components is that this plumbing lives inside the component. You write:

```html
<motion-hover scale="1.04" y="-6">
  <div class="card">…</div>
</motion-hover>
```

and interruptibility, velocity transfer, and `prefers-reduced-motion` handling (animations resolve straight to their end state when the user asks for reduced motion) are already there.

Once you think of animations as simulations instead of timelines, interruption stops being a special case. Changing the target is just another input to the system. The spring is not a feature you configure. It is the substrate everything is built on.

**Further reading**

- [Motion](https://motion.dev): the spring engine underneath every component
- [motion-hover docs](/docs/respond/motion-hover/): every attribute, with live previews
