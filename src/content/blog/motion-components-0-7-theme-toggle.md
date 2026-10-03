---
title: "motion-components 0.7: A Theme Toggle With a Circular Wipe"
description: Version 0.7 adds motion-theme-toggle, a light, dark and system theme control with a spring icon morph and a circular page wipe. It also upgrades Motion to version 13.
pubDate: 2026-10-02T00:00:00.000Z
author: Tanja Gomilar
tags:
  - release
  - components
---
Version 0.7 of [motion-components](https://github.com/tgomilar/motion-components) adds two new elements: `<motion-theme-toggle>` and `<motion-theme-icon>`. The toggle switches a page between a light theme, a dark theme and the system theme. The new theme appears with a circular wipe that grows from the control. This release also upgrades the animation library underneath, Motion, from version 11 to version 13.

You can see the toggle now: the theme menu in the header of this site is a `<motion-theme-toggle>`.

## Install

```bash
npm install motion-components@latest
```

```html
<script type="module">import 'motion-components/motion-theme-toggle'</script>
<motion-theme-toggle permanent></motion-theme-toggle>
```

The toggle sets two things on the `<html>` element: a `data-theme` attribute and the `color-scheme` CSS property. Your own CSS reads the attribute:

```css
:root[data-theme='light'] { --bg: #fff;    --fg: #111; }
:root[data-theme='dark']  { --bg: #0b0b0f; --fg: #eee; }
```

## Four appearances

The `appearance` attribute chooses how the control looks.

| Appearance | What it shows | Best for |
|---|---|---|
| `icon` (default) | One button with the sun or moon icon | A site header with little space |
| `toggle` | A segmented control with one option for each theme | Settings pages |
| `switch` | A switch with "Light" and "Dark" labels on each side | Forms and preference panels |
| `menu` | A button that opens a drop-down list | A header that also offers "System" |

Add the `system` attribute to offer a third option. When the user chooses "System", the page follows the OS setting, and it changes when the OS setting changes.

## How the wipe works

The wipe uses the View Transitions API. The browser takes a picture of the page before the change. Then the toggle changes the theme, and the browser takes a second picture. The toggle shows the new picture inside a circle and makes the circle grow.

The circle starts at the center of the control. It grows until it covers the farthest corner of the window. Motion drives the circle with its `animateView` function and a spring with no bounce, so the edge does not overshoot.

If the user clicks again during a wipe, the toggle stops the running wipe and starts a new one. Two wipes never run at the same time. Browsers without the View Transitions API change the theme at once, with no error.

## The icon is its own element

The morph between sun and moon lives in `<motion-theme-icon>`. You can use it alone, for example as a status indicator:

```html
<motion-theme-icon mode="dark"></motion-theme-icon>
```

When `mode` changes, the sun rays shrink and turn, and a circle slides in to cut the sun into a crescent moon. For the "System" mode, the icon shows a half filled circle. Every part moves on a spring, so a fast change of mind reverses smoothly from the current position.

## Compatible with dark-mode-toggle

The attributes and events follow `dark-mode-toggle` from Google Chrome Labs. If your page already uses that element, most of your markup works without changes.

| Feature | dark-mode-toggle | motion-theme-toggle |
|---|---|---|
| `mode`, `appearance`, `legend`, `light`, `dark`, `remember`, `permanent` | Yes | Yes |
| `colorschemechange` and `permanentcolorschemechange` events | Yes | Yes |
| Switching stylesheets that use a `prefers-color-scheme` media query | Yes | Yes |
| A third "System" option | No | Yes |
| A drop-down menu appearance | No | Yes |
| A custom target element instead of `<html>` | No | Yes, with `target` |
| Animated icon and circular wipe | No | Yes |

With `permanent`, the toggle saves the choice in localStorage and restores it on the next visit. A toggle that themes `<html>` saves under the key `motion-theme`. A toggle with a different `target` saves under its own key, so a themed card does not change the theme of the whole page.

## Prevent a flash of the wrong theme

Web components start after the browser paints the page for the first time. For a short moment, the page can show the wrong theme. To prevent this, put this small script in the `<head>` of your page. It follows the same rules as the toggle: first the saved choice, then the OS setting.

```html
<script>
  (() => {
    let mode = null
    try { mode = localStorage.getItem('motion-theme') } catch {}
    const os = matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    const scheme = mode === 'light' || mode === 'dark' ? mode : os
    document.documentElement.dataset.theme = scheme
    document.documentElement.style.colorScheme = scheme
  })()
</script>
```

## Accessibility

Every appearance works with the keyboard and with screen readers.

| Appearance | Role for screen readers | Keys |
|---|---|---|
| `icon` and `switch` | A switch with an on and off state | Space or Enter |
| `icon` with `system` | A button that names the current mode | Space or Enter |
| `toggle` | A group of radio buttons with a label | Arrow keys |
| `menu` | A menu button with a list of options | Arrow keys, Home, End, Enter, Escape |

If the user turns on the reduced motion setting of the OS, the theme and the icon change at once. There is no morph and no wipe.

## Motion 13

The library now depends on Motion 13 instead of Motion 11. The attributes and events of the existing components did not change. If your own code also imports `motion`, update it to version 13. Then your bundler includes one copy of Motion instead of two.

## What comes next

Version 0.8 will make the attribute names more consistent across all 40 components. For example, every time value will use seconds. The release notes will list every renamed attribute.

Read the [motion-theme-toggle documentation](/docs/components/motion-theme-toggle/) for every attribute, event and CSS custom property.

