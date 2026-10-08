import { NextResponse } from "next/server";
import { randomInt } from "crypto";
import { z } from "zod";
import { db } from "@/lib/db";
import { notifyNewOrder } from "@/lib/telegram";
export const dynamic = "force-dynamic";
const schema = z.object({
  name: z.string().trim().min(2).max(80),
  phone: z.string().trim().regex(/^(?:\+?88)?01[3-9]\d{8}$/, "Enter a valid Bangladeshi mobile number"),
  address: z.string().trim().min(8).max(300),
  paymentMethod: z.literal("COD"),
  items: z.array(z.object({ productId: z.string().min(1), quantity: z.number().int().min(1).max(20) })).min(1).max(30),
});
const code = () => "EN-" + Array.from({ length: 8 }, () => "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"[randomInt(32)]).join("");
export async function POST(req: Request) {
  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0]?.message || "Invalid order" }, { status: 400 });
  const d = parsed.data;
  try {
    const order = await db.$transaction(async (tx) => {
      const lines: { productId: string; name: string; price: number; quantity: number }[] = [];
      for (const it of d.items) {
        const p = await tx.product.findFirst({ where: { id: it.productId, active: true } });
        if (!p) throw new Error("A product in your cart is no longer available");
        const r = await tx.product.updateMany({ where: { id: p.id, stock: { gte: it.quantity } }, data: { stock: { decrement: it.quantity } } });
        if (r.count === 0) throw new Error(`Sorry, not enough stock for ${p.name}`);
        lines.push({ productId: p.id, name: p.name, price: p.price, quantity: it.quantity });
      }
      return tx.order.create({
        data: {
          orderNo: code(), paymentMethod: d.paymentMethod, total: lines.reduce((a, l) => a + l.price * l.quantity, 0),
          customer: { create: { name: d.name, phone: d.phone, address: d.address } }, items: { create: lines },
        },
        include: { customer: true, items: true },
      });
    });
    try { await notifyNewOrder(order); } catch (e) { console.error("Telegram notification failed:", e); }
    return NextResponse.json({ orderNo: order.orderNo });
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "Could not place order" }, { status: 400 });
  }
}
