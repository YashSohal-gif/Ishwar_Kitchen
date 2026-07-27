// Triggered daily by Vercel Cron (see vercel.json). Sends ONE personalised,
// Punjabi-touch push notification per day: a festival greeting if today is
// one, otherwise the next message in a 5-message rotation (a different
// notification each day, cycling back to message 1 every 5th day).
//
// Fixed-date Punjabi/national festivals are listed below. Festivals whose
// date shifts every year on the lunar calendar (Lohri's neighbour Maghi
// aside — Holi, Diwali, Gurpurab, Teeyan, Rakhi, Karva Chauth, etc.) are
// NOT hardcoded here since a wrong guessed date is worse than no date.
// Send those manually from the admin panel's "Send Notification" box a
// day or two before, once you've confirmed that year's date.

const { listPushSubscriptions, deletePushSubscription, logNotificationSend } = require('./_lib/supabase');
const { sendToAll } = require('./_lib/webpush');

// MM-DD → greeting. Keep in sync with anything you already tell customers
// in person / on social media.
const FESTIVALS = {
  '01-01': { title: 'Naveen Sal Mubarak! 🎉', body: 'Nave saal di lakh lakh vadhaiyan ji! Aao, Ishwar Kitchen ich rala ke is saal di shuruaat karo. 🍽️' },
  '01-13': { title: 'Lohri Diyan Vadhaiyan! 🔥', body: 'Sat Sri Akal ji! Lohri diyan lakh lakh vadhaiyan! Aao ji, garam garam sarson da saag te makki di roti khaan Ishwar Kitchen.' },
  '01-14': { title: 'Maghi Diyan Vadhaiyan! 🌾', body: 'Maghi da shubh mauka — parivar de naal aao te Punjabi thali da anand maano!' },
  '01-26': { title: 'Happy Republic Day! 🇮🇳', body: 'Gantantra Diwas diyan vadhaiyan! Aaj special thali de naal desh nu yaad karo.' },
  '04-13': { title: 'Baisakhi Diyan Lakh Lakh Vadhaiyan! 🌾', body: 'Sat Sri Akal ji! Baisakhi mubarak! Aao ji, khushiyan manao Ishwar Kitchen de change khane de naal.' },
  '08-15': { title: 'Happy Independence Day! 🇮🇳', body: 'Azadi diyan vadhaiyan ji! Family de naal desi khana khaan aao.' },
  '11-01': { title: 'Punjab Day Diyan Vadhaiyan! 💛', body: 'Sat Sri Akal ji! Punjab Diwas mubarak — Ishwar Kitchen vallon lakh lakh vadhaiyan!' },
  '12-25': { title: 'Merry Christmas! 🎄', body: 'Christmas diyan shubh kamnavan! Aao ji, khushiyan manao change khane de naal.' },
};

// Same rotation as the "Today's Special" banner on the homepage — keep
// these two lists in sync if you change one.
const DAILY_SPECIALS = [
  { dish: 'Butter Paneer Masala + Butter Naan', price: '₹189' }, // Sunday
  { dish: 'Chole Bhature + Sweet Lassi', price: '₹149' },        // Monday
  { dish: 'Dal Makhani + Garlic Naan', price: '₹149' },          // Tuesday
  { dish: 'Chaap Tikka + Paratha', price: '₹199' },              // Wednesday
  { dish: 'Veg Hakka Noodles + Spring Rolls', price: '₹199' },   // Thursday
  { dish: 'Shahi Paneer + Butter Naan', price: '₹199' },         // Friday
  { dish: 'Kadai Paneer + Laccha Paratha', price: '₹199' },      // Saturday
];

// 5 different notification "types" that rotate one-per-day (day 1 sends
// message 1, day 2 sends message 2, ..., day 6 wraps back to message 1).
// Written in a punchy, self-aware, Zomato-style tone — short, a bit
// cheeky/funny — but with Punjabi words woven in instead of straight
// English. Edit/add/remove entries here to change the rotation.
const MESSAGE_POOL = [
  () => {
    const sp = DAILY_SPECIALS[new Date().getDay()];
    return {
      title: 'Fridge Ne Haar Maan Li 🏳️',
      body: `Ghar da khana dekh ke pet ro reha ae. Aaj da special: ${sp.dish} sirf ${sp.price} — bas ek tap door ae!`,
      tag: 'ishwar-kitchen-daily-special',
    };
  },
  () => ({
    title: 'Tandoor Tuhanu Miss Kar Reha Ae 🔥😢',
    body: 'Itne din ho gaye ji, saada tandoor v puchda pai "ohh kithe gaye?" Waapas aao, dil (te pet) naal gal karo.',
    tag: 'ishwar-kitchen-miss-you',
  }),
  () => ({
    title: 'Ghar Da Khana? Nah Ji Nah 🙅',
    body: 'Family nu bahana chahida? "Aaj mood nahi banaan da" bol ke seedha Ishwar Kitchen aa jao — asi cover kar denge. 😎',
    tag: 'ishwar-kitchen-family',
  }),
  () => ({
    title: '500 Log Ikatthe Galat Nahi Ho Sakde 🧠',
    body: 'Roz 500+ log sada khana khaunde ne — tussi hi reh gaye ho ki? Chalo hun der na karo!',
    tag: 'ishwar-kitchen-social-proof',
  }),
  () => ({
    title: 'Pet Vajj Reha Ae... 📢',
    body: 'Kudkud kudkud — ohh tuhada pet bol reha ae, sada nahi. Order karo, shaant karo! 🛵',
    tag: 'ishwar-kitchen-cta',
  }),
];

function todaysPayload() {
  const now = new Date();
  const mmdd = `${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

  if (FESTIVALS[mmdd]) {
    return { ...FESTIVALS[mmdd], url: '/', tag: 'ishwar-kitchen-festival' };
  }

  // Days since Unix epoch — deterministic and stable, so which message
  // goes out on a given calendar day never shifts on redeploys/restarts.
  const dayIndex = Math.floor(now.getTime() / 86400000);
  const msg = MESSAGE_POOL[dayIndex % MESSAGE_POOL.length]();
  return { ...msg, url: '/' };
}

module.exports = async (req, res) => {
  // Vercel Cron calls this with GET — reject anything else so it can't
  // also be spammed as a public endpoint.
  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }
  // Vercel signs cron requests with this header — verify when running on
  // Vercel; skip the check for local/manual testing.
  if (process.env.VERCEL && req.headers['x-vercel-cron'] !== '1' && !process.env.ALLOW_MANUAL_CRON) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  try {
    const payload = todaysPayload();
    const subs = await listPushSubscriptions();
    const result = await sendToAll(subs, payload, { deletePushSubscription });
    await logNotificationSend(payload.title, result.sent, payload.tag).catch(err => console.error('logNotificationSend failed:', err));
    res.status(200).json({ payload, ...result });
  } catch (err) {
    console.error('cron-notify error:', err);
    res.status(500).json({ error: 'Cron send failed' });
  }
};
