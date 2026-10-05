---
title: "motion-components 1.1: Animate Any SVG Icon With One HTML Tag"
description: motion-icon draws in, pops, bounces, rotates, wiggles or pulses any SVG icon from Lucide, Tabler, Heroicons, Material Symbols, Font Awesome and more. motion-state-icon morphs between two states on a spring.
pubDate: 2026-10-03T00:00:00.000Z
author: Tanja Gomilar
tags:
  - release
  - components
  - icons
---
Version 1.1 of [motion-components](https://github.com/tgomilar/motion-components) adds a new category: Icons. It has two elements. `<motion-icon>` animates any SVG icon you already use. `<motion-state-icon>` morphs between two states, such as menu and close, or play and pause. Both use spring physics, and both can be interrupted at any moment.

You can try them now on the [home page](/). Click any icon in the icon grid to see a preview and copy its code.

## One line per icon

This is a complete page. Save it as `index.html` and open it in a browser. You do not need to install anything or run a build step.

```html
<!doctype html>
<html>
  <head>
    <script type="module" src="https://cdn.jsdelivr.net/npm/motion-components@1/dist/motion-icon.js/+esm"></script>
  </head>
  <body>
    <motion-icon src="https://cdn.jsdelivr.net/npm/lucide-static@1/icons/heart.svg"></motion-icon>
    <motion-icon src="https://cdn.jsdelivr.net/npm/lucide-static@1/icons/bell.svg" animation="wiggle"></motion-icon>
  </body>
</html>
```

Hover the heart and its outline draws in, line by line. Hover the bell and it wiggles.

## Four ways to add an icon

| Way | Use it when | Example |
|---|---|---|
| `src` with a CDN URL | You want one line of HTML and no files to manage. | `<motion-icon src="https://cdn.jsdelivr.net/…/heart.svg">` |
| `src` with your own folder | You keep your icons as files in your site, or you drew your own. | `<motion-icon src="icons/heart.svg">` |
| Inline SVG | You copied the SVG from an icon website. | `<motion-icon><svg>…</svg></motion-icon>` |
| `icon` | You use a bundler and want the icon inside your bundle. | `el.icon = Heart` |

The `src` attribute loads each URL once. If ten icons use the same URL, the browser downloads it one time. If the URL fails, the element fires an `error` event.

### Icons from your own folder

`src` also takes a path to a file in your site. Put the SVG files in a folder, for example `icons/`:

```text
my-site/
├── index.html
└── icons/
    ├── heart.svg
    └── logo.svg
```

```html
<motion-icon src="icons/heart.svg"></motion-icon>
<motion-icon src="icons/logo.svg" animation="draw"></motion-icon>
```

This works for icons from any set and for icons you drew yourself. A stroke icon can use `draw`, like every other icon.

A path without a leading slash, such as `icons/heart.svg`, is relative to the page. For pages in subfolders, write `/icons/heart.svg`, so the path always starts at the root of your site.

### Inline SVG

Inline SVG works well when you want the icon in your HTML with no extra request:

```html
<motion-icon animation="pulse" style="--mc-icon-color: #e11d48">
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M20 6 9 17l-5-5" />
  </svg>
</motion-icon>
```

### From an npm package

With a bundler such as Vite, import the icon as a string. `lucide-static` exports every icon by name, so only the icons you import end up in your bundle:

```js
import 'motion-components/motion-icon'
import { Heart } from 'lucide-static'

document.querySelector('#like-icon').icon = Heart
```

Vite can also import any SVG file as a string with the `?raw` suffix. This works for every icon package that ships SVG files:

```js
import heart from '@tabler/icons/outline/heart.svg?raw'
```

## Works with the icon library you already use

Every library in this table publishes its icons as SVG files on the jsDelivr CDN. Find an icon on the library's website and put its name at the end of the URL.

| Library | URL after `https://cdn.jsdelivr.net/npm/` | `draw` |
|---|---|---|
| Lucide | `lucide-static@1/icons/{name}.svg` | Yes |
| Tabler | `@tabler/icons@3/icons/outline/{name}.svg` | Yes |
| Heroicons | `heroicons@2/24/outline/{name}.svg` | Yes |
| Iconoir | `iconoir@7/icons/regular/{name}.svg` | Yes |
| Feather | `feather-icons@4/dist/icons/{name}.svg` | Yes |
| Phosphor | `@phosphor-icons/core@2/assets/regular/{name}.svg` | Pops instead |
| Bootstrap Icons | `bootstrap-icons@1/icons/{name}.svg` | Pops instead |
| Material Symbols | `@material-symbols/svg-400@0/outlined/{name}.svg` | Pops instead |
| Font Awesome Free | `@fortawesome/fontawesome-free@7/svgs/regular/{name}.svg` | Pops instead |
| Simple Icons | `simple-icons@15/icons/{name}.svg` | Pops instead |

The `draw` animation traces the lines of an icon, so it needs an outline icon. Filled icons have no lines to trace. For those, `draw` changes to `pop` by itself, so nothing breaks.

Some icon sets do not set a color in their SVG files. Material Symbols and Simple Icons are two examples. A plain `<img>` shows those icons in black. `motion-icon` gives them the current text color, the same as every other icon.

## Six animations, five triggers

`animation` decides how the icon moves:

| Animation | What it does |
|---|---|
| `draw` | Draws the lines in, one after another. This is the default. |
| `pop` | Scales up from small on a spring. |
| `bounce` | Drops in from above and bounces. |
| `rotate` | Turns half a circle and settles. |
| `wiggle` | Shakes from side to side, like a ringing bell. |
| `pulse` | Grows and shrinks once, like a heartbeat. |

`trigger` decides when it moves:

| Trigger | When the animation runs |
|---|---|
| `hover` | When the pointer enters the icon. This is the default. |
| `click` | When the icon is clicked. |
| `view` | When the icon scrolls into view. |
| `mount` | When the page loads. |
| `loop` | Again and again, with a pause set by `interval`. |

```html
<motion-icon src="https://cdn.jsdelivr.net/npm/lucide-static@1/icons/rocket.svg" trigger="view"></motion-icon>
<motion-icon src="https://cdn.jsdelivr.net/npm/lucide-static@1/icons/bell.svg" trigger="loop" animation="wiggle" interval="1"></motion-icon>
```

## Icons inside buttons

Most icons on a website sit inside a button or a link. So when `motion-icon` is inside a `<button>` or an `<a>`, it listens to that button or link. The icon animates when the pointer enters any part of the button, including the padding and the text.

```html
<button>
  <motion-icon src="https://cdn.jsdelivr.net/npm/lucide-static@1/icons/send.svg" animation="bounce"></motion-icon>
  Send
</button>
```

The "Read the docs" and "Star on GitHub" buttons at the bottom of the home page work this way.

## Color, fill and background

Three CSS custom properties control how an icon looks:

| Property | What it changes | Default |
|---|---|---|
| `--mc-icon-color` | The color of the lines | The text color |
| `--mc-icon-fill` | The color inside an outline icon | No fill |
| `--mc-icon-size` | The width and height | `1.5em` |

`--mc-icon-fill` turns an outline icon into a filled one. Add `33` to the end of a hex color for a light tint at 20% opacity. With `draw`, the fill fades in as the lines finish.

```html
<!-- tinted fill -->
<motion-icon
  src="https://cdn.jsdelivr.net/npm/lucide-static@1/icons/star.svg"
  style="--mc-icon-color: #f59e0b; --mc-icon-fill: #f59e0b33"
></motion-icon>

<!-- white icon on a colored background -->
<motion-icon
  src="https://cdn.jsdelivr.net/npm/lucide-static@1/icons/rocket.svg"
  animation="bounce"
  style="--mc-icon-color: #fff; background: #6366f1; padding: 0.6rem; border-radius: 14px"
></motion-icon>
```

## Icons with two states

`<motion-state-icon>` is for icons that show a state. Set `name` to choose the icon. Set `active` to show the second state.

| `name` | Without `active` | With `active` |
|---|---|---|
| `menu` | menu | close |
| `play` | play | pause |
| `copy` | copy | check |
| `plus` | plus | minus |
| `chevron` | chevron down | chevron up |
| `heart` | empty heart | filled heart |
| `loading` | spinner | check |
| `eye` | eye | eye with a line through it |

There are two ways to switch the state. In the first way, the icon is the button. Add `toggle` and a `label`. The icon then switches itself on a click, or on the Space or Enter key:

```html
<motion-state-icon name="heart" toggle label="Like"></motion-state-icon>
```

In the second way, your own button controls the icon. This menu button changes to a close icon when it opens:

```html
<button id="menu-button" aria-label="Menu" aria-expanded="false">
  <motion-state-icon name="menu"></motion-state-icon>
</button>

<script type="module">
  const button = document.querySelector('#menu-button')

  button.addEventListener('click', () => {
    const open = button.getAttribute('aria-expanded') !== 'true'
    button.setAttribute('aria-expanded', open)
    button.querySelector('motion-state-icon').active = open
  })
</script>
```

The state changes on a spring. If you click again in the middle of a change, the icon turns around from where it is. It does not jump to the end first.

[State Icons: Menu to Close, Play to Pause, on a Spring](/blog/motion-state-icons/) explains this element in detail. It has complete recipes for a copy button, a save button with a spinner, a show password button and an accordion.

## React and Vue

Both elements work in every framework. React 19 passes properties to custom elements directly, so `active` takes a boolean from state:

```jsx
import { useState } from 'react'
import 'motion-components/motion-state-icon'

export function LikeButton() {
  const [liked, setLiked] = useState(false)

  return (
    <button aria-pressed={liked} onClick={() => setLiked(!liked)}>
      <motion-state-icon name="heart" active={liked}></motion-state-icon>
      Like
    </button>
  )
}
```

You can also wrap the icon component from your icon library. Any component that renders an `<svg>` works inside `<motion-icon>`:

```jsx
import 'motion-components/motion-icon'
import { Heart } from 'lucide-react'

<motion-icon animation="pop">
  <Heart />
</motion-icon>
```

In Vue, tell the compiler that `motion-*` tags are custom elements. The [framework setup guide](/docs/#frameworks) shows the configuration.

## Safe by default

An SVG file can contain more than drawing instructions. It can contain scripts, links and references to other files. Before `motion-icon` shows an icon from `src` or `icon`, it keeps only the drawing elements, such as `<path>`, `<circle>` and gradients. It removes everything else: scripts, styles, images, links, event handlers and references to other files.

## Accessibility

| Element | Default | How to give it a name |
|---|---|---|
| `motion-icon` | Decorative and hidden from screen readers | Add `label`. The icon then gets `role="img"`. |
| `motion-state-icon` with `toggle` | A button with `aria-pressed` | Add `label`. |
| `motion-state-icon` without `toggle` | Decorative | Give the surrounding button a name. |

When a user turns on reduced motion in their system settings, both elements skip the animation. They show the final state at once, and the loading spinner stands still.

## Get started

```bash
npm install motion-components@latest
```

```js
import 'motion-components/motion-icon'
import 'motion-components/motion-state-icon'
```

Read the [motion-icon docs](/docs/icons/motion-icon/) and the [motion-state-icon docs](/docs/icons/motion-state-icon/). Every code example on those pages works when you paste it into a page.
