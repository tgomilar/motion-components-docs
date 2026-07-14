---
title: "Why Springs Beat Easing Curves (and What Bounce Actually Means)"
description: "Cubic-beziers are drawings; springs are simulations. What that difference means for interruptible UI motion, and how to read the duration and bounce parameters."
pubDate: 2026-06-05
tags: ["springs", "motion-theory"]
---

Every `motion-*` component in [motion-components](https://github.com/tgomilar/motion-components) animates with a spring. That is a structural decision, not a stylistic flourish. This article explains what a spring actually is compared to an easing curve, why the difference shows up the moment a user interrupts an animation, and how to read the two numbers the library asks for: `duration` and `bounce`.

## An easing curve is a drawing

A CSS transition is fully described by four numbers and a duration:

```css
.card {
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
```

That `cubic-bezier` is a static curve: a drawing of how progress maps to time. At 50% of the duration, the element will be exactly where the curve says, no matter what. The animation has no state beyond elapsed time.

This works fine as long as nothing interferes. The problem is that users interfere constantly.

## The interruption problem

Hover over a card with a 0.3s transition, then move the cursor away at 0.15s. The element is halfway up and still moving upward. Now it has to reverse. A CSS transition handles this by starting a brand-new curve from the current position. The current velocity is discarded, because a bezier curve has nowhere to put it.

The result is the small hitch you've felt on a thousand websites: the element stops dead for a frame, then eases back down as if it had been standing still. Each hitch is subtle on its own. Together, they are why hover states feel sticky or cheap. Quick, repeated hovers make it obvious: the animation keeps restarting instead of flowing.

## A spring is a simulation

A spring animation doesn't map time to progress. It simulates a physical system: the element has a position and a velocity, and on every frame the spring applies force toward the target. That means the animation has state.

Now interrupt it. When the cursor leaves mid-flight, the target changes from "lifted" back to "resting". The simulation just continues from its current position and its current velocity. The element slows down, turns around, and settles in one continuous motion. There is no restart, because the simulation never stopped.

This is what `motion-hover` does under the hood via [Motion](https://motion.dev)'s spring generator:

```html
<motion-hover scale="1.05" y="-4" bounce="0.3" duration="0.3">
  <button>Hover me, then leave quickly</button>
</motion-hover>
```

Wiggle the cursor across that button as fast as you can. It never stutters, because every retarget inherits the velocity of the motion already in progress. That property is called interruptibility. It cannot be retrofitted onto a cubic-bezier. It falls out of the physics, or it doesn't exist.

## But springs have three scary parameters, right?

The classic complaint about springs is their native parameterization: mass, stiffness, damping. Nobody knows what `stiffness: 210, damping: 20` feels like without running it, so spring tuning historically meant trial and error.

Motion uses a perceptual parameterization instead. So do motion-components and, not by coincidence, Figma's Smart Animate spring:

- **`duration`**: roughly how long the motion takes to visually settle, in seconds. Under the hood it converts into physical spring constants, so it is a hint rather than a hard cutoff. A very bouncy spring keeps oscillating slightly past it. The benefit is that you reason in the same unit you already use everywhere else.
- **`bounce`**: how much the spring overshoots, from `0` to `1`. At `0` the spring is critically damped: it approaches the target and stops without ever crossing it. At `1` it is severely underdamped: it overshoots hard and oscillates before settling.

Two numbers, both with intuitive meaning. If you've handed off designs from Figma, you've already used this exact model. That mapping is the subject of [the Figma handoff article](/blog/from-figma-to-the-browser/).

## What bounce values actually feel like

Rules of thumb, not laws:

| Bounce | Feels like | Use for |
| ------ | ---------- | ------- |
| `0` | Precise, mechanical, calm | Layout shifts, panels, anything large |
| `0.15`–`0.3` | Alive but professional | Hover lifts, buttons, cards (most UI) |
| `0.4`–`0.6` | Playful, toy-like | Emphasis moments, empty states, celebrations |
| `0.7`+ | Cartoon physics | Almost nothing, on purpose |

The library's defaults sit in the middle band on purpose. `motion-hover` ships with `bounce="0.3"`, because that is where motion registers as physical without calling attention to itself.

One caveat worth internalizing: **bounce belongs to transforms.** Overshoot makes sense for position, scale, and rotation, because a physical object can overshoot a location. It makes no sense for opacity. There is no such thing as 108% visible. That is why fade-driven components like `motion-reveal` expose `duration` but keep the fade itself smooth, and reserve the spring character for the movement.

## The part you don't have to do

If you've used springs via a JS animation library, you've written the plumbing: track the running animation, catch the interruption, read out the current velocity, feed it into the next spring. The entire premise of motion-components is that this plumbing lives inside the component. You write:

```html
<motion-hover scale="1.04" y="-6">
  <div class="card">…</div>
</motion-hover>
```

and interruptibility, velocity transfer, and `prefers-reduced-motion` handling (animations resolve straight to their end state when the user asks for reduced motion) are already there. The spring is not a feature you configure. It is the substrate everything is built on.

**Further reading**

- [Motion's spring documentation](https://motion.dev): the engine underneath every component
- [From Figma to the Browser](/blog/from-figma-to-the-browser/): shipping a designer's spring values verbatim
- [motion-hover docs](/docs/respond/motion-hover/): every attribute, with live previews
