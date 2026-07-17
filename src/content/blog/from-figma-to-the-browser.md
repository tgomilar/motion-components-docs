---
title: "From Figma to the Browser: Shipping a Design's Animation with Motion Components"
description: "How to translate a Figma Smart Animate spec (spring, bounce, duration) directly into working code with motion-components. No eyeballed cubic-beziers in between."
pubDate: 2026-05-18
author: Tanja Gomilar
tags: ["figma", "workflow", "springs"]
draft: true
---

Most animation ends up softer than the Figma prototype it came from. A designer sets up Smart Animate with a nice spring and hands it off. The build ends up with a generic CSS transition, because translating "spring, 60% bounce, 0.4s" into code isn't obvious. This article walks through that translation directly, using [Motion](https://motion.dev/), the animation engine formerly known as Framer Motion, and [`motion-components`](https://github.com/tgomilar/motion-components), a library of drop-in web components built on Motion and Lit. The components expose spring physics as plain HTML attributes.

The example is a pricing card: it lifts on hover, and clicking it opens a plan-detail modal that springs up from the bottom. Small, but it touches the three animation categories designers reach for most: hover response, modal transition, and scroll-in reveal.

## The design in Figma

The card component has two interactions set up in Figma's prototype tab.

**Hover state**: a variant swap that triggers a Smart Animate transition:

- Trigger: While hovering
- Card scales from 100% to 103%, moves up 4px
- Animation: Spring, bounce 30%, duration ~0.3s

**Open plan details**: tapping the card opens an overlay:

- Trigger: On click/tap
- Action: Open overlay, "Slide in from bottom"
- Animation: Spring, bounce 25%, duration ~0.5s
- Overlay background fades in at the same time

These are exactly the parameters Figma exposes in the right-hand panel when you set an interaction's animation type to "Spring": duration and bounce. That is not a coincidence. Figma uses the same spring model that Motion uses under the hood (mass, stiffness, and damping expressed as duration plus bounce). That shared model is what makes the handoff direct instead of approximate.

| Figma setting          | Value  | Motion Components equivalent |
| ---------------------- | ------ | ---------------------------- |
| Trigger: While hovering | —      | `motion-hover`               |
| Scale 100% → 103%      | `1.03` | `scale="1.03"`               |
| Move up 4px            | `-4`   | `y="-4"`                     |
| Spring, bounce 30%     | `0.3`  | `bounce="0.3"`               |
| Duration ~0.3s         | `0.3`  | `duration="0.3"`             |
| Trigger: On click      | —      | `motion-dialog`              |
| Slide in from bottom   | —      | native slide-up entrance     |
| Spring, bounce 25%     | `0.25` | `bounce="0.25"`              |
| Duration ~0.5s         | `0.5`  | `duration="0.5"`             |
| Overlay fade           | —      | built-in backdrop fade       |

That table is the actual deliverable of any Figma-to-code animation handoff. Everything below just implements it.

## 1. Install the library

```sh
npm install motion-components
```

No build step is required. The library also ships as an ES module on a CDN:

```html
<script type="module" src="https://cdn.jsdelivr.net/npm/motion-components/dist/index.js"></script>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/motion-components/dist/preload.css" />
```

The `preload.css` import matters for components that hide content before their animation is ready to run (reveal, stagger, dialog, text effects). It prevents a flash of unstyled, unanimated content while the custom element upgrades. [How that works has its own article](/blog/fixing-the-flash-preload-css/).

## 2. The hover lift: `motion-hover`

`motion-hover` wraps any element and applies spring motion on hover: scale, offset, rotate, or skew, all interruptible mid-animation. The Figma spec (scale to 103%, lift 4px, bounce 30%, duration 0.3s) maps onto its attributes with no interpretation needed:

```html
<motion-hover scale="1.03" y="-4" bounce="0.3" duration="0.3">
  <article class="plan-card">
    <h3>Pro</h3>
    <p class="price">$24/mo</p>
    <p>Everything in Starter, plus priority support and 10 team seats.</p>
  </article>
</motion-hover>
```

That's the whole hover interaction. There are no `mouseenter` or `mouseleave` handlers, and no hand-tuned cubic-bezier standing in for a spring. The component runs a real spring simulation through Motion, so it settles the same way no matter how quickly the user moves the cursor on and off the card.

## 3. The modal: `motion-dialog`

