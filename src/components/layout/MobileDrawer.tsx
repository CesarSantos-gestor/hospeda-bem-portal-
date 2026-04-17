import { Icon } from "@/components/ui/Icon";
import { Logo } from "@/components/ui/Logo";
import { Portal as C } from "@/constants/colors";

export function MobileDrawer({ show, onClose }: { show: boolean; onClose: () => void }) {
  if (!show) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-black/50 z-50 md:hidden"
        onClick={onClose}
      />

      <div className="fixed top-0 right-0 bottom-0 w-80 bg-white z-50 md:hidden shadow-2xl">
        <div className="flex items-center justify-between p-5 border-b border-gray-200">
          <Logo />
          <button
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>

        <div className="p-5 space-y-2">
          <div className="mb-6">
            <a href="#entrar" className="w-full flex items-center justify-center gap-2 text-base font-bold py-3.5 rounded-xl border-2 transition-all mb-3" style={{ borderColor: C.navy, color: C.navy }}>
              Entrar
            </a>
            <a href="#cadastrar" className="w-full flex items-center justify-center gap-2 text-base font-bold py-3.5 rounded-xl text-white transition-all" style={{ backgroundColor: C.navy }}>
              Cadastrar
            </a>
          </div>

          <div className="space-y-1">
            <a href="#favoritos" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-100 transition-colors">
              <div className="w-5 h-5 text-red-500">{Icon.heartFilled()}</div>
              <span className="font-semibold text-gray-900">Meus Favoritos</span>
            </a>
            <a href="#reservas" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-100 transition-colors">
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
              </svg>
              <span className="font-semibold text-gray-900">Minhas Reservas</span>
            </a>
            <a href="#giftback" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-100 transition-colors">
              <div className="w-5 h-5" style={{ color: C.yellow }}>{Icon.gift()}</div>
              <span className="font-semibold text-gray-900">Meu Giftback</span>
            </a>
            <a href="#conta" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-100 transition-colors">
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
              </svg>
              <span className="font-semibold text-gray-900">Minha Conta</span>
            </a>
          </div>

          <div className="border-t border-gray-200 my-4" />

          <div className="space-y-1">
            <a href="#anunciar" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-100 transition-colors">
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
              </svg>
              <span className="font-semibold text-gray-900">Anunciar Propriedade</span>
            </a>
            <a href="#ajuda" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-100 transition-colors">
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              <span className="font-semibold text-gray-900">Central de Ajuda</span>
            </a>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-5 border-t border-gray-200 bg-gray-50">
          <p className="text-xs text-gray-600 text-center mb-2">Hospeda Bem &copy; 2026</p>
          <p className="text-xs text-gray-500 text-center">O marketplace das cidades turísticas</p>
        </div>
      </div>
    </>
  );
}
