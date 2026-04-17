// ─── PORTAL TYPES ─────────────────────────────────────────────────────────────

export interface City {
  id: string;
  name: string;
  state: string;
  count: number;
}

export interface Property {
  id: number;
  name: string;
  type: string;
  score: number;
  scoreLabel: string;
  reviews: number;
  price: number;
  oldPrice: number | null;
  images: string[];
  image?: string;
  amenities: string[];
  giftback: number;
  superhost: boolean;
  verified: boolean;
}

export interface Restaurant {
  id: number;
  nome: string;
  especialidade: string;
  descricao: string;
  faixaPreco: string;
  avaliacao: number;
  totalAvaliacoes: number;
  imagem: string;
  tags: string[];
  horario: string;
  localizacao: string;
  googlePlaceId: string;
  googleMapsUrl: string;
}

export interface Attraction {
  id: number;
  nome: string;
  descricao: string;
  preco: number;
  desconto: number;
  avaliacao: number;
  totalAvaliacoes: number;
  imagem: string;
  localizacao: string;
  googleMapsUrl: string;
  ingressoUrl: string | null;
  gratuito: boolean;
}

export interface Tour {
  id: number;
  nome: string;
  tipo: string;
  descricao: string;
  duracao: string;
  preco: string;
  avaliacao: number;
  totalAvaliacoes: number;
  whatsapp: string;
  telefone: string;
  instagram: string;
  imagem: string;
  destaque: boolean;
}

export interface Room {
  adults: number;
  children: number;
}

export type SortBy = 'price_asc' | 'price_desc' | 'score_desc';

// ─── PMS TYPES (needed by detail page rate-calculator) ────────────────────────

export interface PMSRatePlan {
  id: number;
  propertyId: number;
  name: string;
  active: boolean;
  basePrice: number;
  mealsIncluded: boolean;
  mealTypes: string[];
}

export interface InventoryEntry {
  id?: number;
  roomId: number;
  date: string;
  availability: number | null;
  rate: number | null;
  stopSell: boolean;
  closedCheckin: boolean;
  closedCheckout: boolean;
  minStay: number | null;
  maxStay: number | null;
}

export interface Season {
  id: number;
  name: string;
  startDate: string;
  endDate: string;
  rate: number | null;
  global: boolean;
  active: boolean;
  propertyId: number | null;
}

export interface LengthDiscount {
  id: number;
  propertyId: number;
  minNights: number;
  discountType: 'percent' | 'fixed';
  discountValue: number;
  active: boolean;
}

// ─── DETAIL PAGE TYPES ─────────────────────────────────────────────────────

export interface AmenityDetail {
  icon: string;
  label: string;
  included: boolean;
}

export interface RoomPolicy {
  type: string;
  label: string;
  extraCost: number;
}

export interface PropertyRoom {
  id: number;
  name: string;
  capacity: number;
  beds: string;
  size: string;
  price: number;
  featured: boolean;
  rating: number;
  ratingLabel: string;
  amenities: string[];
  images: string[];
  policies: RoomPolicy[];
  breakfast: boolean;
  roomCount: number;
  installments: boolean;
  giftPoints: boolean;
  lakeView: boolean;
  bathtub: boolean;
  ratePlanId?: number | null;
  rateTotal?: number | null;
}

export interface PropertyLocation {
  lat: number;
  lng: number;
  address: string;
  neighborhood: string;
  distances: { place: string; distance: string; time: string }[];
}

export interface PropertyRatings {
  overall: number;
  cleanliness: number;
  comfort: number;
  location: number;
  staff: number;
  facilities: number;
  valueForMoney: number;
}

export interface PropertyReview {
  id: number;
  author: string;
  date: string;
  rating: number;
  comment: string;
}

export interface PropertyPolicies {
  checkIn: string;
  checkOut: string;
  cancellation: string;
  pets: string;
  children: string;
  smoking: string;
  parties: string;
}

export interface PropertyContact {
  whatsapp: string;
  phone: string;
  email: string;
  website: string;
  businessHours: string;
}

export interface PropertyDetail extends Property {
  slug: string;
  description: string;
  city: string;
  state: string;
  country: string;
  amenitiesDetail: AmenityDetail[];
  rooms: PropertyRoom[];
  location: PropertyLocation;
  ratings: PropertyRatings;
  reviewsData: PropertyReview[];
  policies: PropertyPolicies;
  contact: PropertyContact;
}
