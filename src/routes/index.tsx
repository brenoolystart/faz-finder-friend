import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Check, Sparkles, Tag, Ticket } from "lucide-react";
import { toast } from "sonner";
import { AuroraMark } from "@/components/aurora/Logo";
import { contact, faqs, gallery, highlights, plans, steps, type PlanId } from "@/content/clube";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Clube Aurora — Planos Plus e Premium" },
      { name: "description", content: "Conheça os planos Plus e Premium do Clube Aurora e escolha o seu." },
      { property: "og:title", content: "Clube Aurora — Planos Plus e Premium" },
      { property: "og:description", content: "Mais vantagens para o seu dia a dia. Escolha seu plano." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const icons = { tag: Tag, sparkles: Sparkles, ticket: Ticket };
const nav = [
  ["Planos", "#planos"],
  ["Como funciona", "#como-funciona"],
  ["Dúvidas", "#faq"],
];

function Index() {
  const [plan, setPlan] = useState<PlanId>("premium");
  const choose = (id: PlanId) => {
    setPlan(id);
    document.getElementById("interesse")?.scrollIntoView({ behavior: "smooth" });
    setTimeout(() => document.getElementById("nome")?.focus(), 400);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <a href="#conteudo" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-primary focus:px-3 focus:py-2 focus:text-primary-foreground">
        Pular para o conteúdo
      </a>
      <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <a href="#" className="flex items-center gap-2 font-display text-lg font-semibold">
            <AuroraMark /> Clube Aurora
          </a>
          <nav aria-label="Principal" className="flex items-center gap-1 sm:gap-4">
            {nav.map(([l, h]) => (
              <a key={h} href={h} className="hidden rounded-md px-2 py-1 text-sm text-muted-foreground hover:text-foreground sm:inline">{l}</a>
            ))}
            <Button size="sm" onClick={() => document.getElementById("planos")?.scrollIntoView({ behavior: "smooth" })}>Escolher plano</Button>
          </nav>
        </div>
      </header>

      <main id="conteudo">
        <section className="aurora-glow relative overflow-hidden px-4 py-24 text-center sm:py-32">
          <span className="inline-block rounded-full border border-primary/40 bg-primary/10 px-3 py-1 text-xs font-semibold tracking-widest text-primary">CLUBE DE BENEFÍCIOS</span>
          <h1 className="mx-auto mt-6 max-w-3xl font-display text-4xl font-bold leading-tight sm:text-6xl">
            Mais vantagens para o seu <span className="text-gradient">dia a dia</span>
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-lg text-muted-foreground">
            Ofertas de parceiros, novidades em primeira mão e experiências exclusivas — em dois planos simples.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button size="lg" asChild><a href="#planos">Ver planos</a></Button>
            <Button size="lg" variant="outline" asChild><a href="#como-funciona">Como funciona</a></Button>
          </div>
        </section>

        <section aria-label="Benefícios" className="border-y border-border bg-card/50">
          <ul className="mx-auto grid max-w-6xl gap-6 px-4 py-10 sm:grid-cols-3">
            {highlights.map((h) => {
              const Icon = icons[h.icon];
              return (
                <li key={h.title} className="flex gap-4">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-primary"><Icon className="h-5 w-5" aria-hidden /></span>
                  <div><h2 className="font-semibold">{h.title}</h2><p className="text-sm text-muted-foreground">{h.text}</p></div>
                </li>
              );
            })}
          </ul>
        </section>

        <section id="planos" className="scroll-mt-20 px-4 py-24">
          <div className="mx-auto max-w-5xl">
            <h2 className="text-center font-display text-3xl font-bold sm:text-4xl">Escolha seu plano</h2>
            <p className="mt-3 text-center text-muted-foreground">Dois caminhos, o mesmo Clube.</p>
            <div className="mt-12 grid gap-6 md:grid-cols-2">
              {plans.map((p) => (
                <article key={p.id} className={`relative flex flex-col rounded-2xl border p-8 shadow-lg transition ${p.highlight ? "border-primary/60 bg-card shadow-primary/20" : "border-border bg-card/70"}`}>
                  {p.highlight && <span className="absolute -top-3 right-6 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground">Mais completo</span>}
                  <h3 className="font-display text-2xl font-bold">{p.name}</h3>
                  <p className="mt-2 text-muted-foreground">{p.description}</p>
                  <p className="mt-6 rounded-lg border border-dashed border-border px-4 py-3 text-sm text-muted-foreground">{p.priceLabel}</p>
                  <ul className="mt-6 flex-1 space-y-3">
                    {p.benefits.map((b) => (
                      <li key={b} className="flex gap-3 text-sm"><Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden />{b}</li>
                    ))}
                  </ul>
                  <Button className="mt-8" size="lg" variant={p.highlight ? "default" : "secondary"} onClick={() => choose(p.id)} aria-label={`Tenho interesse no plano ${p.name}`}>
                    Tenho interesse
                  </Button>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section aria-labelledby="galeria" className="px-4 pb-24">
          <div className="mx-auto max-w-5xl">
            <h2 id="galeria" className="mb-8 font-display text-2xl font-bold sm:text-3xl">Um pouco do Clube</h2>
            <Carousel opts={{ loop: true }} className="mx-10 sm:mx-12">
              <CarouselContent>
                {gallery.map((g) => (
                  <CarouselItem key={g.alt} className="md:basis-1/2">
                    <img src={g.src} alt={g.alt} width={1280} height={800} loading="lazy" className="aspect-[16/10] w-full rounded-2xl object-cover" />
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious aria-label="Imagem anterior" />
              <CarouselNext aria-label="Próxima imagem" />
            </Carousel>
          </div>
        </section>

        <section id="como-funciona" className="scroll-mt-20 border-t border-border bg-card/40 px-4 py-24">
          <div className="mx-auto max-w-5xl">
            <h2 className="text-center font-display text-3xl font-bold sm:text-4xl">Como funciona</h2>
            <ol className="mt-12 grid gap-6 sm:grid-cols-3">
              {steps.map((s, i) => (
                <li key={s.title} className="rounded-2xl border border-border bg-card p-6">
                  <span className="text-gradient font-display text-3xl font-bold">{i + 1}</span>
                  <h3 className="mt-3 font-semibold">{s.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{s.text}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <InterestForm plan={plan} setPlan={setPlan} />

        <section id="faq" className="scroll-mt-20 px-4 py-24">
          <div className="mx-auto max-w-3xl">
            <h2 className="text-center font-display text-3xl font-bold sm:text-4xl">Perguntas frequentes</h2>
            <Accordion type="single" collapsible className="mt-10">
              {faqs.map((f, i) => (
                <AccordionItem key={f.q} value={`f${i}`}>
                  <AccordionTrigger className="text-left">{f.q}</AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">{f.a}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>
      </main>

      <footer className="border-t border-border px-4 py-10">
        <div className="mx-auto flex max-w-6xl flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2 font-semibold"><AuroraMark className="h-6 w-6" /> Clube Aurora</div>
          <p className="text-sm text-muted-foreground">{contact.email} · {contact.phone}</p>
          <nav aria-label="Rodapé" className="flex gap-4 text-sm text-muted-foreground">
            {["Termos", "Privacidade", "Suporte"].map((l) => <a key={l} href="#" className="hover:text-foreground">{l}</a>)}
          </nav>
        </div>
      </footer>
    </div>
  );
}

function InterestForm({ plan, setPlan }: { plan: PlanId; setPlan: (p: PlanId) => void }) {
  const [sent, setSent] = useState(false);
  return (
    <section id="interesse" className="scroll-mt-20 px-4 py-24">
      <div className="mx-auto max-w-xl rounded-2xl border border-primary/40 bg-card p-8 shadow-xl shadow-primary/10">
        <h2 className="font-display text-2xl font-bold">Demonstrar interesse</h2>
        <p className="mt-2 text-sm text-muted-foreground">Só nome e e-mail. Não pedimos dados de cartão nem documentos.</p>
        {sent ? (
          <p role="status" className="mt-6 rounded-lg bg-primary/10 p-4 text-sm">Obrigado! Entraremos em contato com as instruções do plano {plan === "plus" ? "Plus" : "Premium"}.</p>
        ) : (
          <form
            className="mt-6 space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              // Envio ainda não integrado — futuramente conectar a um serviço de contato/pagamento.
              setSent(true);
              toast.success("Interesse registrado!");
            }}
          >
            <fieldset>
              <legend className="mb-2 text-sm font-medium">Plano</legend>
              <div className="grid grid-cols-2 gap-2">
                {plans.map((p) => (
                  <label key={p.id} className={`cursor-pointer rounded-lg border px-4 py-2 text-center text-sm has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-ring ${plan === p.id ? "border-primary bg-primary/15" : "border-border"}`}>
                    <input type="radio" name="plano" value={p.id} checked={plan === p.id} onChange={() => setPlan(p.id)} className="sr-only" />
                    {p.name}
                  </label>
                ))}
              </div>
            </fieldset>
            <div><Label htmlFor="nome">Nome</Label><Input id="nome" required autoComplete="name" className="mt-1" /></div>
            <div><Label htmlFor="email">E-mail</Label><Input id="email" type="email" required autoComplete="email" className="mt-1" /></div>
            <Button type="submit" size="lg" className="w-full">Enviar interesse</Button>
          </form>
        )}
      </div>
    </section>
  );
}
