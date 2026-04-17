import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const restaurants = await prisma.restaurant.findMany();
  const parsed = restaurants.map((r) => ({
    ...r,
    tags: JSON.parse(r.tags),
  }));
  return NextResponse.json(parsed);
}
