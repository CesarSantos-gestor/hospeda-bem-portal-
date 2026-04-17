"use client";
import { useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { Portal as C } from "@/constants/colors";
import type { Room } from "@/types";

export function GuestsPicker({ rooms, totalGuests, onAddRoom, onRemoveRoom, onUpdateRoom }: {
  rooms: Room[];
  totalGuests: number;
  onAddRoom: () => void;
  onRemoveRoom: (idx: number) => void;
  onUpdateRoom: (idx: number, field: "adults" | "children", val: number) => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button onClick={() => setOpen(!open)} className={`w-full flex items-center gap-2 px-3 py-3 rounded-xl hover:bg-gray-50 transition-colors text-left border border-gray-100 ${open ? "bg-blue-50/60" : ""}`}>
        <div className="w-4 h-4 flex-shrink-0" style={{ color: C.navy }}><Icon.users /></div>
        <div className="flex-1 min-w-0">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-wider">HÓSPEDES E QUARTOS</p>
          <p className="text-sm font-bold text-gray-900">{totalGuests} hóspede{totalGuests !== 1 ? "s" : ""} · {rooms.length} quarto{rooms.length !== 1 ? "s" : ""}</p>
        </div>
        <div className={`w-4 h-4 text-gray-400 transition-transform ${open ? "rotate-180" : ""}`}>{Icon.chevronDown()}</div>
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute top-full left-0 right-0 md:right-auto md:w-96 mt-2 bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 p-4 max-h-96 overflow-y-auto">
            {rooms.map((room, idx) => (
              <div key={idx} className="border-b border-gray-100 pb-4 mb-4 last:border-0 last:mb-0 last:pb-0">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm font-black text-gray-800">Quarto {idx + 1}</p>
                  {rooms.length > 1 && (
                    <button onClick={() => onRemoveRoom(idx)} className="w-5 h-5 flex items-center justify-center text-red-500 hover:text-red-700">
                      <div className="w-4 h-4">{Icon.x()}</div>
                    </button>
                  )}
                </div>
                {[{ label: "Adultos", field: "adults" as const, min: 1 }, { label: "Crianças", field: "children" as const, min: 0 }].map(item => (
                  <div key={item.field} className="flex items-center justify-between py-2">
                    <span className="text-sm font-semibold text-gray-700">{item.label}</span>
                    <div className="flex items-center gap-3">
                      <button onClick={() => onUpdateRoom(idx, item.field, room[item.field] - 1)} className="w-7 h-7 rounded-full border border-gray-300 flex items-center justify-center hover:border-gray-800">
                        <div className="w-3 h-3 text-gray-600">{Icon.minus()}</div>
                      </button>
                      <span className="w-4 text-center text-sm font-black">{room[item.field]}</span>
                      <button onClick={() => onUpdateRoom(idx, item.field, room[item.field] + 1)} className="w-7 h-7 rounded-full border border-gray-300 flex items-center justify-center hover:border-gray-800">
                        <div className="w-3 h-3 text-gray-600">{Icon.plus()}</div>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ))}
            <button onClick={onAddRoom} className="w-full mt-2 text-sm font-bold flex items-center justify-center gap-1.5 py-2 rounded-lg hover:bg-gray-50 transition-colors" style={{ color: C.navy }}>
              <div className="w-4 h-4">{Icon.plus()}</div>
              Adicionar outro quarto
            </button>
          </div>
        </>
      )}
    </div>
  );
}
