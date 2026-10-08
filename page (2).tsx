import { notFound, redirect } from "next/navigation";
import { OrderStatus } from "@prisma/client";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { changeStatus, STATUSES } from "@/lib/orders";
import { taka } from "@/lib/format";
export default async function OrderDetail({ params, searchParams }: { params: { id: string }; searchParams: { err?: string } }) {
  const o = await db.order.findUnique({ where: { id: params.id }, include: { customer: true, items: true } });
  if (!o) notFound();
  async function update(f: FormData) {
    "use server"; await requireAdmin();
    const s = String(f.get("status")) as OrderStatus;
    if (!STATUSES.includes(s)) return;
    try { await changeStatus({ id: params.id }, s); } catch (e) { redirect(`/admin/orders/${params.id}?err=${encodeURIComponent(e instanceof Error ? e.message : "Failed")}`); }
    redirect(`/admin/orders/${params.id}`);
  }
  return (
    <>
      <h1 className="text-xl font-bold">Order {o.orderNo}</h1>
      <div className="mt-3 space-y-1 rounded-xl border bg-white p-4 text-sm">
        <p><b>Customer:</b> {o.customer.name}</p><p><b>Phone:</b> <a href={`tel:${o.customer.phone}`} className="text-brand">{o.customer.phone}</a></p>
        <p><b>Address:</b> {o.customer.address}</p><p><b>Payment:</b> {o.paymentMethod}</p><p><b>Placed:</b> {o.createdAt.toLocaleString("en-GB", { timeZone: "Asia/Dhaka" })}</p>
      </div>
      <ul className="mt-3 divide-y rounded-xl border bg-white text-sm">{o.items.map((i) => <li key={i.id} className="flex justify-between p-3"><span>{i.name} × {i.quantity}</span><span>{taka(i.price * i.quantity)}</span></li>)}<li className="flex justify-between p-3 font-bold"><span>Total</span><span>{taka(o.total)}</span></li></ul>
      <form action={update} className="mt-4 flex gap-2">
        <select name="status" defaultValue={o.status} className="flex-1 rounded-lg border px-3 py-2.5 text-sm">{STATUSES.map((s) => <option key={s}>{s}</option>)}</select>
        <button className="rounded-lg bg-brand px-4 font-semibold text-white">Update</button>
      </form>
      {searchParams.err && <p className="mt-2 text-sm text-red-600">{searchParams.err}</p>}
    </>
  );
}
