const webpush = require('web-push');

const VAPID_PUBLIC_KEY = process.env.VAPID_PUBLIC_KEY;
const VAPID_PRIVATE_KEY = process.env.VAPID_PRIVATE_KEY;
const VAPID_SUBJECT = process.env.VAPID_SUBJECT || 'mailto:sohalyash85@gmail.com';

let configured = false;
function ensureConfigured() {
  if (configured) return;
  if (!VAPID_PUBLIC_KEY || !VAPID_PRIVATE_KEY) {
    throw new Error('VAPID_PUBLIC_KEY / VAPID_PRIVATE_KEY env vars are not set');
  }
  webpush.setVapidDetails(VAPID_SUBJECT, VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY);
  configured = true;
}

// Sends one payload to every subscription, dropping any that are dead
// (410 Gone / 404) so the list doesn't keep growing with stale entries.
async function sendToAll(subscriptions, payload, { deletePushSubscription } = {}) {
  ensureConfigured();
  const body = JSON.stringify(payload);
  let sent = 0, failed = 0;

  await Promise.all(subscriptions.map(async (row) => {
    try {
      await webpush.sendNotification(row.subscription, body);
      sent++;
    } catch (err) {
      failed++;
      if ((err.statusCode === 410 || err.statusCode === 404) && deletePushSubscription) {
        await deletePushSubscription(row.endpoint).catch(() => {});
      }
    }
  }));

  return { sent, failed, total: subscriptions.length };
}

module.exports = { sendToAll };
