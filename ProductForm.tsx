import { deleteProduct, saveProduct } from "../actions";
type Cat = { id: string; name: string };
type Prod = { id: string; name: string; description: string; categoryId: string; price: number; oldPrice: number | null; stock: number; specs: unknown; featured: boolean; isNew: boolean; active: boolean; images: { url: string }[] };
const i = "mt-1 w-full rounded-lg border bg-white px-3 py-2.5 text-sm";
export default function ProductForm({ product, cats, err }: { product?: Prod; cats: Cat[]; err?: string }) {
  const id = product?.id ?? "new";
  const specs = ((product?.specs as [string, string][]) || []).map(([k, v]) => `${k}: ${v}`).join("\n");
  return (
    <>
      <form action={saveProduct.bind(null, id)} className="space-y-3">
        <label className="block text-sm font-medium">Product name<input name="name" required defaultValue={product?.name} className={i} /></label>
        <label className="block text-sm font-medium">Category<select name="categoryId" required defaultValue={product?.categoryId} className={i}>{cats.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}</select></label>
        <div className="grid grid-cols-3 gap-2">
          <label className="text-sm font-medium">Price ৳<input name="price" type="number" min={1} required defaultValue={product?.price} className={i} /></label>
          <label className="text-sm font-medium">Old price ৳<input name="oldPrice" type="number" min={1} defaultValue={product?.oldPrice ?? ""} className={i} /></label>
          <label className="text-sm font-medium">Stock<input name="stock" type="number" min={0} required defaultValue={product?.stock ?? 0} className={i} /></label>
        </div>
        <label className="block text-sm font-medium">Description<textarea name="description" required rows={4} defaultValue={product?.description} className={i} /></label>
        <label className="block text-sm font-medium">Specifications <span className="font-normal text-gray-500">(one per line, like Battery: 5000mAh)</span><textarea name="specs" rows={4} defaultValue={specs} className={i} /></label>
        <label className="block text-sm font-medium">Image links <span className="font-normal text-gray-500">(one per line, first is the main image)</span><textarea name="imageUrls" rows={3} defaultValue={product?.images.map((x) => x.url).join("\n")} className={i} /></label>
        <label className="block text-sm font-medium">Upload photos (max 4 MB each)<input name="files" type="file" accept="image/*" multiple className={i} /></label>
        <div className="flex flex-wrap gap-4 text-sm">
          <label><input type="checkbox" name="featured" defaultChecked={product?.featured} /> Featured</label>
          <label><input type="checkbox" name="isNew" defaultChecked={product?.isNew} /> New</label>
          <label><input type="checkbox" name="active" defaultChecked={product ? product.active : true} /> Enabled (visible in shop)</label>
        </div>
        {err && <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{err}</p>}
        <button className="w-full rounded-lg bg-brand py-3 font-bold text-white">Save product</button>
      </form>
      {product && <form action={deleteProduct.bind(null, product.id)} className="mt-3"><button className="w-full rounded-lg border border-red-300 py-3 font-semibold text-red-600">Delete product</button><p className="mt-1 text-xs text-gray-500">If this product already has orders, it is hidden instead of deleted so order history stays correct.</p></form>}
    </>
  );
}
