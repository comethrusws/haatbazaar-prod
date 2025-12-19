'use server';

import { prisma } from "@/libs/db";
import { currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export async function createConversation(adId: string) {
    const user = await currentUser();
    if (!user) {
        throw new Error('Unauthorized');
    }

    const ad = await prisma.ad.findUnique({
        where: { id: adId }
    });

    if (!ad) {
        throw new Error('Ad not found');
    }

    if (ad.userId === user.id) {
        throw new Error('Cannot chat with yourself');
    }

    // Check if conversation already exists for this ad between these users
    // But first, ENSURE the current user exists in our DB.
    // Clerk user might not be synced yet.

    // Check if user exists, if not create.
    const dbUser = await prisma.user.findUnique({ where: { id: user.id } });
    if (!dbUser) {
        // Essential fields
        const email = user.emailAddresses[0]?.emailAddress || "no-email@example.com";
        const name = `${user.firstName || ''} ${user.lastName || ''}`.trim() || "Anonymous";
        const avatar = user.imageUrl;

        await prisma.user.create({
            data: {
                id: user.id,
                email,
                name,
                avatar
            }
        });
    }

    const existingConv = await prisma.conversation.findFirst({
        where: {
            adId: adId,
            participants: {
                every: {
                    id: { in: [user.id, ad.userId] }
                }
            }
        }
    });

    if (existingConv) {
        return existingConv;
    }

    // Create new conversation
    const conversation = await prisma.conversation.create({
        data: {
            adId: adId,
            participants: {
                connect: [
                    { id: user.id },
                    { id: ad.userId }
                ]
            }
        }
    });

    return conversation;
}

export async function sendMessage(conversationId: string, content: string) {
    const user = await currentUser();
    if (!user) throw new Error('Unauthorized');

    const message = await prisma.message.create({
        data: {
            content,
            conversationId,
            senderId: user.id
        }
    });

    await prisma.conversation.update({
        where: { id: conversationId },
        data: {
            lastMessageAt: new Date()
        }
    });

    revalidatePath('/inbox');
    revalidatePath(`/inbox/${conversationId}`);
    return message;
}

export async function getConversations() {
    const user = await currentUser();
    if (!user) return [];

    const conversations = await prisma.conversation.findMany({
        where: {
            participants: {
                some: { id: user.id }
            }
        },
        include: {
            participants: true,
            ad: true,
            messages: {
                orderBy: { createdAt: 'desc' },
                take: 1
            }
        },
        orderBy: { lastMessageAt: 'desc' }
    });

    return JSON.parse(JSON.stringify(conversations));
}

export async function getMessages(conversationId: string) {
    const user = await currentUser();
    if (!user) return [];

    // Verify participation
    const conversation = await prisma.conversation.findUnique({
        where: { id: conversationId },
        include: { participants: true }
    });

    if (!conversation || !conversation.participants.find(p => p.id === user.id)) {
        return [];
    }

    const messages = await prisma.message.findMany({
        where: { conversationId },
        orderBy: { createdAt: 'asc' }
    });

    return JSON.parse(JSON.stringify(messages));
}
