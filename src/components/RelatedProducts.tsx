import { prisma } from "@/libs/db";
import AdItem from "./AdItem";
import { Ad } from "@prisma/client";

type Props = {
    category?: string;
    currentAdId?: string;
    limit?: number;
};

export default async function RelatedProducts({ category, currentAdId, limit = 4 }: Props) {
    let ads: Ad[] = [];

    const where: any = {
        status: 'ACTIVE',
    };

    if (currentAdId) {
        where.id = { not: currentAdId };
    }

    if (category) {
        where.category = category;
        ads = await prisma.ad.findMany({
            where,
            orderBy: { createdAt: 'desc' },
            take: limit,
        });
    }

    if (ads.length === 0) {
        delete where.category;
        ads = await prisma.ad.findMany({
            where,
            orderBy: { createdAt: 'desc' },
            take: limit,
        });
    }

    if (ads.length === 0) return null;

    return (
        <div className="mt-12">
            <h3 className="text-xl font-bold mb-6 text-gray-800">
                {category ? 'Related Products' : 'You Might Also Like'}
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {ads.map(ad => (
                    <AdItem key={ad.id} ad={ad} />
                ))}
            </div>
        </div>
    );
}
