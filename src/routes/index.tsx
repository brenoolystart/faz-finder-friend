import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { CreditCard, Gift, Plus, ShieldCheck, ShoppingCart, Sparkles, Ticket, Zap } from "lucide-react";
import { toast } from "sonner";
import mascara from "@/assets/mascara.jpg";
import { contact, gallery, plans, type PlanId } from "@/content/clube";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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

type Tab = "planos" | "beneficios" | "experiencias";
const tabs: { id: Tab; label: string; icon: typeof Gift }[] = [
  { id: "planos", label: "Planos", icon: CreditCard },
  { id: "beneficios", label: "Benefícios", icon: Gift },
  { id: "experiencias", label: "Eventos", icon: Ticket },
];
const items: Record<Tab, { title: string; name: string; sub: string; plan?: PlanId }[]> = {
  planos: plans.map((p) => ({ title: "PLANOS", name: `Plano ${p.name}`, sub: p.priceLabel, plan: p.id })),
  beneficios: [
    { title: "BENEFÍCIOS", name: "Descontos em parceiros", sub: "Plus e Premium" },
    { title: "BENEFÍCIOS", name: "Novidades em primeira mão", sub: "Plus e Premium" },
    { title: "BENEFÍCIOS", name: "Atendimento prioritário", sub: "Premium" },
  ],
  experiencias: [
    { title: "EVENTOS", name: "Shows e festivais", sub: "Convites Premium" },
    { title: "EVENTOS", name: "Jantares exclusivos", sub: "Convites Premium" },
  ],
};

function Index() {
  const [tab, setTab] = useState<Tab>("planos");
  const [plan, setPlan] = useState<PlanId>("premium");
  const [api, setApi] = useState<CarouselApi>();
  const [slide, setSlide] = useState(0);
  useEffect(() => {
    if (!api) return;
    const f = () => setSlide(api.selectedScrollSnap());
    api.on("select", f);
    return () => { api.off("select", f); };
  }, [api]);
  const list = items[tab];
  const pick = (id?: PlanId) => {
    if (id) setPlan(id);
    document.getElementById("interesse")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="hack-bg min-h-screen text-foreground">
      <div className="mx-auto max-w-md px-4 pb-10">
        <header className="flex items-center justify-between pt-5">
          <span className="flex items-center gap-2 font-mono text-sm text-muted-foreground">
            <span className="h-2 w-2 animate-pulse rounded-full bg-primary" /> @clubeaurora
          </span>
          <button onClick={() => pick()} aria-label="Ir para o formulário" className="flex h-10 w-10 items-center justify-center rounded-full border border-primary/30 bg-card/60">
            <ShoppingCart className="h-4 w-4" />
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

        <nav className="mt-6 grid grid-cols-3 gap-1 rounded-2xl border border-border bg-card/60 p-1.5">
          {tabs.map((t) => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`flex items-center justify-center gap-1.5 rounded-xl py-2.5 text-sm font-semibold transition ${tab === t.id ? "bg-primary text-primary-foreground shadow-lg shadow-primary/40" : "text-muted-foreground"}`}>
              <t.icon className="h-4 w-4" />{t.label}
            </button>
          ))}
        </nav>

        <section className="mt-6 rounded-2xl border border-border bg-card/60 p-5">
          <div className="flex items-center justify-between">
            <h2 className="font-mono text-xs font-bold tracking-[0.2em]">{list[0]?.title}</h2>
            <span className="text-xs text-muted-foreground">{list.length} itens</span>
          </div>
          <ul className="mt-4 space-y-4">
            {list.map((it) => (
              <li key={it.name} className="flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-full border border-primary/30 bg-primary/10"><CreditCard className="h-4 w-4" /></span>
                <div className="flex-1"><p className="font-semibold">{it.name}</p><p className="text-xs text-muted-foreground">{it.sub}</p></div>
                <button onClick={() => pick(it.plan)} aria-label={`Quero ${it.name}`} className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-lg shadow-primary/40">
                  <Plus className="h-5 w-5" />
                </button>
              </li>
            ))}
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

        <InterestForm plan={plan} setPlan={setPlan} />

        <footer className="mt-10 text-center text-xs text-muted-foreground">
          <p>{contact.email}</p>
          <p className="mt-1">© 2026 Clube Aurora · Todos os direitos reservados</p>
        </footer>
      </div>
    </div>
  );
}

function InterestForm({ plan, setPlan }: { plan: PlanId; setPlan: (p: PlanId) => void }) {
  const [sent, setSent] = useState(false);
  return (
    <section id="interesse" className="mt-6 scroll-mt-6 rounded-2xl border border-primary/40 bg-card/70 p-5">
      <h2 className="font-mono text-xs font-bold tracking-[0.2em]">&gt; QUERO PARTICIPAR_</h2>
      {sent ? (
        <p role="status" className="mt-4 rounded-lg bg-primary/10 p-4 text-sm">Obrigado! Entraremos em contato sobre o plano {plan === "plus" ? "Plus" : "Premium"}.</p>
      ) : (
        <form className="mt-4 space-y-3" onSubmit={(e) => { e.preventDefault(); setSent(true); toast.success("Interesse registrado!"); }}>
          <div className="grid grid-cols-2 gap-2">
            {plans.map((p) => (
              <button type="button" key={p.id} onClick={() => setPlan(p.id)}
                className={`rounded-lg border py-2 text-sm ${plan === p.id ? "border-primary bg-primary/15" : "border-border"}`}>{p.name}</button>
            ))}
          </div>
          <div><Label htmlFor="nome">Nome</Label><Input id="nome" required className="mt-1" /></div>
          <div><Label htmlFor="email">E-mail</Label><Input id="email" type="email" required className="mt-1" /></div>
          <Button type="submit" size="lg" className="w-full">Enviar</Button>
        </form>
      )}
    </section>
  );
}
