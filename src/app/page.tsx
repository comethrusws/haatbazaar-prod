import AdItem from "@/components/AdItem";
import { prisma } from "@/libs/db";

export const dynamic = 'force-dynamic';

export default async function Home(props: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const searchParams = await props.searchParams;
  const phrase = Array.isArray(searchParams.phrase) ? searchParams.phrase[0] : searchParams.phrase;
  const where: any = {};

  if (phrase) {
    where.title = { contains: phrase, mode: 'insensitive' };
  }

  const ads = await prisma.ad.findMany({
    where,
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="flex flex-col gap-6">

      <h2 className="font-bold text-2xl mb-4">
        {phrase ? `Results for "${phrase}"` : 'Latest Arrivals'}
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {ads.map(ad => (
          <AdItem key={ad.id} ad={ad} />
        ))}
      </div>

      {ads.length === 0 && (
        <div className="text-gray-500 py-12 text-center">
          No products found matching your criteria.
        </div>
      )}
    </div>
  );
}
