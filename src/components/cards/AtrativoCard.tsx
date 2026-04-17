import Image from "next/image";
import { Icon } from "@/components/ui/Icon";
import { Portal as C } from "@/constants/colors";
import type { Attraction } from "@/types";

export function AtrativoCard({ atrativo, toggleFavorite, isFavorite }: {
  atrativo: Attraction;
  favorites?: number[];
  toggleFavorite?: (id: number) => void;
  isFavorite?: (id: number) => boolean;
}) {
  const openMaps = () => {
    window.open(atrativo.googleMapsUrl, '_blank');
  };

  const openIngresso = () => {
    if (atrativo.ingressoUrl) {
      window.open(atrativo.ingressoUrl, '_blank');
    }
  };

  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all group border border-gray-100 h-full flex flex-col">
      <div className="relative h-48 overflow-hidden flex-shrink-0">
        <Image src={atrativo.imagem} alt={`${atrativo.nome} - Atrativo turístico em Capitólio`} fill sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw" className="object-cover group-hover:scale-105 transition-transform duration-500" />

        {atrativo.gratuito && (
          <div className="absolute top-3 left-3 bg-green-500 text-white text-xs font-black px-3 py-1.5 rounded-full shadow-lg">
            GRÁTIS
          </div>
        )}
        {!atrativo.gratuito && atrativo.desconto > 0 && (
          <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-black px-3 py-1.5 rounded-full shadow-lg">
            {atrativo.desconto}% OFF
          </div>
        )}

        <button
          onClick={(e) => {
            e.preventDefault();
            toggleFavorite?.(atrativo.id + 2000);
          }}
          className="absolute top-3 right-3 w-8 h-8 bg-white/90 hover:bg-white rounded-full flex items-center justify-center transition-all shadow-lg backdrop-blur-sm"
          aria-label="Adicionar aos favoritos">
          <div className="w-5 h-5" style={{ color: isFavorite?.(atrativo.id + 2000) ? '#dc2626' : '#6b7280' }}>
            {isFavorite?.(atrativo.id + 2000) ? Icon.heartFilled() : Icon.heartEmpty()}
          </div>
        </button>
      </div>

      <div className="p-5 flex flex-col flex-1">
        <h3 className="text-lg font-black text-gray-900 mb-2 leading-tight">{atrativo.nome}</h3>

        <div className="flex items-center gap-2 mb-3">
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 text-amber-500">{Icon.star2()}</div>
            <span className="text-sm font-black text-gray-900">{atrativo.avaliacao.toFixed(1)}</span>
          </div>
          <span className="text-xs text-gray-500">({atrativo.totalAvaliacoes.toLocaleString()} avaliações)</span>
        </div>

        <p className="text-sm text-gray-600 mb-4">{atrativo.descricao}</p>

        <div className="flex items-center gap-1.5 text-xs mb-4">
          <div className="w-3.5 h-3.5 text-gray-400">{Icon.mapPin()}</div>
          <span className="font-bold text-gray-700">{atrativo.localizacao}</span>
        </div>

        {!atrativo.gratuito && (
          <div className="mb-4 pb-4 border-b border-gray-100">
            <div className="text-xs text-gray-500 mb-1">A partir de</div>
            <div className="text-2xl font-black text-gray-900">
              R$ {atrativo.preco}
            </div>
          </div>
        )}

        <div className="mt-auto">
          <div className={`grid gap-2 ${atrativo.gratuito ? 'grid-cols-1' : 'grid-cols-2'}`}>
            <button
              onClick={openMaps}
              className="flex items-center justify-center gap-1.5 border-2 hover:opacity-90 font-semibold text-sm py-2 px-3 rounded-lg transition-all whitespace-nowrap"
              style={{ backgroundColor: "transparent", borderColor: C.navy, color: C.navy }}>
              <div className="w-4 h-4">{Icon.mapPin()}</div>
              <span>Como chegar</span>
            </button>

            {!atrativo.gratuito && atrativo.ingressoUrl && (
              <button
                onClick={openIngresso}
                className="flex items-center justify-center gap-1.5 text-white font-semibold text-sm py-2 px-3 rounded-lg transition-all hover:opacity-90 whitespace-nowrap"
                style={{ backgroundColor: C.navy }}>
                <div className="w-4 h-4">{Icon.ticket()}</div>
                <span>Comprar</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
