import type { Metadata } from "next"
import { Bebas_Neue, Montserrat } from "next/font/google"
import "./globals.css"

const bebasNeue = Bebas_Neue({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: "400",
})

const montserrat = Montserrat({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
})

export const metadata: Metadata = {
  title: "Genevois Summer Camp — Approche le basket de haut niveau",
  description:
    "Stage de basket et multisport en Haute-Savoie, à 20 min de Genève. Encadrement professionnel avec des coachs du haut niveau. U11-U16.",
  keywords: [
    "camp basket Genève",
    "stage basket Haute-Savoie",
    "summer camp Genève",
    "stage basket Valleiry",
    "stage basket Vulbens",
    "camp multisports Haute-Savoie",
    "basket jeunes Genève",
  ],
  openGraph: {
    title: "Genevois Summer Camp",
    description:
      "Vivre, l'espace d'une semaine, le quotidien d'un basketteur de haut niveau — sans quitter le Genevois.",
    type: "website",
    locale: "fr_FR",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="fr" className={`${bebasNeue.variable} ${montserrat.variable} h-full`}>
      <body className="min-h-full flex flex-col bg-gsc-black text-gsc-white font-sans antialiased">
        {children}
      </body>
    </html>
  )
}
