---
title: "Charts That Move: Bar, Line, Pie and Sparkline Charts in HTML"
description: motion-chart, motion-pie and motion-sparkline draw charts from an HTML attribute or a table. Bars grow, lines draw in, pies sweep in, and every change in the data springs into place.
pubDate: 2026-10-04T12:00:00.000Z
author: Tanja Gomilar
tags:
  - release
  - components
  - charts
---
Version 1.1 of [motion-components](https://github.com/tgomilar/motion-components) adds a second new category next to Icons: Charts. It has three elements. `<motion-chart>` draws bar and line charts. `<motion-pie>` draws pie and donut charts. `<motion-sparkline>` draws a small trend line that fits inside a sentence.

All three follow one idea: **the data is HTML, and every change in the data is a spring.** You do not call a draw function. You write the numbers into an attribute, and when the numbers change, the chart moves to them.

## A chart in one line

This is a complete page. Save it as `index.html` and open it in a browser.

```html
<!doctype html>
<html>
  <head>
    <script type="module" src="https://cdn.jsdelivr.net/npm/motion-components@1/+esm"></script>
  </head>
  <body>
    <motion-chart
      values="12, 19, 8, 24, 16"
      labels="Mon, Tue, Wed, Thu, Fri"
      label="Orders per day"
    ></motion-chart>
  </body>
</html>
```

The bars grow one after another when the chart scrolls into view. Hover a bar to see its value.

## Three ways to give a chart its data

| Way | Use it when | Example |
|---|---|---|
| Attributes | You have a few numbers. | `values="12, 19, 8" labels="Mon, Tue, Wed"` |
| A table | Your data is already a table, or a server or CMS renders it. | `<motion-chart><table>…</table></motion-chart>` |
| The `data` property | The data comes from JavaScript, an API or a framework. | `chart.data = { labels, series }` |

The table is the most interesting one. Wrap any HTML table, and the chart reads it. The first column holds the labels, and every other column is one series:

```html
<motion-chart type="line" label="Visitors and signups">
  <table>
    <tr><th>Month</th><th>Visitors</th><th>Signups</th></tr>
    <tr><td>Jan</td><td>1200</td><td>310</td></tr>
    <tr><td>Feb</td><td>1850</td><td>420</td></tr>
    <tr><td>Mar</td><td>1600</td><td>530</td></tr>
  </table>
</motion-chart>
```

The table stays in the page for screen readers. If your code changes a cell, the chart updates by itself.

## Every change is a spring

Most chart libraries redraw or fade when the data changes. Here, each bar and each point springs from where it is to its new value:

```js
const chart = document.querySelector('motion-chart')
chart.values = '20, 9, 17, 10, 27'
```

If the data changes again in the middle of an animation, the chart does not jump to the end first. It turns around from its current position. This makes live data look calm, even when it updates every second.

| Moment | What moves |
|---|---|
| Entrance | Bars grow one after another, lines draw in, pies sweep in clockwise. |
| New data | Bars, points and slices spring to their new values. |
| Hover | The tooltip springs from point to point. A hovered pie slice springs outward. |

## Bar and line charts

`type` is `bar` (the default) or `line`. For several series, separate them with `;` and name them in `series`:

```html
<motion-chart
  values="42, 55, 61, 48; 30, 38, 52, 60"
  labels="Q1, Q2, Q3, Q4"
  series="2025, 2026"
  format="currency:EUR"
></motion-chart>
```

`format` uses the reader's language for the axis, the tooltip and the screen reader text. It accepts `compact`, `percent`, `currency:EUR` and `unit:kilometer`, for example.

## Pie and donut charts

`<motion-pie>` shows how a whole splits into parts. Add `donut` to show the total in the center:

```html
<motion-pie
  donut
  values="1450, 620, 380, 240"
  labels="Rent, Food, Transport, Fun"
  format="currency:EUR"
></motion-pie>
```

A pie works best with a few slices. When there are more than six, the extra slices are combined into one slice called "Other". To compare values that are close together, a bar chart is easier to read.

## Sparklines

`<motion-sparkline>` is a small trend line with no axes. It takes the color of the text around it:

```html
<p>Signups this week <motion-sparkline values="3, 5, 4, 8, 7, 11"></motion-sparkline> are up 38%.</p>
```

Put it next to `motion-counter` and you have a stat tile: a number that counts up above its trend.

## Colors

The eight series colors are chosen to stay apart for readers with color blindness, in light mode and in dark mode. Each mode has its own set of colors, not an automatic inversion. Override them with `--chart-1` to `--chart-8`:

```html
<motion-chart values="8, 14, 11" labels="A, B, C" style="--chart-1: #16a34a"></motion-chart>
```

Text, axes and gridlines use the text color, so the chart fits any theme.

## Accessibility

| What | How |
|---|---|
| Screen readers | They read the data as a table: your own table, or one the chart generates. |
| Keyboard | Press Tab to focus the chart, then the arrow keys to move between points. Each point is read out. |
| Name | Give every chart a `label`. |
| Reduced motion | The chart shows its final state at once and changes values without animation. |

## Recipes

The [Chart Recipes](/docs/recipes/charts/) page has six patterns you can copy, each with a live demo:

1. A stat tile with a number and a trend.
2. A week, month and year switcher.
3. A chart that follows a form.
4. Data loaded from a JSON file.
5. A budget donut with a month select.
6. A live line chart.

## Get started

```bash
npm install motion-components@latest
```

```js
import 'motion-components/motion-chart'
import 'motion-components/motion-pie'
import 'motion-components/motion-sparkline'
```

Read the [motion-chart](/docs/charts/motion-chart/), [motion-pie](/docs/charts/motion-pie/) and [motion-sparkline](/docs/charts/motion-sparkline/) docs. Every code example on those pages works when you paste it into a page.
