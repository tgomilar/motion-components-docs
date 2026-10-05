/**
 * Upgrades bare `<code>` inside documentation HTML strings into the library's
 * <motion-code-inline> chips, so table cells get the same copyable, no-line-break
 * code treatment as prose. Already-upgraded markup is left alone, and content
 * inside <pre> is never touched.
 */

/** True when the text is something a reader would actually paste. */
export const isPasteable = (text) =>
  /^motion-/.test(text) || // component tags, event names
  text.includes('="') || // attribute snippets: scale="1.03"
  text.includes('<') || // markup: <dialog>, </script>
  text.includes('(') || // calls: setCode(raw), showModal()
  /^(npm|npx|import|from)\s/.test(text) || // commands and imports
  /^[a-z-]+-[a-z-]+/.test(text); // css custom properties: --mc-icon-color

const CODE_TAG = /<code(\s[^>]*)?>([\s\S]*?)<\/code>/gi;
// The capture group is required: String.split keeps captured groups in its
// result, which is how fenced blocks survive the round trip.
const PRE_BLOCK = /(<pre[\s\S]*?<\/pre>)/gi;

const decodeEntities = (s) =>
  s
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, '&');

const escapeHtml = (s) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/** Same as upgradeInlineCode, but the text around <code> is escaped first. */
export function inlineText(text) {
  // One capture group only, so odd chunks are always whole <code> elements.
  return text
    .split(/(<code(?:\s[^>]*)?>[\s\S]*?<\/code>)/i)
    .map((chunk, i) => (i % 2 === 1 ? chunk : escapeHtml(decodeEntities(chunk))))
    .join('');
}

export function upgradeInlineCode(html) {
  // Fenced code must stay as-is, so upgrade only the segments between <pre> blocks.
  return html
    .split(PRE_BLOCK)
    .map((chunk, i) =>
      i % 2 === 1
        ? chunk // an odd chunk is the captured <pre>...</pre>
        : chunk.replace(CODE_TAG, (match, attrs, text) => {
            // Leave chips and anything already carrying a class untouched.
            if (/class\s*=/.test(attrs ?? '')) return match;
            const value = text.trim();
            if (!value) return match;
            if (value.includes('<motion-code-inline')) return match;
            const plain = decodeEntities(value.replace(/<[^>]+>/g, ''));
            const pasteable = isPasteable(plain) ? ' copy copy-visible' : '';
            return `<motion-code-inline${pasteable}>${value}</motion-code-inline>`;
          }),
    )
    .join('');
}