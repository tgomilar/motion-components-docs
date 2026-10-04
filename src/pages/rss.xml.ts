import type { APIRoute } from "astro";
import { getCollection } from "astro:content";

const escape = (text: string) =>
  text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

export const GET: APIRoute = async ({ site }) => {
  const posts = (await getCollection("blog", ({ data }) => !data.draft)).sort(
    (a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf(),
  );
  const link = (path: string) => new URL(path, site).href;
  const items = posts
    .map(
      (post) => `    <item>
      <title>${escape(post.data.title)}</title>
      <link>${link(`/blog/${post.id}/`)}</link>
      <guid isPermaLink="true">${link(`/blog/${post.id}/`)}</guid>
      <description>${escape(post.data.description)}</description>
      <pubDate>${post.data.pubDate.toUTCString()}</pubDate>
${post.data.tags.map((tag) => `      <category>${escape(tag)}</category>`).join("\n")}
    </item>`,
    )
    .join("\n");

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Motion Components Blog</title>
    <link>${link("/blog/")}</link>
    <atom:link href="${link("/rss.xml")}" rel="self" type="application/rss+xml" />
    <description>Releases, guides and recipes for motion-components, spring-based web components for animation.</description>
    <language>en</language>
    <lastBuildDate>${(posts[0]?.data.pubDate ?? new Date()).toUTCString()}</lastBuildDate>
${items}
  </channel>
</rss>
`;
  return new Response(body, { headers: { "Content-Type": "application/rss+xml; charset=utf-8" } });
};
