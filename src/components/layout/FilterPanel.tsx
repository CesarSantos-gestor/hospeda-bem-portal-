import { Icon } from "@/components/ui/Icon";
import { Portal as C } from "@/constants/colors";

const ALL_AMENITIES = ["Wi-Fi", "Piscina", "Café da manhã", "Ar-condicionado", "Pet-friendly", "Vista para o lago", "Estacionamento"];

export function FilterPanel({ show, onClose, priceRange, setPriceRange, selectedAmenities, setSelectedAmenities, onlySuperhost, setOnlySuperhost, onlyVerified, setOnlyVerified, clearFilters, resultCount }: {
  show: boolean;
  onClose: () => void;
  priceRange: [number, number];
  setPriceRange: (v: [number, number]) => void;
  selectedAmenities: string[];
  setSelectedAmenities: (v: string[]) => void;
  onlySuperhost: boolean;
  setOnlySuperhost: (v: boolean) => void;
  onlyVerified: boolean;
  setOnlyVerified: (v: boolean) => void;
  clearFilters: () => void;
  resultCount: number;
}) {
  if (!show) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-40" onClick={onClose} />
      <div className="fixed right-0 top-0 bottom-0 w-full md:w-96 bg-white z-50 shadow-2xl overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-black text-gray-900">Filtros</h2>
            <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100">
              <div className="w-5 h-5 text-gray-600">{Icon.x()}</div>
            </button>
          </div>

          <div className="mb-6 pb-6 border-b border-gray-200">
            <h3 className="text-sm font-black text-gray-900 mb-3">Faixa de preço</h3>
            <div className="flex items-center gap-3 mb-3">
              <input
                type="number"
                value={priceRange[0]}
                onChange={(e) => setPriceRange([parseInt(e.target.value) || 0, priceRange[1]])}
                className="w-24 px-3 py-2 border border-gray-300 rounded-lg text-sm font-bold"
                placeholder="Mín"
              />
              <span className="text-gray-400">&mdash;</span>
              <input
                type="number"
                value={priceRange[1]}
                onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value) || 1000])}
                className="w-24 px-3 py-2 border border-gray-300 rounded-lg text-sm font-bold"
                placeholder="Máx"
              />
            </div>
            <input
              type="range"
              min="0"
              max="1000"
              step="10"
              value={priceRange[1]}
              onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
              className="w-full"
            />
            <p className="text-xs text-gray-500 mt-2">R$ {priceRange[0]} - R$ {priceRange[1]} por noite</p>
          </div>

          <div className="mb-6 pb-6 border-b border-gray-200">
            <h3 className="text-sm font-black text-gray-900 mb-3">Comodidades</h3>
            <div className="space-y-2">
              {ALL_AMENITIES.map(amenity => (
                <label key={amenity} className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors">
                  <input
                    type="checkbox"
                    checked={selectedAmenities.includes(amenity)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedAmenities([...selectedAmenities, amenity]);
                      } else {
                        setSelectedAmenities(selectedAmenities.filter(a => a !== amenity));
                      }
                    }}
                    className="w-5 h-5 rounded border-gray-300"
                  />
                  <span className="text-sm font-semibold text-gray-700">{amenity}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-sm font-black text-gray-900 mb-3">Selos de qualidade</h3>
            <div className="space-y-2">
              <label className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors">
                <input
                  type="checkbox"
                  checked={onlySuperhost}
                  onChange={(e) => setOnlySuperhost(e.target.checked)}
                  className="w-5 h-5 rounded border-gray-300"
                />
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 text-amber-600">{Icon.shield()}</div>
                  <span className="text-sm font-semibold text-gray-700">Host Premium</span>
                </div>
              </label>
              <label className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors">
                <input
                  type="checkbox"
                  checked={onlyVerified}
                  onChange={(e) => setOnlyVerified(e.target.checked)}
                  className="w-5 h-5 rounded border-gray-300"
                />
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 text-emerald-600">{Icon.verified()}</div>
                  <span className="text-sm font-semibold text-gray-700">Verificado</span>
                </div>
              </label>
            </div>
          </div>

          <div className="flex gap-3 pt-6 border-t border-gray-200">
            <button
              onClick={clearFilters}
              className="flex-1 px-4 py-3 rounded-xl border-2 border-gray-300 text-gray-700 font-black text-sm hover:border-gray-400 transition-colors">
              Limpar tudo
            </button>
            <button
              onClick={onClose}
              className="flex-1 px-4 py-3 rounded-xl text-white font-black text-sm hover:opacity-90 transition-opacity"
              style={{ backgroundColor: C.navy }}>
              Mostrar {resultCount} {resultCount === 1 ? "resultado" : "resultados"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
