import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const attractions = await prisma.attraction.findMany();
  return NextResponse.json(attractions);
}
