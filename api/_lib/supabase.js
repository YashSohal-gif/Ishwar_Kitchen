// Minimal Supabase REST helper — avoids adding @supabase/supabase-js as a
// dependency since these functions only need a couple of simple queries.
// Requires SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY env vars (the
// *service role* key, not the publishable one admin.html uses — this
// needs to bypass RLS to read/write the subscriptions table server-side).

const SUPABASE_URL = process.env.SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

function assertConfigured() {
  if (!SUPABASE_URL || !SERVICE_KEY) {
    throw new Error('SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY env vars are not set');
  }
}

async function supabaseRequest(path, options = {}) {
  assertConfigured();
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    ...options,
    headers: {
      apikey: SERVICE_KEY,
      Authorization: `Bearer ${SERVICE_KEY}`,
      'Content-Type': 'application/json',
      Prefer: options.prefer || 'return=representation',
      ...options.headers,
    },
  });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`Supabase ${options.method || 'GET'} ${path} failed: ${res.status} ${text}`);
  }
  const ct = res.headers.get('content-type') || '';
  return ct.includes('application/json') ? res.json() : null;
}

async function upsertPushSubscription(subscription, name) {
  return supabaseRequest('push_subscriptions?on_conflict=endpoint', {
    method: 'POST',
    prefer: 'resolution=merge-duplicates,return=representation',
    body: JSON.stringify([{
      endpoint: subscription.endpoint,
      subscription,
      customer_name: name || null,
    }]),
  });
}

async function listPushSubscriptions() {
  return supabaseRequest('push_subscriptions?select=id,endpoint,subscription,customer_name');
}

async function deletePushSubscription(endpoint) {
  return supabaseRequest(`push_subscriptions?endpoint=eq.${encodeURIComponent(endpoint)}`, {
    method: 'DELETE',
    prefer: 'return=minimal',
  });
}

module.exports = { upsertPushSubscription, listPushSubscriptions, deletePushSubscription };
