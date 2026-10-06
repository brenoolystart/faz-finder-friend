import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ChevronRight, CreditCard, Gift, Minus, Plus, ShieldCheck, ShoppingCart, Sparkles, X, Zap } from "lucide-react";
import { toast } from "sonner";
import mascara from "@/assets/mascara.jpg";
import { contact, gallery, plans, type PlanId } from "@/content/clube";
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
  component: Index,
});

type Tab = "planos" | "beneficios";
const tabs: { id: Tab; label: string; icon: typeof Gift }[] = [
  { id: "planos", label: "Planos", icon: CreditCard },
  { id: "beneficios", label: "Benefícios", icon: Gift },
];
// Preços fictícios — substituir pelos reais
const tiers: Record<PlanId, { name: string; price: number }[]> = {
  plus: [{ name: "Lite", price: 19.9 }, { name: "Pro", price: 29.9 }, { name: "Master", price: 39.9 }],
  premium: [{ name: "Lite", price: 49.9 }, { name: "Pro", price: 69.9 }, { name: "Master", price: 99.9 }],
};
const beneficios = [
  { name: "Descontos em parceiros", price: 9.9 },
  { name: "Novidades em primeira mão", price: 4.9 },
  { name: "Atendimento prioritário", price: 14.9 },
];
const brl = (n: number) => n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
type Item = { name: string; price: number };

function Index() {
  const [tab, setTab] = useState<Tab>("planos");
  const [open, setOpen] = useState<PlanId | null>(null);
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
  const Row = ({ it, onAdd }: { it: { name: string; sub: string }; onAdd: () => void }) => (
    <li className="flex items-center gap-3">
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-primary/30 bg-primary/10"><CreditCard className="h-4 w-4" /></span>
      <div className="flex-1"><p className="font-semibold">{it.name}</p><p className="text-xs text-muted-foreground">{it.sub}</p></div>
      <button onClick={onAdd} aria-label={`Adicionar ${it.name}`} className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-lg shadow-primary/40"><Plus className="h-5 w-5" /></button>
    </li>
  );

  return (
    <div className="hack-bg min-h-screen text-foreground">
      <div className="mx-auto max-w-md px-4 pb-10">
        <header className="flex items-center justify-between pt-5">
          <span className="flex items-center gap-2 font-mono text-sm text-muted-foreground">
            <span className="h-2 w-2 animate-pulse rounded-full bg-primary" /> @clubeaurora
          </span>
          <button onClick={() => setShowCart(true)} aria-label={`Carrinho, ${count} itens`} className="relative flex h-10 w-10 items-center justify-center rounded-full border border-primary/30 bg-card/60">
            <ShoppingCart className="h-4 w-4" />
            {count > 0 && <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground">{count}</span>}
          </button>
        </header>

        <section className="flex flex-col items-center text-center">
          <img src={mascara} alt="Máscara em fumaça roxa" width={1024} height={1024} className="mask-fade -mb-6 w-72" />
          <span className="relative z-10 rounded-full border border-primary/40 bg-card/80 px-3 py-1 font-mono text-[11px] font-bold tracking-[0.2em] text-primary">
            <Sparkles className="mr-1 inline h-3 w-3" />PREMIUM CLUB
          </span>
          <h1 className="glitch mt-3 font-display text-4xl font-extrabold tracking-tight">CLUBE AURORA</h1>
          <p className="mt-2 max-w-xs text-sm text-muted-foreground">Ofertas, novidades e experiências exclusivas. Cadastro rápido, direto pelo site.</p>
        </section>

        <ul className="mt-6 grid grid-cols-3 gap-2">
          {[[Zap, "Acesso rápido"], [ShieldCheck, "100% seguro"], [Sparkles, "Alta qualidade"]].map(([I, l]) => {
            const Icon = I as typeof Zap;
            return (
              <li key={l as string} className="flex flex-col items-center gap-2 rounded-xl border border-border bg-card/60 py-4 text-xs">
                <Icon className="h-4 w-4 text-primary" />{l as string}
              </li>
            );
          })}
        </ul>

        <nav className="mt-6 grid grid-cols-2 gap-1 rounded-2xl border border-border bg-card/60 p-1.5">
          {tabs.map((t) => (
            <button key={t.id} onClick={() => { setTab(t.id); setOpen(null); }}
              className={`flex items-center justify-center gap-1.5 rounded-xl py-2.5 text-sm font-semibold transition ${tab === t.id ? "bg-primary text-primary-foreground shadow-lg shadow-primary/40" : "text-muted-foreground"}`}>
              <t.icon className="h-4 w-4" />{t.label}
            </button>
          ))}
        </nav>

        <section className="mt-6 rounded-2xl border border-border bg-card/60 p-5">
          <div className="flex items-center justify-between">
            <h2 className="font-mono text-xs font-bold tracking-[0.2em]">
              {tab === "beneficios" ? "BENEFÍCIOS" : open ? <button onClick={() => setOpen(null)}>&lt; PLANO {open.toUpperCase()}</button> : "PLANOS"}
            </h2>
            <span className="text-xs text-muted-foreground">{tab === "beneficios" ? beneficios.length : open ? 3 : plans.length} itens</span>
          </div>
          <ul className="mt-4 space-y-4">
            {tab === "beneficios" && beneficios.map((b) => <Row key={b.name} it={{ name: b.name, sub: brl(b.price) }} onAdd={() => add(b)} />)}
            {tab === "planos" && !open && plans.map((p) => (
              <li key={p.id}>
                <button onClick={() => setOpen(p.id)} className="flex w-full items-center gap-3 text-left">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-primary/30 bg-primary/10"><CreditCard className="h-4 w-4" /></span>
                  <div className="flex-1"><p className="font-semibold">Plano {p.name}</p><p className="text-xs text-muted-foreground">Lite · Pro · Master</p></div>
                  <ChevronRight className="h-5 w-5 text-primary" />
                </button>
              </li>
            ))}
            {tab === "planos" && open && tiers[open].map((t) => {
              const it = { name: `${open === "plus" ? "Plus" : "Premium"} ${t.name}`, price: t.price };
              return <Row key={t.name} it={{ name: it.name, sub: brl(t.price) }} onAdd={() => add(it)} />;
            })}
          </ul>
        </section>

        <section className="mt-6 rounded-2xl border border-border bg-card/60 p-5">
          <div className="flex items-center justify-between">
            <h2 className="font-mono text-xs font-bold tracking-[0.2em]">DEMONSTRAÇÃO</h2>
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
          <p>{contact.email}</p>
          <p className="mt-1">© 2026 Clube Aurora · Todos os direitos reservados</p>
        </footer>
      </div>

      {showCart && (
        <div className="fixed inset-0 z-50 flex items-end bg-background/70 backdrop-blur-sm" onClick={() => setShowCart(false)}>
          <div className="mx-auto w-full max-w-md rounded-t-3xl border border-primary/30 bg-card p-5" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <h2 className="font-mono text-xs font-bold tracking-[0.2em]">CARRINHO</h2>
              <button onClick={() => setShowCart(false)} aria-label="Fechar"><X className="h-5 w-5" /></button>
            </div>
            {lines.length === 0 ? <p className="py-8 text-center text-sm text-muted-foreground">Seu carrinho está vazio.</p> : (
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
              <span className="text-sm text-muted-foreground">Total</span><span className="font-display text-xl font-bold">{brl(total)}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
