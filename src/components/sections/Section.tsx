import { PropertyCard } from "@/components/cards/PropertyCard";
import type { Property } from "@/types";

export function Section({ title, subtitle, items, filtered, favorites, onToggleFavorite, cityName, cityState }: {
  title: string; subtitle: string; icon: string;
  items: Property[]; filtered: string;
  favorites?: number[];
  onToggleFavorite?: (id: number) => void;
  cityName?: string;
  cityState?: string;
}) {
  const shown = filtered === "Todos" ? items : items.filter(p => p.type === filtered);
  if (shown.length === 0) return null;
  return (
    <section>
      <div className="flex items-end justify-between mb-6">
        <div>
          <h2 className="text-2xl md:text-3xl font-black text-gray-900 mb-1">{title}</h2>
          <p className="text-sm text-gray-500">{subtitle}</p>
        </div>
      </div>
      <div className="relative -mx-4 md:mx-0">
        <div className="pointer-events-none absolute right-0 top-0 bottom-4 w-12 z-10 bg-gradient-to-l from-gray-50 to-transparent md:hidden" />
        <div
          className="overflow-x-auto overflow-y-visible pb-4 px-4 md:px-0 snap-x snap-mandatory scrollbar-hide"
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
          }}>
          <div className="flex gap-4 md:gap-5">
            {shown.map(p => (
              <div
                key={p.id}
                className="flex-shrink-0 snap-start w-[85%] sm:w-[45%] md:w-[calc(50%-10px)] lg:w-[calc(33.333%-14px)] xl:w-[calc(25%-15px)]">
                <PropertyCard p={p} favorites={favorites} onToggleFavorite={onToggleFavorite} cityName={cityName} cityState={cityState} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
