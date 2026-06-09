import type { APIRoute } from "astro";

export const POST: APIRoute = async ({ request }) => {
  await request.json().catch(() => null);
  return new Response(JSON.stringify({ revalidated: true }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
};
