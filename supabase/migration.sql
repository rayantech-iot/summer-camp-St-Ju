-- 1. Ajouter la colonne price_externat_avec_repas
ALTER TABLE public.offers ADD COLUMN IF NOT EXISTS price_externat_avec_repas INTEGER;

-- 2. Mettre à jour les offres existantes
UPDATE public.offers SET price_externat_avec_repas = 350 WHERE type = 'basket';
UPDATE public.offers SET price_externat_avec_repas = 350 WHERE type = 'multisport';

-- 3. Mettre à jour les lieux et publics
UPDATE public.offers SET lieu = 'Valleiry & Vulbens (74520)' WHERE type = 'basket';
UPDATE public.offers SET lieu = 'Valleiry & Vulbens (74520)' WHERE type = 'multisport';
UPDATE public.offers SET public = 'U11 à U17 (11-17 ans)' WHERE type = 'basket';
UPDATE public.offers SET public = '6-10 ans' WHERE type = 'multisport';

-- 4. RLS policies pour memory_media (manquantes)
DROP POLICY IF EXISTS "anon_all" ON public.memory_media;
CREATE POLICY "anon_all" ON public.memory_media FOR ALL TO anon USING (true) WITH CHECK (true);

-- 5. Table us_edition_interests
CREATE TABLE IF NOT EXISTS public.us_edition_interests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  parent_name TEXT NOT NULL,
  child_first_name TEXT NOT NULL,
  child_age INTEGER NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

DROP POLICY IF EXISTS "anon_insert" ON public.us_edition_interests;
CREATE POLICY "anon_insert" ON public.us_edition_interests FOR INSERT TO anon WITH CHECK (true);

DROP POLICY IF EXISTS "anon_select" ON public.us_edition_interests;
CREATE POLICY "anon_select" ON public.us_edition_interests FOR SELECT TO anon USING (true);
