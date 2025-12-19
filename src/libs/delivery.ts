const USER_LOCATION = { lat: 27.7172, lng: 85.3240 };

function getDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

import { IconDefinition } from "@fortawesome/free-solid-svg-icons";
import { faBolt, faTruck, faBox, faPlane, faTruckFast } from "@fortawesome/free-solid-svg-icons";

export type DeliveryEstimate = {
    time: string;
    label: string;
    color: string;
    icon: IconDefinition;
};

export function getDeliveryEstimate(productLocation: { lat: number; lng: number } | null | undefined): DeliveryEstimate {
    if (!productLocation) {
        return { time: '3-5 days', label: 'Standard Delivery', color: 'text-gray-500', icon: faBox };
    }

    const distance = getDistanceKm(
        USER_LOCATION.lat,
        USER_LOCATION.lng,
        productLocation.lat,
        productLocation.lng
    );

    // Within 40km - Express delivery
    if (distance <= 40) {
        return { time: '1 hour', label: 'Express Delivery', color: 'text-green-600', icon: faBolt };
    }

    // Within Kathmandu Valley (~100km radius)
    if (distance <= 100) {
        return { time: 'Next day', label: 'Next Day Delivery', color: 'text-blue-600', icon: faTruck };
    }

    // Within Nepal (~500km)
    if (distance <= 500) {
        return { time: '2 days', label: 'Inter-Region Delivery', color: 'text-orange-500', icon: faTruckFast };
    }

    // International
    return { time: '4-5 business days', label: 'International Shipping', color: 'text-purple-600', icon: faPlane };
}

export function formatDeliveryDate(estimate: DeliveryEstimate): string {
    const now = new Date();

    if (estimate.time === '1 hour') {
        return `Today by ${new Date(now.getTime() + 60 * 60 * 1000).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}`;
    }

    if (estimate.time === 'Next day') {
        const tomorrow = new Date(now);
        tomorrow.setDate(tomorrow.getDate() + 1);
        return `Tomorrow, ${tomorrow.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}`;
    }

    if (estimate.time === '2 days') {
        const delivery = new Date(now);
        delivery.setDate(delivery.getDate() + 2);
        return delivery.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
    }

    // 4-5 business days
    const delivery = new Date(now);
    delivery.setDate(delivery.getDate() + 5);
    return `By ${delivery.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}`;
}
