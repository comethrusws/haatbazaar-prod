'use client';

import { useCart } from "@/components/CartContext";
import { formatMoney } from "@/libs/helpers";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import { createOrder } from "@/app/actions/orderActions";
import { getDeliveryEstimate, formatDeliveryDate } from "@/libs/delivery";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function PaymentPage() {
    const { cart, clearCart } = useCart();
    const router = useRouter();
    const [isProcessing, setIsProcessing] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);

    if (!mounted) return <div className="p-8 text-center">Loading...</div>;

    const total = cart.reduce((sum, item) => sum + item.price * (item.quantity || 1), 0);


    const handlePayment = async () => {
        setIsProcessing(true);

        try {
            await new Promise(resolve => setTimeout(resolve, 2000));

            await createOrder(cart, total);

            setIsProcessing(false);
            setIsSuccess(true);

            setTimeout(() => {
                clearCart();
                router.push('/');
            }, 3000);
        } catch (error) {
            console.error(error);
            setIsProcessing(false);
            alert("Payment failed: " + (error instanceof Error ? error.message : "Unknown error"));
        }
    };

    if (cart.length === 0 && !isSuccess) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
                <div className="bg-white p-8 rounded-xl shadow-md text-center max-w-md w-full">
                    <h1 className="text-2xl font-bold text-gray-800 mb-4">Your Cart is Empty</h1>
                    <p className="text-gray-500 mb-6">Looks like you haven't added anything to your cart yet.</p>
                    <button
                        onClick={() => router.push('/')}
                        className="bg-blue-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-blue-700 transition w-full"
                    >
                        Start Shopping
                    </button>
                </div>
            </div>
        );
    }

    if (isSuccess) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
                <div className="bg-white p-8 rounded-xl shadow-md text-center max-w-md w-full animate-fade-in">
                    <div className="size-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                    </div>
                    <h1 className="text-2xl font-bold text-gray-800 mb-2">Payment Successful!</h1>
                    <p className="text-gray-500 mb-6">Thank you for your purchase. Redirecting you home...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4">
            <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8">

                {/* Order Summary */}
                <div className="bg-white p-6 rounded-xl shadow-sm h-fit">
                    <h2 className="text-xl font-bold text-gray-800 mb-6">Order Summary</h2>
                    <div className="space-y-4 mb-6">
                        {cart.map((item, idx) => (
                            <div key={item.id + idx} className="flex gap-4 border-b pb-4 last:border-0">
                                <div className="size-16 bg-gray-100 rounded-md overflow-hidden flex-shrink-0 relative">
                                    {item.image && <Image src={item.image} alt={item.title} fill className="object-cover" />}
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-medium text-gray-900 line-clamp-1">{item.title}</h3>
                                    <p className="text-gray-500 text-sm">Qty: {item.quantity || 1}</p>
                                </div>
                                <div className="font-bold text-gray-900">
                                    {formatMoney(item.price * (item.quantity || 1))}
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="border-t pt-4 flex justify-between items-center text-lg font-bold">
                        <span>Total Amount</span>
                        <span>{formatMoney(total)}</span>
                    </div>

                    {/* Estimated Delivery Date */}
                    {cart.length > 0 && (() => {
                        // Get the earliest delivery estimate from all cart items
                        const estimates = cart.map(item => getDeliveryEstimate(item.location));
                        // Use the fastest delivery option available
                        const fastestEstimate = estimates.reduce((fastest, current) => {
                            const priority = { '1 hour': 1, 'Next day': 2, '2 days': 3, '3-5 days': 4, '4-5 business days': 5 };
                            const fastestPriority = priority[fastest.time as keyof typeof priority] || 99;
                            const currentPriority = priority[current.time as keyof typeof priority] || 99;
                            return currentPriority < fastestPriority ? current : fastest;
                        });

                        return (
                            <div className="mt-4 pt-4 border-t border-gray-200">
                                <div className="flex items-center gap-2 text-sm">
                                    <FontAwesomeIcon icon={fastestEstimate.icon} className={`${fastestEstimate.color} w-4 h-4`} />
                                    <span className="text-gray-600">Estimated Delivery:</span>
                                    <span className={`font-semibold ${fastestEstimate.color}`}>
                                        {formatDeliveryDate(fastestEstimate)}
                                    </span>
                                </div>
                                <p className="text-xs text-gray-500 mt-1 ml-6">{fastestEstimate.label}</p>
                            </div>
                        );
                    })()}
                </div>

                {/* Payment Gateway Mock */}
                <div className="bg-white p-6 rounded-xl shadow-sm h-fit border-t-4" style={{ borderColor: '#dd0012' }}>
                    <div className="flex justify-center mb-8">
                        <div className="relative w-48 h-16">
                            <Image src="/khalti.png" alt="Khalti" fill className="object-contain" />
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Khalti ID / Mobile Number</label>
                            <input
                                type="text"
                                placeholder="98XXXXXXXX"
                                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#dd0012] focus:border-[#dd0012] outline-none transition"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Transaction PIN</label>
                            <input
                                type="password"
                                placeholder="****"
                                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#dd0012] focus:border-[#dd0012] outline-none transition"
                            />
                        </div>

                        <button
                            onClick={handlePayment}
                            disabled={isProcessing}
                            className="w-full text-white font-bold py-4 rounded-lg shadow-lg hover:shadow-xl transition transform active:scale-95 disabled:opacity-70 disabled:scale-100 flex items-center justify-center gap-2"
                            style={{ backgroundColor: '#dd0012' }}
                        >
                            {isProcessing ? 'Processing Payment...' : `Pay ${formatMoney(total)}`}
                        </button>

                        <p className="text-center text-xs text-gray-400 mt-4">
                            Secured by Khalti Payment Gateway
                        </p>
                    </div>
                </div>

            </div>
        </div>
    );
}
