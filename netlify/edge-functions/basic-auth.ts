// Basic Auth-gate voor de hele site (tijdelijk, tot publieke lancering).
// Credentials: Netlify env var AUTH_USERS, formaat "gebruiker1:wachtwoord1,gebruiker2:wachtwoord2".
// Elke geslaagde login wordt gelogd in Supabase (calculator_access_log) via de anon key
// (insert-only RLS-policy — die key kan niets uitlezen, alleen wegschrijven).

import type { Context } from "https://edge.netlify.com";

const REALM = "Lumenear Acoustic Calculator";

function unauthorized(): Response {
  return new Response("Authentication required", {
    status: 401,
    headers: { "WWW-Authenticate": `Basic realm="${REALM}"` },
  });
}

async function logLogin(username: string, request: Request) {
  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const supabaseKey = Deno.env.get("SUPABASE_ANON_KEY");
  if (!supabaseUrl || !supabaseKey) return;

  try {
    await fetch(`${supabaseUrl}/rest/v1/calculator_access_log`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: supabaseKey,
        Authorization: `Bearer ${supabaseKey}`,
      },
      body: JSON.stringify({
        username,
        ip: request.headers.get("x-nf-client-connection-ip") || null,
        user_agent: request.headers.get("user-agent") || null,
      }),
    });
  } catch {
    // Logging mag de auth-gate nooit breken.
  }
}

export default async (request: Request, context: Context) => {
  const authUsers = Deno.env.get("AUTH_USERS") || "";
  const validPairs = new Set(
    authUsers.split(",").map((p) => p.trim()).filter(Boolean)
  );

  // Geen credentials geconfigureerd = fail closed (niet per ongeluk open site).
  if (validPairs.size === 0) return unauthorized();

  const auth = request.headers.get("authorization") || "";
  const [scheme, encoded] = auth.split(" ");

  if (scheme === "Basic" && encoded) {
    let decoded = "";
    try {
      decoded = atob(encoded);
    } catch {
      return unauthorized();
    }
    if (validPairs.has(decoded)) {
      const username = decoded.split(":")[0];
      context.waitUntil(logLogin(username, request));
      return context.next();
    }
  }

  return unauthorized();
};
