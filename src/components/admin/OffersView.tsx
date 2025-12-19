'use client';

import { useState } from "react";
import { createOffer, deleteOffer, toggleOfferStatus } from "@/actions/admin";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTrash, faToggleOn, faToggleOff } from "@fortawesome/free-solid-svg-icons";

export default function OffersView({ offers }: { offers: any[] }) {
    const [showForm, setShowForm] = useState(false);

    async function handleAdd(formData: FormData) {
        const data = {
            title: formData.get('title') as string,
            description: formData.get('description') as string,
            code: formData.get('code') as string,
            discountValue: parseFloat(formData.get('discountValue') as string),
        };
        await createOffer(data);
        setShowForm(false);
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Marketing Offers</h2>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition flex items-center gap-2"
                >
                    <FontAwesomeIcon icon={faPlus} />
                    {showForm ? 'Cancel' : 'Create Offer'}
                </button>
            </div>

            {showForm && (
                <form action={handleAdd} className="bg-white p-6 rounded-xl shadow-md border mb-8 grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Offer Title</label>
                        <input name="title" required className="mt-1 block w-full border border-gray-300 rounded p-2" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Coupon Code</label>
                        <input name="code" className="mt-1 block w-full border border-gray-300 rounded p-2" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Discount Amount (NPR)</label>
                        <input name="discountValue" type="number" required className="mt-1 block w-full border border-gray-300 rounded p-2" />
                    </div>
                    <div className="col-span-2">
                        <label className="block text-sm font-medium text-gray-700">Description</label>
                        <textarea name="description" className="mt-1 block w-full border border-gray-300 rounded p-2"></textarea>
                    </div>
                    <div className="col-span-2 text-right">
                        <button type="submit" className="bg-green-600 text-white px-6 py-2 rounded">Save Offer</button>
                    </div>
                </form>
            )}

            <div className="space-y-4">
                {offers.map((offer) => (
                    <div key={offer.id} className="bg-white p-6 rounded-xl shadow-sm border flex justify-between items-center">
                        <div>
                            <div className="flex items-center gap-2">
                                <h3 className="font-bold text-lg text-gray-800">{offer.title}</h3>
                                <span className="bg-purple-100 text-purple-700 px-2 py-0.5 rounded text-xs font-mono font-bold tracking-wider">{offer.code}</span>
                            </div>
                            <p className="text-gray-500 text-sm mt-1">{offer.description}</p>
                            <div className="font-bold text-green-600 mt-2">Save Rs. {offer.discountValue}</div>
                        </div>

                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => toggleOfferStatus(offer.id, !offer.isActive)}
                                className={`text-2xl ${offer.isActive ? 'text-green-500' : 'text-gray-300'}`}
                                title={offer.isActive ? "Deactivate" : "Activate"}
                            >
                                <FontAwesomeIcon icon={offer.isActive ? faToggleOn : faToggleOff} />
                            </button>
                            <button
                                onClick={() => { if (confirm('Delete offer?')) deleteOffer(offer.id) }}
                                className="text-red-400 hover:text-red-600 p-2"
                            >
                                <FontAwesomeIcon icon={faTrash} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
