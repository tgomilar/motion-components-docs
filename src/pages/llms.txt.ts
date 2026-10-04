import type { APIRoute } from "astro";
import { llmsIndex } from "../data/llms";

export const GET: APIRoute = () => new Response(llmsIndex(), { headers: { "Content-Type": "text/plain; charset=utf-8" } });
