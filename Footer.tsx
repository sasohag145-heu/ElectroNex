import Link from "next/link";
export default function Footer() {
  return (
    <footer className="mt-16 bg-ink text-gray-300">
      <div className="mx-auto grid max-w-6xl gap-6 px-4 py-10 sm:grid-cols-3">
        <div><p className="text-lg font-bold text-white">ElectroNex</p><p className="mt-2 text-sm">Electronics, gadgets & accessories delivered across Bangladesh.</p></div>
        <div className="text-sm"><p className="font-semibold text-white">Quick links</p><ul className="mt-2 space-y-1"><li><Link href="/shop">Shop</Link></li><li><Link href="/cart">Cart</Link></li></ul></div>
        <div className="text-sm"><p className="font-semibold text-white">Contact</p><p className="mt-2">Phone: +880 1XXX-XXXXXX</p><p>Email: hello@electronex.com</p><p>Facebook · Instagram · WhatsApp</p></div>
      </div>
      <p className="border-t border-white/10 py-4 text-center text-xs">© {new Date().getFullYear()} ElectroNex. All rights reserved.</p>
    </footer>
  );
}
