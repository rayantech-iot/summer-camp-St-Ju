// Script to seed/update offers in Supabase
// Run: node scripts/seed-offers.js

const fs = require('fs')
const path = require('path')

const envPath = path.join(__dirname, '..', '.env.local')
const envContent = fs.readFileSync(envPath, 'utf-8')
const envVars = {}
envContent.split('\n').forEach(line => {
  const [key, ...rest] = line.split('=')
  if (key && rest.length) envVars[key.trim()] = rest.join('=').trim()
})

const SUPABASE_URL = envVars['NEXT_PUBLIC_SUPABASE_URL']
const SUPABASE_KEY = envVars['NEXT_PUBLIC_SUPABASE_ANON_KEY']

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('Missing Supabase credentials in .env.local')
  process.exit(1)
}

const headers = {
  'Content-Type': 'application/json',
  'apikey': SUPABASE_KEY,
  'Authorization': `Bearer ${SUPABASE_KEY}`,
  'Prefer': 'return=representation',
}

async function api(path, method, body) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`${method} ${path}: ${res.status} ${text}`)
  }
  return res.json()
}

const offers = [
  {
    id: 'basket-1',
    type: 'basket',
    dates: ['4-11 juillet 2026', '11-18 juillet 2026'],
    price_externat: 300,
    price_externat_avec_repas: 350,
    price_internat: 490,
    lieu: 'Valleiry & Vulbens (74520)',
    public: 'U11 à U17 (11-17 ans)',
    description: "Camp basket intensif avec coachs professionnels",
  },
  {
    id: 'multi-1',
    type: 'multisport',
    dates: ['6-13 juillet 2026', '13-17 juillet 2026'],
    price_externat: 300,
    price_externat_avec_repas: 350,
    lieu: 'Valleiry & Vulbens (74520)',
    public: '6-10 ans',
    description: "Multisport pour les plus jeunes",
  },
]

async function seed() {
  for (const offer of offers) {
    // Check if exists
    const existing = await api(`offers?id=eq.${offer.id}`, 'GET')
    if (existing.length > 0) {
      await api(`offers?id=eq.${offer.id}`, 'PATCH', offer)
      console.log(`Updated offer: ${offer.id}`)
    } else {
      await api('offers', 'POST', offer)
      console.log(`Created offer: ${offer.id}`)
    }
  }
  console.log('Done!')
}

seed().catch(err => {
  console.error('Error:', err.message)
  process.exit(1)
})
