import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { LogOut, Plus, Save, Trash2 } from "lucide-react";
import {
  adminLogin, adminLogout, adminStatus, deleteRow, getCatalog, saveCategory, saveItem, saveSiteContent, uploadSiteImage,
  type Category, type Item, type SiteImage,
} from "@/lib/catalog.functions";
import { siteTextDefaults, siteTextFields, type SiteTextKey } from "@/content/clube";
import { getIcon, iconNames } from "@/lib/icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Painel admin — Clube Aurora" },
      { name: "description", content: "Gerencie categorias, itens e preços do Clube Aurora." },
      { property: "og:title", content: "Painel admin — Clube Aurora" },
      { property: "og:description", content: "Gerencie o conteúdo do Clube Aurora." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  loader: async () => {
    const s = await adminStatus();
    return { ok: s.ok, catalog: s.ok ? await getCatalog() : { categories: [], items: [], content: {}, images: [] } };
  },
  errorComponent: () => <p className="p-8 text-center">Erro ao carregar o painel.</p>,
  component: Admin,
});

function Admin() {
  const { ok, catalog } = Route.useLoaderData();
  return (
    <div className="hack-bg min-h-screen text-foreground">
      <div className="mx-auto max-w-md px-4 py-6">{ok ? <Panel {...catalog} /> : <Login />}</div>
    </div>
  );
}

function Login() {
  const router = useRouter();
  const login = useServerFn(adminLogin);
  const [pw, setPw] = useState("");
  const [err, setErr] = useState(false);
  return (
    <form
      className="mt-20 space-y-4 rounded-2xl border border-primary/40 bg-card/70 p-6"
      onSubmit={async (e) => {
        e.preventDefault();
        const r = await login({ data: { password: pw } });
        if (r.ok) window.location.reload(); else setErr(true);
      }}
    >
      <h1 className="font-mono text-sm font-bold tracking-[0.2em]">&gt; PAINEL ADMIN_</h1>
      <Input type="password" placeholder="Senha" value={pw} onChange={(e) => setPw(e.target.value)} autoComplete="current-password" />
      {err && <p className="text-sm text-destructive">Senha incorreta.</p>}
      <Button type="submit" className="w-full">Entrar</Button>
    </form>
  );
}

