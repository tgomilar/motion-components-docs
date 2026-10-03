---
title: "Recipe: An Animated Hero Section in 20 Lines of HTML"
description: "A landing-page hero with a word-by-word headline reveal, fading subcopy, and staggered call-to-action buttons. No JavaScript beyond one import."
pubDate: 2026-06-24
author: Tanja Gomilar
tags: ["recipes", "reveal", "text"]
---

The hero is the most animated section of almost every landing page, and the pattern barely varies: the headline reveals itself, the supporting copy fades in just after, and the call-to-action buttons arrive last with a little life on hover. This recipe builds exactly that with [motion-components](https://github.com/tgomilar/motion-components). The entire animation layer is HTML attributes.

Here's the finished markup. Everything else in this article is explanation:

```html
<section class="hero">
  <motion-headline by="words" interval="0.06" duration="1">
    <h1>Ship motion your users can feel</h1>
  </motion-headline>

  <motion-reveal y="24" duration="0.6">
    <p>Physics-based web components for any framework.
       No easing curves to tune, no wrapper divs to manage.</p>
  </motion-reveal>

  <motion-stagger interval="0.08" y="16">
    <motion-hover scale="1.04" y="-2">
      <a class="button primary" href="/docs/">Get started</a>
    </motion-hover>
    <motion-hover scale="1.04" y="-2">
      <a class="button" href="https://github.com/tgomilar/motion-components">GitHub</a>
    </motion-hover>
  </motion-stagger>
</section>
```

## Setup

One import, npm or CDN:

```html
<script type="module" src="https://cdn.jsdelivr.net/npm/motion-components@1/+esm"></script>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/motion-components/dist/preload.css" />
```

The stylesheet stops the headline and buttons from flashing fully visible before their entrance animation is ready. [That mechanism gets its own article](/blog/fixing-the-flash-preload-css/). If you bundle instead, run `npm install motion-components` and `import 'motion-components'`.

## The headline: `motion-headline`

```html
<motion-headline by="words" interval="0.06" duration="1">
  <h1>Ship motion your users can feel</h1>
</motion-headline>
```

`motion-headline` wraps each word in an overflow-hidden mask and springs it up into view. It is the reveal style you've seen on every high-end agency site, without the agency. Three attributes carry the whole effect:

- **`by="words"`**: the unit of animation. `"chars"` gives a finer cascade, and `"lines"` reads calmer and more editorial. Words is the safe default for heroes: readable at a glance, animated enough to notice.
- **`interval="0.06"`**: seconds between each word starting. This knob controls perceived speed more than `duration` does. At `0.03` the headline pours in; at `0.12` it becomes deliberate.
- **`duration="1"`**: the spring duration hint for each word's individual rise.

The `<h1>` stays a real `<h1>`. The component masks and animates it without changing document semantics, and screen readers get the full text through `aria-label` rather than a soup of `<span>` fragments.

If the slide-up mask is too subtle for your brand, `variant="flip"` swaps it for a 3D card-flip per word. Use it sparingly.

## The subcopy: `motion-reveal`

```html
<motion-reveal y="24" duration="0.6">
  <p>Physics-based web components for any framework. …</p>
</motion-reveal>
```

`motion-reveal` is the workhorse entrance: it fades in while lifting from `y` pixels below, when the element enters the viewport. It is built on IntersectionObserver, so the same tag works for content far down the page. In a hero it simply fires right away. The defaults are already `y="24"` and `duration="0.6"`; they are written out here so the knobs are visible.

The headline takes about a second to finish. The reveal starts at the same time but resolves faster, so the eye reads them as a sequence without any explicit delay coordination. That is a general principle worth stealing: **overlapping animations with different durations read as choreography; sequential animations with gaps read as loading.**

## The buttons: `motion-stagger` + `motion-hover`

```html
<motion-stagger interval="0.08" y="16">
  <motion-hover scale="1.04" y="-2">…</motion-hover>
  <motion-hover scale="1.04" y="-2">…</motion-hover>
</motion-stagger>
```

Two components composed, one responsibility each:

- **`motion-stagger`** handles the *entrance*: each direct child fades and lifts in, `interval` seconds apart. With two buttons the 0.08s offset is barely conscious, which is the point. It also takes `from="last"` or `from="center"` to change where the cascade starts. With a row of feature cards, `from="center"` is a nice trick.
- **`motion-hover`** handles the *response*: a spring to `scale: 1.04`, lifted 2px, fully interruptible mid-flight ([why that matters](/blog/why-springs-beat-easing-curves/)).

Composition over configuration is the library's core pattern. There is no `stagger-children-and-also-hover` component. You nest the two primitives, and because each animates its own transform, they never fight.

## Taste adjustments

The recipe as written is deliberately restrained. Depending on the product's personality:

- **Calmer:** use `by="lines"` on the headline, drop the stagger, and let the buttons simply appear with the reveal.
- **Bouncier:** add `bounce="0.4"` to the `motion-hover` wrappers. Read the [bounce guide](/blog/why-springs-beat-easing-curves/) before going higher.
- **Terminal-flavored:** replace `motion-headline` with `motion-typewriter` for character-by-character typing with a blinking cursor. Different genre, same drop-in usage.

## Accessibility, included

Every component here respects `prefers-reduced-motion` at the animation layer. Users who ask for reduced motion get the hero's final state immediately: a real `<h1>` and visible buttons, with no work on your part. The animation is an enhancement layered over markup that was already correct.

**Related**

- [motion-headline docs](/docs/text/motion-headline/) · [motion-reveal docs](/docs/reveal/motion-reveal/) · [motion-stagger docs](/docs/reveal/motion-stagger/) · [motion-hover docs](/docs/respond/motion-hover/)
