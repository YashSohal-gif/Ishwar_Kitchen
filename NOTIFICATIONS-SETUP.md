# Setting up push notifications

Everything on the code side is done — the site, service worker, and serverless
functions are all wired up. Three things only you can do (they need secrets I
should never hardcode into a public repo) are left before it goes live.

## 1. Create the tables in Supabase

This reuses the same Supabase project `admin.html` already talks to.

1. Go to your Supabase project → **SQL Editor** → **New query**
2. Paste the contents of [`supabase-setup.sql`](supabase-setup.sql) and run it

> If you already ran this once before (for `push_subscriptions`), run it
> again — it's been updated with two more tables (`order_clicks`,
> `notification_sends`) for the admin dashboard's "Order Now clicks" and
> "Notified Today" stats. `create table if not exists` means re-running it
> is safe and won't touch your existing data.

## 2. Generate VAPID keys (one-time, free)

VAPID keys are how the browser verifies push messages actually came from you.

On any machine with Node installed:

```bash
npx web-push generate-vapid-keys
```

This prints a **Public Key** and a **Private Key**. Keep both — the public one
also needs to be pasted into the site's `script.js`.

## 3. Set environment variables in Vercel

In your Vercel project → **Settings** → **Environment Variables**, add:

| Name | Value |
|---|---|
| `VAPID_PUBLIC_KEY` | the public key from step 2 |
| `VAPID_PRIVATE_KEY` | the private key from step 2 |
| `VAPID_SUBJECT` | `mailto:sohalyash85@gmail.com` (or any contact email) |
| `SUPABASE_URL` | `https://myusocxvkspfjlzhfncz.supabase.co` (same as admin.html) |
| `SUPABASE_SERVICE_ROLE_KEY` | your Supabase project's **service_role** key — Settings → API in Supabase (⚠️ **not** the publishable key `admin.html` uses — this one bypasses RLS, keep it secret, never put it in client-side code) |
| `ADMIN_SEND_SECRET` | any password you make up — this is what you'll type into the "Send secret" field in the admin panel to authorize a manual broadcast |

## 4. Paste the public VAPID key into the site

Open [`script.js`](script.js) and find this line near the bottom:

```js
const VAPID_PUBLIC_KEY = 'REPLACE_WITH_VAPID_PUBLIC_KEY';
```

Replace it with the public key from step 2, then redeploy.

---

## Once that's done

- Visitors will see a 🔔 bell button (top-right, on the homepage, contact page,
  and reviews page) — tapping it asks for notification permission and
  subscribes them.
- **Daily automatic notifications** go out at 11:00 AM IST every day via
  Vercel Cron ([`vercel.json`](vercel.json) → `/api/cron-notify`) — a fixed
  festival greeting if today matches one of the dates in
  [`api/cron-notify.js`](api/cron-notify.js), otherwise today's rotating
  special, both with a Punjabi-touch ("Sat Sri Akal ji!", "Aao ji, aithe
  khao!") tone.
- **Manual sends** (for anything not on a fixed date — Diwali, Holi, Gurpurab,
  Rakhi, Karva Chauth, Teeyan, or any custom offer) go through `admin.html`'s
  new "📢 Send Push Notification" panel — fill in a title/message, enter the
  `ADMIN_SEND_SECRET` you set above, and hit send.

### Why some festivals aren't automatic

Lohri, Baisakhi, Republic Day, Independence Day, and a few others have fixed
calendar dates, so they're hardcoded in `api/cron-notify.js`. Diwali, Holi,
Gurpurab, Rakhi, Karva Chauth, and Teeyan shift every year on the lunar
calendar — rather than guess a date that might be wrong, those are left for
you to send manually (a day or two ahead) once you've confirmed that year's
date, using the admin panel.

### Vercel Cron on the free (Hobby) plan

Hobby-tier projects are limited to daily-or-less cron frequency, which is
exactly what this uses (once a day), so no paid plan is required.
