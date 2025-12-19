import { prisma } from "@/libs/db";
import { auth, currentUser } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  const phrase = searchParams.get('phrase');
  const category = searchParams.get('category');
  const min = searchParams.get('min');
  const max = searchParams.get('max');

  const where: any = {};

  if (phrase) {
    where.title = { contains: phrase, mode: 'insensitive' };
  }
  if (category) {
    where.category = category;
  }
  if (min || max) {
    where.price = {};
    if (min) where.price.gte = parseFloat(min);
    if (max) where.price.lte = parseFloat(max);
  }

  try {
    const ads = await prisma.ad.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(ads);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
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
