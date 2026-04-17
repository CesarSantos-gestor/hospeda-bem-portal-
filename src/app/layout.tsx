import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Hospeda Bem Capitólio | Pousadas e Hotéis com até 30% OFF + Giftback',
  description: 'Reserve pousadas, hotéis e chalés em Capitólio-MG com descontos de até 30%. Sistema Giftback exclusivo: ganhe até R$ 500 de volta. Avaliações reais, parceiros verificados.',
  keywords: 'capitólio hospedagem, pousadas capitólio, hotéis capitólio, chalés capitólio, hospeda bem, giftback, furnas, cânions, serra da canastra, minas gerais',

  authors: [{ name: 'Hospeda Bem' }],
  creator: 'Hospeda Bem',
  publisher: 'Hospeda Bem',

  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },

  openGraph: {
    title: 'Hospeda Bem Capitólio | Pousadas, Hotéis e Chalés',
    description: 'Encontre as melhores hospedagens em Capitólio-MG. Descontos de até 30% + Giftback. Passeios, restaurantes e atrativos turísticos.',
    url: 'https://capitolio.hospedabem.com',
    siteName: 'Hospeda Bem',
    locale: 'pt_BR',
    type: 'website',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=630&fit=crop',
        width: 1200,
        height: 630,
        alt: 'Cânions de Furnas em Capitólio, Minas Gerais - Vista aérea do lago',
      },
    ],
  },

  twitter: {
    card: 'summary_large_image',
    title: 'Hospeda Bem Capitólio | Pousadas e Hotéis com Giftback',
    description: 'Reserve com até 30% OFF + Giftback exclusivo. As melhores hospedagens em Capitólio-MG.',
    images: ['https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=630&fit=crop'],
    creator: '@hospedabem',
  },

  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },

  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
    apple: '/icon.svg',
  },

  manifest: '/site.webmanifest',

  alternates: {
    canonical: 'https://capitolio.hospedabem.com',
    languages: {
      'pt-BR': 'https://capitolio.hospedabem.com',
    },
  },

  verification: {
    google: 'seu-codigo-google-aqui',
  },

  category: 'travel',
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: '#002F87',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <head>
        <link rel="preconnect" href="https://images.unsplash.com" />
        <link rel="dns-prefetch" href="https://images.unsplash.com" />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'TravelAgency',
              name: 'Hospeda Bem',
              description: 'Marketplace de hospedagens em cidades turísticas do Brasil',
              url: 'https://capitolio.hospedabem.com',
              logo: 'https://capitolio.hospedabem.com/logo.png',
              image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=630',
              address: {
                '@type': 'PostalAddress',
                addressLocality: 'Capitólio',
                addressRegion: 'MG',
                addressCountry: 'BR',
              },
              sameAs: [
                'https://www.instagram.com/hospedabem',
                'https://www.facebook.com/hospedabem',
                'https://www.youtube.com/@hospedabem',
              ],
              priceRange: 'R$ 195 - R$ 680',
              aggregateRating: {
                '@type': 'AggregateRating',
                ratingValue: '9.2',
                reviewCount: '847',
                bestRating: '10',
                worstRating: '1',
              },
            }),
          }}
        />
      </head>
      <body className="antialiased bg-white text-gray-900">
        {children}
      </body>
    </html>
  )
}
