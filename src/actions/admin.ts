'use server';

import { prisma } from "@/libs/db";
import { revalidatePath } from "next/cache";

const MALL_USER_ID = 'haatbazaar-mall';


export async function getMallInventory() {
    return await prisma.ad.findMany({
        where: { userId: MALL_USER_ID },
        orderBy: { createdAt: 'desc' },
    });
}

export async function createMallProduct(data: {
    title: string;
    price: number;
    category: string;
    description: string;
    images: string[];
    stock: number;
    condition: string;
    location?: any;
}) {
    const ad = await prisma.ad.create({
        data: {
            ...data,
            userId: MALL_USER_ID,
            contact: 'HaatBazaar Official',
            status: 'ACTIVE',
        },
    });
    revalidatePath('/web/admin/inventory');
    revalidatePath('/');
    return ad;
}

export async function updateMallProductStock(adId: string, stock: number) {
    const ad = await prisma.ad.update({
        where: { id: adId },
        data: { stock },
    });
    revalidatePath('/web/admin/inventory');
    return ad;
}

export async function deleteMallProduct(adId: string) {
    await prisma.ad.delete({
        where: { id: adId },
    });
    revalidatePath('/web/admin/inventory');
    revalidatePath('/');
}



export async function getCategories() {
    return await prisma.category.findMany({
        orderBy: { label: 'asc' },
    });
}

export async function createCategory(data: { key: string; label: string; icon: string }) {
    const category = await prisma.category.create({
        data,
    });
    revalidatePath('/web/admin/categories');
    revalidatePath('/');
    return category;
}

export async function deleteCategory(id: string) {
    await prisma.category.delete({
        where: { id },
    });
    revalidatePath('/web/admin/categories');
    revalidatePath('/');
}

// --- Offers ---

export async function getOffers() {
    return await prisma.offer.findMany({
        orderBy: { createdAt: 'desc' },
    });
}

export async function createOffer(data: {
    title: string;
    description: string;
    code: string;
    discountValue: number;
    expiresAt?: Date;
}) {
    const offer = await prisma.offer.create({
        data,
    });
    revalidatePath('/web/admin/offers');
    return offer;
}

export async function toggleOfferStatus(id: string, isActive: boolean) {
    const offer = await prisma.offer.update({
        where: { id },
        data: { isActive },
    });
    revalidatePath('/web/admin/offers');
    return offer;
}

export async function deleteOffer(id: string) {
    await prisma.offer.delete({
        where: { id },
    });
    revalidatePath('/web/admin/offers');
}


export async function getOrders() {
    const realOrders = await prisma.order.findMany({
        include: {
            buyer: true,
        },
        orderBy: { createdAt: 'desc' },
    });

    if (realOrders.length > 0) return realOrders;

    return [
        {
            id: "ORD-7382-MOCK",
            total: 15500,
            status: "PENDING",
            items: JSON.stringify([{ id: "p1", title: "Samsung Galaxy M12", price: 15000, qty: 1 }]),
            createdAt: new Date(),
            estimatedDelivery: new Date(Date.now() + 86400000),
            buyer: { name: "Aarav Sharma", email: "aarav.test@example.com", id: "user_mock_1" }
        },
        {
            id: "ORD-9921-MOCK",
            total: 2500,
            status: "DELIVERED",
            items: JSON.stringify([{ id: "p2", title: "Wireless Earbuds", price: 2500, qty: 1 }]),
            createdAt: new Date(Date.now() - 172800000), // 2 days ago
            estimatedDelivery: new Date(Date.now() - 86400000),
            buyer: { name: "Sita Poudel", email: "sita.p@example.com", id: "user_mock_2" }
        },
        {
            id: "ORD-1123-MOCK",
            total: 45000,
            status: "SHIPPED",
            items: JSON.stringify([{ id: "p3", title: "Dell Monitor 24", price: 45000, qty: 1 }]),
            createdAt: new Date(Date.now() - 86400000), // 1 day ago
            estimatedDelivery: new Date(Date.now() + 172800000),
            buyer: { name: "Hari Bahadur", email: "hari.b@example.com", id: "user_mock_3" }
        }
    ] as any; // Cast to any to match Prisma return type roughly
}

export async function updateOrderStatus(orderId: string, status: string) {
    if (orderId.includes('MOCK')) {
        revalidatePath('/web/admin/orders');
        return { id: orderId, status };
    }

    const order = await prisma.order.update({
        where: { id: orderId },
        data: { status },
    });
    revalidatePath('/web/admin/orders'); // Assuming there will be an orders page
    return order;
}
