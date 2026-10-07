// Conteúdo central e editável do Clube Aurora (textos ilustrativos — revisar antes de publicar).
import img1 from "@/assets/clube-1.jpg";
import img2 from "@/assets/clube-2.jpg";
import img3 from "@/assets/clube-3.jpg";
import img4 from "@/assets/clube-4.jpg";

export type PlanId = "plus" | "premium";

export interface Plan {
  id: PlanId;
  name: string;
  description: string;
  benefits: string[];
  priceLabel: string; // placeholder até definir preços
  highlight?: boolean;
}

export const plans: Plan[] = [
  {
    id: "plus",
    name: "Plus",
    description: "O plano de entrada para aproveitar o Clube no dia a dia.",
    benefits: [
      "Acesso às ofertas de parceiros participantes",
      "Novidades e lançamentos em primeira mão",
      "Newsletter mensal com seleções do Clube",
    ],
    priceLabel: "Preço a definir",
  },
  {
    id: "premium",
    name: "Premium",
    description: "Todos os benefícios Plus e vantagens adicionais selecionadas.",
    benefits: [
      "Tudo do plano Plus",
      "Descontos ampliados em parceiros selecionados",
      "Convites para eventos e experiências exclusivas",
      "Atendimento prioritário",
    ],
    priceLabel: "Preço a definir",
    highlight: true,
  },
];

export const highlights = [
  { icon: "tag", title: "Ofertas de parceiros", text: "Descontos em marcas e serviços participantes." },
  { icon: "sparkles", title: "Novidades em primeira mão", text: "Saiba antes de todo mundo o que vem por aí." },
  { icon: "ticket", title: "Experiências exclusivas", text: "Eventos e convites pensados para membros." },
] as const;

export const gallery = [
  { src: img1, alt: "Amigos jantando em um terraço ao entardecer" },
  { src: img2, alt: "Pessoa tomando café em um ambiente aconchegante" },
  { src: img3, alt: "Público em um show com luzes roxas" },
  { src: img4, alt: "Casal observando o nascer do sol nas montanhas" },
];

export const steps = [
  { title: "Escolha um plano", text: "Compare Plus e Premium e indique seu interesse." },
  { title: "Receba as instruções", text: "Entraremos em contato com os próximos passos." },
  { title: "Aproveite os benefícios", text: "Use suas vantagens nos parceiros participantes." },
];

export const faqs = [
  { q: "Quais são os benefícios de cada plano?", a: "O Plus dá acesso às ofertas participantes e novidades. O Premium inclui tudo do Plus e vantagens adicionais. Os detalhes finais serão divulgados em breve." },
  { q: "Qual é a validade da associação?", a: "As regras de validade ainda serão definidas e informadas antes da contratação." },
  { q: "Posso cancelar quando quiser?", a: "As condições de cancelamento serão publicadas junto com os termos comerciais." },
  { q: "Preciso informar dados de pagamento agora?", a: "Não. Nesta fase coletamos apenas seu nome e e-mail para contato. Nunca pedimos dados de cartão." },
];

export const contact = { email: "contato@clubeaurora.exemplo", phone: "(00) 0000-0000" };

export const siteTextDefaults = {
  handle: "@clubeaurora",
  badge: "PREMIUM CLUB",
  title: "CLUBE AURORA",
  intro: "Ofertas, novidades e experiências exclusivas. Cadastro rápido, direto pelo site.",
  feature_1: "Acesso rápido",
  feature_2: "100% seguro",
  feature_3: "Alta qualidade",
  item_count_label: "itens",
  options_label: "Ver opções",
  catalog_empty: "Nenhum item ainda.",
  gallery_title: "DEMONSTRAÇÃO",
  footer_email: "contato@clubeaurora.exemplo",
  footer_copyright: "© 2026 Clube Aurora · Todos os direitos reservados",
  cart_title: "CARRINHO",
  cart_empty: "Seu carrinho está vazio.",
  total_label: "Total",
  gift_form_title: "PERSONALIZE SEU VALE-PRESENTE",
  gift_issuer_label: "LOJA EMISSORA",
  gift_select_placeholder: "Selecione uma opção",
  gift_continue: "Continuar",
  gift_close: "Fechar",
  gift_preview_title: "SEU GIFT CARD",
  gift_preparing_title: "PREPARANDO SEU VALE",
  gift_preparing: "Preparando a prévia…",
  gift_code_label: "CÓDIGO DO VALE-PRESENTE",
  gift_preview_note: "Prévia ilustrativa. O código válido é fornecido pela loja emissora após a compra.",
  gift_pay: "Continuar para pagamento",
  gift_unavailable: "Pagamento indisponível no momento.",
  gift_payment_note: "O pagamento é realizado no checkout da loja.",
} as const;

export type SiteTextKey = keyof typeof siteTextDefaults;

export const siteTextFields: Array<{ key: SiteTextKey; label: string; multiline?: boolean }> = [
  { key: "handle", label: "Nome no topo" },
  { key: "badge", label: "Selo acima do título" },
  { key: "title", label: "Título principal" },
  { key: "intro", label: "Texto de apresentação", multiline: true },
  { key: "feature_1", label: "Destaque 1" },
  { key: "feature_2", label: "Destaque 2" },
  { key: "feature_3", label: "Destaque 3" },
  { key: "item_count_label", label: "Palavra da contagem de itens" },
  { key: "options_label", label: "Texto para abrir opções" },
  { key: "catalog_empty", label: "Mensagem de categoria vazia" },
  { key: "gallery_title", label: "Título das fotos" },
  { key: "footer_email", label: "Contato no rodapé" },
  { key: "footer_copyright", label: "Direitos no rodapé" },
  { key: "cart_title", label: "Título do carrinho" },
  { key: "cart_empty", label: "Mensagem do carrinho vazio" },
  { key: "total_label", label: "Texto do total" },
  { key: "gift_form_title", label: "Título do formulário do vale" },
  { key: "gift_issuer_label", label: "Rótulo da loja emissora" },
  { key: "gift_select_placeholder", label: "Texto de seleção do vale" },
  { key: "gift_continue", label: "Botão continuar do vale" },
  { key: "gift_close", label: "Fechar vale" },
  { key: "gift_preview_title", label: "Título da prévia do vale" },
  { key: "gift_preparing_title", label: "Título de preparação do vale" },
  { key: "gift_preparing", label: "Mensagem de preparação" },
  { key: "gift_code_label", label: "Rótulo do código do vale" },
  { key: "gift_preview_note", label: "Aviso da prévia ilustrativa", multiline: true },
  { key: "gift_pay", label: "Botão de pagamento do vale" },
  { key: "gift_unavailable", label: "Pagamento indisponível" },
  { key: "gift_payment_note", label: "Aviso do checkout do vale", multiline: true },
];
