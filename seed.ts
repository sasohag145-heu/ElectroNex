import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
const db = new PrismaClient();
const img = (t: string) => `https://placehold.co/800x800/e8f0ff/0f62fe?text=${encodeURIComponent(t)}`;
const cats = ["Earbuds","Headphones","Smart Watches","Speakers","Chargers","Cables","Power Banks","Accessories"];
const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
const demo = [
  ["Wireless Earbuds Pro","Earbuds",2490,3290,25,true,true],
  ["Bluetooth Headphones","Headphones",3290,4290,12,true,false],
  ["Smart Watch Active","Smart Watches",3990,5490,8,true,true],
  ["Portable Bluetooth Speaker","Speakers",2190,2890,30,false,false],
  ["33W Fast Charger","Chargers",990,1290,50,true,false],
  ["Type-C Charging Cable","Cables",290,450,100,false,true],
  ["10000mAh Power Bank","Power Banks",1890,2390,0,true,false],
  ["Phone Stand & Case Kit","Accessories",590,790,40,false,true],
] as const;
async function main() {
  for (const n of cats) await db.category.upsert({ where: { slug: slug(n) }, update: {}, create: { name: n, slug: slug(n) } });
  for (const [name, cat, price, oldPrice, stock, featured, isNew] of demo) {
    const c = await db.category.findUnique({ where: { slug: slug(cat) } });
    await db.product.upsert({
      where: { slug: slug(name) }, update: {},
      create: {
        name, slug: slug(name), price, oldPrice, stock, featured, isNew, categoryId: c!.id,
        description: `${name} from ElectroNex. Genuine quality, fast delivery across Bangladesh, cash on delivery available.`,
        specs: [["Warranty","6 months"],["Delivery","1–4 days"]],
        images: { create: [{ url: img(name), position: 0 }, { url: img(name + " 2"), position: 1 }] },
      },
    });
  }
  const { ADMIN_EMAIL: e, ADMIN_PASSWORD: p } = process.env;
  if (e && p) await db.adminUser.upsert({ where: { email: e }, update: {}, create: { email: e, passwordHash: await bcrypt.hash(p, 12) } });
  console.log("Seed complete");
}
main().finally(() => db.$disconnect());
