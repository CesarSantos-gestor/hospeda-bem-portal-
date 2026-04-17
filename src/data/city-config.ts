export interface CityConfig {
  slug: string;
  name: string;
  state: string;
  description: string;
  metaDescription: string;
  keywords: string;
  image: string;
  highlights: string;
}

export const CITY_CONFIG: Record<string, CityConfig> = {
  capitolio: {
    slug: "capitolio",
    name: "Capitólio",
    state: "MG",
    description: "Cânions de Furnas, cachoeiras e paisagens deslumbrantes",
    metaDescription: "Reserve pousadas, hotéis e chalés em Capitólio-MG com descontos de até 30%. Giftback exclusivo. Cânions de Furnas, cachoeiras e natureza.",
    keywords: "pousadas capitólio, hotéis capitólio, chalés capitólio, furnas, cânions, hospedagem capitólio",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=630&fit=crop",
    highlights: "Cânions de Furnas · Cachoeiras · Lago de Furnas",
  },
  tiradentes: {
    slug: "tiradentes",
    name: "Tiradentes",
    state: "MG",
    description: "Cidade histórica, gastronomia e charme colonial",
    metaDescription: "Encontre as melhores pousadas e hotéis em Tiradentes-MG. Cidade histórica com gastronomia premiada. Reserve com Giftback exclusivo.",
    keywords: "pousadas tiradentes, hotéis tiradentes, hospedagem tiradentes, cidade histórica, minas gerais",
    image: "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=1200&h=630&fit=crop",
    highlights: "Centro Histórico · Gastronomia · Maria Fumaça",
  },
  gramado: {
    slug: "gramado",
    name: "Gramado",
    state: "RS",
    description: "Serra gaúcha, fondue, chocolate e inverno encantador",
    metaDescription: "Reserve hotéis e pousadas em Gramado-RS com até 30% de desconto. Serra gaúcha, fondue, chocolate e muito charme. Giftback exclusivo.",
    keywords: "hotéis gramado, pousadas gramado, hospedagem gramado, serra gaúcha, natal luz",
    image: "https://images.unsplash.com/photo-1580137189272-c9379f8864fd?w=1200&h=630&fit=crop",
    highlights: "Serra Gaúcha · Fondue · Natal Luz",
  },
  bonito: {
    slug: "bonito",
    name: "Bonito",
    state: "MS",
    description: "Rios cristalinos, grutas e ecoturismo de aventura",
    metaDescription: "Pousadas e hotéis em Bonito-MS com descontos exclusivos. Rios cristalinos, grutas e ecoturismo. Reserve com Giftback no Hospeda Bem.",
    keywords: "pousadas bonito, hotéis bonito, hospedagem bonito, ecoturismo, rios cristalinos, gruta azul",
    image: "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=1200&h=630&fit=crop",
    highlights: "Rios Cristalinos · Grutas · Ecoturismo",
  },
};

export const ALL_CITY_SLUGS = Object.keys(CITY_CONFIG);

export function getCityConfig(slug: string): CityConfig | null {
  return CITY_CONFIG[slug] || null;
}
