// Manually triggered from admin.html's "Send Notification" panel.
// Protected by ADMIN_SEND_SECRET (set in Vercel env vars) so only the
// admin panel — which asks for it — can trigger a broadcast.

const { listPushSubscriptions, deletePushSubscription } = require('./_lib/supabase');
const { sendToAll } = require('./_lib/webpush');

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const { secret, title, body, url } = req.body || {};

    if (!process.env.ADMIN_SEND_SECRET || secret !== process.env.ADMIN_SEND_SECRET) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }
    if (!title || !body) {
      res.status(400).json({ error: 'title and body are required' });
      return;
    }

    const subs = await listPushSubscriptions();
    const result = await sendToAll(
      subs,
      { title, body, url: url || '/', tag: 'ishwar-kitchen-manual' },
      { deletePushSubscription }
    );

    res.status(200).json(result);
  } catch (err) {
    console.error('send-push error:', err);
    res.status(500).json({ error: 'Could not send notification' });
  }
};
