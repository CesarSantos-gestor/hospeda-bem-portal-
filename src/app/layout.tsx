import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: {
    default: 'Hospeda Bem | Pousadas, Hotéis e Chalés com Giftback',
    template: '%s | Hospeda Bem',
  },
  description: 'Encontre pousadas, hotéis e chalés nas melhores cidades turísticas do Brasil. Descontos de até 30% + Giftback exclusivo. Avaliações reais, parceiros verificados.',
  keywords: 'hospedagem brasil, pousadas, hotéis, chalés, hospeda bem, giftback, turismo brasil',

  authors: [{ name: 'Hospeda Bem' }],
  creator: 'Hospeda Bem',
  publisher: 'Hospeda Bem',

  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },

  openGraph: {
    title: 'Hospeda Bem | Pousadas, Hotéis e Chalés com Giftback',
    description: 'Encontre as melhores hospedagens nas cidades turísticas do Brasil. Descontos de até 30% + Giftback exclusivo.',
    url: 'https://hospedabem.com',
    siteName: 'Hospeda Bem',
    locale: 'pt_BR',
    type: 'website',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=630&fit=crop',
        width: 1200,
        height: 630,
        alt: 'Hospeda Bem - Hospedagens nas melhores cidades turísticas do Brasil',
      },
    ],
  },

  twitter: {
    card: 'summary_large_image',
    title: 'Hospeda Bem | Pousadas e Hotéis com Giftback',
    description: 'Reserve com até 30% OFF + Giftback exclusivo. As melhores hospedagens do Brasil.',
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
    canonical: 'https://hospedabem.com',
    languages: {
      'pt-BR': 'https://hospedabem.com',
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
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
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
              url: 'https://hospedabem.com',
              logo: 'https://hospedabem.com/logo.svg',
              image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=630',
              sameAs: [
                'https://www.instagram.com/hospedabem',
                'https://www.facebook.com/hospedabem',
                'https://www.youtube.com/@hospedabem',
              ],
              priceRange: 'R$ 195 - R$ 680',
            }),
          }}
        />
      </head>
      <body className="antialiased bg-white text-gray-900" style={{ fontFamily: "'Inter', sans-serif" }}>
        {children}
      </body>
    </html>
  )
}
