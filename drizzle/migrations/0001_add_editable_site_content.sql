CREATE TABLE public.site_content (
  key text PRIMARY KEY,
  value text NOT NULL DEFAULT '',
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.site_content TO anon, authenticated;
GRANT ALL ON public.site_content TO service_role;
ALTER TABLE public.site_content ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read site content" ON public.site_content FOR SELECT TO anon, authenticated USING (true);

CREATE TABLE public.site_images (
  key text PRIMARY KEY,
  url text NOT NULL,
  alt text NOT NULL DEFAULT '',
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.site_images TO anon, authenticated;
GRANT ALL ON public.site_images TO service_role;
ALTER TABLE public.site_images ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read site images" ON public.site_images FOR SELECT TO anon, authenticated USING (true);