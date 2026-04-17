import { NextResponse, type NextRequest } from "next/server";

// Mapa de domínios custom → slug da cidade
const DOMAIN_CITY_MAP: Record<string, string> = {
  "hospedabemcapitolio.com": "capitolio",
  "www.hospedabemcapitolio.com": "capitolio",
  "hospedabemgramado.com": "gramado",
  "www.hospedabemgramado.com": "gramado",
  "hospedabembonito.com": "bonito",
  "www.hospedabembonito.com": "bonito",
  // Adicionar futuras cidades aqui:
  // "hospedabemtiradentes.com": "tiradentes",
};

export function middleware(request: NextRequest) {
  const hostname = request.headers.get("host") || "";
  const citySlug = DOMAIN_CITY_MAP[hostname];

  // Se acessou via domínio custom e está na raiz, rewrite para /<city>
  if (citySlug) {
    const { pathname } = request.nextUrl;

    // Se está na raiz, redireciona para a página da cidade
    if (pathname === "/") {
      const url = request.nextUrl.clone();
      url.pathname = `/${citySlug}`;
      return NextResponse.rewrite(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
