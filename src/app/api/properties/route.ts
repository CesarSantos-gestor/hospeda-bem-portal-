import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const properties = await prisma.property.findMany({
    where: { portalApproved: true, portalActive: true },
  });
  const parsed = properties.map((p) => ({
    ...p,
    images: JSON.parse(p.images),
    amenities: JSON.parse(p.amenities),
  }));
  return NextResponse.json(parsed);
}
