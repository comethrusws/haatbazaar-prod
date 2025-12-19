'use client';
import UploadThumbnail from "@/components/UploadThumbnail";
import { Ad } from "@prisma/client";
import Link from "next/link";
import { useCart } from "@/components/CartContext";
import { FaShoppingCart, FaCheckCircle, FaTruck } from "react-icons/fa"; // Kept for safety
import { getDeliveryEstimate } from "@/libs/delivery";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

type Props = {
  ad: Ad;
  isMall?: boolean;
};

export default function AdItem({ ad, isMall = false }: Props) {
  const { addToCart } = useCart();
  const location = ad.location as { lat: number; lng: number } | null;
  const delivery = getDeliveryEstimate(location);

  return (
    <div className="bg-white border rounded-xl overflow-hidden flex flex-col hover:shadow-xl transition-all duration-300 group relative">
      <Link href={`/ad/${ad.id}`} className="absolute inset-0 z-10"></Link>

      {/* Image Container */}
      <div className="aspect-square relative bg-gray-50">
        {ad.images && ad.images.length > 0 ? (
          <UploadThumbnail onClick={() => { }} file={ad.images[0]} />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-300 text-xs">No Image</div>
        )}

        {/* Mall Badge */}
        {isMall && (
          <div className="absolute top-2 left-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-[10px] font-bold px-2 py-1 rounded-full flex items-center gap-1 shadow-md">
            <FaCheckCircle className="h-3 w-3" />
            <span>Official</span>
          </div>
        )}

        {/* SOLD Badge */}
        {ad.status === 'SOLD' && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <span className="bg-red-600 text-white px-4 py-2 rounded-full font-bold text-sm">SOLD</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-grow">
        {/* Price */}
        <div className="flex items-baseline gap-1 mb-1">
          <span className="font-bold text-xl text-gray-900">Rs {ad.price.toLocaleString()}</span>
        </div>

        {/* Title */}
        <h3 className="text-gray-600 text-sm line-clamp-2 leading-snug mb-3 flex-grow group-hover:text-blue-600 transition-colors">
          {ad.title}
        </h3>

        {/* Delivery Estimate */}
        <div className={`flex items-center gap-2 text-xs mb-3 font-medium ${delivery.color}`}>
          <FontAwesomeIcon icon={delivery.icon} className="h-3 w-3" />
          <span>{delivery.label}</span>
        </div>

        {/* Add to Cart Button */}
        {ad.status === 'ACTIVE' && (
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              addToCart({
                id: ad.id,
                title: ad.title,
                price: ad.price,
                image: ad.images?.[0],
                location: location || undefined
              });
            }}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-lg py-2 text-sm font-bold transition flex items-center justify-center gap-2 z-20 relative"
          >
            <FaShoppingCart className="h-4 w-4" />
            <span>Add to Cart</span>
          </button>
        )}
      </div>
    </div>
  );
}