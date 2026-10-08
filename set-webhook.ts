const { TELEGRAM_BOT_TOKEN: t, TELEGRAM_WEBHOOK_SECRET: s, NEXT_PUBLIC_SITE_URL: u } = process.env;
if (!t || !s || !u?.startsWith("https://")) { console.error("Set TELEGRAM_BOT_TOKEN, TELEGRAM_WEBHOOK_SECRET and an https NEXT_PUBLIC_SITE_URL in .env first."); process.exit(1); }
fetch(`https://api.telegram.org/bot${t}/setWebhook`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ url: `${u}/api/telegram/webhook`, secret_token: s, allowed_updates: ["callback_query"] }) })
  .then((r) => r.json()).then((j) => console.log(j));
