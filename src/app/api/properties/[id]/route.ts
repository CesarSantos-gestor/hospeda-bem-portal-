import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const property = await prisma.property.findUnique({
    where: { id: Number(id) },
    include: { blockedDates: true, rooms: true, reviewsData: true },
  });

  if (!property) {
    return NextResponse.json({ error: "Property not found" }, { status: 404 });
  }

  const parseJSON = (val: string | null) => (val ? JSON.parse(val) : null);

  return NextResponse.json({
    ...property,
    images: JSON.parse(property.images),
    amenities: JSON.parse(property.amenities),
    amenitiesDetail: parseJSON(property.amenitiesDetail),
    location: parseJSON(property.location),
    ratings: parseJSON(property.ratings),
    policies: parseJSON(property.policies),
    contact: parseJSON(property.contact),
    blockedDates: property.blockedDates.map((d) => d.date),
    rooms: property.rooms.map((room) => ({
      ...room,
      amenities: JSON.parse(room.amenities),
      images: JSON.parse(room.images),
      policies: JSON.parse(room.policies),
    })),
    reviewsData: property.reviewsData.map((r) => ({
      id: r.id,
      author: r.author,
      date: r.date,
      rating: r.rating,
      comment: r.comment,
    })),
  });
}
