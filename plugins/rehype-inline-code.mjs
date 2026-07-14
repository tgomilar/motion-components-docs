/**
 * Converts inline Markdown code spans (`like-this`) into the library's
 * <motion-code-inline> chips. Fenced blocks are untouched: converted ones
 * are already <motion-code> raw nodes by this stage, and `plain` fences
 * stay <pre><code>, which the walk skips by not descending into <pre>.
 *
 * The copy button only appears on spans someone would actually paste:
 * component/event names, attribute snippets, commands, markup, and calls.
 * Plain vocabulary (`cubic-bezier`, `duration`) renders without it.
 */
const isPasteable = (text) =>
  /^motion-/.test(text) || // component tags, event names
  text.includes('="') || // attribute snippets: scale="1.03"
  text.includes("<") || // markup: <dialog>, </script>
  text.includes("(") || // calls: setCode(raw), showModal()
  /^(npm|npx|import|from)\s/.test(text); // commands and imports

const textOf = (node) =>
  (node.children ?? []).map((child) => (child.type === "text" ? child.value : textOf(child))).join("");

export function rehypeInlineCode() {
  return (tree) => {
    const visit = (parent) => {
      if (!parent.children) return;
      for (const node of parent.children) {
        if (node.type !== "element") continue;
        if (node.tagName === "pre") continue;
        if (node.tagName === "code") {
          node.tagName = "motion-code-inline";
          if (isPasteable(textOf(node))) node.properties = { ...node.properties, copy: true, "copy-visible": true };
          continue;
        }
        visit(node);
      }
    };
    visit(tree);
  };
}
