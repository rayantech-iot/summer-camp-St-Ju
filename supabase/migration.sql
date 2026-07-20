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
