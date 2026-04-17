import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/api-auth";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAdmin(req);
  if (auth instanceof NextResponse) return auth;

  const { id } = await params;
  const property = await prisma.property.findUnique({
    where: { id: parseInt(id) },
    include: { rooms: true },
  });

  if (!property) return NextResponse.json({ error: "Propriedade não encontrada" }, { status: 404 });
  return NextResponse.json(property);
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAdmin(req);
  if (auth instanceof NextResponse) return auth;

  const { id } = await params;
  const body = await req.json();

  const existing = await prisma.property.findUnique({ where: { id: parseInt(id) }, select: { source: true } });
  if (!existing) return NextResponse.json({ error: "Propriedade não encontrada" }, { status: 404 });

  let allowed: string[];
  if (existing.source === "portal") {
    allowed = [
      "name", "type", "city", "state", "country", "description", "slug",
      "price", "oldPrice", "score", "scoreLabel", "reviews", "giftback",
      "superhost", "verified", "images", "amenities", "amenitiesDetail",
      "location", "ratings", "policies", "contact",
      "portalApproved", "portalActive", "portalFeatured",
    ];
  } else {
    allowed = ["portalApproved", "portalActive", "portalFeatured"];
  }

  const data: any = {};
  for (const key of allowed) {
    if (body[key] !== undefined) data[key] = body[key];
  }

  const property = await prisma.property.update({
    where: { id: parseInt(id) },
    data,
  });

  return NextResponse.json(property);
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAdmin(req);
  if (auth instanceof NextResponse) return auth;

  const { id } = await params;

  const existing = await prisma.property.findUnique({ where: { id: parseInt(id) }, select: { source: true } });
  if (!existing) return NextResponse.json({ error: "Propriedade não encontrada" }, { status: 404 });
  if (existing.source !== "portal") {
    return NextResponse.json({ error: "Não é possível excluir propriedades PMS pelo portal" }, { status: 403 });
  }

  await prisma.property.delete({ where: { id: parseInt(id) } });
  return NextResponse.json({ ok: true });
}
