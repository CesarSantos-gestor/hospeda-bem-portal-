import type { Property } from "@/types";

export const properties: Property[] = [
  { id: 1, name: "Pousada Mar de Minas", type: "Pousada", score: 9.4, scoreLabel: "Maravilhosa", reviews: 128, price: 320, oldPrice: 380, images: ["https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&q=80", "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80", "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&q=80"], amenities: ["Wi-Fi", "Piscina", "Café da manhã", "Ar-condicionado"], giftback: 10, superhost: true, verified: true },
  { id: 2, name: "Riviera Capitólio Hotel", type: "Chalé", score: 9.1, scoreLabel: "Extraordinária", reviews: 94, price: 280, oldPrice: null, images: ["https://images.unsplash.com/photo-1510798831971-661eb04b3739?w=800&q=80", "https://images.unsplash.com/photo-1449158743715-0a90ebb6d2d8?w=800&q=80"], amenities: ["Vista para o lago", "Churrasqueira", "Wi-Fi", "Garagem"], giftback: 8, superhost: true, verified: true },
  { id: 3, name: "Obbá Coema Village Hotel", type: "Hotel", score: 8.7, scoreLabel: "Muito Boa", reviews: 213, price: 450, oldPrice: 520, images: ["https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800&q=80", "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&q=80", "https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=800&q=80"], amenities: ["Restaurante", "Spa", "Academia", "Wi-Fi"], giftback: 12, superhost: false, verified: false },
  { id: 4, name: "Pousada Quinta dos Cabeças", type: "Pousada", score: 8.3, scoreLabel: "Excelente", reviews: 77, price: 195, oldPrice: null, images: ["https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&q=80"], amenities: ["Café da manhã", "Piscina", "Pet-friendly", "Wi-Fi"], giftback: 5, superhost: false, verified: false },
  { id: 5, name: "Pousada Enseada da Ilha", type: "Suíte", score: 9.6, scoreLabel: "Maravilhosa", reviews: 56, price: 560, oldPrice: 620, images: ["https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800&q=80", "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&q=80", "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=800&q=80"], amenities: ["Banheira", "Vista panorâmica", "Frigobar", "Wi-Fi"], giftback: 15, superhost: true, verified: true },
  { id: 6, name: "Escarpas Resort", type: "Chalé", score: 8.9, scoreLabel: "Muito Boa", reviews: 102, price: 240, oldPrice: null, images: ["https://images.unsplash.com/photo-1449158743715-0a90ebb6d2d8?w=800&q=80", "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80"], amenities: ["Natureza", "Trilhas", "Fogueira", "Wi-Fi"], giftback: 7, superhost: false, verified: false },
  { id: 7, name: "Engenho da Serra EcoResort", type: "Pousada", score: 9.2, scoreLabel: "Extraordinária", reviews: 89, price: 310, oldPrice: 345, images: ["https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80", "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80"], amenities: ["Wi-Fi", "Varanda", "Café da manhã", "Estacionamento"], giftback: 9, superhost: true, verified: true },
  { id: 8, name: "Pousada Capitólio", type: "Resort", score: 8.5, scoreLabel: "Excelente", reviews: 341, price: 680, oldPrice: 750, images: ["https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80", "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&q=80", "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&q=80"], amenities: ["All Inclusive", "Spa", "PischeckInas", "Academia"], giftback: 12, superhost: false, verified: false },
];

export const blockedDates: { [propertyId: number]: Date[] } = {
  1: [
    new Date(2026, 1, 20), new Date(2026, 1, 21), new Date(2026, 1, 22),
    new Date(2026, 1, 27), new Date(2026, 1, 28),
  ],
  2: [
    new Date(2026, 1, 18), new Date(2026, 1, 19),
    new Date(2026, 2, 5), new Date(2026, 2, 6), new Date(2026, 2, 7),
  ],
  5: [
    new Date(2026, 1, 25), new Date(2026, 1, 26), new Date(2026, 1, 27),
  ],
};
