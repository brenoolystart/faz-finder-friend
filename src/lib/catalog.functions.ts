import { createServerFn } from "@tanstack/react-start";
import { useSession } from "@tanstack/react-start/server";
import { z } from "zod";

export type Category = { id: string; parent_id: string | null; name: string; icon: string; sort: number };
export type Item = { id: string; category_id: string; name: string; price: number; icon: string; sort: number };

const sessionConfig = () => ({
  password: process.env["SESSION_SECRET"]!,
  name: "admin-gate",
  maxAge: 60 * 60 * 24 * 7,
  cookie: { httpOnly: true, secure: true, sameSite: "lax" as const, path: "/" },
});

async function admin() {
  const s = await useSession<{ ok?: boolean }>(sessionConfig());
  if (!s.data.ok) throw new Error("Não autorizado");
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  return supabaseAdmin;
}

async function sha(s: string) {
  return new Uint8Array(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(s)));
}

export const getCatalog = createServerFn({ method: "GET" }).handler(async () => {
  const { createClient } = await import("@supabase/supabase-js");
  const key = process.env["SUPABASE_PUBLISHABLE_KEY"]!;
  const sb = createClient(process.env["SUPABASE_URL"]!, key, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: { fetch: (input, init) => {
      const h = new Headers(init?.headers);
      if (key.startsWith("sb_") && h.get("Authorization") === `Bearer ${key}`) h.delete("Authorization");
      h.set("apikey", key);
      return fetch(input, { ...init, headers: h });
    } },
  });
  const [c, i] = await Promise.all([
    sb.from("categories").select("id,parent_id,name,icon,sort").order("sort"),
    sb.from("items").select("id,category_id,name,price,icon,sort").order("sort"),
  ]);
  return {
    categories: (c.data ?? []) as Category[],
    items: ((i.data ?? []) as Item[]).map((x) => ({ ...x, price: Number(x.price) })),
  };
});

export const adminStatus = createServerFn({ method: "GET" }).handler(async () => {
  const s = await useSession<{ ok?: boolean }>(sessionConfig());
  return { ok: !!s.data.ok };
});

export const adminLogin = createServerFn({ method: "POST" })
  .inputValidator((d: { password: string }) => z.object({ password: z.string().max(200) }).parse(d))
  .handler(async ({ data }) => {
    const expected = process.env["ADMIN_PASSWORD"];
    if (!expected) return { ok: false };
    const a = await sha(data.password), b = await sha(expected);
    let diff = 0;
    for (let k = 0; k < a.length; k++) diff |= a[k]! ^ b[k]!;
    if (diff !== 0) return { ok: false };
    const s = await useSession<{ ok?: boolean }>(sessionConfig());
    await s.update({ ok: true });
    return { ok: true };
  });

export const adminLogout = createServerFn({ method: "POST" }).handler(async () => {
  const s = await useSession<{ ok?: boolean }>(sessionConfig());
  await s.clear();
  return { ok: true };
});

const catSchema = z.object({ id: z.string().uuid().optional(), parent_id: z.string().uuid().nullable(), name: z.string().min(1).max(80), icon: z.string().max(40), sort: z.number().int() });
const itemSchema = z.object({ id: z.string().uuid().optional(), category_id: z.string().uuid(), name: z.string().min(1).max(80), price: z.number().min(0).max(1000000), icon: z.string().max(40), sort: z.number().int() });

export const saveCategory = createServerFn({ method: "POST" })
  .inputValidator((d: z.infer<typeof catSchema>) => catSchema.parse(d))
  .handler(async ({ data }) => {
    const sb = await admin();
    const { id, ...rest } = data;
    const r = id ? await sb.from("categories").update(rest).eq("id", id) : await sb.from("categories").insert(rest);
    if (r.error) throw new Error(r.error.message);
    return { ok: true };
  });

export const saveItem = createServerFn({ method: "POST" })
  .inputValidator((d: z.infer<typeof itemSchema>) => itemSchema.parse(d))
  .handler(async ({ data }) => {
    const sb = await admin();
    const { id, ...rest } = data;
    const r = id ? await sb.from("items").update(rest).eq("id", id) : await sb.from("items").insert(rest);
    if (r.error) throw new Error(r.error.message);
    return { ok: true };
  });

export const deleteRow = createServerFn({ method: "POST" })
  .inputValidator((d: { table: "categories" | "items"; id: string }) =>
    z.object({ table: z.enum(["categories", "items"]), id: z.string().uuid() }).parse(d))
  .handler(async ({ data }) => {
    const sb = await admin();
    const r = await sb.from(data.table).delete().eq("id", data.id);
    if (r.error) throw new Error(r.error.message);
    return { ok: true };
  });
