import { readFileSync } from "node:fs";
import { join } from "node:path";
import satori from "satori";
import { Resvg } from "@resvg/resvg-js";

const font = (file: string) => readFileSync(join(process.cwd(), "src/assets/og-fonts", file));

const fonts = [
  { name: "Inter", data: font("inter-latin-500-normal.woff"), weight: 500 as const, style: "normal" as const },
  { name: "Inter", data: font("inter-latin-800-normal.woff"), weight: 800 as const, style: "normal" as const },
  { name: "JetBrains Mono", data: font("jetbrains-mono-latin-500-normal.woff"), weight: 500 as const, style: "normal" as const },
];

type Node = { type: string; props: Record<string, unknown> };
const h = (type: string, style: Record<string, unknown>, ...children: (Node | string)[]): Node => ({
  type,
  props: { style, children: children.length === 1 ? children[0] : children },
});

const GRID = `url("data:image/svg+xml,${encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" width="72" height="72"><path d="M72 0H0V72" fill="none" stroke="rgba(255,255,255,0.05)"/></svg>',
)}")`;

export async function shareImage({ eyebrow, title, description }: { eyebrow: string; title: string; description: string }) {
  const titleSize = title.length > 40 ? 60 : title.length > 22 ? 72 : 88;
  const tree = h(
    "div",
    {
      width: "100%",
      height: "100%",
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      padding: "72px 80px",
      backgroundColor: "#0f0f13",
      backgroundImage: `radial-gradient(circle at 85% 15%, rgba(37, 99, 235, 0.45), transparent 45%), radial-gradient(circle at 10% 90%, rgba(124, 58, 237, 0.22), transparent 40%), ${GRID}`,
      color: "#e8e8f0",
      fontFamily: "Inter",
    },
    h(
      "div",
      { display: "flex", flexDirection: "column", gap: 28 },
      h(
        "div",
        {
          display: "flex",
          alignSelf: "flex-start",
          padding: "8px 18px",
          borderRadius: 999,
          backgroundColor: "rgba(96, 165, 250, 0.12)",
          color: "#60a5fa",
          fontSize: 22,
          fontWeight: 500,
          letterSpacing: 3,
          textTransform: "uppercase",
        },
        eyebrow,
      ),
      h("div", { fontSize: titleSize, fontWeight: 800, letterSpacing: -2, lineHeight: 1.05, maxWidth: 1000 }, title),
      h("div", { fontSize: 30, fontWeight: 500, color: "#a0a0bc", lineHeight: 1.4, maxWidth: 940 }, description),
    ),
    h(
      "div",
      { display: "flex", fontFamily: "JetBrains Mono", fontSize: 28, fontWeight: 500 },
      h("span", { color: "#facc15" }, "<"),
      h("span", { color: "#60a5fa" }, "motion-components"),
      h("span", { color: "#facc15" }, ">"),
    ),
  );
  const svg = await satori(tree as unknown as Parameters<typeof satori>[0], { width: 1200, height: 630, fonts });
  return new Resvg(svg, { fitTo: { mode: "width", value: 1200 } }).render().asPng();
}
