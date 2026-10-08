import Link from "next/link";
import { db } from "@/lib/db";
import { taka } from "@/lib/format";
export default async function Dashboard() {
  const [products, groups, sales, recent] = await Promise.all([
    db.product.count(), db.order.groupBy({ by: ["status"], _count: true }),
    db.order.aggregate({ where: { status: { not: "CANCELLED" } }, _sum: { total: true } }),
    db.order.findMany({ orderBy: { createdAt: "desc" }, take: 8, include: { customer: true } }),
  ]);
  const n = (s: string) => groups.find((g) => g.status === s)?._count ?? 0;
  const cards: [string, string | number][] = [["Products", products], ["Total orders", groups.reduce((a, g) => a + g._count, 0)], ["Pending", n("PENDING")], ["Confirmed", n("CONFIRMED")], ["Delivered", n("DELIVERED")], ["Cancelled", n("CANCELLED")], ["Sales (not cancelled)", taka(sales._sum.total ?? 0)]];
  return (
    <>
      <h1 className="text-xl font-bold">Dashboard</h1>
      <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">{cards.map(([l, v]) => <div key={l} className="rounded-xl border bg-white p-3"><p className="text-xs text-gray-500">{l}</p><p className="text-lg font-bold">{v}</p></div>)}</div>
      <h2 className="mb-2 mt-6 font-semibold">Recent orders</h2>
      <ul className="divide-y rounded-xl border bg-white text-sm">{recent.map((o) => <li key={o.id}><Link href={`/admin/orders/${o.id}`} className="flex justify-between p-3"><span>{o.orderNo} · {o.customer.name}</span><span>{taka(o.total)} · {o.status}</span></Link></li>)}</ul>
    </>
  );
}
