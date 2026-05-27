# motion-components documentation

<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://img.shields.io/badge/spring--physics-%23fbbf24?style=flat-square">
    <img alt="Spring physics" src="https://img.shields.io/badge/spring--physics-%23fbbf24?style=flat-square">
  </picture>
  <img alt="Framework-agnostic" src="https://img.shields.io/badge/framework--agnostic-%233b82f6?style=flat-square">
  <img alt="Interruptible" src="https://img.shields.io/badge/interruptible-%238b5cf6?style=flat-square">
  <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-%233178C6?style=flat-square">
  <img alt="MIT" src="https://img.shields.io/badge/license-MIT-%2310b981?style=flat-square">
</p>

<p align="center">
  <strong>Drop-in web components with spring-physics animations.</strong><br>
  Works in React, Vue, Svelte, Astro, Angular, SolidJS, Alpine, or plain HTML.<br>
  Built on <a href="https://motion.dev">Motion</a> & <a href="https://lit.dev">Lit</a>.
</p>

<p align="center">
  <a href="https://motion-components.dev"><strong>Explore the docs →</strong></a>
  ·
  <a href="https://github.com/tgomilar/motion-components"><strong>View on GitHub →</strong></a>
</p>

---

## ✦ Quick start

```bash
npm install motion-components
```

```html
<!-- import once — registers every component globally -->
<script type="module">
  import "motion-components";
</script>

<!-- drop any tag anywhere -->
<motion-hover scale="1.1" y="-6">
  <button>Hover me</button>
</motion-hover>

<motion-reveal>
  <h2>Smooth entrance</h2>
</motion-reveal>
```

