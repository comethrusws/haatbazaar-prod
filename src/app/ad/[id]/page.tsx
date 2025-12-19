'use server';

import DeleteAdButton from "@/components/DeleteAdButton";
import Gallery from "@/components/Gallery";
import MapWrapper from "@/components/MapWrapper";
import { formatMoney, formatDate } from "@/libs/helpers";
import { prisma } from "@/libs/db";
import Link from "next/link";
import { currentUser } from "@clerk/nextjs/server";
import { BsPencil } from "react-icons/bs";
import MessageButton from "@/components/MessageButton";
import BuyBlock from "@/components/BuyBlock";
import RelatedProducts from "@/components/RelatedProducts";

type Props = {
  params: Promise<{
    id: string;
  }>;
  searchParams: { [key: string]: string };
};

export default async function SingleAdPage(args: Props) {
  const { id: adId } = await args.params;

  const adDoc = await prisma.ad.findUnique({
    where: { id: adId },
    include: { user: true }
  });

  if (!adDoc) {
    return <div>Not found!</div>;
  }

  const user = await currentUser();
  const isOwner = user && user.id === adDoc.userId;

  // safe cast for op locationj data
  const locationJson = adDoc.location as { lat: number, lng: number } | null;
  const locationTuple: [number, number] | null = locationJson ? [locationJson.lat, locationJson.lng] : null;

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border mt-4">
      <div className="grid md:grid-cols-5 gap-8">
        <div className="md:col-span-3 bg-gray-50 rounded-lg overflow-hidden border relative aspect-video md:aspect-auto">
          <Gallery files={adDoc.images} />
        </div>

        <div className="md:col-span-2 flex flex-col gap-4">
          <h1 className="text-3xl font-bold text-gray-900">{adDoc.title}</h1>

          {/* Replaced simple price display with BuyBlock */}
          {!isOwner && (
            <BuyBlock ad={adDoc} isMall={adDoc.userId === 'haatbazaar-mall'} />
          )}

          {isOwner && (
            <p className="text-2xl font-bold text-walmart-blue">{formatMoney(adDoc.price)}</p>
          )}

          {isOwner && (
            <div className="flex gap-2">
              <Link href={`/edit/${adDoc.id}`} className="border border-blue-600 text-blue-600 rounded-md py-1 px-4 inline-flex gap-1 items-center hover:bg-blue-50 transition">
                <BsPencil className="h-4" />
                <span>Edit</span>
              </Link>
              <DeleteAdButton id={adDoc.id} />
            </div>
          )}

          <div className="border-t pt-4 mt-2">
            <h3 className="font-bold mb-2">Description</h3>
            <p className="text-gray-600 text-sm leading-relaxed">{adDoc.description}</p>
          </div>


          {/* Seller Info - Hide for Mall */}
          {adDoc.userId !== 'haatbazaar-mall' && (
            <>
              <h3 className="font-bold mb-2">Seller Info</h3>
              <p className="text-gray-600 text-sm">
                Contact: <span className="font-medium text-gray-900">{adDoc.contact}</span>
              </p>
              <p className="text-gray-600 text-sm">
                Email: <span className="font-medium text-gray-900">{adDoc.user?.email || 'N/A'}</span>
              </p>
            </>
          )}

          {/* Chat Button - Only for normal ads, if logged in and not owner */}
          {adDoc.userId !== 'haatbazaar-mall' && !isOwner && user && (
            <div className="mt-4">
              <MessageButton adId={adDoc.id} />
            </div>
          )}

          {locationTuple && (
            <div className="border-t pt-4 h-64 grayscale hover:grayscale-0 transition">
              <h3 className="font-bold mb-2">Location</h3>
              <MapWrapper location={locationTuple} />
            </div>
          )}

          <p className="text-xs text-gray-400 mt-auto">
            Posted: {formatDate(adDoc.createdAt)}
          </p>
        </div>
      </div>
      <RelatedProducts category={adDoc.category} currentAdId={adDoc.id} />
    </div>
  );
}
