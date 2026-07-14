/**
 * Replaces fenced code blocks in Markdown with <motion-code> windows.
 *
 * The code is delivered through setCode() from a companion inline script,
 * with `<` / `>` unicode-escaped inside the JSON payload. This
 * survives samples that contain blank lines or literal </script> tags,
 * which break the declarative <script type="text/plain"> embedding.
 *
 * Fence meta options:
 *   ```js filename="my-file.js"   → custom chrome filename
 *   ```js plain                   → opt out, keep a normal Shiki block
 */

const DEFAULT_FILENAMES = {
  js: "app.js",
  ts: "app.ts",
  jsx: "App.jsx",
  tsx: "App.tsx",
  html: "index.html",
  css: "styles.css",
  json: "config.json",
  sh: "terminal.sh",
  bash: "terminal.sh",
  shell: "terminal.sh",
  py: "app.py",
};

// Rough SSR height (chrome bar + padding + lines) to limit layout shift
// while the custom element upgrades.
const heightFor = (code) => 68 + code.split("\n").length * 20;

export function remarkMotionCode() {
  return (tree) => {
    let counter = 0;

    const visit = (parent) => {
      if (!parent.children) return;
      parent.children.forEach((node, index) => {
        if (node.type !== "code") return visit(node);

        const meta = node.meta ?? "";
        if (/\bplain\b/.test(meta)) return;

        const lang = node.lang ?? "";
        const filename = /filename="([^"]+)"/.exec(meta)?.[1] ?? DEFAULT_FILENAMES[lang] ?? (lang ? `app.${lang}` : "code.txt");
        const id = `cw-md-${counter++}`;
        const payload = JSON.stringify(node.value).replace(/</g, "\\u003c").replace(/>/g, "\\u003e");

        parent.children[index] = {
          type: "html",
          value:
            `<motion-code id="${id}" filename="${filename}"${lang ? ` lang="${lang}"` : ""} copy style="min-height:${heightFor(node.value)}px"></motion-code>\n` +
            `<script type="module">customElements.whenDefined("motion-code").then(()=>document.getElementById("${id}")?.setCode(${payload}))</script>`,
        };
      });
    };

    visit(tree);
  };
}
