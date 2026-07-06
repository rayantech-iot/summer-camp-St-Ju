// Seed script — imports static data into Supabase
// Uses direct fetch to avoid WebSocket issues with Node 20

const SUPABASE_URL = 'https://tjuzeadfqxztxfsqrffp.supabase.co';
const SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRqdXplYWRmcXh6dHhmc3FyZmZwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MzM1NzgwMywiZXhwIjoyMDk4OTMzODAzfQ.ump_CoB4PKyFi1-Qzp7N4nfulOwMXvmDalmZTPal9kw';

const headers = {
  'apikey': SERVICE_KEY,
  'Authorization': `Bearer ${SERVICE_KEY}`,
  'Content-Type': 'application/json',
  'Prefer': 'return=minimal',
};

async function upsert(table, data) {
  // Update existing record
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}?id=eq.${data.id}`, {
    method: 'PATCH',
    headers: {
      'apikey': SERVICE_KEY,
      'Authorization': `Bearer ${SERVICE_KEY}`,
      'Content-Type': 'application/json',
      'Prefer': 'return=minimal',
    },
    body: JSON.stringify(data),
  });
  if (!res.ok && res.status !== 404) {
    const text = await res.text();
    throw new Error(`${table}: PATCH ${res.status} ${text}`);
  }
  if (res.status === 404) {
    // Insert new
    const res2 = await fetch(`${SUPABASE_URL}/rest/v1/${table}`, {
      method: 'POST',
      headers: {
        'apikey': SERVICE_KEY,
        'Authorization': `Bearer ${SERVICE_KEY}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=minimal',
      },
      body: JSON.stringify(data),
    });
    if (!res2.ok) {
      const text = await res2.text();
      throw new Error(`${table}: POST ${res2.status} ${text}`);
    }
  }
  return res;
}

async function checkTable(table) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}?limit=1`, {
    headers: { ...headers, 'Prefer': '' },
  });
  return res.ok;
}

async function init() {
  // Vérifier que les tables existent
  const tables = ['coaches', 'offers', 'faq_items'];
  for (const t of tables) {
    const ok = await checkTable(t);
    if (!ok) {
      console.log(`✗ Table "${t}" introuvable.`);
      console.log('→ Va dans le SQL Editor de Supabase et exécute supabase-schema.sql');
      process.exit(1);
    }
  }
  console.log('✓ Tables OK');

  // Créer le compte admin
  try {
    const res = await fetch(`${SUPABASE_URL}/auth/v1/admin/users`, {
      method: 'POST',
      headers: {
        'apikey': SERVICE_KEY,
        'Authorization': `Bearer ${SERVICE_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'admin@genevoissummercamp.fr',
        password: 'Admin123!',
        email_confirm: true,
      }),
    });
    if (res.ok) {
      console.log('✓ Compte admin créé: admin@genevoissummercamp.fr / Admin123!');
    } else {
      const text = await res.text();
      console.log('Note admin:', text.slice(0, 100));
    }
  } catch (e) {
    console.log('Note admin:', e.message);
  }

  // Importer les coachs
  const coaches = [
    { id: 'dodzi', name: 'Dodzi', role: 'Responsable — Basket Club Saint Julien en Genevois', bio: "Éducateur sportif et organisateur du Genevois Summer Camp.", diplomas: ['Éducateur Sportif'], citation: "Mon objectif est simple : offrir aux jeunes du Genevois ce que je n'ai pas eu à leur âge.", image_url: '/images/coach-dodji.jpg', featured: true, order: 0 },
    { id: 'mike-alard', name: 'Mike Alard', role: 'Directeur technique — Centre de formation Nanterre 92 (Pro A)', bio: "Ancien entraîneur de Victor Wembanyama, Mike Alard est aujourd'hui directeur du centre de formation de la JSF Nanterre 92.", diplomas: ['DEJEPS'], citation: "Ce qui fait la différence, ce n'est pas le talent brut, c'est la rigueur quotidienne.", image_url: '/images/coach-mike.png', featured: true, order: 1 },
    { id: 'allan-perricaud', name: 'Allan Perricaud', role: "Entraîneur individuel — Paris", bio: "Spécialiste du développement individuel.", diplomas: ['DETB', 'BPJEPS'], citation: "Chaque geste compte.", image_url: '/images/coach-allan.png', featured: false, order: 2 },
    { id: 'baptiste-nivet', name: 'Baptiste Nivet', role: "Entraîneur — BCSJ", bio: "Entraîneur au BCSJ.", diplomas: ['DETB', 'BPJEPS'], citation: "Le basket, c'est d'abord du plaisir.", image_url: '/images/coach-baptiste.png', featured: false, order: 3 },
    { id: 'jean-podevin', name: 'Jean Podevin', role: "Entraîneur de sélection", bio: "Fort d'une expérience en sélection.", diplomas: ['BPJEPS'], citation: "Le collectif élève le niveau de chacun.", image_url: '/images/coach-jean.png', featured: false, order: 4 },
  ];

  for (const c of coaches) {
    try {
      await upsert('coaches', c);
      console.log('  ✓', c.name);
    } catch (e) {
      console.log('  ✗', c.name, '-', e.message);
    }
  }

  // Importer FAQ
  const faqItems = [
    { id: '1', question: 'À partir de quel âge peut-on participer ?', answer: 'Le camp est ouvert aux jeunes de 11 à 16 ans (U11 à U16). Aucun niveau minimum requis.', order: 0 },
    { id: '2', question: 'Que faut-il apporter ?', answer: "Pour le camp basket : tenue de sport, baskets, gourde, serviette. Pour l'internat : sac de couchage, affaires de toilette.", order: 1 },
    { id: '3', question: 'Comment se déroule une journée type ?', answer: 'Accueil 8h30, entraînement 9h, repas 12h, technique individuelle 14h, matchs 16h, intervention pro 17h, fin 18h.', order: 2 },
    { id: '4', question: 'Les repas sont-ils inclus ?', answer: 'En externat : déjeuner inclus. En internat : tous les repas inclus.', order: 3 },
    { id: '5', question: 'Quelle est la différence entre externat et internat ?', answer: "Externat (300€/semaine) : le jeune rentre chaque soir. Internat (490€/semaine) : hébergement et pension complète.", order: 4 },
  ];

  for (const f of faqItems) {
    try {
      await upsert('faq_items', f);
      console.log('  ✓', f.question.slice(0, 50));
    } catch (e) {
      console.log('  ✗', f.question.slice(0, 40), '-', e.message);
    }
  }

  console.log('\n✅ Import terminé !');
}

init().catch(console.error);
