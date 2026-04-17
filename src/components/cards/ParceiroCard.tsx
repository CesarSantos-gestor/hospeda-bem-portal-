import Image from "next/image";
import { Icon } from "@/components/ui/Icon";
import type { Tour } from "@/types";

export function ParceiroCard({ parceiro, toggleFavorite, isFavorite }: {
  parceiro: Tour;
  favorites?: number[];
  toggleFavorite?: (id: number) => void;
  isFavorite?: (id: number) => boolean;
}) {
  const openWhatsApp = () => {
    window.open(`https://wa.me/55${parceiro.whatsapp.replace(/\D/g, '')}?text=Olá! Vi o passeio no Hospeda Bem e gostaria de mais informações.`, '_blank');
  };

  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all group border border-gray-100">
      <div className="relative h-48 overflow-hidden">
        <Image src={parceiro.imagem} alt={`${parceiro.tipo} - ${parceiro.nome} em Capitólio`} fill sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw" className="object-cover group-hover:scale-105 transition-transform duration-500" />

        {parceiro.destaque && (
          <div className="absolute top-3 left-3 bg-white text-gray-900 text-xs font-black px-3 py-1.5 rounded-full shadow-lg">
            DESTAQUE
          </div>
        )}

        <button
          onClick={(e) => {
            e.preventDefault();
            toggleFavorite?.(parceiro.id + 3000);
          }}
          className="absolute top-3 right-3 w-8 h-8 bg-white/90 hover:bg-white rounded-full flex items-center justify-center transition-all shadow-lg backdrop-blur-sm"
          aria-label="Adicionar aos favoritos">
          <div className="w-5 h-5" style={{ color: isFavorite?.(parceiro.id + 3000) ? '#dc2626' : '#6b7280' }}>
            {isFavorite?.(parceiro.id + 3000) ? Icon.heartFilled() : Icon.heartEmpty()}
          </div>
        </button>
      </div>

      <div className="p-5">
        <h3 className="text-xl font-black text-gray-900 mb-1 leading-tight">{parceiro.tipo}</h3>
        <div className="text-sm text-gray-500 mb-3 font-medium">{parceiro.nome}</div>

        <div className="flex items-center gap-2 mb-3">
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 text-amber-500">{Icon.star2()}</div>
            <span className="text-sm font-black text-gray-900">{parceiro.avaliacao.toFixed(1)}</span>
          </div>
          <span className="text-xs text-gray-500">({parceiro.totalAvaliacoes} avaliações)</span>
        </div>

        <p className="text-sm text-gray-600 mb-4 line-clamp-2 leading-relaxed">{parceiro.descricao}</p>

        <div className="flex items-center gap-4 text-xs text-gray-500 mb-4 pb-4 border-b border-gray-100">
          <div className="flex items-center gap-1.5">
            <div className="w-3.5 h-3.5">{Icon.calendar()}</div>
            <span>{parceiro.duracao}</span>
          </div>
          <div className="font-bold text-gray-900">{parceiro.preco}</div>
        </div>

        <button
          onClick={openWhatsApp}
          className="w-full flex items-center justify-center gap-2 border-2 border-green-500 text-green-600 hover:bg-green-50 font-semibold text-sm py-2 rounded-lg transition-all">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
          </svg>
          WhatsApp
        </button>
      </div>
    </div>
  );
}
