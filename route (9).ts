import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { changeStatus } from "@/lib/orders";
import { tg } from "@/lib/telegram";
export const dynamic = "force-dynamic";
export async function POST(req: Request) {
  const secret = process.env.TELEGRAM_WEBHOOK_SECRET;
  if (!secret || req.headers.get("x-telegram-bot-api-secret-token") !== secret) return new NextResponse("Forbidden", { status: 403 });
  const cb = (await req.json().catch(() => null))?.callback_query;
  if (!cb) return NextResponse.json({ ok: true });
  const chat = String(cb.message?.chat?.id ?? "");
  if (!process.env.TELEGRAM_CHAT_ID || chat !== process.env.TELEGRAM_CHAT_ID) return NextResponse.json({ ok: true });
  const [act, orderNo] = String(cb.data || "").split(":");
  const status = act === "c" ? "CONFIRMED" : act === "x" ? "CANCELLED" : null;
  let note = "Unknown action";
  if (status && orderNo) {
    try {
      const o = await changeStatus({ orderNo }, status);
      note = o ? `Order ${orderNo} is now ${status}` : "Order not found";
      if (o) await tg("editMessageReplyMarkup", { chat_id: chat, message_id: cb.message.message_id, reply_markup: { inline_keyboard: [] } });
    } catch (e) { note = e instanceof Error ? e.message : "Failed"; }
  }
  await tg("answerCallbackQuery", { callback_query_id: cb.id, text: note }).catch(() => {});
  await tg("sendMessage", { chat_id: chat, text: (status === "CONFIRMED" ? "✅ " : "❌ ") + note }).catch(() => {});
  return NextResponse.json({ ok: true });
}
