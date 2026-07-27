const { upsertPushSubscription } = require('./_lib/supabase');

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const { subscription, name } = req.body || {};
    if (!subscription || !subscription.endpoint) {
      res.status(400).json({ error: 'Missing subscription' });
      return;
    }
    await upsertPushSubscription(subscription, name);
    res.status(200).json({ ok: true });
  } catch (err) {
    console.error('save-subscription error:', err);
    res.status(500).json({ error: 'Could not save subscription' });
  }
};
