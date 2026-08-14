/**
 * OAuth 2.1 (PKCE + Dynamic Client Registration) wrapper in front of an
 * upstream MCP server that only supports a static API key.
 *
 * Lets an OAuth-only client (e.g. claude.ai custom connectors) authorize
 * once behind a shared password, then proxies MCP traffic upstream with
 * the real API key injected server-side. The client never sees the key.
 *
 * Tokens/codes are stateless: a signed (HMAC-SHA256) payload carries its
 * own expiry, so no KV/database is needed. That means an authorization
 * code technically stays valid (once) for its full TTL rather than being
 * invalidated the instant it's used — acceptable for single-user/personal
 * use; move to KV-backed one-time codes if that stops being true.
 */

const ACCESS_TOKEN_TTL = 60 * 60; // 1 hour
const REFRESH_TOKEN_TTL = 60 * 60 * 24 * 90; // 90 days
const AUTH_CODE_TTL = 5 * 60; // 5 minutes

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, Mcp-Session-Id",
};

function json(obj, status = 200, extraHeaders = {}) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { "Content-Type": "application/json", ...CORS_HEADERS, ...extraHeaders },
  });
}

function html(body, status = 200) {
  return new Response(body, { status, headers: { "Content-Type": "text/html; charset=utf-8" } });
}

