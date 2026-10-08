import { db } from "./db";
export const withImages = { images: { orderBy: { position: "asc" as const } }, category: true };
export type P = Awaited<ReturnType<typeof listProducts>>[number];
export async function listProducts(o: { q?: string; cat?: string; min?: number; max?: number; sort?: string; inStock?: boolean; featured?: boolean; isNew?: boolean; discounted?: boolean; take?: number } = {}) {
  const orderBy = o.sort === "price-asc" ? { price: "asc" as const } : o.sort === "price-desc" ? { price: "desc" as const } : { createdAt: "desc" as const };
  const items = await db.product.findMany({
    where: {
      active: true,
      ...(o.q ? { name: { contains: o.q, mode: "insensitive" } } : {}),
      ...(o.cat ? { category: { slug: o.cat } } : {}),
      ...(o.min || o.max ? { price: { ...(o.min ? { gte: o.min } : {}), ...(o.max ? { lte: o.max } : {}) } } : {}),
      ...(o.inStock ? { stock: { gt: 0 } } : {}),
      ...(o.featured ? { featured: true } : {}),
      ...(o.isNew ? { isNew: true } : {}),
    },
    include: withImages, orderBy, take: o.take,
  });
  return o.discounted ? items.filter((p) => p.oldPrice && p.oldPrice > p.price) : items;
}
