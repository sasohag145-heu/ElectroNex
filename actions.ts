"use server";
import { redirect } from "next/navigation";
import { put } from "@vercel/blob";
import { z } from "zod";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { slugify, withSuffix } from "@/lib/slug";

const fail = (back: string, m: string): never => redirect(`${back}?err=${encodeURIComponent(m)}`);
const num = (f: FormData, k: string) => { const v = String(f.get(k) ?? "").trim(); return v === "" ? undefined : Number(v); };
const schema = z.object({
  name: z.string().trim().min(2).max(120), description: z.string().trim().min(5).max(5000), categoryId: z.string().min(1),
  price: z.number().int().min(1).max(10_000_000), oldPrice: z.number().int().min(1).max(10_000_000).optional(),
  stock: z.number().int().min(0).max(100_000),
});

export async function saveProduct(id: string, f: FormData) {
  await requireAdmin();
  const back = id === "new" ? "/admin/products/new" : `/admin/products/${id}`;
  const p = schema.safeParse({ name: f.get("name"), description: f.get("description"), categoryId: f.get("categoryId"), price: num(f, "price"), oldPrice: num(f, "oldPrice"), stock: num(f, "stock") });
  if (!p.success) return fail(back, `${p.error.issues[0].path.join(".")}: ${p.error.issues[0].message}`);

  const urls = String(f.get("imageUrls") || "").split("\n").map((s) => s.trim()).filter(Boolean);
  if (urls.some((u) => !/^https:\/\/\S+$/.test(u))) return fail(back, "Image links must start with https://");
  const files = (f.getAll("files") as File[]).filter((x) => x && x.size > 0);
  if (files.length) {
    if (!process.env.BLOB_READ_WRITE_TOKEN) return fail(back, "Photo upload is not set up yet (BLOB_READ_WRITE_TOKEN). Paste image links instead.");
    for (const file of files) {
      if (!file.type.startsWith("image/")) return fail(back, "Only image files are allowed");
      if (file.size > 4 * 1024 * 1024) return fail(back, "Each photo must be under 4 MB");
      try { urls.push((await put(`products/${Date.now()}-${file.name.replace(/[^a-z0-9.]/gi, "_")}`, file, { access: "public" })).url); }
      catch { return fail(back, "Photo upload failed. Check BLOB_READ_WRITE_TOKEN."); }
    }
  }
  if (urls.length < 1 || urls.length > 8) return fail(back, "Add between 1 and 8 product images");

  const specs = String(f.get("specs") || "").split("\n").map((l) => l.split(":")).filter((a) => a.length >= 2 && a[0].trim()).map((a) => [a[0].trim(), a.slice(1).join(":").trim()]);
  const d = p.data;
  const data = { name: d.name, description: d.description, categoryId: d.categoryId, price: d.price, oldPrice: d.oldPrice ?? null, stock: d.stock, specs, featured: f.get("featured") === "on", isNew: f.get("isNew") === "on", active: f.get("active") === "on" };
  const images = { create: urls.map((url, position) => ({ url, position })) };
  try {
    if (id === "new") {
      let slug = slugify(d.name);
      if (await db.product.findUnique({ where: { slug } })) slug = withSuffix(d.name);
      await db.product.create({ data: { ...data, slug, images } });
    } else {
      await db.$transaction([db.productImage.deleteMany({ where: { productId: id } }), db.product.update({ where: { id }, data: { ...data, images } })]);
    }
  } catch { return fail(back, "Could not save the product"); }
  redirect("/admin/products");
}

export async function deleteProduct(id: string) {
  await requireAdmin();
  const used = await db.orderItem.count({ where: { productId: id } });
  if (used > 0) await db.product.update({ where: { id }, data: { active: false } }); // keeps order history intact
  else await db.product.delete({ where: { id } });
  redirect("/admin/products");
}

export async function addCategory(f: FormData) {
  await requireAdmin();
  const name = String(f.get("name") || "").trim();
  if (name.length < 2 || name.length > 60) return fail("/admin/categories", "Category name must be 2–60 characters");
  let slug = slugify(name);
  if (await db.category.findUnique({ where: { slug } })) slug = withSuffix(name);
  await db.category.create({ data: { name, slug } });
  redirect("/admin/categories");
}
export async function renameCategory(id: string, f: FormData) {
  await requireAdmin();
  const name = String(f.get("name") || "").trim();
  if (name.length < 2 || name.length > 60) return fail("/admin/categories", "Category name must be 2–60 characters");
  await db.category.update({ where: { id }, data: { name } });
  redirect("/admin/categories");
}
export async function deleteCategory(id: string) {
  await requireAdmin();
  if ((await db.product.count({ where: { categoryId: id } })) > 0) return fail("/admin/categories", "Move or delete this category's products first");
  await db.category.delete({ where: { id } });
  redirect("/admin/categories");
}
