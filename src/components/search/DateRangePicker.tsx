"use client";
import { useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { Portal as C } from "@/constants/colors";

const MONTHS_FULL = ["Janeiro","Fevereiro","Março","Abril","Maio","Junho","Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"];
const MONTHS_SHORT = ["Jan","Fev","Mar","Abr","Mai","Jun","Jul","Ago","Set","Out","Nov","Dez"];
const DAYS_MIN = ["D","S","T","Q","Q","S","S"];

const sameDay = (a: Date, b: Date) => a.toDateString() === b.toDateString();
const before = (a: Date, b: Date) => new Date(a.getFullYear(), a.getMonth(), a.getDate()) < new Date(b.getFullYear(), b.getMonth(), b.getDate());
const between = (d: Date, s: Date, e: Date) => { const day = new Date(d.getFullYear(), d.getMonth(), d.getDate()); return day > new Date(s.getFullYear(), s.getMonth(), s.getDate()) && day < new Date(e.getFullYear(), e.getMonth(), e.getDate()); };

function CalMonth({ m, y, checkIn, checkOut, onPick, propertyId, blockedDates }: {
  m: number; y: number; checkIn: Date | null; checkOut: Date | null;
  onPick: (d: Date) => void; propertyId?: number;
  blockedDates?: { [key: number]: Date[] };
}) {
  const first = new Date(y, m, 1).getDay();
  const days = new Date(y, m + 1, 0).getDate();
  const today = new Date();
  const cells = [...Array(first).fill(null), ...Array.from({ length: days }, (_, i) => i + 1)];

  const isBlocked = (date: Date) => {
    if (!propertyId || !blockedDates) return false;
    const blocked = blockedDates[propertyId] || [];
    return blocked.some(d => sameDay(d, date));
  };

  return (
    <div>
      <p className="text-sm font-black text-center text-gray-900 mb-4">{MONTHS_FULL[m]} {y}</p>
      <div className="grid grid-cols-7 mb-2">{DAYS_MIN.map((d, i) => <div key={i} className="text-center text-xs font-bold text-gray-400 py-1">{d}</div>)}</div>
      <div className="grid grid-cols-7 gap-y-1">
        {cells.map((day, i) => {
          if (!day) return <div key={i} />;
          const date = new Date(y, m, day);
          const isPast = before(date, today);
          const isDateBlocked = isBlocked(date);
          const isDisabled = isPast || isDateBlocked;
          const isStart = checkIn && sameDay(date, checkIn);
          const isEnd = checkOut && sameDay(date, checkOut);
          const inRange = checkIn && checkOut && between(date, checkIn, checkOut);
          return (
            <button
              key={i}
              disabled={isDisabled}
              onClick={() => !isDisabled && onPick(date)}
              className={`h-9 w-full flex items-center justify-center text-xs font-semibold transition-all rounded-full relative
                ${isPast ? "text-gray-300 cursor-not-allowed opacity-40" : ""}
                ${isDateBlocked && !isPast ? "text-red-500 cursor-not-allowed line-through opacity-60" : ""}
                ${!isDisabled ? "cursor-pointer" : ""}
                ${isStart || isEnd ? "text-white font-black" : ""}
                ${inRange ? "bg-blue-50 text-blue-800 rounded-none" : ""}
                ${!isStart && !isEnd && !inRange && !isDisabled ? "hover:bg-gray-100 text-gray-700" : ""}
              `}
              style={(isStart || isEnd) ? { backgroundColor: C.navy } : {}}
              title={isDateBlocked ? "Data indisponível (já reservada)" : isPast ? "Data passada" : ""}>
              {day}
              {isDateBlocked && !isPast && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-0.5 h-full bg-red-400 rotate-45" />
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function DateRangePicker({ checkIn, checkOut, onChange, propertyId, blockedDates }: {
  checkIn: Date | null; checkOut: Date | null;
  onChange: (i: Date | null, o: Date | null) => void;
  propertyId?: number;
  blockedDates?: { [key: number]: Date[] };
}) {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<"in" | "out">("in");
  const now = new Date();
  const [m, setM] = useState(now.getMonth());
  const [y, setY] = useState(now.getFullYear());
  const m2 = m === 11 ? 0 : m + 1;
  const y2 = m === 11 ? y + 1 : y;
  const fmt = (d: Date | null) => d ? `${d.getDate().toString().padStart(2, "0")} ${MONTHS_SHORT[d.getMonth()]} ${d.getFullYear()}` : "";
  const pick = (d: Date) => {
    if (step === "in") { onChange(d, null); setStep("out"); }
    else { if (checkIn && before(d, checkIn)) { onChange(d, null); setStep("out"); } else { onChange(checkIn, d); setOpen(false); setStep("in"); } }
  };
  const prev = () => m === 0 ? (setM(11), setY(y - 1)) : setM(m - 1);
  const next = () => m === 11 ? (setM(0), setY(y + 1)) : setM(m + 1);
  const nights = checkIn && checkOut ? Math.round((checkOut.getTime() - checkIn.getTime()) / 86400000) : 0;

  return (
    <div className="relative flex-1">
      <div className="flex h-full divide-x divide-gray-100">
        {[{ label: "CHECK-IN", val: checkIn, s: "in" as const }, { label: "CHECK-OUT", val: checkOut, s: "out" as const }].map(({ label, val, s }) => (
          <button key={label} onClick={() => { setOpen(true); setStep(s); }}
            className={`flex-1 flex items-center gap-2.5 px-4 py-3 hover:bg-gray-50 transition-colors text-left ${open && step === s ? "bg-blue-50/60" : ""}`}>
            <div className="w-4 h-4 flex-shrink-0" style={{ color: C.navy }}><Icon.calendar /></div>
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{label}</p>
              <p className={`text-sm font-bold ${val ? "text-gray-900" : "text-gray-400"}`}>{val ? fmt(val) : "Adicionar data"}</p>
            </div>
          </button>
        ))}
      </div>
      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="fixed inset-0 bg-white z-50 md:absolute md:inset-auto md:top-full md:left-0 md:mt-3 md:rounded-2xl md:shadow-2xl md:border md:border-gray-100 md:p-6 md:w-[600px]">
            <button
              onClick={() => setOpen(false)}
              className="hidden md:flex absolute top-2 right-2 z-10 w-7 h-7 items-center justify-center hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Fechar calendário">
              <div className="w-4 h-4 text-gray-500">{Icon.x()}</div>
            </button>

            <div className="md:hidden sticky top-0 bg-white border-b border-gray-200 z-10">
              <div className="flex items-center justify-between p-4">
                <button onClick={() => setOpen(false)} className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded-full">
                  <div className="w-5 h-5 text-gray-600">{Icon.x()}</div>
                </button>
                <div className="flex items-center gap-2 text-xs font-bold text-gray-500">
                  <span className={step === "in" ? "font-black" : ""} style={step === "in" ? { color: C.navy } : {}}>Check-in</span>
                  <div className="w-4 h-4 text-gray-400">{Icon.chevronRight()}</div>
                  <span className={step === "out" ? "font-black" : ""} style={step === "out" ? { color: C.navy } : {}}>Check-out</span>
                </div>
                <div className="w-8" />
              </div>
            </div>

            <div className="hidden md:flex items-center justify-between mb-5">
              <button onClick={prev} className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded-full transition-colors">
                <div className="w-4 h-4 text-gray-600">{Icon.chevronLeft()}</div>
              </button>
              <div className="flex items-center gap-2 text-xs font-bold text-gray-500">
                <span className={step === "in" ? "font-black" : ""} style={step === "in" ? { color: C.navy } : {}}>Selecione entrada</span>
                <div className="w-4 h-4 text-gray-400">{Icon.chevronRight()}</div>
                <span className={step === "out" ? "font-black" : ""} style={step === "out" ? { color: C.navy } : {}}>Selecione saída</span>
              </div>
              <button onClick={next} className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded-full transition-colors">
                <div className="w-4 h-4 text-gray-600">{Icon.chevronRight()}</div>
              </button>
            </div>

            <div className="md:hidden overflow-y-auto h-[calc(100vh-120px)] px-4 pb-20">
              <div className="space-y-8">
                {[0, 1, 2, 3, 4, 5].map(offset => {
                  const date = new Date(now.getFullYear(), now.getMonth() + offset, 1);
                  return (
                    <CalMonth
                      key={offset}
                      m={date.getMonth()}
                      y={date.getFullYear()}
                      checkIn={checkIn}
                      checkOut={checkOut}
                      onPick={pick}
                      propertyId={propertyId}
                      blockedDates={blockedDates}
                    />
                  );
                })}
              </div>
            </div>

            <div className="hidden md:grid grid-cols-2 gap-8">
              <CalMonth m={m} y={y} checkIn={checkIn} checkOut={checkOut} onPick={pick} propertyId={propertyId} blockedDates={blockedDates} />
              <CalMonth m={m2} y={y2} checkIn={checkIn} checkOut={checkOut} onPick={pick} propertyId={propertyId} blockedDates={blockedDates} />
            </div>

            {(checkIn || checkOut) && (
              <>
                <div className="hidden md:flex items-center justify-between mt-5 pt-4 border-t border-gray-100">
                  <button onClick={() => { onChange(null, null); setStep("in"); }} className="text-sm text-gray-500 underline hover:text-gray-800 font-semibold">Limpar</button>
                  {nights > 0 && <p className="text-sm font-black text-gray-700">{nights} noite{nights > 1 ? "s" : ""}</p>}
                </div>

                <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
                  <div className="flex items-center justify-between mb-3">
                    <button onClick={() => { onChange(null, null); setStep("in"); }} className="text-sm text-gray-500 underline font-semibold">Limpar datas</button>
                    {nights > 0 && <p className="text-sm font-black text-gray-700">{nights} noite{nights > 1 ? "s" : ""}</p>}
                  </div>
                  <button
                    onClick={() => setOpen(false)}
                    disabled={!checkIn || !checkOut}
                    className="w-full py-3 rounded-xl text-white font-black text-sm disabled:opacity-40"
                    style={{ backgroundColor: C.navy }}>
                    Aplicar datas
                  </button>
                </div>
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
}
