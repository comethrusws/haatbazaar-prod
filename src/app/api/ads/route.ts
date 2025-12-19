import { prisma } from "@/libs/db";
import { auth, currentUser } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  const phrase = searchParams.get('phrase');
  const category = searchParams.get('category');
  const min = searchParams.get('min');
  const max = searchParams.get('max');
  const radius = searchParams.get('radius');
  const lat = searchParams.get('lat');
  const lng = searchParams.get('lng');
  const sort = searchParams.get('sort') || 'newest';

  const where: any = {};

  if (phrase) {
    where.OR = [
      { title: { contains: phrase, mode: 'insensitive' } },
      { description: { contains: phrase, mode: 'insensitive' } },
    ];
  }
  if (category) {
    where.category = category;
  }
  if (min || max) {
    where.price = {};
    if (min) where.price.gte = parseFloat(min);
    if (max) where.price.lte = parseFloat(max);
  }

  const orderBy: any = {};
  if (sort === 'newest') {
    orderBy.createdAt = 'desc';
  } else if (sort === 'price-asc') {
    orderBy.price = 'asc';
  } else if (sort === 'price-desc') {
    orderBy.price = 'desc';
  } else {
    orderBy.createdAt = 'desc';
  }

  try {
    let ads = await prisma.ad.findMany({
      where,
      orderBy,
    });

    if (lat && lng) {
      const userLat = parseFloat(lat);
      const userLng = parseFloat(lng);
      const radiusKm = radius ? parseFloat(radius) : undefined;

      const adsWithDistance = ads.map(ad => {
        let distance = null;
        if (ad.latitude && ad.longitude) {
          distance = calculateDistance(userLat, userLng, ad.latitude, ad.longitude);
        }
        return { ...ad, distance };
      });

      // Filter by radius
      let filteredAds = adsWithDistance;
      if (radiusKm) {
        filteredAds = filteredAds.filter(ad => ad.distance !== null && ad.distance <= radiusKm);
      }

      // Sort by distance
      if (sort === 'distance') {
        filteredAds.sort((a, b) => {
          if (a.distance === null) return 1;
          if (b.distance === null) return -1;
          return a.distance - b.distance;
        });
      }

      // Return processing result
      return NextResponse.json(filteredAds);
    }

    // If no location params, just return DB result
    return NextResponse.json(ads);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371; // km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export async function DELETE(req: NextRequest) {
  const url = new URL(req.url);
  const id = url.searchParams.get('id');

  if (!id) {
    return NextResponse.json(false, { status: 400 });
  }

  const user = await currentUser();
  if (!user) {
    return NextResponse.json(false, { status: 401 });
  }

  const adDoc = await prisma.ad.findUnique({
    where: { id }
  });

  if (!adDoc || adDoc.userId !== user.id) {
    return NextResponse.json(false, { status: 403 });
  }

  await prisma.ad.delete({
    where: { id }
  });

  return NextResponse.json(true);
}
