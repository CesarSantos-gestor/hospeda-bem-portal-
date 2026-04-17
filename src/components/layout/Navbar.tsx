import { Icon } from "@/components/ui/Icon";
import { Logo } from "@/components/ui/Logo";
import { Portal as C } from "@/constants/colors";

const NAV_ITEMS = [
  { icon: <Icon.bed />, label: "Hospedagens", active: true },
  { icon: <Icon.compass />, label: "Passeios", active: false },
  { icon: <Icon.utensils />, label: "Restaurantes", active: false },
  { icon: <Icon.car />, label: "Táxi", active: false },
];

export function Navbar() {
  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-6">
          <Logo />

          <div className="hidden lg:flex items-center gap-1">
            {NAV_ITEMS.map(item => (
              <button key={item.label} className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold transition-all ${item.active ? "text-white" : "text-gray-500 hover:bg-gray-100 hover:text-gray-900"}`}
                style={item.active ? { backgroundColor: C.navy } : {}}>
                <div className="w-4 h-4">{item.icon}</div>
                {item.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button className="hidden md:flex items-center gap-2 text-sm font-black px-4 py-2 rounded-full border-2 transition-all hover:text-white" style={{ borderColor: C.navy, color: C.navy }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.backgroundColor = C.navy; (e.currentTarget as HTMLElement).style.color = "white"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.backgroundColor = "transparent"; (e.currentTarget as HTMLElement).style.color = C.navy; }}>
              <div className="w-4 h-4"><Icon.megaphone /></div>
              Anuncie seu Hotel
            </button>
            <button className="flex items-center gap-2 border border-gray-200 rounded-full px-3 py-2 hover:shadow-md transition-shadow cursor-pointer">
              <div className="w-4 h-4 text-gray-600"><Icon.menu /></div>
              <div className="w-7 h-7 rounded-full flex items-center justify-center" style={{ backgroundColor: C.navy }}>
                <div className="w-4 h-4 text-white"><Icon.user /></div>
              </div>
            </button>
          </div>
        </div>
      </div>

      <div className="lg:hidden overflow-x-auto border-t border-gray-100">
        <div className="flex gap-1 px-4 py-2 w-max">
          {[...NAV_ITEMS, { icon: <Icon.megaphone />, label: "Anunciar", active: false }].map(item => (
            <button key={item.label} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${item.active ? "text-white" : "text-gray-600 bg-gray-100"}`}
              style={item.active ? { backgroundColor: C.navy } : {}}>
              <div className="w-3.5 h-3.5">{item.icon}</div>
              {item.label}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
}
