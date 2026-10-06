import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ChevronRight, Minus, Plus, ShieldCheck, ShoppingCart, Sparkles, X, Zap } from "lucide-react";
import { toast } from "sonner";
import mascara from "@/assets/mascara.jpg";
import { gallery as fallbackGallery, siteTextDefaults } from "@/content/clube";
import { getCatalog } from "@/lib/catalog.functions";
import { getIcon } from "@/lib/icons";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, type CarouselApi } from "@/components/ui/carousel";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Clube Aurora — Premium Club" },
      { name: "description", content: "Planos Plus e Premium do Clube Aurora: ofertas, novidades e experiências exclusivas." },
      { property: "og:title", content: "Clube Aurora — Premium Club" },
      { property: "og:description", content: "Escolha seu plano e aproveite vantagens exclusivas." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  loader: () => getCatalog(),
  errorComponent: () => <p className="p-8 text-center">Erro ao carregar o catálogo.</p>,
  component: Index,
});

const brl = (n: number) => n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
type Item = { name: string; price: number };


function Index() {
  const { categories, items, content, images } = Route.useLoaderData();
  const text = { ...siteTextDefaults, ...content };
  const hero = images.find((image) => image.key === "hero");
  const gallery = fallbackGallery.map((fallback, index) => {
    const editable = images.find((image) => image.key === `gallery_${index + 1}`);
    return editable ? { src: editable.url, alt: editable.alt || fallback.alt } : fallback;
  });
  const tops = categories.filter((c) => !c.parent_id);
  const [tab, setTab] = useState<string>(tops[0]?.id ?? "");
  const [open, setOpen] = useState<string | null>(null);
  const current = open ?? tab;
  const subs = categories.filter((c) => c.parent_id === current);
  const its = items.filter((i) => i.category_id === current);
  const openCat = categories.find((c) => c.id === open);
  const [cart, setCart] = useState<Record<string, Item & { qty: number }>>({});
  const [showCart, setShowCart] = useState(false);
  const [api, setApi] = useState<CarouselApi>();
  const [slide, setSlide] = useState(0);
  useEffect(() => {
    if (!api) return;
    const f = () => setSlide(api.selectedScrollSnap());
    api.on("select", f);
    return () => { api.off("select", f); };
  }, [api]);
  const add = (it: Item) => {
    setCart((c) => ({ ...c, [it.name]: { ...it, qty: (c[it.name]?.qty ?? 0) + 1 } }));
    toast.success(`${it.name} adicionado ao carrinho`);
  };
  const dec = (name: string) => setCart((c) => {
    const n = { ...c }; const cur = n[name]; if (!cur) return c; if (cur.qty <= 1) delete n[name]; else n[name] = { ...cur, qty: cur.qty - 1 }; return n;
  });
  const lines = Object.values(cart);
  const count = lines.reduce((s, l) => s + l.qty, 0);
  const total = lines.reduce((s, l) => s + l.qty * l.price, 0);
  const Row = ({ it, onAdd }: { it: { name: string; sub: string; icon: string }; onAdd: () => void }) => {
    const I = getIcon(it.icon);
    return (
    <li className="flex items-center gap-3">
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-primary/30 bg-primary/10"><I className="h-4 w-4" /></span>
      <div className="flex-1"><p className="font-semibold">{it.name}</p><p className="text-xs text-muted-foreground">{it.sub}</p></div>
      <button onClick={onAdd} aria-label={`Adicionar ${it.name}`} className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-lg shadow-primary/40"><Plus className="h-5 w-5" /></button>
    </li>
  );
  };

  return (
    <div className="hack-bg min-h-screen text-foreground">
      <div className="mx-auto max-w-md px-4 pb-10">
        <header className="flex items-center justify-between pt-5">
          <span className="flex items-center gap-2 font-mono text-sm text-muted-foreground">
            <span className="h-2 w-2 animate-pulse rounded-full bg-primary" /> {text.handle}
          </span>
          <button onClick={() => setShowCart(true)} aria-label={`Carrinho, ${count} itens`} className="relative flex h-10 w-10 items-center justify-center rounded-full border border-primary/30 bg-card/60">
            <ShoppingCart className="h-4 w-4" />
            {count > 0 && <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground">{count}</span>}
          </button>
        </header>

        <section className="flex flex-col items-center text-center">
          <img src={hero?.url ?? mascara} alt={hero?.alt || "Máscara em fumaça roxa"} width={1024} height={1024} className="mask-fade -mb-6 aspect-square w-72 object-cover" />
          <span className="relative z-10 rounded-full border border-primary/40 bg-card/80 px-3 py-1 font-mono text-[11px] font-bold tracking-[0.2em] text-primary">
            <Sparkles className="mr-1 inline h-3 w-3" />{text.badge}
          </span>
          <h1 className="glitch mt-3 font-display text-4xl font-extrabold tracking-tight">{text.title}</h1>
          <p className="mt-2 max-w-xs text-sm text-muted-foreground">{text.intro}</p>
        </section>

        <ul className="mt-6 grid grid-cols-3 gap-2">
          {[[Zap, text.feature_1], [ShieldCheck, text.feature_2], [Sparkles, text.feature_3]].map(([I, l]) => {
            const Icon = I as typeof Zap;
            return (
              <li key={l as string} className="flex flex-col items-center gap-2 rounded-xl border border-border bg-card/60 py-4 text-xs">
                <Icon className="h-4 w-4 text-primary" />{l as string}
              </li>
            );
          })}
        </ul>

        <nav style={{ gridTemplateColumns: `repeat(${tops.length || 1}, minmax(0, 1fr))` }} className="mt-6 grid gap-1 rounded-2xl border border-border bg-card/60 p-1.5">
          {tops.map((t) => { const TI = getIcon(t.icon); return (
            <button key={t.id} onClick={() => { setTab(t.id); setOpen(null); }}
              className={`flex items-center justify-center gap-1.5 rounded-xl py-2.5 text-sm font-semibold transition ${tab === t.id ? "bg-primary text-primary-foreground shadow-lg shadow-primary/40" : "text-muted-foreground"}`}>
              <TI className="h-4 w-4 shrink-0" /><span className="truncate">{t.name}</span>
            </button>
          ); })}
        </nav>

        <section className="mt-6 rounded-2xl border border-border bg-card/60 p-5">
          <div className="flex items-center justify-between">
            <h2 className="font-mono text-xs font-bold tracking-[0.2em]">
              {openCat ? <button onClick={() => setOpen(openCat.parent_id === tab ? null : openCat.parent_id)}>&lt; {openCat.name.toUpperCase()}</button> : tops.find((t) => t.id === tab)?.name.toUpperCase()}
            </h2>
            <span className="text-xs text-muted-foreground">{subs.length + its.length} {text.item_count_label}</span>
          </div>
          <ul className="mt-4 space-y-4">
            {subs.map((c) => { const CI = getIcon(c.icon); return (
              <li key={c.id}>
                <button onClick={() => setOpen(c.id)} className="flex w-full items-center gap-3 text-left">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-primary/30 bg-primary/10"><CI className="h-4 w-4" /></span>
                  <div className="flex-1"><p className="font-semibold">{c.name}</p><p className="text-xs text-muted-foreground">{items.filter((i) => i.category_id === c.id).map((i) => i.name).join(" · ") || text.options_label}</p></div>
                  <ChevronRight className="h-5 w-5 text-primary" />
                </button>
              </li>
            ); })}
            {its.map((i) => <Row key={i.id} it={{ name: i.name, sub: brl(i.price), icon: i.icon }} onAdd={() => add({ name: i.name, price: i.price })} />)}
            {subs.length + its.length === 0 && <li className="text-sm text-muted-foreground">{text.catalog_empty}</li>}
          </ul>
        </section>

        <section className="mt-6 rounded-2xl border border-border bg-card/60 p-5">
          <div className="flex items-center justify-between">
            <h2 className="font-mono text-xs font-bold tracking-[0.2em]">{text.gallery_title}</h2>
            <span className="text-xs text-muted-foreground">{slide + 1} / {gallery.length}</span>
          </div>
          <Carousel setApi={setApi} opts={{ loop: true }} className="mt-4">
            <CarouselContent>
              {gallery.map((g) => (
                <CarouselItem key={g.alt}>
                  <img src={g.src} alt={g.alt} loading="lazy" className="aspect-[4/5] w-full rounded-xl object-cover" />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-2" aria-label="Anterior" />
            <CarouselNext className="right-2" aria-label="Próxima" />
          </Carousel>
          <div className="mt-3 flex justify-center gap-1.5">
            {gallery.map((g, i) => <span key={g.alt} className={`h-1.5 rounded-full transition-all ${i === slide ? "w-6 bg-primary" : "w-1.5 bg-muted-foreground/50"}`} />)}
          </div>
        </section>


        <footer className="mt-10 text-center text-xs text-muted-foreground">
          <p>{text.footer_email}</p>
          <p className="mt-1">{text.footer_copyright}</p>
        </footer>
      </div>

      {showCart && (
        <div className="fixed inset-0 z-50 flex items-end bg-background/70 backdrop-blur-sm" onClick={() => setShowCart(false)}>
          <div className="mx-auto w-full max-w-md rounded-t-3xl border border-primary/30 bg-card p-5" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <h2 className="font-mono text-xs font-bold tracking-[0.2em]">{text.cart_title}</h2>
              <button onClick={() => setShowCart(false)} aria-label="Fechar"><X className="h-5 w-5" /></button>
            </div>
            {lines.length === 0 ? <p className="py-8 text-center text-sm text-muted-foreground">{text.cart_empty}</p> : (
              <ul className="mt-4 max-h-[50vh] space-y-3 overflow-auto">
                {lines.map((l) => (
                  <li key={l.name} className="flex items-center gap-3">
                    <div className="flex-1"><p className="font-semibold">{l.name}</p><p className="text-xs text-muted-foreground">{brl(l.price)}</p></div>
                    <button onClick={() => dec(l.name)} aria-label="Diminuir" className="flex h-8 w-8 items-center justify-center rounded-lg border border-border"><Minus className="h-4 w-4" /></button>
                    <span className="w-5 text-center text-sm">{l.qty}</span>
                    <button onClick={() => add(l)} aria-label="Aumentar" className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground"><Plus className="h-4 w-4" /></button>
                  </li>
                ))}
              </ul>
            )}
            <div className="mt-5 flex items-center justify-between border-t border-border pt-4">
              <span className="text-sm text-muted-foreground">{text.total_label}</span><span className="font-display text-xl font-bold">{brl(total)}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
