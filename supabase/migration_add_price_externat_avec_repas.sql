-- Ajouter la colonne price_externat_avec_repas à la table offers
ALTER TABLE public.offers ADD COLUMN IF NOT EXISTS price_externat_avec_repas INTEGER;

-- Mettre à jour les offres existantes avec les nouveaux prix
UPDATE public.offers SET price_externat_avec_repas = 350 WHERE type = 'basket';
UPDATE public.offers SET price_externat_avec_repas = 350 WHERE type = 'multisport';
