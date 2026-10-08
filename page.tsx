import { db } from "@/lib/db";
import { addCategory, deleteCategory, renameCategory } from "../actions";
export default async function Categories({ searchParams }: { searchParams: { err?: string } }) {
  const cats = await db.category.findMany({ orderBy: { name: "asc" }, include: { _count: { select: { products: true } } } });
  return (
    <>
      <h1 className="text-xl font-bold">Categories</h1>
      {searchParams.err && <p className="mt-2 rounded-lg bg-red-50 p-3 text-sm text-red-700">{searchParams.err}</p>}
      <form action={addCategory} className="mt-3 flex gap-2"><input name="name" required placeholder="New category name" className="flex-1 rounded-lg border px-3 py-2.5 text-sm" /><button className="rounded-lg bg-brand px-4 font-semibold text-white">Add</button></form>
      <ul className="mt-4 space-y-2">{cats.map((c) => (
        <li key={c.id} className="rounded-xl border bg-white p-3">
          <form action={renameCategory.bind(null, c.id)} className="flex gap-2"><input name="name" defaultValue={c.name} className="flex-1 rounded-lg border px-3 py-2 text-sm" /><button className="rounded-lg border px-3 text-sm">Save</button></form>
          <form action={deleteCategory.bind(null, c.id)} className="mt-2 flex items-center justify-between text-xs text-gray-500"><span>{c._count.products} product(s)</span><button className="text-red-600">Delete</button></form>
        </li>))}
      </ul>
    </>
  );
}
