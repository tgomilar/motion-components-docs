#!/usr/bin/env node
// Tells IndexNow search engines (Bing, Yandex, Seznam, Naver) about every URL in the live sitemap.
// Bing's index also feeds ChatGPT search and Copilot. Run after a deploy: npm run indexnow
const SITE = "https://www.motion-components.dev";
const KEY = "b06b5cd9cdeb7444fa9a06db99bd7205";

const sitemap = await (await fetch(`${SITE}/sitemap-0.xml`)).text();
const urlList = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
const response = await fetch("https://api.indexnow.org/indexnow", {
  method: "POST",
  headers: { "Content-Type": "application/json; charset=utf-8" },
  body: JSON.stringify({ host: new URL(SITE).host, key: KEY, keyLocation: `${SITE}/${KEY}.txt`, urlList }),
});
console.log(`IndexNow: ${response.status} ${response.statusText} for ${urlList.length} URLs`);
if (!response.ok) process.exit(1);
