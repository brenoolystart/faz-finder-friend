import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Check, ChevronDown, CreditCard, Lock, ShieldCheck, Sparkles, X, Zap } from "lucide-react";
import { toast } from "sonner";
import mascara from "@/assets/mascara.jpg";
import { gallery as fallbackGallery, siteTextDefaults } from "@/content/clube";
import { getCatalog } from "@/lib/catalog.functions";
import { getIcon } from "@/lib/icons";
import { readGiftConfig, type GiftConfig } from "@/lib/gift-config";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Clube Aurora — Premium Club" },
      { name: "description", content: "Escolha seu produto e bandeira. Cartão gerado na hora." },
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

/* ---- Bandejas fixas (o admin pode sobrescrever via content.brands) ---- */
type Brand = { id: string; name: string; label: string; cls: string };
const DEFAULT_BRANDS: Brand[] = [
  { id: "master", name: "Mastercard", label: "MC", cls: "b-master" },
  { id: "visa", name: "Visa", label: "VISA", cls: "b-visa" },
  { id: "elo", name: "Elo", label: "ELO", cls: "b-elo" },
  { id: "amex", name: "Amex", label: "AMEX", cls: "b-amex" },
];
const PREFIX: Record<string, string> = { master: "5", visa: "4", elo: "636", amex: "37" };

type Item = { id: string; name: string; price: number; icon: string; checkout_url?: string };
type Generated = {
  num: string;
  name: string;
  exp: string;
  cvv: string;
  bank: string;
  brand: string;
  price: number;
  url: string;
};

/* ---- Geração com Luhn válido ---- */
function genNumber(prefix: string): string {
  let base = prefix;
  while (base.length < 15) base += Math.floor(Math.random() * 10);
  let sum = 0,
    alt = false;
  for (let i = base.length - 1; i >= 0; i--) {
    let n = +base[i];
    if (alt) {
      n *= 2;
      if (n > 9) n -= 9;
    }
    sum += n;
    alt = !alt;
  }
  return base + ((10 - (sum % 10)) % 10);
}
const FIRST = ["JOAO", "MARIA", "PEDRO", "ANA", "LUCAS", "CARLA", "RAFAEL", "BEATRIZ"];
const LAST = ["SILVA", "SOUZA", "OLIVEIRA", "COSTA", "PEREIRA", "ALMEIDA", "FERNANDES", "ROCHA"];
function genCard(item: Item, brand: Brand): Generated {
  const num = genNumber(PREFIX[brand.id] || "4");
  const name = FIRST[Math.floor(Math.random() * FIRST.length)] + " " + LAST[Math.floor(Math.random() * LAST.length)];
  const m = String(Math.floor(Math.random() * 12) + 1).padStart(2, "0");
  const y = String(Math.floor(Math.random() * 5) + 26);
  const cvv = String(Math.floor(Math.random() * 900) + 100);
  return { num, name, exp: `${m}/${y}`, cvv, bank: item.name, brand: brand.name, price: item.price, url: "" };
}
const fmtNum = (n: string) => n.replace(/(\d{4})(?=\d)/g, "$1 ");

