export interface Recipe {
  id: string
  title: string
  intro: string
  html: string
  js?: string
  css?: string
  note?: string
}

const indent = (text: string) =>
  text
    .split('\n')
    .map((line) => (line ? `  ${line}` : line))
    .join('\n')

export const recipeSnippet = (r: Recipe) =>
  [r.html, r.js && `<script type="module">\n${indent(r.js)}\n</script>`, r.css && `<style>\n${indent(r.css)}\n</style>`]
    .filter(Boolean)
    .join('\n\n')