[→ Full installation guide & framework setup](https://motion-components.dev/docs/)

---

## ✦ Component catalog

### Reveal — entrance & transition effects

| Component                                                                     | Does                                            |
| ----------------------------------------------------------------------------- | ----------------------------------------------- |
| [`motion-reveal`](https://motion-components.dev/docs/reveal/motion-reveal/)   | Fade + lift entrance on viewport entry          |
| [`motion-stagger`](https://motion-components.dev/docs/reveal/motion-stagger/) | Sequenced children entrance (first/last/center) |
| [`motion-blur`](https://motion-components.dev/docs/reveal/motion-blur/)       | Scroll-driven blur reveal (in/out/both)         |
| [`motion-blur-in`](https://motion-components.dev/docs/reveal/motion-blur-in/) | Viewport-triggered blur-to-clear                |

### Respond — input-driven interactivity

| Component                                                                        | Does                                       |
| -------------------------------------------------------------------------------- | ------------------------------------------ |
| [`motion-hover`](https://motion-components.dev/docs/respond/motion-hover/)       | Spring scale, lift, rotate on hover        |
| [`motion-press`](https://motion-components.dev/docs/respond/motion-press/)       | Tactile spring compression on press        |
| [`motion-magnetic`](https://motion-components.dev/docs/respond/motion-magnetic/) | Element pulled toward cursor, springs back |
| [`motion-tilt`](https://motion-components.dev/docs/respond/motion-tilt/)         | 3D perspective tilt with gloss highlight   |

### Text — typography & character effects

| Component                                                                           | Does                                             |
| ----------------------------------------------------------------------------------- | ------------------------------------------------ |
| [`motion-split`](https://motion-components.dev/docs/text/motion-split/)             | Word/char/line split stagger reveal              |
| [`motion-typewriter`](https://motion-components.dev/docs/text/motion-typewriter/)   | Typewriter typing effect with blinking cursor    |
| [`motion-counter`](https://motion-components.dev/docs/text/motion-counter/)         | Animated number counter (prefix/suffix/decimals) |
| [`motion-scramble`](https://motion-components.dev/docs/text/motion-scramble/)       | Text scramble reveal — scroll or hover trigger   |
| [`motion-ticker`](https://motion-components.dev/docs/text/motion-ticker/)           | Seamless horizontal marquee, pauses on hover     |
| [`motion-words`](https://motion-components.dev/docs/text/motion-words/)             | Rotating word cycler with per-word color         |
| [`motion-headline`](https://motion-components.dev/docs/text/motion-headline/)       | Mask-clip headline reveal (slide or flip)        |
| [`motion-curve`](https://motion-components.dev/docs/text/motion-curve/)             | Sine-wave text along a curve                     |
| [`motion-circle`](https://motion-components.dev/docs/text/motion-circle/)           | Spinning circular text ring                      |
| [`motion-arc`](https://motion-components.dev/docs/text/motion-arc/)                 | Curved arc text (static or spinning)             |
| [`motion-glitch`](https://motion-components.dev/docs/text/motion-glitch/)           | RGB channel split glitch effect                  |
| [`motion-gravity`](https://motion-components.dev/docs/text/motion-gravity/)         | Falling character entrance with spring bounce    |
| [`motion-liquid`](https://motion-components.dev/docs/text/motion-liquid/)           | SVG displacement fluid distortion (no WebGL)     |
| [`motion-perspective`](https://motion-components.dev/docs/text/motion-perspective/) | Vanishing-point perspective text                 |
| [`motion-stretch`](https://motion-components.dev/docs/text/motion-stretch/)         | Elastic letter-spacing on hover                  |
| [`motion-text-mask`](https://motion-components.dev/docs/text/motion-text-mask/)     | Standalone mask-clip reveal primitive            |
| [`motion-font`](https://motion-components.dev/docs/text/motion-font/)               | Variable font axis animation (weight/width/opsz) |

### Scroll — scroll-driven animation

| Component                                                                       | Does                                     |
| ------------------------------------------------------------------------------- | ---------------------------------------- |
| [`motion-parallax`](https://motion-components.dev/docs/scroll/motion-parallax/) | Scroll-linked depth shift, no JS needed  |
| [`motion-scene`](https://motion-components.dev/docs/scroll/motion-scene/)       | Scroll-timeline with pinning & keyframes |

### Components — interactive widgets

| Component                                                                                     | Does                                       |
| --------------------------------------------------------------------------------------------- | ------------------------------------------ |
| [`motion-slider`](https://motion-components.dev/docs/components/motion-slider/)               | Gesture-driven carousel with spring snap   |
| [`motion-gallery`](https://motion-components.dev/docs/components/motion-gallery/)             | CSS grid gallery with FLIP lightbox expand |
| [`motion-dialog`](https://motion-components.dev/docs/components/motion-dialog/)               | Spring-animated modal on native `<dialog>` |
| [`motion-countdown`](https://motion-components.dev/docs/components/motion-countdown/)         | Animated timer — flip or slot-machine roll |
| [`motion-spotlight`](https://motion-components.dev/docs/components/motion-spotlight/)         | Mouse-tracked radial gradient overlay      |
| [`motion-progress`](https://motion-components.dev/docs/components/motion-progress/)           | Spring-eased scroll progress bar           |
| [`motion-image-compare`](https://motion-components.dev/docs/components/motion-image-compare/) | Before/after slider, drag or keyboard      |
| [`motion-flip-card`](https://motion-components.dev/docs/components/motion-flip-card/)         | Two-sided flip card (hover or click)       |

### Code — syntax-highlighted display

| Component                                                                           | Does                                           |
| ----------------------------------------------------------------------------------- | ---------------------------------------------- |
| [`motion-code`](https://motion-components.dev/docs/code/motion-code/)               | Code window with chrome bar & typing animation |
| [`motion-code-inline`](https://motion-components.dev/docs/code/motion-code-inline/) | Inline `<code>` tag with copy button           |

**30+ components and counting.** → [Browse the full docs](https://motion-components.dev/docs/)

---

## ✦ Why motion-components

|                           |                                                                                              |
| ------------------------- | -------------------------------------------------------------------------------------------- |
| **Spring physics**        | Every animation uses spring dynamics — naturally interruptible, no jarring cuts.             |
| **Framework-agnostic**    | Standard web components work in any framework or none. No adapter, no wrappers.              |
| **Composable**            | Nest primitives to build complex interactions — `motion-hover` inside `motion-stagger`, etc. |
| **Zero config**           | Sensible defaults out of the box. Tune with attributes when you need to.                     |
| **Interruptible**         | Interactions never queue or stutter, even mid-animation.                                     |
| **TypeScript**            | Full type declarations with IDE autocomplete for attribute names and values.                 |
| **Accessible**            | Honors `prefers-reduced-motion`. Animations skip cleanly — no flashes, no layout shift.      |
| **Per-component imports** | Standalone subpath exports — import only what you use.                                       |

---

## ✦ Stack

| Tool                                                               | Purpose                      |
| ------------------------------------------------------------------ | ---------------------------- |
| [Astro](https://astro.build)                                       | Static site framework        |
| [motion-components](https://github.com/tgomilar/motion-components) | The library being documented |

## ✦ Development

```bash
npm install
npm run dev       # start dev server at localhost:4321
npm run build     # production build → dist/
npm run preview   # preview the production build
npm run check     # TypeScript + Astro type checking
```

## ✦ Deployment

Automatically deployed to [Vercel](https://vercel.com) on push to `main`.

---

<p align="center">
  <a href="https://motion-components.dev">
    <strong>motion-components docs & showcase</strong>
  </a>
  <br>
  <a href="https://github.com/tgomilar/motion-components">
    <strong>motion-components repo</strong>
  </a>
  <br>
  <sub>MIT · built by <a href="https://github.com/tgomilar">Tanja Gomilar</a></sub>
</p>
