export const SECTION_ORDER = ['reveal', 'respond', 'text', 'icons', 'scroll', 'components', 'charts', 'code', 'recipes'] as const

export type DocsSection = (typeof SECTION_ORDER)[number]

export const SECTION_LABELS: Record<DocsSection, string> = {
  reveal: 'Reveal',
  respond: 'Respond',
  text: 'Text',
  scroll: 'Scroll',
  components: 'Components',
  icons: 'Icons',
  charts: 'Charts',
  code: 'Code',
  recipes: 'Recipes',
}
