export const taka = (n: number) => "৳" + n.toLocaleString("en-US");
export const discountPct = (price: number, old?: number | null) =>
  old && old > price ? Math.round(((old - price) / old) * 100) : 0;
