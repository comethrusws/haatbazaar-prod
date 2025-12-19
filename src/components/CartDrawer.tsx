'use client';
import { useCart } from "@/components/CartContext";
import { formatMoney } from "@/libs/helpers";
import { getDeliveryEstimate, formatDeliveryDate } from "@/libs/delivery";
import Image from "next/image";
import { BiTrash } from "react-icons/bi";
import { FaXmark } from "react-icons/fa6";
import { useState } from "react";
import PaymentModal from "./PaymentModal";
import { createOrder } from "@/app/actions/orderActions";
import { useUser } from "@clerk/nextjs";

export default function CartDrawer() {
    const { cart, removeFromCart, cartOpen, setCartOpen, clearCart } = useCart();
    const { user } = useUser();

    if (!cartOpen) return null;

    const total = cart.reduce((sum, item) => sum + item.price * (item.quantity || 1), 0);

    const handleCheckout = () => {
        if (!user) {
            alert("Please log in to checkout.");
            return;
        }
        setCartOpen(false);
        window.location.href = '/payment';
    };

    return (
        <>
            <div
                className="fixed inset-0 bg-black/50 z-[60]"
                onClick={() => setCartOpen(false)}
            ></div>
            <div className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-white z-[70] shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
                <div className="p-4 border-b flex justify-between items-center bg-walmart-blue text-white">
                    <h2 className="font-bold text-lg">My Cart ({cart.length})</h2>
                    <button onClick={() => setCartOpen(false)}>
                        <FaXmark className="h-6" />
                    </button>
                </div>

                <div className="flex-grow overflow-y-auto p-4 space-y-4">
                    {cart.length === 0 ? (
                        <div className="text-center text-gray-500 mt-10">
                            Your cart is empty.
                        </div>
                    ) : (
                        cart.map((item, idx) => {
                            const delivery = getDeliveryEstimate(item.location);
                            const deliveryDate = formatDeliveryDate(delivery);

                            return (
                                <div key={item.id + idx} className="flex gap-4 border-b pb-4">
                                    <div className="size-20 bg-gray-100 rounded relative shrink-0">
                                        {item.image && (
                                            <Image src={item.image} alt={item.title} fill className="object-cover rounded" />
                                        )}
                                    </div>
                                    <div className="flex-grow">
                                        <h3 className="font-bold text-sm line-clamp-2 mb-1">{item.title}</h3>
                                        <p className="font-bold text-walmart-blue">{formatMoney(item.price)}</p>
                                        <p className="text-xs text-gray-500">Qty: {item.quantity || 1}</p>

                                        {/* Delivery Estimate */}
                                        <div className={`text-xs mt-1 ${delivery.color}`}>
                                            {delivery.label} • {deliveryDate}
                                        </div>

                                        <button
                                            onClick={() => removeFromCart(item.id)}
                                            className="text-xs text-red-500 mt-2 underline flex items-center gap-1"
                                        >
                                            <BiTrash className="h-3" />
                                            Remove
                                        </button>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>

                <div className="p-4 border-t bg-gray-50">
                    <div className="flex justify-between font-bold text-lg mb-2">
                        <span>more Estimated Total</span>
                        <span>{formatMoney(total)}</span>
                    </div>

                    <button
                        onClick={handleCheckout}
                        disabled={cart.length === 0}
                        className="w-full btn-primary py-3 rounded-full text-center block mb-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Continue to Checkout
                    </button>
                </div>
            </div>
        </>
    );
}
