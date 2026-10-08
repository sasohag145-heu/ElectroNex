import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import ProductForm from "../ProductForm";
export default async function EditProduct({ params, searchParams }: { params: { id: string }; searchParams: { err?: string } }) {
  const [product, cats] = await Promise.all([db.product.findUnique({ where: { id: params.id }, include: { images: { orderBy: { position: "asc" } } } }), db.category.findMany({ orderBy: { name: "asc" } })]);
  if (!product) notFound();
  return <><h1 className="mb-3 text-xl font-bold">Edit product</h1><ProductForm product={product} cats={cats} err={searchParams.err} /></>;
}
