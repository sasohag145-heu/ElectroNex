import { OrderStatus } from "@prisma/client";
import { db } from "./db";
export const STATUSES: OrderStatus[] = ["PENDING", "CONFIRMED", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"];
export async function changeStatus(where: { id?: string; orderNo?: string }, status: OrderStatus) {
  return db.$transaction(async (tx) => {
    const o = await tx.order.findUnique({ where: where as { id: string }, include: { items: true } });
    if (!o) return null;
    if (o.status === status) return o;
    if (o.status === "CANCELLED") throw new Error("Cancelled orders cannot be reopened");
    if (status === "CANCELLED") for (const i of o.items) await tx.product.update({ where: { id: i.productId }, data: { stock: { increment: i.quantity } } });
    return tx.order.update({ where: { id: o.id }, data: { status } });
  });
}
