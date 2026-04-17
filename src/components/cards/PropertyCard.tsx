"use client";
import { useState } from "react";
import Image from "next/image";
import { Icon } from "@/components/ui/Icon";
import type { Property } from "@/types";

export function PropertyCard({ p, inCarousel = false, favorites, onToggleFavorite }: {
  p: Property;
  inCarousel?: boolean;
  favorites?: number[];
  onToggleFavorite?: (id: number) => void;
}) {
  const isSaved = favorites?.includes(p.id) || false;
  const [currentImg, setCurrentImg] = useState(0);
  const hasMultiple = p.images && p.images.length > 1;

  return (
    <div className={`bg-white rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 group cursor-pointer border border-gray-100 ${inCarousel ? "w-[280px] flex-shrink-0" : ""}`}>

      {/* IMAGEM COM CARROSSEL */}
      <div className="relative overflow-hidden h-48">
        <Image
          src={p.images ? p.images[currentImg] : p.image || ""}
          alt={p.name}
          fill
          sizes="(max-width: 640px) 85vw, (max-width: 1024px) 45vw, 25vw"
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />

        <button
          onClick={(e) => { e.stopPropagation(); onToggleFavorite?.(p.id); }}
          className="absolute top-3 right-3 w-7 h-7 bg-white rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-all"
        >
          <div className="w-5 h-5">{isSaved ? <Icon.heartFilled /> : <Icon.heartEmpty />}</div>
        </button>

        {hasMultiple && (
          <>
            <button onClick={(e) => { e.stopPropagation(); setCurrentImg((currentImg - 1 + p.images.length) % p.images.length); }} className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/50 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/70 transition-all shadow-lg">
              <div className="w-5 h-5 text-gray-800 font-black">{Icon.chevronLeft()}</div>
            </button>
            <button onClick={(e) => { e.stopPropagation(); setCurrentImg((currentImg + 1) % p.images.length); }} className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/50 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/70 transition-all shadow-lg">
              <div className="w-5 h-5 text-gray-800 font-black">{Icon.chevronRight()}</div>
            </button>
          </>
        )}
      </div>

      {/* CONTEÚDO */}
      <div className="p-3">
        <span className="text-xs font-bold px-2 py-0.5 rounded-full inline-block mb-2" style={{ backgroundColor: "#EEF2FF", color: "#003580" }}>
          {p.type}
        </span>

        <h3 className="font-black text-gray-900 text-sm leading-snug mb-1.5 line-clamp-2">{p.name}</h3>

        <div className="flex flex-wrap gap-1.5 mb-2 min-h-[32px]">
          {p.superhost && (
            <div className="flex items-center gap-1 text-xs font-bold text-amber-700 bg-amber-50 px-2 py-1 rounded-full border border-amber-200">
              <div className="w-3 h-3"><Icon.shield /></div>
              <span>Host Premium</span>
            </div>
          )}
          {p.verified && (
            <div className="flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-1 rounded-full border border-emerald-200">
              <div className="w-3 h-3"><Icon.verified /></div>
              <span>Verificado</span>
            </div>
          )}
        </div>

        <p className="text-xs text-gray-400 flex items-center gap-1 mb-3">
          <span className="w-3 h-3 flex-shrink-0"><Icon.pin /></span>
          Capitólio, MG
        </p>

        <div className="flex items-center gap-2 mb-3">
          <div className="w-9 h-9 rounded-lg rounded-tr-none flex items-center justify-center flex-shrink-0 text-white font-black text-sm" style={{ backgroundColor: "#003580" }}>
            {p.score}
          </div>
          <div>
            <p className="text-xs font-black leading-tight" style={{ color: "#003580" }}>{p.scoreLabel}</p>
            <p className="text-xs text-gray-400 leading-tight">{p.reviews} avaliações</p>
          </div>
        </div>

        <div className="border-t border-gray-100 pt-3">
          <div className="flex items-center gap-1.5 text-xs font-bold mb-2" style={{ color: "#003580" }}>
            <div className="w-3.5 h-3.5"><Icon.gift /></div>
            <span>Giftback {p.giftback}% nesta reserva</span>
          </div>

          <div className="flex items-end justify-between">
            <div>
              {p.oldPrice && (
                <p className="text-xs text-gray-400 line-through">R$ {p.oldPrice}<span className="text-gray-300"> /noite</span></p>
              )}
              <div className="flex items-baseline gap-1">
                <span className="font-black text-gray-900 text-xl">R$ {p.price}</span>
                <span className="text-xs text-gray-500">/noite</span>
              </div>
              <p className="text-xs text-gray-400">inclui impostos e taxas</p>
            </div>
            <button
              className="text-sm font-black text-white px-4 py-2.5 rounded-xl hover:opacity-90 active:scale-95 transition-all"
              style={{ backgroundColor: "#003580" }}
            >
              Ver oferta
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
