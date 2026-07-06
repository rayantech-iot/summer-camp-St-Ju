-- =============================================
-- Genevois Summer Camp — Schéma Supabase
-- =============================================

-- 1. Coachs
CREATE TABLE coaches (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  bio TEXT NOT NULL DEFAULT '',
  diplomas TEXT[] NOT NULL DEFAULT '{}',
  citation TEXT NOT NULL DEFAULT '',
  image_url TEXT NOT NULL DEFAULT '',
  featured BOOLEAN NOT NULL DEFAULT false,
  "order" INTEGER NOT NULL DEFAULT 0
);

-- 2. Éditions (Memories)
CREATE TABLE editions (
  id TEXT PRIMARY KEY,
  year INTEGER NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('basket', 'multisport')),
  title TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Médias (photos/vidéos des Memories)
CREATE TABLE memory_media (
  id TEXT PRIMARY KEY,
  edition_id TEXT NOT NULL REFERENCES editions(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('image', 'video')),
  thumbnail_url TEXT DEFAULT '',
  alt TEXT DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index pour requêtes rapides
CREATE INDEX idx_memory_media_edition ON memory_media(edition_id);

-- 4. Témoignages
CREATE TABLE testimonials (
  id TEXT PRIMARY KEY,
  author TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('parent', 'jeune', 'coach')),
  content TEXT NOT NULL,
  rating INTEGER NOT NULL DEFAULT 5,
  video_url TEXT DEFAULT '',
  edition_id TEXT REFERENCES editions(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. FAQ
CREATE TABLE faq_items (
  id TEXT PRIMARY KEY,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  "order" INTEGER NOT NULL DEFAULT 0
);

-- 6. Offres (Camp Basket / Multisport)
CREATE TABLE offers (
  id TEXT PRIMARY KEY,
  type TEXT NOT NULL CHECK (type IN ('basket', 'multisport')),
  dates TEXT[] NOT NULL DEFAULT '{}',
  price_externat INTEGER NOT NULL,
  price_internat INTEGER,
  lieu TEXT NOT NULL,
  "public" TEXT NOT NULL DEFAULT '',
  description TEXT NOT NULL DEFAULT ''
);

-- Insérer les offres par défaut
INSERT INTO offers (id, type, dates, price_externat, price_internat, lieu, "public", description) VALUES
  ('basket', 'basket', ARRAY['4-11 juillet 2026', '11-18 juillet 2026'], 300, 490, 'Valleiry (74520)', 'U11-U16', 'Camp basket intensif'),
  ('multisport', 'multisport', ARRAY['6-13 juillet 2026', '13-17 juillet 2026'], 300, NULL, 'Vulbens (74520)', 'U11-U16', 'Édition multisport');

-- 7. Inscriptions
CREATE TABLE inscriptions (
  id TEXT PRIMARY KEY,
  child_name TEXT NOT NULL,
  child_age INTEGER NOT NULL,
  parent_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  camp_type TEXT NOT NULL CHECK (camp_type IN ('basket', 'multisport')),
  session TEXT NOT NULL DEFAULT '',
  formule TEXT NOT NULL CHECK (formule IN ('externat', 'internat')),
  message TEXT DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 8. Messages de contact
CREATE TABLE contact_messages (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT DEFAULT '',
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================
-- Row Level Security (RLS)
-- =============================================

-- Activer RLS sur toutes les tables
ALTER TABLE coaches ENABLE ROW LEVEL SECURITY;
ALTER TABLE editions ENABLE ROW LEVEL SECURITY;
ALTER TABLE memory_media ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE faq_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE inscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

-- Lecture publique pour les tables du site
CREATE POLICY "Lecture publique coachs" ON coaches FOR SELECT USING (true);
CREATE POLICY "Lecture publique editions" ON editions FOR SELECT USING (true);
CREATE POLICY "Lecture publique media" ON memory_media FOR SELECT USING (true);
CREATE POLICY "Lecture publique temoignages" ON testimonials FOR SELECT USING (true);
CREATE POLICY "Lecture publique faq" ON faq_items FOR SELECT USING (true);
CREATE POLICY "Lecture publique offres" ON offers FOR SELECT USING (true);

-- Écriture publique pour inscriptions et contact (les visiteurs doivent pouvoir envoyer)
CREATE POLICY "Ecriture publique inscriptions" ON inscriptions FOR INSERT WITH CHECK (true);
CREATE POLICY "Ecriture publique contact" ON contact_messages FOR INSERT WITH CHECK (true);

-- Admin : tout est permis via l'auth
CREATE POLICY "Admin full access coachs" ON coaches FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access editions" ON editions FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access media" ON memory_media FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access temoignages" ON testimonials FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access faq" ON faq_items FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access offres" ON offers FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access inscriptions" ON inscriptions FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access contact" ON contact_messages FOR ALL USING (auth.role() = 'authenticated');

-- =============================================
-- Bucket de stockage pour les photos
-- =============================================
-- À créer manuellement dans Supabase Dashboard > Storage > Create bucket
-- Nom du bucket : memories
-- Public : true
-- RLS policy : 
--   SELECT : public
--   INSERT/UPDATE/DELETE : authenticated only
