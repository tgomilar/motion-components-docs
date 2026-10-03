---
title: "Fixing the Flash: Why Animated Components Need preload.css"
description: "Custom elements upgrade after your JavaScript loads, and entrance animations flash their finished state in the gap. How :defined and one small stylesheet fix it."
pubDate: 2026-07-12
author: Tanja Gomilar
tags: ["performance", "web-components"]
---

There is a failure mode specific to animated web components, and if you've used any custom-element library you have probably seen it. The page loads, your headline is fully visible for a split second, then it vanishes, then it plays its entrance animation. The animation itself is fine. The flash before it ruins the effect.

This article explains where that flash comes from, and what the `preload.css` file that ships with [motion-components](https://github.com/tgomilar/motion-components) actually does about it. The file is about 25 lines of CSS, but it encodes design decisions worth understanding rather than copying blindly.

## Where the flash comes from

A custom element like `<motion-reveal>` is just an unknown tag until JavaScript registers it. The browser's HTML parser doesn't wait: it builds the DOM, renders the children (your headline, styled and visible), and moves on. Registration happens later, whenever your module loads and `customElements.define()` runs. At that moment the element **upgrades**: its class attaches, and the entrance animation finally sets its starting state (`opacity: 0`, offset down 24px) before springing to the end state.

So the timeline on a cold cache is:

1. HTML is parsed. The headline renders, **fully visible** (wrong).
2. The JS module arrives and runs. The component upgrades.
3. The animation sets its "from" state. The headline **snaps invisible**.
4. The spring runs. The headline animates in (finally right).

Steps 1–3 are the flash. It is a cousin of FOUC: a flash of *un-animated* content. It gets worse exactly when you can least afford it: on slow networks, with `type="module"` scripts (deferred by default), and with CDN-loaded bundles.

## The fix is a pseudo-class

CSS can target the not-yet-upgraded window directly. [`:defined`](https://developer.mozilla.org/en-US/docs/Web/CSS/:defined) matches custom elements that have been registered, so `:not(:defined)` matches the gap between parse and upgrade. The fix needs no JavaScript. That is the whole point, because the problem is exactly that JavaScript isn't there yet.

`preload.css` applies the entrance components' hidden state in CSS, before their code exists:

```css
motion-reveal:not(:defined),
motion-headline:not(:defined),
motion-split:not(:defined),
motion-typewriter:not(:defined),
motion-counter:not(:defined) /* …and the other entrance/text components */ {
  opacity: 0;
}
```

Now the headline renders already invisible, the component upgrades, and the spring animates it in. The "from" state was never wrong, so there is nothing to flash.

## The three shapes of hiding

The interesting part of the file is that not every component is treated the same way, because they own different things.

**Components that animate themselves** get `opacity: 0` on the host element. That is the list above.

**Components that animate their children** hide the children instead:

```css
motion-stagger:not(:defined) > *,
motion-gallery:not(:defined) > * {
  opacity: 0;
}
```

`motion-stagger` doesn't fade in as a container; each child enters on its own. Hiding the wrapper would work visually, but hiding the children matches what the upgraded component will actually take over, so ownership transfers cleanly.

**`motion-dialog` disappears entirely:**

```css
motion-dialog:not(:defined) {
  display: none;
}
```

A dialog's content shouldn't just be transparent before upgrade. It shouldn't be in the layout at all. Otherwise the page height would jump when the component upgrades and moves its content into the native `<dialog>`.

Equally deliberate is what's *not* in the file: `motion-hover`, `motion-press`, `motion-tilt`, and the other **respond**-category wrappers. They don't animate an entrance. Before upgrade they are just inert wrappers around content that should be visible. Hiding them would cause the opposite bug: content that flashes invisible for no reason.

The text-layout components (`motion-curve`, `motion-liquid`, `motion-gravity`, and their siblings) are absent for a different reason. They never had a wrong state to flash: they used to take their text as an attribute, so before upgrade they were simply empty. Since v0.4.0 they also accept the text as child content. The browser shows that child text before the element is defined, so the pre-upgrade state is real, readable text instead of a gap. No CSS is needed, because the fallback is the content itself.

## Wiring it up

The one rule: the CSS must be there **before first paint**. That means the `<head>`, not a JS-imported stylesheet that arrives with your bundle. A late stylesheet would recreate the exact race it is meant to fix.

Via CDN:

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/motion-components/dist/preload.css" />
<script type="module" src="https://cdn.jsdelivr.net/npm/motion-components@1/+esm"></script>
```

Bundlers can import the same rules as a string and inline them, which saves a round trip. This site does that in its own layout:

```js
import { preloadCSS } from 'motion-components/preload'
// render `preloadCSS` into an inline <style> tag in the document head
```

## The honest tradeoff

Hiding content until JavaScript arrives means that if the JavaScript never arrives (blocked script, extension, broken deploy), the hidden content stays hidden. That is the standard bargain of entrance animation on the web, not something unique to this library. But you should make the bargain consciously. Two mitigations worth knowing:

- A `<noscript>` override restores everything for users with JS disabled outright:

  ```html
  <noscript><style>:not(:defined), :not(:defined) > * { opacity: 1 !important; }</style></noscript>
  ```

  With JavaScript off, the elements never upgrade, so `:not(:defined)` keeps matching forever. The override flips everything preload.css hid (hosts and children both) back to visible. `motion-dialog` stays `display: none`, which is right: a dialog can't open without JavaScript anyway.

- Scope your exposure. Only above-the-fold entrance components risk a visible flash window. Content revealed on scroll, like a `motion-reveal` far down the page, upgrades long before the user reaches it.

The flip side of the bargain: because the hidden state is plain CSS keyed to upgrade timing, the fix costs zero JavaScript, causes zero layout shift, and works identically with SSR, static HTML, or any framework.

**Related**

- [motion-reveal](/docs/reveal/motion-reveal/) · [motion-stagger](/docs/reveal/motion-stagger/) · [motion-dialog](/docs/components/motion-dialog/): the components doing the hiding
- [Recipe: An Animated Hero Section](/blog/animated-hero-section-recipe/): where getting this wrong is most visible