`motion-dialog` is built on the native `<dialog>` element, so it gets top-layer stacking, focus trapping, and `Esc`-to-close for free. A spring-based slide-up entrance is layered on top. The Figma overlay used a bottom slide-in at bounce 25%, duration 0.5s, with the backdrop fading in at the same time. `motion-dialog` does the fade automatically, so only the motion attributes need to be set:

```html
<motion-hover scale="1.03" y="-4" bounce="0.3" duration="0.3">
  <article class="plan-card" id="pro-card">
    <h3>Pro</h3>
    <p class="price">$24/mo</p>
    <button data-open="pro-dialog">View plan</button>
  </article>
</motion-hover>

<motion-dialog id="pro-dialog" duration="0.5" bounce="0.25" light-dismiss>
  <h2>Pro plan</h2>
  <p>Everything in Starter, plus priority support, 10 team seats, and usage analytics.</p>
  <button data-close>Close</button>
</motion-dialog>

<script type="module">
  import 'motion-components'

  const dialog = document.getElementById('pro-dialog')
  document.querySelector('[data-open="pro-dialog"]').addEventListener('click', () => dialog.show())
  dialog.querySelector('[data-close]').addEventListener('click', () => dialog.close())
</script>
```

`light-dismiss` lets a click on the backdrop close the modal. The Figma flow implied this: the overlay reads as sitting in front of the page, and users expect to dismiss it by clicking outside. But that intent never shows up in a Smart Animate spec. It is the one attribute here that came from the designer's intent rather than a literal panel setting.

## 4. Scroll-in reveal for the pricing grid

The Figma file also had the three pricing cards fade and lift into view as the page scrolls to them, staggered slightly so they don't all land at once. That's `motion-stagger`, which animates each child's entrance itself. No extra wrapper is needed:

```html
<motion-stagger interval="0.08">
  <motion-hover scale="1.03" y="-4" bounce="0.3" duration="0.3">
    <article class="plan-card">…Starter…</article>
  </motion-hover>
  <motion-hover scale="1.03" y="-4" bounce="0.3" duration="0.3">
    <article class="plan-card">…Pro…</article>
  </motion-hover>
  <motion-hover scale="1.03" y="-4" bounce="0.3" duration="0.3">
    <article class="plan-card">…Team…</article>
  </motion-hover>
</motion-stagger>
```

`motion-stagger` delays each child's entrance by `interval` seconds, so the cards cascade in left to right instead of popping in together. It is the same effect as offsetting each layer's Smart Animate delay in Figma by a fixed amount.

## 5. Syncing state with events

Every animated component in the library fires lifecycle events: `motion-start`, `motion-finish`, and `motion-cancel`. Dialogs also fire `motion-close`. App state can stay in sync with what is actually on screen instead of guessing at animation timing:

```js
document.getElementById('pro-dialog').addEventListener('motion-close', () => {
  // e.g. clear a "selectedPlan" state value only after the exit animation has actually finished
})
```

This matters more than it looks. A common bug is removing a modal's content, or resetting form state, the instant the close button is clicked. That cuts the spring's exit animation off mid-flight. Listening for `motion-close` means the teardown always happens after the animation has really finished.

## 6. Accessibility comes with the component, not on top of it

Every component here respects `prefers-reduced-motion` automatically. Animations resolve straight to their end state, and the `finished` promise and events still fire normally, so any code that depends on them keeps working. `motion-dialog` also uses the browser's native `showModal()`, so focus trapping and screen reader announcement (`role="dialog"`, `aria-modal`) come from the platform rather than being reimplemented. None of this needs a separate audit pass. It comes with the component instead of being layered on afterward.

## What this workflow actually buys you

The point is not that Figma has a spring value and so does the code. Plenty of animation libraries expose duration and easing. The point is that Figma's spring model and Motion's spring model are the same parameterization. A designer's Smart Animate panel and a developer's component attributes describe the identical curve. There is no unit conversion, no eyeballing a cubic-bezier that looks close enough, and no drift between what was designed and what ships. The handoff table above is the whole spec.

The full working example (pricing grid, hover, modal, and stagger) needs nothing beyond the snippets above, `motion-components` from npm or the CDN, and about 15 lines of markup per card.

**Resources**

- Library: [github.com/tgomilar/motion-components](https://github.com/tgomilar/motion-components)
- Docs & live previews: [motion-components.dev](https://www.motion-components.dev)
- Animation engine: [motion.dev](https://motion.dev)
