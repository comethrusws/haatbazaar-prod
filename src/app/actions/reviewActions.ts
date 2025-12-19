'use server';

import { prisma } from "@/libs/db";
import { currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export async function createReview(targetUserId: string, rating: number, comment: string) {
    const user = await currentUser();
    if (!user) throw new Error("Unauthorized");

    if (user.id === targetUserId) {
        throw new Error("Cannot review yourself");
    }

    // Upsert logic for users?
    // We assume users exist because we are reviewing a targetUserId (likely from an Ad).
    // But we need to ensure the AUTHOR exists in our local DB if we have FK constraint.
    // Prerendering might overlook this, but runtime will fail if User table is empty.

    // Check if targetReview already exists? usually one review per user per target.
    // For now, allow multiple or just create.

    // We need to ensure 'User' records exist in Prisma for Relation.
    // Clerk ID is the ID.
    // We can try to connect/create the user record just in case.

    await prisma.user.upsert({
        where: { id: user.id },
        update: { email: user.emailAddresses[0].emailAddress, name: user.fullName, avatar: user.imageUrl },
        create: { id: user.id, email: user.emailAddresses[0].emailAddress, name: user.fullName, avatar: user.imageUrl }
    });

    // We also need to ensure targetUserId exists. If we are reviewing them, they probably posted an ad, 
    // maybe we should ensure they are in DB.
    // If they aren't, the FK will fail.
    // But how can we review someone without their profile?
    // Assume implemented.

    const review = await prisma.review.create({
        data: {
            rating,
            comment,
            authorId: user.id,
            targetUserId: targetUserId
        }
    });

    revalidatePath(`/profile/${targetUserId}`);
    return review;
}

export async function getUserStats(userId: string) {
    const aggregate = await prisma.review.aggregate({
        where: { targetUserId: userId },
        _avg: { rating: true },
        _count: { rating: true }
    });

    return {
        averageRating: aggregate._avg.rating || 0,
        totalReviews: aggregate._count.rating || 0
    };
}

export async function getReviews(userId: string) {
    return await prisma.review.findMany({
        where: { targetUserId: userId },
        include: { author: true },
        orderBy: { createdAt: 'desc' }
    });
}
