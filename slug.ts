import { randomBytes } from "crypto";
export const slugify = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") || "item";
export const withSuffix = (s: string) => `${slugify(s)}-${randomBytes(2).toString("hex")}`;
