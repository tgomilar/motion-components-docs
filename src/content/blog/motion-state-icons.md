---
title: "State Icons: Menu to Close, Play to Pause, on a Spring"
description: motion-icon-state morphs an icon between two states with spring physics. Eight icons, two ways to switch them, and complete recipes for menu, copy, save, password and accordion buttons.
pubDate: 2026-10-04T10:00:00.000Z
author: Tanja Gomilar
tags:
  - components
  - icons
  - recipes
---

> `motion-state-icon` has since been renamed to `motion-icon-state`. The examples below use the new name. The old name still works until version 2.0.

Many icons show a state. A menu button shows three lines when the menu is closed and a cross when it is open. A play button turns into a pause button. A copy button shows a check after it copies. `<motion-icon-state>`, new in [motion-components](https://github.com/tgomilar/motion-components) 1.1, handles this change for you. The icon morphs from one state to the other on a spring, and it can turn around in the middle of a change.

This article explains how the element works and gives five complete recipes that you can paste into a page.

## Why morph instead of swap

The usual way to show a state is to swap one icon for another. The menu icon disappears and a close icon appears in its place. This works, but the change is sudden, and the user does not see how the two states connect.

A morph moves the parts of one icon into the other. The three lines of the menu icon turn and meet in the middle to form a cross. The user sees one control that changes, not two different controls.

The morph also handles fast clicks. Every change runs on a spring from the current position. If a user clicks again before the change finishes, the icon turns around from where it is. It does not jump to the end first, and it does not wait.

## Try it in one file

Save this as `index.html` and open it in a browser:

```html
<!doctype html>
<html>
  <head>
    <script type="module" src="https://cdn.jsdelivr.net/npm/motion-components@1/dist/motion-icon-state.js/+esm"></script>
  </head>
  <body>
    <motion-icon-state name="heart" toggle label="Like"></motion-icon-state>
    <motion-icon-state name="menu" toggle label="Menu"></motion-icon-state>
    <motion-icon-state name="play" toggle label="Play"></motion-icon-state>
  </body>
</html>
```

Click each icon to switch its state. You can also press Tab to move to an icon and press Space or Enter.

## Eight icons

Set `name` to choose the icon. Set `active` to show the second state.

| `name` | Without `active` | With `active` | Typical use |
|---|---|---|---|
| `menu` | menu | close | Navigation drawer |
| `play` | play | pause | Audio and video players |
| `copy` | copy | check | Copy to clipboard |
| `plus` | plus | minus | Expand and collapse |
| `chevron` | chevron down | chevron up | Accordions and drop-down menus |
| `heart` | empty heart | filled heart | Like and favorite |
| `loading` | spinner | check | Save and submit |
| `eye` | eye | eye with a line through it | Show and hide a password |

All eight icons use a 24 pixel grid and 2 pixel round lines. This is the same style as Lucide, Tabler and Heroicons, so a state icon looks right next to the icons you already use.

## Two ways to switch

### 1. The icon is the button

Add `toggle` and a `label`. The icon becomes a button. It switches itself on a click, or on the Space or Enter key, and it fires a `motion-change` event:

```html
<motion-icon-state id="like" name="heart" toggle label="Like"></motion-icon-state>

<script type="module">
  document.querySelector('#like').addEventListener('motion-change', (event) => {
    console.log(event.detail.active ? 'liked' : 'unliked')
  })
</script>
```

Use this way for small controls that have no text, such as a like icon on a card.

### 2. Your button controls the icon

Leave out `toggle`. Put the icon inside your own `<button>`, and set `active` from your code. Your button handles the click, the keyboard and the accessible name. The icon only shows the state.

Use this way when the button already exists, or when it has text next to the icon. All five recipes below work this way.

## Recipe 1: Menu button

The button tells screen readers whether the menu is open with `aria-expanded`. The icon follows the same value.

```html
<button id="menu-button" aria-label="Menu" aria-expanded="false">
  <motion-icon-state name="menu"></motion-icon-state>
</button>

<script type="module">
  const button = document.querySelector('#menu-button')

  button.addEventListener('click', () => {
    const open = button.getAttribute('aria-expanded') !== 'true'
    button.setAttribute('aria-expanded', open)
    button.querySelector('motion-icon-state').active = open
  })
</script>
```

## Recipe 2: Copy button

The icon shows a check for 1.5 seconds after the copy, then returns to the copy icon.

```html
<button id="copy-button">
  <motion-icon-state name="copy"></motion-icon-state>
  Copy
</button>

<script type="module">
  const button = document.querySelector('#copy-button')
  const icon = button.querySelector('motion-icon-state')

  button.addEventListener('click', async () => {
    await navigator.clipboard.writeText('Text to copy')
    icon.active = true
    setTimeout(() => (icon.active = false), 1500)
  })
</script>
```

## Recipe 3: Save button with a spinner

The `loading` icon spins while it is not active. When you set `active`, the spinner stops and a check draws in. Start with `active` so the button shows a check before the first save.

```html
<button id="save-button">
  <motion-icon-state name="loading" active></motion-icon-state>
  Save
</button>

<script type="module">
  const button = document.querySelector('#save-button')
  const icon = button.querySelector('motion-icon-state')

  button.addEventListener('click', async () => {
    icon.active = false   // spinner
    await new Promise((resolve) => setTimeout(resolve, 1500))   // replace with your save
    icon.active = true    // check
  })
</script>
```

## Recipe 4: Show password

When the password is visible, the icon shows the eye with a line through it. The button label changes too, so a screen reader always says what the next click does.

```html
<input id="password" type="password" value="secret" />
<button id="password-button" aria-label="Show password">
  <motion-icon-state name="eye"></motion-icon-state>
</button>

<script type="module">
  const input = document.querySelector('#password')
  const button = document.querySelector('#password-button')

  button.addEventListener('click', () => {
    const visible = input.type === 'password'
    input.type = visible ? 'text' : 'password'
    button.setAttribute('aria-label', visible ? 'Hide password' : 'Show password')
    button.querySelector('motion-icon-state').active = visible
  })
</script>
```

## Recipe 5: Accordion

The native `<details>` element fires a `toggle` event when it opens or closes. The chevron follows its `open` value. You need no extra button and no extra state.

```html
<details id="faq">
  <summary>
    What is motion-components?
    <motion-icon-state name="chevron"></motion-icon-state>
  </summary>
  Web components with spring-based motion.
</details>

<script type="module">
  const details = document.querySelector('#faq')

  details.addEventListener('toggle', () => {
    details.querySelector('motion-icon-state').active = details.open
  })
</script>
```

## Color, size and feel

| Property | What it changes | Default |
|---|---|---|
| `--mc-icon-color` | The color of the lines | The text color |
| `--mc-icon-color-active` | The icon in its second state, including the filled heart and the checks in `copy` and `loading` | `--mc-icon-color` |
| `--mc-icon-size` | The width and height | `1.5em` |

```html
<motion-icon-state name="heart" active style="--mc-icon-color-active: #f59e0b"></motion-icon-state>
```

Two attributes change how the morph feels:

| Attribute | What it changes | Default |
|---|---|---|
| `duration` | How long the morph takes, in seconds | `0.45` |
| `bounce` | How much the spring overshoots. `0` means no overshoot. | `0.3` |

A higher `bounce` feels more playful. A lower `bounce` feels calmer. For a menu button in a serious interface, try `bounce="0.1"`.

## React and Vue

React 19 sets `active` as a property, so you can pass a boolean from state:

```jsx
import { useState } from 'react'
import 'motion-components/motion-icon-state'

export function LikeButton() {
  const [liked, setLiked] = useState(false)

  return (
    <button aria-pressed={liked} onClick={() => setLiked(!liked)}>
      <motion-icon-state name="heart" active={liked}></motion-icon-state>
      Like
    </button>
  )
}
```

In Vue, bind `:active` after you tell the compiler that `motion-*` tags are custom elements. The [framework setup guide](/docs/#frameworks) shows the configuration.

```vue
<button :aria-pressed="liked" @click="liked = !liked">
  <motion-icon-state name="heart" :active="liked"></motion-icon-state>
  Like
</button>
```

## Accessibility

| Setup | What a screen reader gets | What you add |
|---|---|---|
| With `toggle` | A button with `aria-pressed` | A `label` |
| Inside your own button | Nothing from the icon. It is decorative. | A name on the button: its text or `aria-label` |
| Alone, without `toggle` | Nothing. It is decorative. | A `label` if the icon carries meaning |

When a user turns on reduced motion in their system settings, the icon changes state at once with no morph. The loading spinner stands still.

## Next steps

Read the [motion-icon-state docs](/docs/icons/motion-icon-state/) for live versions of every recipe in this article. For icons that do not show a state, such as a bell that wiggles or a heart that draws itself in, read [motion-components 1.1: Animate Any SVG Icon With One HTML Tag](/blog/motion-icons/).
