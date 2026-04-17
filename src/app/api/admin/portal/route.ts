import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/api-auth";

export async function GET(req: NextRequest) {
  const auth = await requireAdmin(req);
  if (auth instanceof NextResponse) return auth;

  const url = new URL(req.url);
  const status = url.searchParams.get("status") || "";
  const source = url.searchParams.get("source") || "";

  const where: any = {};
  if (status === "approved") {
    where.portalApproved = true;
  } else if (status === "rejected") {
    where.portalApproved = false;
    where.portalActive = false;
  } else if (status === "pending") {
    where.portalActive = true;
    where.portalApproved = false;
  }
  if (source) where.source = source;

  const properties = await prisma.property.findMany({
    where,
    select: {
      id: true,
      name: true,
      type: true,
      city: true,
      state: true,
      source: true,
      portalApproved: true,
      portalActive: true,
      portalFeatured: true,
      tenantId: true,
    },
    orderBy: { id: "asc" },
  });

  return NextResponse.json(
    properties.map((p) => ({
      ...p,
      tenantName: p.tenantId ? `Tenant #${p.tenantId}` : "Portal",
    }))
  );
}

export async function POST(req: NextRequest) {
  const auth = await requireAdmin(req);
  if (auth instanceof NextResponse) return auth;

  const body = await req.json();

  const allowed = [
    "name", "type", "city", "state", "country", "description", "slug",
    "price", "oldPrice", "score", "scoreLabel", "reviews", "giftback",
    "superhost", "verified", "images", "amenities", "amenitiesDetail",
    "location", "ratings", "policies", "contact",
  ];

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const data: any = { source: "portal", tenantId: null, portalApproved: true, portalActive: true };
  for (const key of allowed) {
    if (body[key] !== undefined) data[key] = body[key];
  }

  if (!data.name) return NextResponse.json({ error: "Nome é obrigatório" }, { status: 400 });
  if (!data.type) data.type = "Pousada";
  if (!data.city) return NextResponse.json({ error: "Cidade é obrigatória" }, { status: 400 });
  if (data.score === undefined) data.score = 0;
  if (!data.scoreLabel) data.scoreLabel = "Novo";
  if (data.reviews === undefined) data.reviews = 0;
  if (data.price === undefined) data.price = 0;
  if (data.giftback === undefined) data.giftback = 0;
  if (data.superhost === undefined) data.superhost = false;
  if (data.verified === undefined) data.verified = false;
  if (!data.images) data.images = "[]";
  if (!data.amenities) data.amenities = "[]";
  if (!data.state) data.state = "MG";
  if (!data.country) data.country = "Brasil";

  if (!data.slug) {
    data.slug = (data.name as string)
      .toLowerCase()
      .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  }

  const property = await prisma.property.create({ data });
  return NextResponse.json(property, { status: 201 });
}
