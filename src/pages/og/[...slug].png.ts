import type { APIRoute } from "astro";
import { getCollection } from "astro:content";
import { blurb, components, sectionLabel } from "../../data/manifest";
import { shareImage } from "../../data/og";

interface Card {
  eyebrow: string;
  title: string;
  description: string;
}

export async function getStaticPaths() {
  const posts = await getCollection("blog", ({ data }) => !data.draft);
  return [
    ...components.map((c) => ({
      params: { slug: `docs/${c.section}/${c.tagName}` },
      props: { eyebrow: sectionLabel(c.section), title: `<${c.tagName}>`, description: blurb(c) },
    })),
    ...posts.map((post) => ({
      params: { slug: `blog/${post.id}` },
      props: { eyebrow: "Blog", title: post.data.title, description: post.data.description },
    })),
  ];
}

export const GET: APIRoute<Card> = async ({ props }) =>
  new Response(new Uint8Array(await shareImage(props)), { headers: { "Content-Type": "image/png" } });
