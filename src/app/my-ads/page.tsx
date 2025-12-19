
import AdItem from "@/components/AdItem";
import { prisma } from "@/libs/db";
import { currentUser } from "@clerk/nextjs/server";

export const dynamic = 'force-dynamic';

export default async function MyAdsPage() {
  const user = await currentUser();

  if (!user) {
    return (
      <div className="text-center mt-10">
        <p>You must be signed in to view your ads.</p>
      </div>
    );
  }

  const adsDocs = await prisma.ad.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="container-main my-8">
      <h1 className="text-2xl font-bold mb-6 border-b pb-2">Your Ads</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {adsDocs.length > 0 ? (
          adsDocs.map(ad => (
            <AdItem key={ad.id} ad={ad} />
          ))
        ) : (
          <p className="text-gray-500 col-span-4 text-center">You haven't posted any ads yet.</p>
        )}
      </div>
    </div>
  );
}