import Link from "next/link";
import { db } from "@/lib/db";
import { taka } from "@/lib/format";
export default async function Orders() {
  const orders = await db.order.findMany({ orderBy: { createdAt: "desc" }, take: 200, include: { customer: true, items: true } });
  return (
    <>
      <h1 className="text-xl font-bold">Orders</h1>
      <ul className="mt-3 space-y-2">{orders.map((o) => (
        <li key={o.id}><Link href={`/admin/orders/${o.id}`} className="block rounded-xl border bg-white p-3 text-sm">
          <div className="flex justify-between"><b>{o.orderNo}</b><span className="rounded bg-brand-light px-2 text-xs font-semibold text-brand">{o.status}</span></div>
          <p>{o.customer.name} · {o.customer.phone}</p><p className="text-gray-500">{o.items.length} item(s) · {taka(o.total)} · {o.createdAt.toLocaleString("en-GB", { timeZone: "Asia/Dhaka" })}</p>
        </Link></li>))}
      </ul>
    </>
  );
}
