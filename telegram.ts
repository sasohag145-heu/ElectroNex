const api = (m: string) => `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/${m}`;
const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
export async function tg(method: string, body: object) {
  if (!process.env.TELEGRAM_BOT_TOKEN) throw new Error("TELEGRAM_BOT_TOKEN is not set");
  const r = await fetch(api(method), { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
  if (!r.ok) throw new Error(`Telegram ${method} failed: ${r.status} ${await r.text()}`);
}
type O = { orderNo: string; total: number; paymentMethod: string; createdAt: Date; customer: { name: string; phone: string; address: string }; items: { name: string; quantity: number }[] };
export async function notifyNewOrder(o: O) {
  const chat = process.env.TELEGRAM_CHAT_ID;
  if (!chat) throw new Error("TELEGRAM_CHAT_ID is not set");
  const time = o.createdAt.toLocaleString("en-GB", { timeZone: "Asia/Dhaka", dateStyle: "medium", timeStyle: "short" });
  const text = [
    "🔔 <b>NEW ELECTRONEX ORDER</b>", "",
    `<b>Order ID:</b> ${esc(o.orderNo)}`, `<b>Customer Name:</b> ${esc(o.customer.name)}`,
    `<b>Phone:</b> ${esc(o.customer.phone)}`, `<b>Address:</b> ${esc(o.customer.address)}`, "",
    "<b>Product:</b>", ...o.items.map((i) => `• ${esc(i.name)} × ${i.quantity}`), "",
    `<b>Quantity:</b> ${o.items.reduce((a, i) => a + i.quantity, 0)}`,
    `<b>Total Price:</b> ৳${o.total.toLocaleString("en-US")}`,
    `<b>Payment Method:</b> ${o.paymentMethod === "COD" ? "Cash on Delivery" : esc(o.paymentMethod)}`,
    `<b>Order Time:</b> ${time}`,
  ].join("\n");
  await tg("sendMessage", { chat_id: chat, text, parse_mode: "HTML", reply_markup: { inline_keyboard: [[{ text: "✅ Confirm Order", callback_data: `c:${o.orderNo}` }, { text: "❌ Cancel Order", callback_data: `x:${o.orderNo}` }]] } });
}
