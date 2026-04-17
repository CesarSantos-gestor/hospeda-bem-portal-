import { NextResponse, type NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const city = request.nextUrl.searchParams.get("city");

  const where: Record<string, unknown> = {
    portalApproved: true,
    portalActive: true,
  };
  if (city) where.city = city;

  const properties = await prisma.property.findMany({ where });
  const parsed = properties.map((p) => ({
    ...p,
    images: JSON.parse(p.images),
    amenities: JSON.parse(p.amenities),
  }));
  return NextResponse.json(parsed);
}