function IconPick({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const I = getIcon(value);
  return (
    <label className="relative flex h-10 w-12 shrink-0 items-center justify-center rounded-md border border-input bg-background">
      <I className="h-4 w-4 text-primary" />
      <select aria-label="Ícone" value={value} onChange={(e) => onChange(e.target.value)} className="absolute inset-0 opacity-0">
        {iconNames.map((n) => <option key={n} value={n}>{n}</option>)}
      </select>
    </label>
  );
}

function Panel({ categories, items, content, images }: { categories: Category[]; items: Item[]; content: Record<string, string>; images: SiteImage[] }) {
  const router = useRouter();
  const saveC = useServerFn(saveCategory);
  const saveI = useServerFn(saveItem);
  const del = useServerFn(deleteRow);
  const logout = useServerFn(adminLogout);
  const saveText = useServerFn(saveSiteContent);
  const uploadImage = useServerFn(uploadSiteImage);
  const run = async (f: () => Promise<unknown>, msg = "Salvo!") => {
    try { await f(); toast.success(msg); router.invalidate(); } catch (e) { toast.error((e as Error).message); }
  };
  const tops = categories.filter((c) => !c.parent_id);
  const [copy, setCopy] = useState<Record<SiteTextKey, string>>({ ...siteTextDefaults, ...content });

  const imageSlots = [
    { key: "hero", label: "Imagem principal" },
    { key: "gallery_1", label: "Foto 1 do carrossel" },
    { key: "gallery_2", label: "Foto 2 do carrossel" },
    { key: "gallery_3", label: "Foto 3 do carrossel" },
    { key: "gallery_4", label: "Foto 4 do carrossel" },
  ] as const;

  const upload = async (key: typeof imageSlots[number]["key"], file: File, alt: string) => {
    if (!(["image/jpeg", "image/png", "image/webp"] as string[]).includes(file.type)) {
      toast.error("Use uma imagem JPG, PNG ou WebP.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("A imagem deve ter no máximo 5 MB.");
      return;
    }
    const base64 = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result).split(",")[1] ?? "");
      reader.onerror = () => reject(new Error("Não foi possível ler a imagem."));
      reader.readAsDataURL(file);
    });
    await run(() => uploadImage({ data: { key, alt, mime: file.type as "image/jpeg" | "image/png" | "image/webp", base64 } }), "Foto atualizada!");
  };

  const CatBlock = ({ cat, depth }: { cat: Category; depth: number }) => {
    const [c, setC] = useState(cat);
    const subs = categories.filter((x) => x.parent_id === cat.id);
    const its = items.filter((i) => i.category_id === cat.id);
    return (
      <div className={`space-y-3 rounded-2xl border border-border bg-card/60 p-4 ${depth ? "ml-3" : ""}`}>
        <div className="flex gap-2">
          <IconPick value={c.icon} onChange={(icon) => setC({ ...c, icon })} />
          <Input value={c.name} onChange={(e) => setC({ ...c, name: e.target.value })} className="font-semibold" />
          <Button size="icon" aria-label="Salvar categoria" onClick={() => run(() => saveC({ data: c }))}><Save className="h-4 w-4" /></Button>
          <Button size="icon" variant="destructive" aria-label="Excluir categoria"
            onClick={() => confirm(`Excluir "${cat.name}" e tudo dentro?`) && run(() => del({ data: { table: "categories", id: cat.id } }), "Excluído")}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
        {its.map((i) => <ItemRow key={i.id} item={i} />)}
        {subs.map((s) => <CatBlock key={s.id} cat={s} depth={depth + 1} />)}
        <div className="flex flex-wrap gap-2">
          <Button size="sm" variant="secondary" onClick={() => run(() => saveI({ data: { category_id: cat.id, name: "Novo item", price: 0, icon: "credit-card", sort: its.length + 1 } }), "Item criado")}>
            <Plus className="h-4 w-4" /> Item
          </Button>
          <Button size="sm" variant="secondary" onClick={() => run(() => saveC({ data: { parent_id: cat.id, name: "Nova subcategoria", icon: "credit-card", sort: subs.length + 1 } }), "Subcategoria criada")}>
            <Plus className="h-4 w-4" /> Subcategoria
          </Button>
        </div>
      </div>
    );
  };

  const ItemRow = ({ item }: { item: Item }) => {
    const [i, setI] = useState(item);
    return (
      <div className="flex gap-2">
        <IconPick value={i.icon} onChange={(icon) => setI({ ...i, icon })} />
        <Input value={i.name} onChange={(e) => setI({ ...i, name: e.target.value })} />
        <Input type="number" step="0.01" min="0" value={i.price} onChange={(e) => setI({ ...i, price: Number(e.target.value) })} className="w-24" aria-label="Preço" />
        <Button size="icon" variant="outline" aria-label="Salvar item" onClick={() => run(() => saveI({ data: i }))}><Save className="h-4 w-4" /></Button>
        <Button size="icon" variant="ghost" aria-label="Excluir item" onClick={() => run(() => del({ data: { table: "items", id: item.id } }), "Excluído")}><Trash2 className="h-4 w-4" /></Button>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="font-mono text-sm font-bold tracking-[0.2em]">&gt; PAINEL ADMIN_</h1>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" asChild><a href="/">Ver site</a></Button>
          <Button size="icon" variant="ghost" aria-label="Sair" onClick={() => run(() => logout(), "Saiu")}><LogOut className="h-4 w-4" /></Button>
        </div>
      </div>
      <section className="space-y-4 rounded-2xl border border-border bg-card/60 p-4">
        <div>
          <h2 className="font-mono text-xs font-bold tracking-[0.2em]">TEXTOS DO SITE</h2>
          <p className="mt-1 text-xs text-muted-foreground">Altere os textos exibidos na página principal.</p>
        </div>
        <div className="space-y-3">
          {siteTextFields.map((field) => (
            <div key={field.key} className="space-y-1.5">
              <Label htmlFor={field.key}>{field.label}</Label>
              {field.multiline ? (
                <Textarea id={field.key} value={copy[field.key]} onChange={(e) => setCopy({ ...copy, [field.key]: e.target.value })} />
              ) : (
                <Input id={field.key} value={copy[field.key]} onChange={(e) => setCopy({ ...copy, [field.key]: e.target.value })} />
              )}
            </div>
          ))}
        </div>
        <Button className="w-full" onClick={() => run(() => saveText({ data: siteTextFields.map(({ key }) => ({ key, value: copy[key] })) }), "Textos atualizados!")}>
          <Save className="h-4 w-4" /> Salvar todos os textos
        </Button>
      </section>

      <section className="space-y-4 rounded-2xl border border-border bg-card/60 p-4">
        <div>
          <h2 className="font-mono text-xs font-bold tracking-[0.2em]">FOTOS DO SITE</h2>
          <p className="mt-1 text-xs text-muted-foreground">JPG, PNG ou WebP de até 5 MB.</p>
        </div>
        {imageSlots.map((slot) => {
          const current = images.find((image) => image.key === slot.key);
          return <ImageEditor key={slot.key} label={slot.label} current={current} onUpload={(file, alt) => upload(slot.key, file, alt)} />;
        })}
      </section>
      {tops.map((c) => <CatBlock key={c.id} cat={c} depth={0} />)}
      <Button className="w-full" onClick={() => run(() => saveC({ data: { parent_id: null, name: "Nova categoria", icon: "star", sort: tops.length + 1 } }), "Categoria criada")}>
        <Plus className="h-4 w-4" /> Nova categoria
      </Button>
    </div>
  );
}

function ImageEditor({ label, current, onUpload }: { label: string; current: SiteImage | undefined; onUpload: (file: File, alt: string) => Promise<void> }) {
  const [alt, setAlt] = useState(current?.alt ?? label);
  const [busy, setBusy] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const chooseFile = async (input: HTMLInputElement) => {
    const file = input.files?.[0];
    if (!file) return;
    setBusy(true);
    try { await onUpload(file, alt); } finally { setBusy(false); input.value = ""; }
  };
  return (
    <div className="space-y-2 border-t border-border pt-4 first:border-0 first:pt-0">
      <Label>{label}</Label>
      {current && <img src={current.url} alt={current.alt} className="aspect-video w-full rounded-lg object-cover" />}
      <Input value={alt} onChange={(e) => setAlt(e.target.value)} placeholder="Descrição da foto" aria-label={`Descrição de ${label}`} />
      <Input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp" disabled={busy} aria-label={`Selecionar ${label}`} />
      <Button type="button" variant="secondary" className="w-full" disabled={busy} onClick={() => fileRef.current && chooseFile(fileRef.current)}>
        {busy ? "Enviando..." : current ? "Trocar foto" : "Enviar foto"}
      </Button>
    </div>
  );
}
