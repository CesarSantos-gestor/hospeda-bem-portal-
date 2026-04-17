import { Logo } from "@/components/ui/Logo";

const FOOTER_SECTIONS = [
  {
    title: "Destinos",
    links: [
      { label: "Capitólio, MG", href: "#capitolio" },
      { label: "Tiradentes, MG", href: "#tiradentes" },
      { label: "Paraty, RJ", href: "#paraty" },
      { label: "Gramado, RS", href: "#gramado" },
      { label: "Bonito, MS", href: "#bonito" },
      { label: "Jericoacoara, CE", href: "#jericoacoara" },
      { label: "+ Ver todos os destinos", href: "#destinos", highlight: true },
    ],
  },
  {
    title: "Hospedagens",
    links: [
      { label: "Pousadas", href: "#pousadas" },
      { label: "Hotéis", href: "#hoteis" },
      { label: "Chalés", href: "#chales" },
      { label: "Suítes", href: "#suites" },
      { label: "Resorts", href: "#resorts" },
      { label: "Casas", href: "#casas" },
      { label: "+ Ver todos os tipos", href: "#hospedagens", highlight: true },
    ],
  },
  {
    title: "Experiências",
    links: [
      { label: "Passeios de lancha", href: "#passeios" },
      { label: "Restaurantes", href: "#restaurantes" },
      { label: "Atrativos turísticos", href: "#atrativos" },
      { label: "Aventuras", href: "#aventuras" },
      { label: "Gastronomia", href: "#gastronomia" },
      { label: "Cultura local", href: "#cultura" },
      { label: "+ Ver parceiros", href: "#parceiros", highlight: true },
    ],
  },
  {
    title: "Para Você",
    links: [
      { label: "Como funciona", href: "#como-funciona" },
      { label: "O que é Giftback", href: "#giftback" },
      { label: "Minha conta", href: "#conta" },
      { label: "Minhas reservas", href: "#reservas" },
      { label: "Meus favoritos", href: "#favoritos" },
      { label: "Minhas avaliações", href: "#avaliacoes" },
    ],
  },
  {
    title: "Para Negócios",
    links: [
      { label: "Anuncie grátis", href: "#anunciar" },
      { label: "Para hoteleiros", href: "#hoteleiros" },
      { label: "Para parceiros", href: "#parceiros" },
      { label: "Dashboard", href: "#dashboard" },
      { label: "Planos e preços", href: "#planos" },
      { label: "Recursos", href: "#recursos" },
    ],
  },
];

const BOTTOM_SECTIONS = [
  {
    title: "Suporte",
    links: [
      { label: "Central de ajuda", href: "#ajuda" },
      { label: "Fale conosco", href: "#contato" },
      { label: "Perguntas frequentes", href: "#faq" },
      { label: "Como reservar", href: "#como-reservar" },
      { label: "Cancelamento", href: "#cancelamento" },
    ],
  },
  {
    title: "Empresa",
    links: [
      { label: "Sobre nós", href: "#sobre" },
      { label: "Trabalhe conosco", href: "#trabalhe" },
      { label: "Imprensa", href: "#imprensa" },
      { label: "Blog", href: "#blog" },
      { label: "Investidores", href: "#investidores" },
    ],
  },
  {
    title: "Políticas",
    links: [
      { label: "Privacidade", href: "#privacidade" },
      { label: "Termos de uso", href: "#termos" },
      { label: "Cookies", href: "#cookies" },
      { label: "Segurança", href: "#seguranca" },
      { label: "Acessibilidade", href: "#acessibilidade" },
    ],
  },
];

const SOCIAL_LINKS = [
  { label: "Instagram", href: "https://instagram.com/hospedabem", icon: <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg> },
  { label: "Facebook", href: "https://facebook.com/hospedabem", icon: <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg> },
  { label: "YouTube", href: "https://youtube.com/@hospedabem", icon: <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg> },
  { label: "LinkedIn", href: "https://linkedin.com/company/hospedabem", icon: <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg> },
];

