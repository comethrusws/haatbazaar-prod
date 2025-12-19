'use client';

import dynamic from "next/dynamic";

const LocationMap = dynamic(() => import("@/components/LocationMap"), {
    ssr: false,
    loading: () => <div className="h-full w-full bg-gray-100 animate-pulse rounded flex items-center justify-center text-gray-400">Loading map...</div>
});

type Props = {
    location: [number, number];
};

export default function MapWrapper({ location }: Props) {
    return <LocationMap location={location} />;
}
