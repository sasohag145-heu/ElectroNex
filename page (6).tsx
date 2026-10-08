import { db } from "@/lib/db";
import ProductForm from "../ProductForm";
export default async function NewProduct({ searchParams }: { searchParams: { err?: string } }) {
  return <><h1 className="mb-3 text-xl font-bold">Add product</h1><ProductForm cats={await db.category.findMany({ orderBy: { name: "asc" } })} err={searchParams.err} /></>;
}
