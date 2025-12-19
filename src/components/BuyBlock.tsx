'use client';

import { useState } from "react";
import { useCart } from "./CartContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCartPlus, faBolt } from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/navigation";

type Props = {
    ad: any;
    isMall: boolean;
};

export default function BuyBlock({ ad, isMall }: Props) {
    const { addToCart, setCartOpen } = useCart();
    const router = useRouter();
    const [qty, setQty] = useState(1);

    const handleAddToCart = () => {
        addToCart({
            id: ad.id,
            title: ad.title,
            price: ad.price,
            image: ad.images?.[0],
            location: ad.location,
            quantity: qty
        });
    };

    const handleBuyNow = () => {
        handleAddToCart();
        router.push('/payment');
    };

    return (
        <div className="bg-white border rounded-xl p-4 shadow-sm mb-4">
            <div className="flex items-center gap-4 mb-4">
                <span className="text-3xl font-bold text-gray-900">Rs {ad.price.toLocaleString()}</span>
                {isMall && (
                    <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded text-xs font-bold uppercase">In Stock</span>
                )}
            </div>

            {isMall && (
                <div className="flex items-center gap-3 mb-4">
                    <span className="font-medium text-gray-700">Quantity:</span>
                    <div className="flex items-center border rounded-lg">
                        <button
                            onClick={() => setQty(Math.max(1, qty - 1))}
                            className="px-3 py-1 hover:bg-gray-100 border-r"
                        >-</button>
                        <span className="px-4 py-1 font-bold w-12 text-center">{qty}</span>
                        <button
                            onClick={() => setQty(qty + 1)} // Could cap at stock
                            className="px-3 py-1 hover:bg-gray-100 border-l"
                        >+</button>
                    </div>
                </div>
            )}

            <div className="flex gap-3">
                <button
                    onClick={handleBuyNow}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-bold transition flex items-center justify-center gap-2"
                >
                    <FontAwesomeIcon icon={faBolt} />
                    Buy Now
                </button>
                <button
                    onClick={handleAddToCart}
                    className="flex-1 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 py-3 rounded-lg font-bold transition flex items-center justify-center gap-2"
                >
                    <FontAwesomeIcon icon={faCartPlus} />
                    Add to Cart
                </button>
            </div>
        </div>
    );
}
