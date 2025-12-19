'use server';

import { prisma } from "@/libs/db";
import { currentUser } from "@clerk/nextjs/server";
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

type CartItem = {
    id: string; // Ad ID
    price: number;
    title: string;
};

export async function createOrder(items: CartItem[], total: number) {
    const user = await currentUser();
    if (!user) throw new Error("Unauthorized");

    const order = await prisma.order.create({
        data: {
            total,
            items: items, // Json
            status: 'PAID',
            buyerId: user.id,
            estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days from now
        }
    });

    const MALL_USER_ID = 'haatbazaar-mall';

    for (const item of items) {
        const ad = await prisma.ad.findUnique({
            where: { id: item.id },
            select: { userId: true, title: true }
        });

        if (!ad) continue;

        // Prevent buying own product
        if (ad.userId === user.id) {
            throw new Error(`You cannot buy your own product: ${ad.title}`);
        }

        if (ad.userId !== MALL_USER_ID) {
            await prisma.ad.update({
                where: { id: item.id },
                data: { status: 'SOLD' }
            });
        }

        await prisma.user.update({
            where: { id: ad.userId },
            data: {
                balance: { increment: item.price }
            }
        });
    }

    const deliveryDate = order.estimatedDelivery.toLocaleDateString();

    const userEmail = user.emailAddresses[0].emailAddress;

    try {
        await resend.emails.send({
            from: 'Haatbazaar <haatbazaar@basabjha.com.np>', // Use verified domain or default test domain
            to: [userEmail],
            subject: 'Order Confirmed - Haatbazaar',
            html: `
                <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
                    <h1 style="color: #0071dc;">Order Confirmed!</h1>
                    <p>Hi ${user.firstName || 'there'},</p>
                    <p>Thank you for your purchase. Your payment of <strong>NPR ${total.toLocaleString()}</strong> has been received.</p>
                    
                    <div style="background: #f4f4f4; padding: 15px; border-radius: 8px; margin: 20px 0;">
                        <h3>Order Summary</h3>
                        <p><strong>Order ID:</strong> ${order.id}</p>
                        <p><strong>Estimated Delivery:</strong> ${deliveryDate}</p>
                        <hr style="border: 0; border-top: 1px solid #ddd;" />
                        <ul>
                            ${items.map(item => `<li>${item.title} - NPR ${item.price.toLocaleString()}</li>`).join('')}
                        </ul>
                    </div>
                    
                    <p>We will notify you when your items are shipped.</p>
                    <p>Happy Shopping,<br/>The Haatbazaar Team</p>
                </div>
            `
        });
    } catch (e) {
        console.error("Failed to send email:", e);
    }

    return order;
}

export async function withdrawFunds() {
    const user = await currentUser();
    if (!user) throw new Error("Unauthorized");

    const dbUser = await prisma.user.findUnique({ where: { id: user.id } });
    if (!dbUser || dbUser.balance <= 0) {
        throw new Error("Insufficient balance");
    }

    const amount = dbUser.balance;

    await prisma.user.update({
        where: { id: user.id },
        data: { balance: 0 }
    });

    const userEmail = user.emailAddresses[0].emailAddress;

    try {
        await resend.emails.send({
            from: 'Haatbazaar <haatbazaar@basabjha.com.np>',
            to: [userEmail],
            subject: 'Payout Processed',
            html: `
                 <h1>Payout Processed</h1>
                 <p>We have processed your payout of <strong>NPR ${amount.toLocaleString()}</strong>.</p>
                 <p>Funds should appear in your account shortly.</p>
             `
        });
    } catch (e) { console.error(e); }

    return { success: true, amount };
}
