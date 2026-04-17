import Image from "next/image";
import { Icon } from "@/components/ui/Icon";
import { Portal as C } from "@/constants/colors";
import type { Restaurant } from "@/types";

export function RestauranteCard({ restaurante, toggleFavorite, isFavorite }: {
  restaurante: Restaurant;
  favorites?: number[];
  toggleFavorite?: (id: number) => void;
  isFavorite?: (id: number) => boolean;
}) {
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all group border border-gray-100 h-full flex flex-col">
      <div className="relative h-48 overflow-hidden flex-shrink-0">
        <Image src={restaurante.imagem} alt={`${restaurante.nome} - ${restaurante.especialidade} em Capitólio`} fill sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw" className="object-cover group-hover:scale-105 transition-transform duration-500" />
        <button
          onClick={(e) => {
            e.preventDefault();
            toggleFavorite?.(restaurante.id + 1000);
          }}
          className="absolute top-3 right-3 w-8 h-8 bg-white/90 hover:bg-white rounded-full flex items-center justify-center transition-all shadow-lg backdrop-blur-sm"
          aria-label="Adicionar aos favoritos">
          <div className="w-5 h-5" style={{ color: isFavorite?.(restaurante.id + 1000) ? '#dc2626' : '#6b7280' }}>
            {isFavorite?.(restaurante.id + 1000) ? Icon.heartFilled() : Icon.heartEmpty()}
          </div>
        </button>
      </div>

      <div className="p-5 flex flex-col flex-1">
        <div className="text-xs font-bold mb-2 uppercase tracking-wide" style={{ color: C.navy }}>{restaurante.especialidade}</div>
        <h3 className="text-lg font-black text-gray-900 mb-2 leading-tight">{restaurante.nome}</h3>

        <div className="flex items-center gap-2 mb-3">
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 text-amber-500">{Icon.star2()}</div>
            <span className="text-sm font-black text-gray-900">{restaurante.avaliacao.toFixed(1)}</span>
          </div>
          <span className="text-xs text-gray-500">· {restaurante.totalAvaliacoes.toLocaleString()} no Google</span>
        </div>

        <div className="flex flex-wrap gap-1.5 mb-3">
          {restaurante.tags.map(tag => (
            <span key={tag} className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-700 font-medium">
              {tag}
            </span>
          ))}
        </div>

        <p className="text-sm text-gray-600 mb-3">{restaurante.descricao}</p>

        <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-3">
          <div className="w-3.5 h-3.5">{Icon.calendar()}</div>
          <span>{restaurante.horario}</span>
        </div>

        <div className="flex items-center gap-1.5 text-xs mb-3">
          <div className="w-3.5 h-3.5 text-gray-400">{Icon.mapPin()}</div>
          <span className="font-bold text-gray-700">{restaurante.localizacao}</span>
        </div>

        <div className="mb-4 pb-4 border-b border-gray-100">
          <div className="text-sm font-black text-gray-900">{restaurante.faixaPreco}</div>
        </div>

        <div className="mt-auto space-y-2">
          <a
            href={restaurante.googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center gap-2 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium text-xs py-2 px-3 rounded-lg transition-all">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
            </svg>
            <span>Ver no Google Maps</span>
          </a>

          <button
            onClick={() => console.log('Ver detalhes:', restaurante.nome)}
            className="w-full flex items-center justify-center gap-1.5 text-white font-semibold text-sm py-2 px-3 rounded-lg transition-all whitespace-nowrap hover:opacity-90"
            style={{ backgroundColor: C.navy }}>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            <span>Mais detalhes</span>
          </button>
        </div>
      </div>
    </div>
  );
}