function b64urlEncode(bytes) {
  let str = typeof bytes === "string" ? bytes : String.fromCharCode(...new Uint8Array(bytes));
  return btoa(str).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function b64urlDecodeToBytes(str) {
  str = str.replace(/-/g, "+").replace(/_/g, "/");
  while (str.length % 4) str += "=";
  const bin = atob(str);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return bytes;
}

function utf8ToBytes(str) {
  return new TextEncoder().encode(str);
}

async function hmacSign(secret, dataStr) {
  const key = await crypto.subtle.importKey(
    "raw",
    utf8ToBytes(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", key, utf8ToBytes(dataStr));
  return b64urlEncode(sig);
}

function timingSafeEqual(a, b) {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

async function signToken(env, payload) {
  const payloadB64 = b64urlEncode(utf8ToBytes(JSON.stringify(payload)));
  const sig = await hmacSign(env.SIGNING_SECRET, payloadB64);
  return `${payloadB64}.${sig}`;
}

async function verifyToken(env, token) {
  if (!token || typeof token !== "string" || !token.includes(".")) return null;
  const [payloadB64, sig] = token.split(".");
  const expectedSig = await hmacSign(env.SIGNING_SECRET, payloadB64);
  if (!timingSafeEqual(sig, expectedSig)) return null;
  let payload;
  try {
    payload = JSON.parse(new TextDecoder().decode(b64urlDecodeToBytes(payloadB64)));
  } catch {
    return null;
  }
  if (!payload.exp || payload.exp < Math.floor(Date.now() / 1000)) return null;
  return payload;
}

async function sha256Base64Url(str) {
  const digest = await crypto.subtle.digest("SHA-256", utf8ToBytes(str));
  return b64urlEncode(digest);
}

function issuerFromRequest(request) {
  return new URL(request.url).origin;
}

// --- Well-known metadata -----------------------------------------------

function authServerMetadata(issuer) {
  return {
    issuer,
    authorization_endpoint: `${issuer}/authorize`,
    token_endpoint: `${issuer}/token`,
    registration_endpoint: `${issuer}/register`,
    response_types_supported: ["code"],
    grant_types_supported: ["authorization_code", "refresh_token"],
    code_challenge_methods_supported: ["S256"],
    token_endpoint_auth_methods_supported: ["none"],
    scopes_supported: ["mcp"],
  };
}

function protectedResourceMetadata(issuer) {
  return {
    resource: `${issuer}/mcp`,
    authorization_servers: [issuer],
  };
}

// --- Handlers ------------------------------------------------------------

async function handleRegister(request, env) {
  let body = {};
  try {
    body = await request.json();
  } catch {
    // some clients POST an empty body; that's fine, defaults apply
  }
  const clientId = crypto.randomUUID();
  return json({
    client_id: clientId,
    client_id_issued_at: Math.floor(Date.now() / 1000),
    redirect_uris: body.redirect_uris || [],
    token_endpoint_auth_method: "none",
    grant_types: ["authorization_code", "refresh_token"],
    response_types: ["code"],
    client_name: body.client_name || "MCP client",
  });
}

function loginForm(params, error) {
  const hidden = Object.entries(params)
    .filter(([, v]) => v !== undefined && v !== null)
    .map(([k, v]) => `<input type="hidden" name="${k}" value="${escapeHtml(v)}">`)
    .join("\n");
  return html(`<!doctype html>
<html><head><meta charset="utf-8"><title>Authorize</title>
<style>
body{font-family:system-ui,sans-serif;max-width:360px;margin:80px auto;padding:0 16px}
input[type=password]{width:100%;padding:8px;font-size:16px;box-sizing:border-box;margin:8px 0}
button{width:100%;padding:8px;font-size:16px}
.error{color:#c00}
</style></head>
<body>
<h2>Authorize access</h2>
<p>Enter the password to grant this client access to the MCP connector.</p>
${error ? `<p class="error">${escapeHtml(error)}</p>` : ""}
<form method="POST">
${hidden}
<input type="password" name="password" placeholder="Password" autofocus required>
<button type="submit">Authorize</button>
</form>
</body></html>`);
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

function paramsFromQuery(url) {
  const p = url.searchParams;
  return {
    response_type: p.get("response_type") || "",
    client_id: p.get("client_id") || "",
    redirect_uri: p.get("redirect_uri") || "",
    code_challenge: p.get("code_challenge") || "",
    code_challenge_method: p.get("code_challenge_method") || "S256",
    state: p.get("state") || "",
    scope: p.get("scope") || "",
    resource: p.get("resource") || "",
  };
}

async function handleAuthorizeGet(request) {
  const url = new URL(request.url);
  const params = paramsFromQuery(url);
  if (!params.redirect_uri || !params.code_challenge) {
    return json({ error: "invalid_request", error_description: "missing redirect_uri or code_challenge" }, 400);
  }
  return loginForm(params);
}

async function handleAuthorizePost(request, env) {
  const form = await request.formData();
  const params = {
    response_type: form.get("response_type") || "",
    client_id: form.get("client_id") || "",
    redirect_uri: form.get("redirect_uri") || "",
    code_challenge: form.get("code_challenge") || "",
    code_challenge_method: form.get("code_challenge_method") || "S256",
    state: form.get("state") || "",
    scope: form.get("scope") || "",
    resource: form.get("resource") || "",
  };
  const password = form.get("password") || "";

  if (!params.redirect_uri || !params.code_challenge) {
    return json({ error: "invalid_request" }, 400);
  }

  if (!env.GATE_PASSWORD || !timingSafeEqual(password, env.GATE_PASSWORD)) {
    return loginForm(params, "Wrong password. Try again.");
  }

  const now = Math.floor(Date.now() / 1000);
  const code = await signToken(env, {
    type: "code",
    client_id: params.client_id,
    redirect_uri: params.redirect_uri,
    code_challenge: params.code_challenge,
    code_challenge_method: params.code_challenge_method,
    resource: params.resource,
    iat: now,
    exp: now + AUTH_CODE_TTL,
  });

  const redirect = new URL(params.redirect_uri);
  redirect.searchParams.set("code", code);
  if (params.state) redirect.searchParams.set("state", params.state);
  return Response.redirect(redirect.toString(), 302);
}

async function handleToken(request, env) {
  let form;
  const contentType = request.headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    const body = await request.json();
    form = new Map(Object.entries(body));
  } else {
    form = await request.formData();
  }
  const grantType = form.get("grant_type");

  if (grantType === "authorization_code") {
    const code = form.get("code");
    const redirectUri = form.get("redirect_uri");
    const codeVerifier = form.get("code_verifier");

    const payload = await verifyToken(env, code);
    if (!payload || payload.type !== "code") {
      return json({ error: "invalid_grant" }, 400);
    }
    if (payload.redirect_uri !== redirectUri) {
      return json({ error: "invalid_grant", error_description: "redirect_uri mismatch" }, 400);
    }
    if (payload.code_challenge_method === "S256") {
      const computed = await sha256Base64Url(codeVerifier || "");
      if (!codeVerifier || !timingSafeEqual(computed, payload.code_challenge)) {
        return json({ error: "invalid_grant", error_description: "PKCE verification failed" }, 400);
      }
    }

    const now = Math.floor(Date.now() / 1000);
    const accessToken = await signToken(env, {
      type: "access",
      client_id: payload.client_id,
      resource: payload.resource,
      iat: now,
      exp: now + ACCESS_TOKEN_TTL,
    });
    const refreshToken = await signToken(env, {
      type: "refresh",
      client_id: payload.client_id,
      resource: payload.resource,
      iat: now,
      exp: now + REFRESH_TOKEN_TTL,
    });

    return json({
      access_token: accessToken,
      token_type: "Bearer",
      expires_in: ACCESS_TOKEN_TTL,
      refresh_token: refreshToken,
      scope: "mcp",
    });
  }

  if (grantType === "refresh_token") {
    const refreshToken = form.get("refresh_token");
    const payload = await verifyToken(env, refreshToken);
    if (!payload || payload.type !== "refresh") {
      return json({ error: "invalid_grant" }, 400);
    }
    const now = Math.floor(Date.now() / 1000);
    const accessToken = await signToken(env, {
      type: "access",
      client_id: payload.client_id,
      resource: payload.resource,
      iat: now,
      exp: now + ACCESS_TOKEN_TTL,
    });
    return json({
      access_token: accessToken,
      token_type: "Bearer",
      expires_in: ACCESS_TOKEN_TTL,
      scope: "mcp",
    });
  }

  return json({ error: "unsupported_grant_type" }, 400);
}

async function handleMcpProxy(request, env) {
  const authHeader = request.headers.get("authorization") || "";
  const token = authHeader.replace(/^Bearer\s+/i, "");
  const payload = await verifyToken(env, token);
  if (!payload || payload.type !== "access") {
    const issuer = issuerFromRequest(request);
    return json(
      { error: "unauthorized" },
      401,
      { "WWW-Authenticate": `Bearer resource_metadata="${issuer}/.well-known/oauth-protected-resource"` }
    );
  }

  const upstreamUrl = env.UPSTREAM_MCP_URL;
  const headers = new Headers(request.headers);
  headers.set("authorization", env.UPSTREAM_AUTH_HEADER);
  headers.delete("host");

  const init = {
    method: request.method,
    headers,
  };
  if (request.method !== "GET" && request.method !== "HEAD") {
    init.body = request.body;
    init.duplex = "half";
  }

  const upstreamResp = await fetch(upstreamUrl, init);
  const respHeaders = new Headers(upstreamResp.headers);
  Object.entries(CORS_HEADERS).forEach(([k, v]) => respHeaders.set(k, v));
  return new Response(upstreamResp.body, { status: upstreamResp.status, headers: respHeaders });
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: CORS_HEADERS });
    }

    if (url.pathname === "/.well-known/oauth-authorization-server") {
      return json(authServerMetadata(issuerFromRequest(request)));
    }
    if (url.pathname.startsWith("/.well-known/oauth-protected-resource")) {
      return json(protectedResourceMetadata(issuerFromRequest(request)));
    }
    if (url.pathname === "/register" && request.method === "POST") {
      return handleRegister(request, env);
    }
    if (url.pathname === "/authorize" && request.method === "GET") {
      return handleAuthorizeGet(request);
    }
    if (url.pathname === "/authorize" && request.method === "POST") {
      return handleAuthorizePost(request, env);
    }
    if (url.pathname === "/token" && request.method === "POST") {
      return handleToken(request, env);
    }
    if (url.pathname === "/mcp") {
      return handleMcpProxy(request, env);
    }

    return json({ error: "not_found" }, 404);
  },
};
