/**
 * Wraps rendered Markdown tables in <div class="md-table"> so blog posts can
 * style them like the docs' PropsTable component (rounded card, scroll
 * container). A bare <table> can't clip its cell backgrounds to a
 * border-radius, so the wrapper carries the border, radius, and overflow.
 */
// Markdown rendering pretty-prints tables with newlines between rows and
// cells. The later raw-HTML pass re-parses the page (needed for embedded
// motion-code markup), and HTML table parsing foster-parents that
// whitespace out in front of the <table>, leaving a block of blank lines.
// Structural table elements can't contain text anyway, so drop it.
const STRUCTURAL = new Set(["table", "thead", "tbody", "tr"]);
const tidyTable = (node) => {
  if (node.type !== "element") return;
  if (STRUCTURAL.has(node.tagName)) {
    node.children = node.children.filter((child) => !(child.type === "text" && /^\s*$/.test(child.value)));
  }
  node.children?.forEach(tidyTable);
};

export function rehypeTableWrap() {
  return (tree) => {
    const visit = (parent) => {
      if (!parent.children) return;
      parent.children = parent.children.map((node) => {
        if (node.type === "element" && node.tagName === "table") {
          tidyTable(node);
          return { type: "element", tagName: "div", properties: { className: ["md-table"] }, children: [node] };
        }
        visit(node);
        return node;
      });
    };
    visit(tree);
  };
}
