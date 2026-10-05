import assert from "node:assert/strict";
import { test } from "node:test";
import { inlineText, isPasteable, upgradeInlineCode } from "./inline-code.mjs";

test("upgrades bare code into a chip", () => {
  assert.equal(
    upgradeInlineCode("use <code>loop-speed</code> here"),
    "use <motion-code-inline copy copy-visible>loop-speed</motion-code-inline> here",
  );
});

test("only pasteable code gets the copy button", () => {
  const pasteable = upgradeInlineCode("<code>motion-counter</code> <code>play</code>");
  assert.match(pasteable, /<motion-code-inline copy copy-visible>motion-counter/);
  assert.match(pasteable, /<motion-code-inline>play<\/motion-code-inline>/);
});

test("leaves chips, classed code and pre blocks alone", () => {
  const chip = "<motion-code-inline copy>x</motion-code-inline>";
  assert.equal(upgradeInlineCode(chip), chip);
  const classed = '<code class="plain">x</code>';
  assert.equal(upgradeInlineCode(classed), classed);
  assert.equal(upgradeInlineCode("<pre><code>keep</code></pre>"), "<pre><code>keep</code></pre>");
});

test("escapes text around code", () => {
  assert.equal(inlineText("12,900 km"), "12,900 km");
  assert.equal(inlineText("a < b & c > d"), "a &lt; b &amp; c &gt; d");
  assert.equal(inlineText("Takes <code>src</code> or <svg>"), "Takes <code>src</code> or &lt;svg&gt;");
  assert.equal(inlineText("&lt;svg&gt; &amp; friends"), "&lt;svg&gt; &amp; friends");
  assert.equal(inlineText("<code>a</code> mid <code>b</code>"), "<code>a</code> mid <code>b</code>");
});

test("isPasteable matches reader-pasteable values", () => {
  for (const value of [
    "motion-headline",
    'scale="1.03"',
    "<dialog>",
    "showModal()",
    "npm i motion-components",
    "--mc-icon-color",
  ]) {
    assert.equal(isPasteable(value), true, value);
  }
  for (const value of ["duration", "spring", "1500"]) {
    assert.equal(isPasteable(value), false, value);
  }
});