CREATE TABLE public.categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_id uuid REFERENCES public.categories(id) ON DELETE CASCADE,
  name text NOT NULL,
  icon text NOT NULL DEFAULT 'credit-card',
  sort int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE public.items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id uuid NOT NULL REFERENCES public.categories(id) ON DELETE CASCADE,
  name text NOT NULL,
  price numeric(10,2) NOT NULL DEFAULT 0,
  icon text NOT NULL DEFAULT 'credit-card',
  sort int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.categories, public.items TO anon, authenticated;
GRANT ALL ON public.categories, public.items TO service_role;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read categories" ON public.categories FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "public read items" ON public.items FOR SELECT TO anon, authenticated USING (true);

DO $$
DECLARE planos uuid; plus uuid; prem uuid; ben uuid; ext uuid;
BEGIN
  INSERT INTO public.categories(name, icon, sort) VALUES ('Planos','credit-card',1) RETURNING id INTO planos;
  INSERT INTO public.categories(name, icon, sort) VALUES ('Benefícios','gift',2) RETURNING id INTO ben;
  INSERT INTO public.categories(name, icon, sort) VALUES ('Extras','sparkles',3) RETURNING id INTO ext;
  INSERT INTO public.categories(parent_id, name, icon, sort) VALUES (planos,'Plano Plus','credit-card',1) RETURNING id INTO plus;
  INSERT INTO public.categories(parent_id, name, icon, sort) VALUES (planos,'Plano Premium','crown',2) RETURNING id INTO prem;
  INSERT INTO public.items(category_id, name, price, sort) VALUES
    (plus,'Plus Lite',19.90,1),(plus,'Plus Pro',29.90,2),(plus,'Plus Master',39.90,3),
    (prem,'Premium Lite',49.90,1),(prem,'Premium Pro',69.90,2),(prem,'Premium Master',99.90,3);
  INSERT INTO public.items(category_id, name, price, icon, sort) VALUES
    (ben,'Descontos em parceiros',9.90,'tag',1),(ben,'Novidades em primeira mão',4.90,'zap',2),(ben,'Atendimento prioritário',14.90,'shield-check',3),
    (ext,'Kit boas-vindas',24.90,'gift',1),(ext,'Acesso antecipado',12.90,'star',2);
END $$;