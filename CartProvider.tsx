"use client";
import { createContext, useContext, useEffect, useState } from "react";
export type CartItem = { id: string; slug: string; name: string; price: number; image: string; stock: number; quantity: number };
type Ctx = { items: CartItem[]; add: (i: Omit<CartItem, "quantity">, q?: number) => void; setQty: (id: string, q: number) => void; remove: (id: string) => void; clear: () => void; count: number; total: number };
const C = createContext<Ctx>(null as unknown as Ctx);
export const useCart = () => useContext(C);
export default function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [ready, setReady] = useState(false);
  useEffect(() => { try { setItems(JSON.parse(localStorage.getItem("electronex-cart") || "[]")); } catch {} setReady(true); }, []);
  useEffect(() => { if (ready) localStorage.setItem("electronex-cart", JSON.stringify(items)); }, [items, ready]);
  const add: Ctx["add"] = (i, q = 1) => setItems((s) => {
    const f = s.find((x) => x.id === i.id);
    if (f) return s.map((x) => x.id === i.id ? { ...x, quantity: Math.min(i.stock, x.quantity + q) } : x);
    return [...s, { ...i, quantity: Math.min(i.stock, q) }];
  });
  const setQty = (id: string, q: number) => setItems((s) => s.map((x) => x.id === id ? { ...x, quantity: Math.max(1, Math.min(x.stock, q)) } : x));
  const remove = (id: string) => setItems((s) => s.filter((x) => x.id !== id));
  const clear = () => setItems([]);
  const count = items.reduce((a, x) => a + x.quantity, 0);
  const total = items.reduce((a, x) => a + x.quantity * x.price, 0);
  return <C.Provider value={{ items, add, setQty, remove, clear, count, total }}>{children}</C.Provider>;
}
