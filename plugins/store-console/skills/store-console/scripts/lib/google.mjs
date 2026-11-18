// Google service-account access for the Android Publisher API. No dependencies: an RS256 JWT signed with node:crypto,
// exchanged for an access token. The key file's path comes from the project config and is never printed.
import { createSign } from "node:crypto";
import { readFileSync } from "node:fs";
import { die, NEEDS_HUMAN } from "./common.mjs";

export const PUBLISHER_SCOPE = "https://www.googleapis.com/auth/androidpublisher";

/** Base URL of the Android Publisher API; overridable only so tests can stand in for Google. */
export const publisherBase = () => process.env.STORE_CONSOLE_PLAY_API_BASE ?? "https://androidpublisher.googleapis.com";

const b64url = (v) => Buffer.from(typeof v === "string" ? v : JSON.stringify(v)).toString("base64url");

export async function accessToken(keyFile, scope = PUBLISHER_SCOPE) {
  let key;
  try {
    key = JSON.parse(readFileSync(keyFile, "utf8"));
  } catch {
    die("the Play service-account file named by play.serviceAccountJson cannot be read as JSON");
  }
  if (!key.client_email || !key.private_key) die("the Play service-account file has no client_email or private_key");
  const aud = key.token_uri ?? "https://oauth2.googleapis.com/token";
  const now = Math.floor(Date.now() / 1000);
  const unsigned = `${b64url({ alg: "RS256", typ: "JWT" })}.${b64url({ iss: key.client_email, scope, aud, iat: now, exp: now + 3600 })}`;
  const signature = createSign("RSA-SHA256").update(unsigned).sign(key.private_key).toString("base64url");
  const res = await fetch(aud, {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer", assertion: `${unsigned}.${signature}` }),
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok || !body.access_token) {
    die(`Google rejected the service account (${res.status} ${body.error ?? ""}). Ask the human to check its Play Console access; not retrying.`, NEEDS_HUMAN);
  }
  return body.access_token;
}

/** One authenticated Android Publisher call. */
export async function publisher(bearer, method, path, json) {
  const res = await fetch(`${publisherBase()}/androidpublisher/v3/${path}`, {
    method,
    headers: { authorization: `Bearer ${bearer}`, ...(json === undefined ? {} : { "content-type": "application/json" }) },
    ...(json === undefined ? {} : { body: JSON.stringify(json) }),
  });
  const text = await res.text();
  if (!res.ok) die(`Android Publisher ${method} ${path} failed with ${res.status}:\n${text.slice(0, 800)}`, res.status === 401 || res.status === 403 ? NEEDS_HUMAN : 1);
  return text ? JSON.parse(text) : {};
}
