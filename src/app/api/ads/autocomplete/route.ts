import { prisma } from "@/libs/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get('q');

    if (!query || query.length < 2) {
        return NextResponse.json([]);
    }

    try {
        const ads = await prisma.ad.findMany({
            where: {
                title: {
                    contains: query,
                    mode: 'insensitive',
                },
            },
            select: {
                title: true,
                category: true,
            },
            take: 10,
        });

        const uniqueTitles = Array.from(new Set(ads.map(ad => ad.title)));


        return NextResponse.json(uniqueTitles);
    } catch (error) {
        console.error('Autocomplete error:', error);
        return NextResponse.json([]);
    }
}