function FooterLinkList({ links }: { links: { label: string; href: string; highlight?: boolean }[] }) {
  return (
    <ul className="space-y-2.5">
      {links.map(link => (
        <li key={link.label}>
          <a href={link.href} className={`text-sm transition-colors ${link.highlight ? "text-blue-400 hover:text-blue-300 font-semibold" : "text-gray-400 hover:text-white"}`}>
            {link.label}
          </a>
        </li>
      ))}
    </ul>
  );
}

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-12 text-center">
          <div className="flex justify-center mb-3">
            <div className="text-white"><Logo /></div>
          </div>
          <p className="text-gray-400 text-sm">O marketplace das cidades turísticas do Brasil</p>
        </div>

        {/* MOBILE: Accordion */}
        <div className="md:hidden space-y-3 mb-12">
          {[...FOOTER_SECTIONS, ...BOTTOM_SECTIONS].map(section => (
            <details key={section.title} className="bg-gray-800 rounded-lg">
              <summary className="font-black text-white p-4 text-sm uppercase tracking-wide cursor-pointer hover:bg-gray-750 transition-colors flex items-center justify-between">
                {section.title}
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"/>
                </svg>
              </summary>
              <ul className="space-y-2.5 p-4 pt-0">
                {section.links.map(link => (
                  <li key={link.label}>
                    <a href={link.href} className={`text-sm transition-colors block py-2 ${'highlight' in link && link.highlight ? "text-blue-400 hover:text-blue-300 font-semibold" : "text-gray-400 hover:text-white"}`}>
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </details>
          ))}
        </div>

        {/* DESKTOP: Grid */}
        <div className="hidden md:grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 mb-12">
          {FOOTER_SECTIONS.map(section => (
            <div key={section.title}>
              <h3 className="font-black text-white mb-4 text-sm uppercase tracking-wide">{section.title}</h3>
              <FooterLinkList links={section.links} />
            </div>
          ))}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12 pb-12 border-b border-gray-800">
          {BOTTOM_SECTIONS.map(section => (
            <div key={section.title}>
              <h3 className="font-black text-white mb-4 text-sm uppercase tracking-wide">{section.title}</h3>
              <FooterLinkList links={section.links} />
            </div>
          ))}

          <div>
            <h3 className="font-black text-white mb-4 text-sm uppercase tracking-wide">Conecte-se</h3>
            <ul className="space-y-2.5">
              {SOCIAL_LINKS.map(link => (
                <li key={link.label}>
                  <a href={link.href} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white text-sm transition-colors flex items-center gap-2">
                    {link.icon}
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="space-y-6">
          <div className="flex flex-col md:flex-row items-center justify-center gap-6 pb-6 border-b border-gray-800">
            <a href="tel:+553733334444" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors group">
              <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center group-hover:bg-gray-700 transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.01 15.38c-1.23 0-2.42-.2-3.53-.56a.977.977 0 00-1.01.24l-1.57 1.97c-2.83-1.35-5.48-3.9-6.89-6.83l1.95-1.66c.27-.28.35-.67.24-1.02-.37-1.11-.56-2.3-.56-3.53 0-.54-.45-.99-.99-.99H4.19C3.65 3 3 3.24 3 3.99 3 13.28 10.73 21 20.01 21c.71 0 .99-.63.99-1.18v-3.45c0-.54-.45-.99-.99-.99z"/>
                </svg>
              </div>
              <div className="text-left">
                <div className="text-xs text-gray-500">Ligue para nós</div>
                <div className="font-semibold">(37) 3333-4444</div>
              </div>
            </a>
            <a href="mailto:contato@hospedabem.com" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors group">
              <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center group-hover:bg-gray-700 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                </svg>
              </div>
              <div className="text-left">
                <div className="text-xs text-gray-500">Envie um email</div>
                <div className="font-semibold">contato@hospedabem.com</div>
              </div>
            </a>
            <div className="flex items-center gap-2 text-gray-400">
              <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
              <div className="text-left">
                <div className="text-xs text-gray-500">Horário de atendimento</div>
                <div className="font-semibold text-sm">Seg-Sex: 8h-18h | Sáb: 9h-13h</div>
              </div>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-500">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-2">
                <span className="text-2xl">&#x1F1E7;&#x1F1F7;</span>
                <span>BRL · Português (BR)</span>
              </span>
            </div>
            <div className="text-center md:text-center">
              <p>&copy; 2026 Hospeda Bem · Todos os direitos reservados</p>
              <p className="text-xs mt-1">CNPJ XX.XXX.XXX/0001-XX · capitolio.hospedabem.com</p>
            </div>
            <div className="text-xs text-gray-600">
              <p>Feito com &#10084;&#65039; em Minas Gerais</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
