// Script d'import des données statiques vers Supabase
// Usage : node scripts/seed-supabase.js

const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Erreur : NEXT_PUBLIC_SUPABASE_URL et SUPABASE_SERVICE_ROLE_KEY requis')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

const coaches = [
  { id: 'mike-alard', name: 'Mike Alard', role: 'Directeur technique — Centre de formation Nanterre 92 (Pro A)', bio: "Ancien entraîneur de Victor Wembanyama, Mike Alard est aujourd'hui directeur du centre de formation de la JSF Nanterre 92, club de Pro A.", diplomas: ['DEJEPS'], citation: "Ce qui fait la différence, ce n'est pas le talent brut, c'est la rigueur quotidienne et l'envie d'apprendre.", image_url: '/images/coach-mike.png', featured: true, order: 0 },
  { id: 'allan-perricaud', name: 'Allan Perricaud', role: 'Entraîneur individuel — Paris', bio: "Spécialiste du développement individuel, Allan Perricaud accompagne les joueurs dans l'acquisition des fondamentaux techniques.", diplomas: ['DETB', 'BPJEPS'], citation: 'Chaque geste compte.', image_url: '/images/coach-allan.png', featured: false, order: 1 },
  { id: 'baptiste-nivet', name: 'Baptiste Nivet', role: 'Entraîneur — BCSJ', bio: 'Entraîneur au BCSJ, Baptiste Nivet allie compétences techniques et pédagogie.', diplomas: ['DETB', 'BPJEPS'], citation: 'Le basket, c\'est d\'abord du plaisir.', image_url: '/images/coach-baptiste.png', featured: false, order: 2 },
  { id: 'jean-podevin', name: 'Jean Podevin', role: 'Entraîneur de sélection', bio: "Fort d'une expérience en sélection et en club, Jean Podevin apporte une vision tactique du jeu.", diplomas: ['BPJEPS'], citation: 'Le collectif élève le niveau de chacun.', image_url: '/images/coach-jean.png', featured: false, order: 3 },
]

const faqItems = [
  { id: '1', question: 'À partir de quel âge peut-on participer ?', answer: 'Le camp est ouvert aux jeunes de 11 à 16 ans (U11 à U16). Aucun niveau minimum requis.', order: 0 },
  { id: '2', question: 'Que faut-il apporter ?', answer: 'Pour le camp basket : tenue de sport, baskets, gourde, serviette. Pour l\'internat : sac de couchage, affaires de toilette.', order: 1 },
  { id: '3', question: 'Comment se déroule une journée type ?', answer: 'Accueil 8h30, entraînement 9h, repas 12h, technique individuelle 14h, matchs 16h, intervention pro 17h, fin 18h.', order: 2 },
  { id: '4', question: 'Les repas sont-ils inclus ?', answer: 'En externat : déjeuner inclus. En internat : tous les repas inclus.', order: 3 },
  { id: '5', question: 'Quelle est la différence entre externat et internat ?', answer: 'Externat (300€/semaine) : le jeune rentre chaque soir. Internat (490€/semaine) : hébergement et pension complète.', order: 4 },
]

async function seed() {
  console.log('Import des coachs...')
  for (const c of coaches) {
    const { error } = await supabase.from('coaches').upsert(c)
    if (error) console.error('  Erreur coach:', c.name, error.message)
    else console.log(`  ✓ ${c.name}`)
  }

  console.log('Import de la FAQ...')
  for (const f of faqItems) {
    const { error } = await supabase.from('faq_items').upsert(f)
    if (error) console.error('  Erreur FAQ:', f.question, error.message)
    else console.log(`  ✓ ${f.question.slice(0, 40)}...`)
  }

  console.log('Import des offres...')
  const offers = [
    { id: 'basket', type: 'basket', dates: ['4-11 juillet 2026', '11-18 juillet 2026'], price_externat: 300, price_internat: 490, lieu: 'Valleiry (74520)', public: 'U11-U16', description: 'Camp basket intensif' },
    { id: 'multisport', type: 'multisport', dates: ['6-13 juillet 2026', '13-17 juillet 2026'], price_externat: 300, price_internat: null, lieu: 'Vulbens (74520)', public: 'U11-U16', description: 'Édition multisport' },
  ]
  for (const o of offers) {
    const { error } = await supabase.from('offers').upsert(o)
    if (error) console.error('  Erreur offre:', o.type, error.message)
    else console.log(`  ✓ ${o.type}`)
  }

  console.log('Terminé !')
}

seed().catch(console.error)
