import { NextResponse, type NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { CITY_CONFIG } from "@/data/city-config";

export async function GET(request: NextRequest) {
  const citySlug = request.nextUrl.searchParams.get("city");

  const where: any = {
    portalApproved: true,
    portalActive: true,
  };

  if (citySlug) {
    // Map slug to real city name (e.g., "capitolio" → "Capitólio")
    const cfg = CITY_CONFIG[citySlug];
    if (cfg) {
      where.city = cfg.name;
    } else {
      // Fallback: case-insensitive search
      where.city = { contains: citySlug, mode: "insensitive" };
    }
  }

  const properties = await prisma.property.findMany({ where });
  const parsed = properties.map((p) => ({
    ...p,
    images: JSON.parse(p.images),
    amenities: JSON.parse(p.amenities),
  }));
  return NextResponse.json(parsed);
}