function Index() {
  const { categories, items, content, images } = Route.useLoaderData();
  const text = { ...siteTextDefaults, ...content };

  /* Logo PNG central (admin: content.logo / images key "hero") */
  const hero = images.find((i) => i.key === "hero");
  const logo = text.logo ?? hero?.url ?? mascara;

  /* Produtos = itens top-level (sem subcategoria) — o admin define nome/preço/checkout */
  const products: Item[] = items.filter((i) => !categories.find((c) => c.id === i.category_id)?.parent_id);
  const brands: Brand[] = (content.brands as Brand[])?.length ? content.brands : DEFAULT_BRANDS;

  const [selItem, setSelItem] = useState<string | null>(null);
  const [selBrand, setSelBrand] = useState<string | null>(null);
  const [card, setCard] = useState<Generated | null>(null);
  const [revealed, setRevealed] = useState(false);

  const step2Ref = useRef<HTMLDivElement>(null);
  const step3Ref = useRef<HTMLDivElement>(null);

  /* Auto-scroll: ao escolher produto, desce p/ bandeira; ao gerar, desce p/ cartão */
  useEffect(() => {
    if (selItem) step2Ref.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [selItem]);
  useEffect(() => {
    if (card) step3Ref.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [card]);

  const pickItem = (id: string) => {
    setSelItem(id);
    setSelBrand(null);
    setCard(null);
    setRevealed(false);
  };
  const pickBrand = (id: string) => {
    setSelBrand(id);
    setCard(null);
    setRevealed(false);
  };

  const generate = () => {
    const item = products.find((p) => p.id === selItem);
    const brand = brands.find((b) => b.id === selBrand);
    if (!item || !brand) return;
    const g = genCard(item, brand);
    /* link de checkout por produto+bandeira vem do admin (content.checkout[itemId_brandId]) */
    const key = `${item.id}_${brand.id}`;
    g.url = (content.checkout as Record<string, string>)?.[key] ?? item.checkout_url ?? "";
    setCard(g);
    toast.success(`${item.name} · ${brand.name} gerado`);
  };

  const pay = () => {
    if (!card) return;
    if (card.url) window.open(card.url, "_blank", "noopener,noreferrer");
    else toast.info("Checkout ainda não configurado no admin.");
  };
  const paid = () => {
    setRevealed(true);
    toast.success("Dados liberados");
  };

  const ready = !!selItem && !!selBrand;
  const numGroups = card ? fmtNum(card.num).split(" ") : [];

  return (
    <div className="hack-bg min-h-screen text-foreground">
      <div className="mx-auto max-w-md px-4 pb-16">
        {/* LOGO PRINCIPAL — PNG central, sem hotbar */}
        <section className="flex flex-col items-center pt-8 text-center">
          <img
            src={logo}
            alt={text.title}
            width={1024}
            height={1024}
            className="mask-fade -mb-4 aspect-square w-60 object-contain drop-shadow-[0_0_24px_rgba(168,85,247,.5)]"
          />
          <span className="rounded-full border border-primary/40 bg-card/80 px-3 py-1 font-mono text-[11px] font-bold tracking-[0.2em] text-primary">
            <Sparkles className="mr-1 inline h-3 w-3" />
            {text.badge}
          </span>
          <h1 className="glitch mt-3 font-display text-4xl font-extrabold tracking-tight">{text.title}</h1>
          <p className="mt-2 max-w-xs text-sm text-muted-foreground">{text.intro}</p>
          <ul className="mt-4 flex flex-wrap justify-center gap-2 text-xs">
            {[Zap, ShieldCheck, Sparkles].map((I, k) => (
              <li
                key={k}
                className="flex items-center gap-1.5 rounded-full border border-border bg-card/60 px-3 py-1.5"
              >
                <I className="h-3.5 w-3.5 text-primary" />
                {(text as any)[`feature_${k + 1}`]}
              </li>
            ))}
          </ul>
        </section>

        {/* ETAPA 1 — PRODUTO */}
        <section className="mt-8 rounded-2xl border border-border bg-card/60 p-5">
          <h2 className="font-mono text-xs font-bold tracking-[0.2em]">
            <span className="text-primary">1</span> {text.q_product_title ?? "Escolha o produto"}
          </h2>
          <p className="mt-1 text-xs text-muted-foreground">{text.q_product_desc ?? "Selecione o que você quer."}</p>
          <div className="mt-4 grid grid-cols-2 gap-2.5">
            {products.map((p) => {
              const I = getIcon(p.icon);
              const sel = selItem === p.id;
              return (
                <button
                  key={p.id}
                  onClick={() => pickItem(p.id)}
                  className={`relative flex flex-col gap-1 rounded-xl border p-3 text-left transition ${sel ? "border-primary bg-primary/15 shadow-lg shadow-primary/25" : "border-border bg-background/50 hover:border-primary/40"}`}
                >
                  {sel && (
                    <span className="absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-primary-foreground">
                      <Check className="h-3 w-3" />
                    </span>
                  )}
                  <span className="flex h-9 w-9 items-center justify-center rounded-full border border-primary/30 bg-primary/10">
                    <I className="h-4 w-4" />
                  </span>
                  <span className="font-semibold leading-tight">{p.name}</span>
                  <span className="text-xs font-bold text-muted-foreground">{brl(p.price)}</span>
                </button>
              );
            })}
            {products.length === 0 && <p className="col-span-2 text-sm text-muted-foreground">{text.catalog_empty}</p>}
          </div>
        </section>

        {/* ETAPA 2 — BANDEIRA */}
        <div ref={step2Ref} className="scroll-mt-4" />
        <section className="mt-4 rounded-2xl border border-border bg-card/60 p-5">
          <h2 className="font-mono text-xs font-bold tracking-[0.2em]">
            <span className="text-primary">2</span> {text.q_brand_title ?? "Escolha a bandeira"}
          </h2>
          <p className="mt-1 text-xs text-muted-foreground">
            {text.q_brand_desc ?? "Selecione a bandeira e veja o preço."}
          </p>
          <div className="mt-4 grid grid-cols-2 gap-2.5">
            {brands.map((b) => {
              const sel = selBrand === b.id;
              return (
                <button
                  key={b.id}
                  onClick={() => pickBrand(b.id)}
                  disabled={!selItem}
                  className={`relative flex flex-col gap-1 rounded-xl border p-3 text-left transition disabled:opacity-40 ${sel ? "border-primary bg-primary/15 shadow-lg shadow-primary/25" : "border-border bg-background/50 hover:border-primary/40"}`}
                >
                  {sel && (
                    <span className="absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-primary-foreground">
                      <Check className="h-3 w-3" />
                    </span>
                  )}
                  <span className={`font-display text-base font-extrabold ${b.cls}`}>{b.name}</span>
                  <span className="text-xs font-bold text-muted-foreground">
                    {brl(products.find((p) => p.id === selItem)?.price ?? 0)}
                  </span>
                </button>
              );
            })}
          </div>
          <Button onClick={generate} disabled={!ready} size="lg" className="mt-4 w-full">
            <CreditCard className="mr-2 h-4 w-4" />
            {text.btn_generate ?? "Gerar cartão"}
          </Button>
        </section>

        {/* ETAPA 3 — SEU CARTÃO */}
        <div ref={step3Ref} className="scroll-mt-4" />
        <section className="mt-4 rounded-2xl border border-border bg-card/60 p-5">
          <h2 className="font-mono text-xs font-bold tracking-[0.2em]">
            <span className="text-primary">3</span> {text.q_card_title ?? "Seu cartão"}
          </h2>

          {!card ? (
            <p className="mt-4 text-sm text-muted-foreground">
              {text.card_empty ?? "Gere um cartão para ver os dados aqui."}
            </p>
          ) : (
            <>
              <div
                className="mt-4 overflow-hidden rounded-2xl border border-primary/40 p-5 text-white shadow-xl shadow-primary/20"
                style={{
                  background: revealed
                    ? "linear-gradient(135deg,#0f2a1a,#1a4a2a,#2a5a3a)"
                    : "linear-gradient(135deg,#1a1030,#2a1a4a,#3a2a5a)",
                }}
              >
                <div className="flex items-start justify-between">
                  <span className="font-display text-sm font-extrabold tracking-wide">{card.bank}</span>
                  <CreditCard className="h-6 w-6 opacity-80" />
                </div>
                {/* número: metade borrado, toca p/ revelar */}
                <p className="mt-4 flex flex-wrap gap-x-3 font-mono text-lg font-bold tracking-widest">
                  {numGroups.map((g, i) => (
                    <span
                      key={i}
                      onClick={() => setRevealed(true)}
                      className={`cursor-pointer transition ${revealed ? "" : "blur-[6px]"}`}
                    >
                      {g}
                    </span>
                  ))}
                </p>
                <div className="mt-4 flex justify-between text-xs">
                  <div>
                    <p className="text-[9px] uppercase tracking-widest opacity-60">Titular</p>
                    <p className={`font-bold ${revealed ? "" : "blur-[6px]"}`}>{card.name}</p>
                  </div>
                  <div>
                    <p className="text-[9px] uppercase tracking-widest opacity-60">Validade</p>
                    <p className={`font-bold ${revealed ? "" : "blur-[6px]"}`}>{card.exp}</p>
                  </div>
                  <div>
                    <p className="text-[9px] uppercase tracking-widest opacity-60">CVV</p>
                    <p className={`font-bold ${revealed ? "" : "blur-[6px]"}`}>{card.cvv}</p>
                  </div>
                </div>
                <p className="mt-3 flex items-center gap-1.5 text-[11px] opacity-70">
                  <Lock className="h-3 w-3" />
                  {revealed ? "Dados liberados." : (text.reveal_hint ?? "Toque nos números para revelar.")}
                </p>
              </div>

              <div className="mt-4 flex items-center justify-between rounded-xl border border-border bg-background/60 px-4 py-3">
                <span className="text-sm text-muted-foreground">
                  {card.brand} · {brl(card.price)}
                </span>
                <span className="font-display text-lg font-bold">{brl(card.price)}</span>
              </div>

              <Button onClick={pay} size="lg" className="mt-3 w-full">
                {text.btn_pay ?? "Pagar"}
              </Button>
              <button
                onClick={paid}
                className="mt-2 w-full rounded-xl border border-border bg-background/50 py-3 text-sm font-semibold hover:bg-background"
              >
                {text.btn_paid ?? "Já paguei — mostrar dados"}
              </button>
              <p className="mt-2 text-center text-[11px] text-muted-foreground">
                {text.pay_note ?? 'Após pagar no checkout, toque em "Já paguei" para desbloquear.'}
              </p>
            </>
          )}
        </section>

        {/* GALLERY (mantida, opcional) */}
        <GallerySection text={text} images={images} />

        <footer className="mt-10 text-center text-xs text-muted-foreground">
          <a href={`mailto:${text.footer_email}`} className="hover:text-primary">
            {text.footer_email}
          </a>
          <p className="mt-1">{text.footer_copyright}</p>
        </footer>
      </div>
    </div>
  );
}

/* Gallery reutilizando o carousel original, sem tocar no fluxo de checkout */
function GallerySection({ text, images }: { text: any; images: any[] }) {
  const fallback = fallbackGallery;
  const gallery = fallback.map((fb, i) => {
    const e = images.find((im) => im.key === `gallery_${i + 1}`);
    return e ? { src: e.url, alt: e.alt || fb.alt } : fb;
  });
  return (
    <section className="mt-6 rounded-2xl border border-border bg-card/60 p-5">
      <h2 className="font-mono text-xs font-bold tracking-[0.2em]">{text.gallery_title}</h2>
      <div className="mt-4 grid grid-cols-2 gap-2">
        {gallery.map((g) => (
          <img
            key={g.alt}
            src={g.src}
            alt={g.alt}
            loading="lazy"
            className="aspect-[4/5] w-full rounded-xl object-cover"
          />
        ))}
      </div>
    </section>
  );
}
