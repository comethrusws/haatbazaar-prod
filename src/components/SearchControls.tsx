'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { FaLocationArrow, FaSortAmountDown } from 'react-icons/fa';

export default function SearchControls() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [sort, setSort] = useState(searchParams.get('sort') || 'newest');
    const [radius, setRadius] = useState(searchParams.get('radius') || '');
    const [loc, setLoc] = useState<{ lat: string, lng: string } | null>(
        searchParams.get('lat') && searchParams.get('lng')
            ? { lat: searchParams.get('lat')!, lng: searchParams.get('lng')! }
            : null
    );

    const handleUpdate = (newParams: any) => {
        const params = new URLSearchParams(searchParams.toString());
        Object.entries(newParams).forEach(([key, value]) => {
            if (value) {
                params.set(key, value as string);
            } else {
                params.delete(key);
            }
        });
        router.push(`/?${params.toString()}`);
    };

    const handleLocation = () => {
        if ('geolocation' in navigator) {
            navigator.geolocation.getCurrentPosition(({ coords }) => {
                const newLoc = { lat: coords.latitude.toString(), lng: coords.longitude.toString() };
                setLoc(newLoc);
                handleUpdate({ ...newLoc, sort: 'distance' }); // Auto-switch to distance sort
                setSort('distance');
            });
        }
    };

    return (
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6 flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex items-center gap-4 w-full md:w-auto">
                <div className="flex items-center gap-2">
                    <FaSortAmountDown className="text-gray-400" />
                    <span className="text-sm font-bold text-gray-700">Sort by:</span>
                </div>
                <select
                    value={sort}
                    onChange={(e) => {
                        setSort(e.target.value);
                        handleUpdate({ sort: e.target.value });
                    }}
                    className="bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5"
                >
                    <option value="newest">Newest</option>
                    <option value="price-asc">Price: Low to High</option>
                    <option value="price-desc">Price: High to Low</option>
                    <option value="distance">Distance</option>
                </select>
            </div>

            <div className="flex items-center gap-4 w-full md:w-auto">
                {loc && (
                    <div className="flex items-center gap-2 flex-grow">
                        <span className="text-sm font-bold text-gray-700 whitespace-nowrap">Radius (km):</span>
                        <input
                            type="number"
                            value={radius}
                            placeholder="Any"
                            onChange={(e) => {
                                setRadius(e.target.value);
                                handleUpdate({ radius: e.target.value });
                            }}
                            className="w-20 bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-lg p-2.5"
                        />
                    </div>
                )}

                <button
                    onClick={handleLocation}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition ${loc ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                >
                    <FaLocationArrow />
                    {loc ? 'Location Active' : 'Near Me'}
                </button>
            </div>
        </div>
    );
}
