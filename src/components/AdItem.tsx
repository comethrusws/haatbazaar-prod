'use client';
import UploadThumbnail from "@/components/UploadThumbnail";
import { Ad } from "@prisma/client";
import Link from "next/link";
import { useCart } from "@/components/CartContext";
import { faCartPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function AdItem({ ad }: { ad: Ad }) {
  const { addToCart } = useCart();

  return (
    <div className="bg-white border rounded-lg overflow-hidden flex flex-col hover:shadow-lg transition-shadow group relative">
      <Link href={`/ad/${ad.id}`} className="absolute inset-0 z-10"></Link>

      <div className="aspect-square relative bg-gray-100">
        {ad.images && ad.images.length > 0 ? (
          <UploadThumbnail onClick={() => { }} file={ad.images[0]} />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400 text-xs">No Image</div>
        )}
      </div>

      <div className="p-3 flex flex-col flex-grow">
        <p className="font-bold text-lg mb-1">Rs {ad.price.toLocaleString()}</p>
        <h3 className="text-gray-700 text-sm line-clamp-2 leading-snug mb-2 flex-grow group-hover:underline">
          {ad.title}
        </h3>

        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            addToCart({ id: ad.id, title: ad.title, price: ad.price, image: ad.images[0] });
          }}
          className="mt-auto border border-black rounded-full py-1 px-3 text-sm font-bold hover:bg-black/5 transition flex items-center justify-center gap-2 z-20"
        >
          <FontAwesomeIcon icon={faCartPlus} />
          <span>Add</span>
        </button>
      </div>
    </div>
  );
}