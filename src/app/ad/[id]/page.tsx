'use server';

import DeleteAdButton from "@/components/DeleteAdButton";
import Gallery from "@/components/Gallery";
import LocationMap from "@/components/LocationMap";
import { formatMoney, formatDate, prisma } from "@/libs/helpers";
import Link from "next/link";
import { currentUser } from "@clerk/nextjs/server";
import { BsPencil } from "react-icons/bs";

type Props = {
  params: {
    id: string;
  };
  searchParams: { [key: string]: string };
};

export default async function SingleAdPage(args: Props) {
  const adId = args.params.id;

  const adDoc = await prisma.ad.findUnique({
    where: { id: adId }
  });

  if (!adDoc) {
    return <div>Not found!</div>;
  }

  const user = await currentUser();
  const isOwner = user && user.id === adDoc.userId;

  // Safe Cast for Json Location
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
          <p className="text-2xl font-bold text-walmart-blue">{formatMoney(adDoc.price)}</p>

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

          <div className="border-t pt-4">
            <h3 className="font-bold mb-2">Seller Info</h3>
            <p className="text-gray-600 text-sm">
              Contact: <span className="font-medium text-gray-900">{adDoc.contact}</span>
            </p>
            <p className="text-gray-600 text-sm">
              Email: <span className="font-medium text-gray-900">{adDoc.userEmail}</span>
            </p>
          </div>

          {locationTuple && (
            <div className="border-t pt-4 h-64 grayscale hover:grayscale-0 transition">
              <h3 className="font-bold mb-2">Location</h3>
              <LocationMap location={locationTuple} />
            </div>
          )}

          <p className="text-xs text-gray-400 mt-auto">
            Posted: {formatDate(adDoc.createdAt)}
          </p>
        </div>
      </div>
    </div>
  );
}
