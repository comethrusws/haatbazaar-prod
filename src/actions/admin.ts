'use server';

import { prisma } from "@/libs/db";
import { revalidatePath } from "next/cache";

const MALL_USER_ID = 'haatbazaar-mall';

// --- Inventory (Mall Products) ---

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
            contact: 'HaatBazaar Official', // Default contact for Mall
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


// --- Categories ---

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

// --- Orders ---

export async function getOrders() {
    return await prisma.order.findMany({
        include: {
            buyer: true,
        },
        orderBy: { createdAt: 'desc' },
    });
}

export async function updateOrderStatus(orderId: string, status: string) {
    const order = await prisma.order.update({
        where: { id: orderId },
        data: { status },
    });
    revalidatePath('/web/admin/orders'); // Assuming there will be an orders page
    return order;
}
