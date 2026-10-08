import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { taka } from "@/lib/format";
export const dynamic = "force-dynamic";
export const metadata = { title: "Order confirmed", robots: { index: false } };
export default async function OrderPage({ params }: { params: { orderNo: string } }) {
  const o = await db.order.findUnique({ where: { orderNo: params.orderNo }, include: { customer: true, items: true } });
  if (!o) notFound();
  return (
    <main className="mx-auto max-w-xl px-4 py-8">
      <div className="rounded-xl bg-emerald-50 p-4 text-emerald-800"><p className="text-lg font-bold">✅ Thank you! Your order is placed.</p><p className="text-sm">Order ID: <b>{o.orderNo}</b> — we will call you to confirm.</p></div>
      <div className="mt-4 space-y-1 text-sm"><p><b>Name:</b> {o.customer.name}</p><p><b>Phone:</b> {o.customer.phone}</p><p><b>Address:</b> {o.customer.address}</p><p><b>Payment:</b> Cash on Delivery</p><p><b>Status:</b> {o.status}</p></div>
      <ul className="mt-4 divide-y rounded-xl border text-sm">{o.items.map((i) => <li key={i.id} className="flex justify-between p-3"><span>{i.name} × {i.quantity}</span><span>{taka(i.price * i.quantity)}</span></li>)}<li className="flex justify-between p-3 font-bold"><span>Total</span><span>{taka(o.total)}</span></li></ul>
    </main>
  );
}
